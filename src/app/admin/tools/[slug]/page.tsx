import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Icons } from "@/components/icons";
import ToolEditor from "./editor";

export const metadata: Metadata = {
  title: "Edit tool · Admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/signin?next=/admin/tools/${slug}`);
  const { data: isAdmin } = await supabase.rpc("is_admin");
  if (!isAdmin) notFound();

  const { data: tool } = await supabase
    .from("tools")
    .select("slug, name, category_slug, template, model, prompt_template, input_config, enabled")
    .eq("slug", slug)
    .maybeSingle();
  if (!tool) notFound();

  return (
    <div className="admin">
      <div className="admin-head">
        <Link href="/admin" className="admin-back mono">{Icons.arrow} Back to admin</Link>
        <h1>Edit <em>{tool.name}</em></h1>
        <p className="admin-sub mono">{tool.slug} · {tool.category_slug} · {tool.model}</p>
      </div>
      <ToolEditor
        slug={tool.slug}
        initialPrompt={tool.prompt_template}
        initialModel={tool.model}
        initialEnabled={tool.enabled}
        initialInputConfig={JSON.stringify(tool.input_config, null, 2)}
      />
    </div>
  );
}
