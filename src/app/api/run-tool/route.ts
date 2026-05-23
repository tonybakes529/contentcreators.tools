import { NextResponse, type NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateAnonymousSessionId } from "@/lib/session";
import { getToolRow } from "@/lib/tools-db";
import { loadBrain, renderPrompt } from "@/lib/brain";

export const runtime = "nodejs";

const ANON_DAILY_LIMIT = 5;
const AUTH_DAILY_LIMIT = 50;

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured." },
      { status: 503 },
    );
  }

  let body: { toolSlug?: unknown; inputs?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const toolSlug = typeof body.toolSlug === "string" ? body.toolSlug : null;
  const inputs = (body.inputs && typeof body.inputs === "object" ? body.inputs : {}) as Record<string, unknown>;
  if (!toolSlug) {
    return NextResponse.json({ error: "toolSlug is required." }, { status: 400 });
  }

  const tool = await getToolRow(toolSlug);
  if (!tool) {
    return NextResponse.json({ error: "Tool not found or disabled." }, { status: 404 });
  }

  for (const field of tool.input_config) {
    if (field.required && !inputs[field.name]) {
      return NextResponse.json(
        { error: `Missing required field: ${field.label}` },
        { status: 400 },
      );
    }
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const anonymousSessionId = user ? null : await getOrCreateAnonymousSessionId();

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const limit = user ? AUTH_DAILY_LIMIT : ANON_DAILY_LIMIT;
  const filterColumn = user ? "user_id" : "anonymous_session_id";
  const filterValue = user ? user.id : anonymousSessionId!;
  const { count } = await supabase
    .from("runs")
    .select("id", { count: "exact", head: true })
    .eq(filterColumn, filterValue)
    .gte("created_at", since);
  if ((count ?? 0) >= limit) {
    return NextResponse.json(
      {
        error: user
          ? "Daily limit reached. Come back tomorrow."
          : "You've hit the free daily limit. Create a free account to keep going.",
        rateLimited: true,
      },
      { status: 429 },
    );
  }

  const { brain } = await loadBrain();
  const prompt = renderPrompt(tool.prompt_template, inputs, brain);

  const anthropic = new Anthropic({ apiKey });
  const startedAt = Date.now();
  let output = "";
  let tokensIn = 0;
  let tokensOut = 0;
  let status: "success" | "error" = "success";
  let errorMessage: string | null = null;

  try {
    const message = await anthropic.messages.create({
      model: tool.model,
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });
    tokensIn = message.usage?.input_tokens ?? 0;
    tokensOut = message.usage?.output_tokens ?? 0;
    output = message.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("")
      .trim();
  } catch (e) {
    status = "error";
    errorMessage = e instanceof Error ? e.message : "Unknown error";
  }

  const latencyMs = Date.now() - startedAt;

  await supabase.from("runs").insert({
    tool_slug: tool.slug,
    user_id: user?.id ?? null,
    anonymous_session_id: anonymousSessionId,
    input: inputs,
    output: status === "success" ? output : null,
    tokens_in: tokensIn || null,
    tokens_out: tokensOut || null,
    latency_ms: latencyMs,
    status,
    error: errorMessage,
  });

  if (status === "error") {
    return NextResponse.json({ error: errorMessage ?? "Tool run failed." }, { status: 500 });
  }

  return NextResponse.json({
    output,
    latencyMs,
    isSignedIn: !!user,
    brainUsed: !!brain.voice_samples,
  });
}
