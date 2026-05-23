"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Input = {
  slug: string;
  prompt_template: string;
  model: string;
  enabled: boolean;
  input_config: unknown;
};

type Result = { ok: true } | { ok: false; error: string };

export async function saveToolConfig(input: Input): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) return { ok: false, error: "Not authorized" };

  const { error } = await supabase
    .from("tools")
    .update({
      prompt_template: input.prompt_template,
      model: input.model,
      enabled: input.enabled,
      input_config: input.input_config,
    })
    .eq("slug", input.slug);

  if (error) return { ok: false, error: error.message };

  revalidatePath(`/admin/tools/${input.slug}`);
  revalidatePath("/admin");
  return { ok: true };
}
