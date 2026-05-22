import Link from "next/link";
import type { CategorySlug, Tool } from "@/lib/catalog";
import { Icons } from "./icons";

export default function ToolCard({ category, tool }: { category: CategorySlug; tool: Tool }) {
  const isLive = tool.status === "live";
  return (
    <Link
      href={`/${category}/${tool.slug}`}
      className={`card${isLive ? " is-live" : ""}`}
    >
      <div className="card-top">
        <div className="card-icon">{tool.icon}</div>
        <div className={`card-pill${isLive ? " live" : ""}`}>{isLive ? "Live" : "Soon"}</div>
      </div>
      <div className="card-body">
        <div className="card-name">{tool.name}</div>
        <div className="card-sub mono">{tool.sub}</div>
        <div className="card-desc">{tool.desc}</div>
      </div>
      <div className="card-foot">
        <span>{isLive ? "Open tool" : "Coming soon"}</span>
        {Icons.arrow}
      </div>
    </Link>
  );
}
