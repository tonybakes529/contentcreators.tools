import Hero from "@/components/hero";
import BrainBanner from "@/components/brain-banner";
import CategoryTabs from "@/components/category-tabs";
import ToolCard from "@/components/tool-card";
import { CATEGORIES, HOME_META, ALL_TOOLS_COUNT } from "@/lib/catalog";

export default function Home() {
  const allTools = CATEGORIES.flatMap((c) => c.tools.map((t) => ({ category: c.slug, tool: t })));
  return (
    <div className="home">
      <Hero
        badge={`Free · ${ALL_TOOLS_COUNT} tools for creators`}
        h1Html={HOME_META.h1}
        sub={HOME_META.sub}
        primaryHref={HOME_META.primaryHref}
        primaryLabel={HOME_META.primaryLabel}
        secondaryHref="#tools"
        secondaryLabel="Browse all tools"
      />
      <BrainBanner />
      <div id="tools">
        <CategoryTabs active="all" />
        <div className="cards">
          {allTools.map(({ category, tool }) => (
            <ToolCard key={`${category}-${tool.slug}`} category={category} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
}
