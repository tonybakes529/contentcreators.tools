import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { loadBrain } from "@/lib/brain";
import BrainEditor from "@/components/brain-editor";

export const metadata: Metadata = {
  title: "Your Brain — the knowledge base that powers every tool",
  description:
    "Drop in your voice, audience, offer, and past work. Every tool on contentcreators.tools reads from this — the more it knows, the more your output sounds like you.",
  alternates: { canonical: "/brain" },
};

export const dynamic = "force-dynamic";

type BrainDoc = {
  id: string;
  filename: string;
  mime_type: string;
  size_bytes: number;
  created_at: string;
};

export default async function BrainPage() {
  const { brain, isSignedIn } = await loadBrain();

  let docs: BrainDoc[] = [];
  if (isSignedIn) {
    const supabase = await createClient();
    const { data } = await supabase
      .from("brain_documents")
      .select("id, filename, mime_type, size_bytes, created_at")
      .order("created_at", { ascending: false });
    docs = (data as BrainDoc[]) ?? [];
  }

  return <BrainEditor initialBrain={brain} isSignedIn={isSignedIn} docs={docs} />;
}
