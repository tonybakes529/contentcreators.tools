"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "./icons";

export default function Topbar() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className="topbar">
      <div className="topbar-l">
        <Link href="/" className="topbar-brand">
          contentcreators<span>.tools</span>
        </Link>
      </div>
      <div className="topbar-r">
        <form className="topbar-search" onSubmit={onSubmit} role="search">
          {Icons.search}
          <input
            type="text"
            placeholder="Search tools…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search tools"
          />
        </form>
      </div>
    </header>
  );
}
