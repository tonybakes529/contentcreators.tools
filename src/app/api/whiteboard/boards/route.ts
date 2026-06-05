import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type BoardRow = {
  id: string;
  name: string;
  section_count: number;
  updated_at: string;
};

/** List the current user's boards (newest first). */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  const { data, error } = await supabase
    .from("whiteboard_boards")
    .select("id, name, section_count, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ boards: (data as BoardRow[]) ?? [] });
}

/** Create a new (empty) board. Returns the new board id. */
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }
  let name = "Untitled board";
  let initialState: unknown = null;
  try {
    const body = (await req.json()) as { name?: string; state?: unknown };
    if (body && typeof body.name === "string" && body.name.trim()) name = body.name.trim();
    if (body && typeof body.state === "object" && body.state !== null) initialState = body.state;
  } catch {
    // Body is optional for plain "create empty board" calls
  }

  const insertRow: Record<string, unknown> = { user_id: user.id, name };
  if (initialState) insertRow.state = initialState;

  const { data, error } = await supabase
    .from("whiteboard_boards")
    .insert(insertRow)
    .select("id, name, section_count, updated_at")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ board: data });
}
