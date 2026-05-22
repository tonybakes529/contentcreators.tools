"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES } from "@/lib/catalog";
import { Icons } from "./icons";

export default function Rail() {
  const pathname = usePathname();
  const segment = pathname.split("/").filter(Boolean)[0] ?? "";
  const isHome = pathname === "/";
  const isBrain = segment === "brain";

  return (
    <aside className="rail">
      <Link href="/" className="rail-brand" title="Home">C</Link>
      <div className="rail-divider" />
      <Link
        href="/"
        className={`rail-icon${isHome ? " is-active" : ""}`}
        aria-label="Home"
      >
        {Icons.home}
        <span className="rail-tip">Home</span>
      </Link>
      <Link
        href="/brain"
        className={`rail-icon rail-icon-brain${isBrain ? " is-active" : ""}`}
        aria-label="Your Brain"
      >
        {Icons.brain}
        <span className="rail-tip">Your Brain</span>
      </Link>
      <div className="rail-divider" />
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={`/${c.slug}`}
          className={`rail-icon${segment === c.slug ? " is-active" : ""}`}
          aria-label={c.name}
        >
          {Icons[c.slug]}
          <span className="rail-tip">{c.name}</span>
        </Link>
      ))}
      <div className="rail-spacer" />
    </aside>
  );
}
