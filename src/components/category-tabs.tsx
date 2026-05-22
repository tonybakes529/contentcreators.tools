import Link from "next/link";
import { CATEGORIES, ALL_TOOLS_COUNT } from "@/lib/catalog";
import { Icons } from "./icons";

export default function CategoryTabs({ active }: { active: "all" | string }) {
  const items = [
    { slug: "all" as const, name: "All Tools", href: "/", count: ALL_TOOLS_COUNT, icon: Icons.all },
    ...CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      href: `/${c.slug}`,
      count: c.tools.length,
      icon: Icons[c.slug],
    })),
  ];

  return (
    <nav className="tabs" aria-label="Tool categories">
      {items.map((it) => (
        <Link
          key={it.slug}
          href={it.href}
          className={`tab${active === it.slug ? " is-active" : ""}`}
        >
          <span className="tab-icon">{it.icon}</span>
          <span>{it.name}</span>
          <span className="tab-count">{it.count}</span>
        </Link>
      ))}
    </nav>
  );
}
