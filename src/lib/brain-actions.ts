"use server";

import { createClient } from "@/lib/supabase/server";

const TEXT_FIELDS = ["voice_samples"] as const;
const JSON_FIELDS = ["identity", "audience", "offer", "guardrails"] as const;
type TextField = (typeof TEXT_FIELDS)[number];
type JsonField = (typeof JSON_FIELDS)[number];
type BrainField = TextField | JsonField;

const ALLOWED: ReadonlySet<BrainField> = new Set([...TEXT_FIELDS, ...JSON_FIELDS]);

export type SaveResult =
  | { ok: true }
  | { ok: false; error: string; reason?: "signed_out" | "invalid_field" | "db_error" };

export async function saveBrainField(field: string, value: unknown): Promise<SaveResult> {
  if (!ALLOWED.has(field as BrainField)) {
    return { ok: false, error: "Invalid field", reason: "invalid_field" };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { ok: false, error: "Sign in to save your Brain.", reason: "signed_out" };
  }

  const sanitized =
    (TEXT_FIELDS as readonly string[]).includes(field)
      ? (typeof value === "string" ? value : "")
      : (value && typeof value === "object" ? value : {});

  const row = {
    user_id: user.id,
    [field]: sanitized,
  };

  const { error } = await supabase.from("brains").upsert(row, { onConflict: "user_id" });
  if (error) {
    return { ok: false, error: error.message, reason: "db_error" };
  }

  return { ok: true };
}
