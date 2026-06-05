import { createClient } from "@/lib/supabase/server";
import TalkingPointsClient from "./client";
import { EMPTY_BOARD, type Section } from "./types";

export default async function TalkingPointsTool() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let initialSections: Section[] = EMPTY_BOARD.sections;
  if (user) {
    const { data } = await supabase
      .from("talking_points")
      .select("sections")
      .eq("user_id", user.id)
      .maybeSingle();
    if (data?.sections && Array.isArray(data.sections)) {
      initialSections = data.sections as Section[];
    }
  }

  return (
    <TalkingPointsClient
      initialSections={initialSections}
      isSignedIn={!!user}
    />
  );
}
