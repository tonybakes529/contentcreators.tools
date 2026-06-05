import type { ReactNode } from "react";
import TalkingPointsTool from "@/components/tools/talking-points/server";

/**
 * Resolve a custom-component tool by slug. Returns null when the slug isn't
 * a custom tool, which lets the [tool] route fall through to ToolRunner /
 * iframe / "coming soon" handling.
 */
export async function renderCustomTool(slug: string): Promise<ReactNode | null> {
  switch (slug) {
    case "talking-points":
      return <TalkingPointsTool />;
    default:
      return null;
  }
}
