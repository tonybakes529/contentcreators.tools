"use server";

import { createClient } from "@/lib/supabase/server";
import type { Section } from "./types";

/**
 * Replace the user's entire Talking Points board with the supplied sections.
 * Server-side validation: each section/bullet must have an id + string fields.
 */
export async function saveBoard(sections: Section[]): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Sign in to save." };

  // Coerce to a safe shape; drop anything weird.
  const cleaned = (Array.isArray(sections) ? sections : []).map((s) => ({
    id: typeof s.id === "string" ? s.id : crypto.randomUUID(),
    heading: typeof s.heading === "string" ? s.heading : "",
    editor_notes: typeof s.editor_notes === "string" ? s.editor_notes : "",
    bullets: Array.isArray(s.bullets)
      ? s.bullets.map((b) => ({
          id: typeof b.id === "string" ? b.id : crypto.randomUUID(),
          text: typeof b.text === "string" ? b.text : "",
        }))
      : [],
    photos: Array.isArray(s.photos)
      ? s.photos
          .filter(
            (p) =>
              p &&
              typeof p.id === "string" &&
              typeof p.storage_path === "string" &&
              typeof p.filename === "string",
          )
          .map((p) => ({ id: p.id, storage_path: p.storage_path, filename: p.filename }))
      : [],
  }));

  const { error } = await supabase
    .from("talking_points")
    .upsert({ user_id: user.id, sections: cleaned }, { onConflict: "user_id" });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
