import Link from "next/link";
import { Icons } from "./icons";

export default function BrainBanner() {
  return (
    <Link href="/brain" className="brain-banner">
      <div className="brain-banner-mark">B</div>
      <div className="brain-banner-body">
        <div className="brain-banner-title">Your Brain · the knowledge base that powers every tool</div>
        <div className="brain-banner-meta">
          <span>4 / 10 complete</span>
          <div className="brain-banner-bar"><div style={{ width: "40%" }} /></div>
          <span>3 docs uploaded</span>
        </div>
      </div>
      <div className="brain-banner-cta">
        Open Brain
        {Icons.arrow}
      </div>
    </Link>
  );
}
