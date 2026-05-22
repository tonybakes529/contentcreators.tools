import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getTool } from "@/lib/catalog";
import { Icons } from "@/components/icons";

export function generateStaticParams() {
  return CATEGORIES.flatMap((c) =>
    c.tools.map((t) => ({ category: c.slug, tool: t.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; tool: string }>;
}): Promise<Metadata> {
  const { category: cSlug, tool: tSlug } = await params;
  const found = getTool(cSlug, tSlug);
  if (!found) return {};
  const { category, tool } = found;
  const title = `${tool.name} — free ${category.name} tool`;
  return {
    title,
    description: tool.desc,
    alternates: { canonical: `/${category.slug}/${tool.slug}` },
    openGraph: {
      title,
      description: tool.desc,
      url: `/${category.slug}/${tool.slug}`,
      type: "website",
    },
  };
}

export default async function ToolPage({
  params,
}: {
  params: Promise<{ category: string; tool: string }>;
}) {
  const { category: cSlug, tool: tSlug } = await params;
  const found = getTool(cSlug, tSlug);
  if (!found) notFound();
  const { category, tool } = found;
  const isLive = tool.status === "live";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    applicationCategory: `${category.name} tool`,
    operatingSystem: "Web",
    description: tool.desc,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    url: `https://contentcreators.tools/${category.slug}/${tool.slug}`,
  };

  if (isLive && tool.url) {
    return (
      <>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <div className="iframe-wrap" style={{ height: "100%" }}>
          <iframe src={tool.url} title={tool.name} />
        </div>
      </>
    );
  }

  return (
    <div className="home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="hero" style={{ marginBottom: 36 }}>
        <div className="hero-eyebrow mono">
          <span className="dot" />
          <span>{category.name} · Coming soon</span>
        </div>
        <h1>{tool.name}</h1>
        <p className="hero-sub">{tool.desc}</p>
        <div className="hero-ctas">
          <Link
            href={`/${category.slug}/${category.primaryToolSlug}`}
            className="btn-primary"
          >
            {category.primaryLabel}
            {Icons.arrow}
          </Link>
          <Link href={`/${category.slug}`} className="btn-ghost">
            Back to {category.name}
          </Link>
        </div>
      </div>

      <div className="tool-seo">
        <h2>What {tool.name} does</h2>
        <p>{tool.desc}</p>
        <h2>Who it&apos;s for</h2>
        <p>
          {category.name} creators who want a fast, focused way to{" "}
          {tool.sub.toLowerCase()}. Free to use — no signup required to try.
        </p>
        <h2>Other free {category.name} tools</h2>
        <ul>
          {category.tools
            .filter((t) => t.slug !== tool.slug)
            .map((t) => (
              <li key={t.slug}>
                <Link href={`/${category.slug}/${t.slug}`}>{t.name}</Link> — {t.sub.toLowerCase()}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
