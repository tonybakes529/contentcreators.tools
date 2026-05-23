"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icons } from "./icons";

export default function TopbarSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/?q=${encodeURIComponent(q.trim())}`);
  }

  return (
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
  );
}
