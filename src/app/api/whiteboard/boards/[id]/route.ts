import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { signImageUrlsInBoardState } from "@/lib/whiteboard-storage";

export const runtime = "nodejs";

type BoardState = {
  nodes?: Array<Record<string, unknown>>;
  strokes?: unknown[];
  nextId?: number;
  view?: { x: number; y: number; scale: number } | null;
};

/** Load a board by id. Returns state with signed URLs already inlined for images. */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data, error } = await supabase
    .from("whiteboard_boards")
    .select("id, name, state, section_count, updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Board not found" }, { status: 404 });

  const state = (data.state ?? {}) as BoardState;
  const stateWithUrls = await signImageUrlsInBoardState(supabase, state);

  return NextResponse.json({
    board: {
      id: data.id,
      name: data.name,
      section_count: data.section_count,
      updated_at: data.updated_at,
      state: stateWithUrls,
    },
  });
}

/** Save a board (full state replace). Strips any inline `src` from images — only storage_path is persisted. */
export async function PUT(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  let body: { state?: unknown; name?: string };
  try {
    body = (await req.json()) as { state?: unknown; name?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.state || typeof body.state !== "object") {
    return NextResponse.json({ error: "state is required" }, { status: 400 });
  }
  const state = body.state as BoardState;
  const sanitized = sanitizeBoardStateForPersistence(state);
  const sectionCount = Array.isArray(sanitized.nodes)
    ? sanitized.nodes.filter((n) => n && (n as { type?: string }).type === "frame").length
    : 0;

  const update: Record<string, unknown> = {
    state: sanitized,
    section_count: sectionCount,
  };
  if (typeof body.name === "string" && body.name.trim()) update.name = body.name.trim();

  const { error } = await supabase
    .from("whiteboard_boards")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/** Rename only — lighter than PUT for sidebar inline renames. */
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  let body: { name?: string };
  try {
    body = (await req.json()) as { name?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  if (!body.name || typeof body.name !== "string") {
    return NextResponse.json({ error: "name required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("whiteboard_boards")
    .update({ name: body.name.trim() || "Untitled board" })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { error } = await supabase
    .from("whiteboard_boards")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

/**
 * Strip the volatile signed `src` from image nodes before persisting.
 * Only the storage_path (stable) is kept; signed URLs are re-generated on load.
 */
function sanitizeBoardStateForPersistence(state: BoardState): BoardState {
  const nodes = Array.isArray(state.nodes) ? state.nodes : [];
  return {
    nodes: nodes.map((n) => {
      if (!n || typeof n !== "object") return n;
      const node = n as Record<string, unknown>;
      if (node.type === "image" && typeof node.storage_path === "string") {
        // Drop the signed URL — it expires. Keep storage_path as the canonical reference.
        const { src: _src, signedUrl: _signedUrl, ...rest } = node;
        void _src;
        void _signedUrl;
        return rest;
      }
      return node;
    }),
    strokes: Array.isArray(state.strokes) ? state.strokes : [],
    nextId: typeof state.nextId === "number" ? state.nextId : 0,
    view: state.view ?? null,
  };
}
