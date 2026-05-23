import { createClient } from "@/lib/supabase/server";

export type ToolInputField = {
  name: string;
  label: string;
  placeholder?: string;
  type: "text" | "textarea";
  required?: boolean;
  rows?: number;
};

export type ToolRow = {
  slug: string;
  name: string;
  category_slug: string;
  template: "text" | "url" | "image";
  model: string;
  prompt_template: string;
  input_config: ToolInputField[];
  enabled: boolean;
};

export async function getToolRow(slug: string): Promise<ToolRow | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tools")
    .select("slug, name, category_slug, template, model, prompt_template, input_config, enabled")
    .eq("slug", slug)
    .eq("enabled", true)
    .maybeSingle();
  if (!data) return null;
  return {
    ...data,
    input_config: (data.input_config as ToolInputField[]) ?? [],
  } as ToolRow;
}
