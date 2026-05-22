import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Hero from "@/components/hero";
import BrainBanner from "@/components/brain-banner";
import CategoryTabs from "@/components/category-tabs";
import ToolCard from "@/components/tool-card";
import { CATEGORIES, getCategory } from "@/lib/catalog";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) return {};
  const title = category.h1.replace(/<\/?em>/g, "");
  return {
    title: `${category.name} tools for creators`,
    description: category.sub,
    alternates: { canonical: `/${category.slug}` },
    openGraph: {
      title,
      description: category.sub,
      url: `/${category.slug}`,
      type: "website",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();

  return (
    <div className="home">
      <Hero
        badge={category.badge}
        h1Html={category.h1}
        sub={category.sub}
        primaryHref={`/${category.slug}/${category.primaryToolSlug}`}
        primaryLabel={category.primaryLabel}
        secondaryHref="/"
        secondaryLabel="Browse all tools"
      />
      <BrainBanner />
      <CategoryTabs active={category.slug} />
      <div className="cards">
        {category.tools.map((t) => (
          <ToolCard key={t.slug} category={category.slug} tool={t} />
        ))}
      </div>
    </div>
  );
}
