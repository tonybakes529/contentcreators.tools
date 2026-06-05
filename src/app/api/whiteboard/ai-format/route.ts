import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateAnonymousSessionId } from "@/lib/session";

export const runtime = "nodejs";

const ANON_DAILY_LIMIT = 5;
const AUTH_DAILY_LIMIT = 50;

const SYSTEM_PROMPT = `You turn raw notes into a clean, presentation-ready outline for a whiteboard.

Split the text into logical SECTIONS (usually 3-8). For each section write a short, punchy title and an ordered list of blocks.

A block is either:
- type "lead" — an intro sentence that sets up the section, OR
- type "bullet" — a single, concise point.

Keep each block to one concise sentence. Wrap the 1-2 most important words of a block in **double asterisks** to bold them. Fix obvious typos. Do NOT invent facts not present in the notes.

Return ONLY minified JSON, no markdown fences, no commentary, exactly this shape:
{"sections":[{"name":"Section title","blocks":[{"t":"lead","html":"intro sentence"},{"t":"bullet","html":"a point"}]}]}`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured." },
      { status: 503 },
    );
  }

  let body: { text?: unknown };
  try {
    body = (await req.json()) as { text?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }
  const trimmed = text.slice(0, 12000);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const anonymousSessionId = user ? null : await getOrCreateAnonymousSessionId();

  // Rate-limit AI calls just like /api/run-tool (uses the runs table for accounting)
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const limit = user ? AUTH_DAILY_LIMIT : ANON_DAILY_LIMIT;
  const filterColumn = user ? "user_id" : "anonymous_session_id";
  const filterValue = user ? user.id : anonymousSessionId!;
  const { count } = await supabase
    .from("runs")
    .select("id", { count: "exact", head: true })
    .eq(filterColumn, filterValue)
    .eq("tool_slug", "whiteboard-ai-format")
    .gte("created_at", since);
  if ((count ?? 0) >= limit) {
    return NextResponse.json(
      {
        error: user
          ? "Daily AI limit reached. Come back tomorrow."
          : "You've hit the free daily limit. Sign in to keep going.",
        rateLimited: true,
      },
      { status: 429 },
    );
  }

  const anthropic = new Anthropic({ apiKey });
  const startedAt = Date.now();
  let sections: unknown = null;
  let tokensIn = 0;
  let tokensOut = 0;
  let status: "success" | "error" = "success";
  let errorMessage: string | null = null;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: `NOTES:\n"""\n${trimmed}\n"""` }],
    });
    tokensIn = message.usage?.input_tokens ?? 0;
    tokensOut = message.usage?.output_tokens ?? 0;
    const raw = message.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();
    sections = extractJSON(raw);
    if (!sections) {
      status = "error";
      errorMessage = "Model returned non-JSON output";
    }
  } catch (e) {
    status = "error";
    errorMessage = e instanceof Error ? e.message : "Unknown error";
  }

  const latencyMs = Date.now() - startedAt;

  // Ensure the tool row exists once so the FK + admin view work; ignore conflict.
  await supabase
    .from("tools")
    .upsert(
      {
        slug: "whiteboard-ai-format",
        name: "Whiteboard · AI format",
        category_slug: "youtube",
        template: "text",
        model: "claude-sonnet-4-5",
        prompt_template: SYSTEM_PROMPT,
        input_config: [],
        enabled: true,
      },
      { onConflict: "slug" },
    );

  await supabase.from("runs").insert({
    tool_slug: "whiteboard-ai-format",
    user_id: user?.id ?? null,
    anonymous_session_id: anonymousSessionId,
    input: { len: trimmed.length },
    output: status === "success" ? JSON.stringify(sections).slice(0, 8000) : null,
    tokens_in: tokensIn || null,
    tokens_out: tokensOut || null,
    latency_ms: latencyMs,
    status,
    error: errorMessage,
  });

  if (status === "error") {
    return NextResponse.json({ error: errorMessage ?? "AI format failed." }, { status: 500 });
  }
  return NextResponse.json({ sections });
}

/**
 * Pull a JSON object out of model output that may have stray text or fences.
 * Returns the parsed `sections` array, or null on failure.
 */
function extractJSON(raw: string): unknown {
  if (!raw) return null;
  // Strip ```json fences if present
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = (fenceMatch ? fenceMatch[1] : raw).trim();
  // Find the first { … final matching }
  const first = candidate.indexOf("{");
  const last = candidate.lastIndexOf("}");
  if (first < 0 || last <= first) return null;
  const slice = candidate.slice(first, last + 1);
  try {
    const parsed = JSON.parse(slice) as { sections?: unknown };
    if (Array.isArray(parsed?.sections)) {
      return parsed.sections;
    }
  } catch {
    return null;
  }
  return null;
}
