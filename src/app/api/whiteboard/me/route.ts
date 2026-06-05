import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * Bootstrap endpoint the whiteboard HTML hits on load.
 * Tells the client whether it's signed in (so it knows whether to use
 * cloud storage or fall back to localStorage).
 */
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return NextResponse.json({
    signedIn: !!user,
    email: user?.email ?? null,
  });
}
