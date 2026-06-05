export type ToolStatus = "live" | "soon";

export type Tool = {
  /** URL slug, unique per category */
  slug: string;
  name: string;
  /** Tagline like "Script → feedback" */
  sub: string;
  /** 2-letter monogram for icon */
  icon: string;
  status: ToolStatus;
  desc: string;
  /** Live tool URL (loaded in iframe). Required when status === "live" and custom is false. */
  url?: string;
  /** Bespoke React component for this tool (not the shared ToolRunner). */
  custom?: boolean;
  /** Optional longer SEO copy shown on the tool page */
  seo?: string;
};

export type CategorySlug =
  | "youtube"
  | "instagram-tiktok"
  | "linkedin"
  | "brand"
  | "management"
  | "calculators"
  | "ideation";

export type Category = {
  slug: CategorySlug;
  name: string;
  badge: string;
  /** H1 — `<em>` wraps the colored word */
  h1: string;
  sub: string;
  /** Primary CTA points at this tool slug within the same category */
  primaryToolSlug: string;
  primaryLabel: string;
  tools: Tool[];
};

export const CATEGORIES: Category[] = [
  {
    slug: "youtube",
    name: "YouTube",
    badge: "YouTube research + production · free",
    h1: "Plan your next <em>YouTube</em> video.",
    sub: "Pre-production tools for creators who treat YouTube like a business. Build outlines, analyze scripts, audit thumbnails, decode comments — everything you do before you hit record.",
    primaryToolSlug: "talking-points",
    primaryLabel: "Open Talking Points",
    tools: [
      { slug: "talking-points", name: "Talking Points", sub: "Outline → ready to film", icon: "TP", status: "live", custom: true, desc: "Build a video outline as sections of bullets, drop in reference photos for your editor, add per-section notes, then copy or download the sheet." },
      { slug: "whiteboard", name: "Whiteboard", sub: "Brain dump → board", icon: "WB", status: "live", url: "/tools/whiteboard.html", desc: "A free AI-powered Miro-style board. Paste any doc and it splits into sections of editable, draggable, resizable boxes — with drawing, sticky notes, image uploads, and multi-board saves." },
      { slug: "script-analyzer", name: "Script Analyzer", sub: "Script → feedback", icon: "SA", status: "soon", desc: "Paste a video script. Get section-by-section notes on pacing, retention risks, and clarity." },
      { slug: "thumbnail-to-intro-analyzer", name: "Thumbnail to Intro Analyzer", sub: "Promise → delivery", icon: "TI", status: "soon", desc: "Compare your thumbnail/title promise against your first 30s and flag any mismatch." },
      { slug: "comment-analyzer", name: "Comment Analyzer", sub: "Comments → themes", icon: "CA", status: "soon", desc: "Drop a comment dump. Get themes, sentiment, and the next 5 video ideas your audience is asking for." },
      { slug: "thumbnail-preview", name: "Thumbnail Preview Tool", sub: "Image → feed mock", icon: "TM", status: "soon", desc: "See your thumbnail mocked in the YouTube grid, sidebar, and mobile at real sizes." },
    ],
  },
  {
    slug: "instagram-tiktok",
    name: "IG / TikTok",
    badge: "Instagram & TikTok tools · free",
    h1: "Win the <em>short-form</em> feed.",
    sub: "Turn one idea into a week of native posts, carousels, and captions that actually sound like you. Built for creators who don't have time for Canva.",
    primaryToolSlug: "carousel-builder",
    primaryLabel: "Try Carousel Builder",
    tools: [
      { slug: "carousel-builder", name: "Carousel Builder", sub: "Script → carousel", icon: "CB", status: "live", url: "/external/carousel-builder", desc: "Paste a script. Get a slide-by-slide carousel — editorial typography, three theme directions." },
      { slug: "posting-time-recommender", name: "Posting Time Recommender", sub: "Account → best slot", icon: "PT", status: "soon", desc: "Suggest the best posting windows based on your niche, audience timezone, and platform." },
      { slug: "caption-writer", name: "Caption Writer", sub: "Post → caption", icon: "CW", status: "soon", desc: "On-brand captions with a hook, body, and CTA in your voice." },
    ],
  },
  {
    slug: "linkedin",
    name: "LinkedIn",
    badge: "LinkedIn growth tools · free",
    h1: "Win the <em>LinkedIn</em> feed.",
    sub: "Score drafts, repurpose long-form, write hooks that survive the scroll, draft warm DMs, and rebuild your profile. The LinkedIn growth stack for operators and founders.",
    primaryToolSlug: "post-checker",
    primaryLabel: "Try Post Checker",
    tools: [
      { slug: "post-checker", name: "LinkedIn Post Checker", sub: "Draft → score", icon: "PC", status: "soon", desc: "Score a draft against LinkedIn-native patterns: hook strength, line breaks, hashtag use, CTA." },
      { slug: "long-form-to-linkedin", name: "Long Form to LinkedIn", sub: "Essay → LI post", icon: "LL", status: "soon", desc: "Turn a blog, newsletter, or transcript into a tight LinkedIn-native post that holds attention." },
      { slug: "hook-writer", name: "Hook Writer", sub: "Idea → hooks", icon: "HW", status: "soon", desc: "Ten opening lines from one idea, written for the LinkedIn scroll." },
      { slug: "dm-drafting", name: "DM Drafting", sub: "Lead → message", icon: "DM", status: "soon", desc: "Personal-sounding DMs for warm outreach, replies, and follow-ups — not spam." },
      { slug: "profile-optimizer", name: "Profile Optimizer", sub: "Profile → rewrite", icon: "PO", status: "soon", desc: "Audit your headline, About, and Experience. Get a rewrite that reads like you." },
    ],
  },
  {
    slug: "brand",
    name: "Brand",
    badge: "Personal brand toolkit · free",
    h1: "Build a <em>creator</em> brand.",
    sub: "Bios, taglines, names, palettes, and a brand voice that doesn't read like everyone else's. Free brand-building tools for solo operators and small teams.",
    primaryToolSlug: "bio-writer",
    primaryLabel: "Try Bio Writer",
    tools: [
      { slug: "bio-writer", name: "Bio Writer", sub: "You → bio", icon: "BW", status: "soon", desc: "Concise, on-brand bios for every platform — LinkedIn, X, IG, YouTube About, Substack." },
      { slug: "tagline-generator", name: "Tagline Generator", sub: "Offer → tagline", icon: "TG", status: "soon", desc: "Sharp one-liners that explain what you do without sounding like a pitch deck." },
      { slug: "brand-voice-audit", name: "Brand Voice Audit", sub: "Draft → voice match", icon: "VA", status: "soon", desc: "Score any piece of copy against your saved voice and flag the lines that drift." },
      { slug: "palette-maker", name: "Palette Maker", sub: "Vibe → colors", icon: "PM", status: "soon", desc: "Build a 5-color palette from a reference image, a mood, or your existing logo." },
      { slug: "name-generator", name: "Name Generator", sub: "Idea → names", icon: "NG", status: "soon", desc: "Brand, product, podcast, and series names that aren't already taken." },
    ],
  },
  {
    slug: "management",
    name: "Management",
    badge: "Content production tools · free",
    h1: "Run content like a <em>team</em>.",
    sub: "Briefs, batches, and a single source of truth for shoot day. Free workflow tools for creators who hire editors, designers, and producers — or want to.",
    primaryToolSlug: "video-brief-maker",
    primaryLabel: "Try Video Brief Maker",
    tools: [
      { slug: "video-brief-maker", name: "Video Brief Maker", sub: "Idea → brief", icon: "VB", status: "soon", desc: "One-page video briefs for editors and shooters: angle, beats, b-roll, deliverables." },
      { slug: "thumbnail-brief-maker", name: "Thumbnail Brief Maker", sub: "Title → brief", icon: "TB", status: "soon", desc: "A brief for your thumbnail designer with composition notes, refs, and the exact promise." },
      { slug: "batch-production-planner", name: "Batch-production Planner", sub: "Month → schedule", icon: "BP", status: "soon", desc: "Plan a month of content as batched shoot/write/edit days so nothing slips." },
      { slug: "tiny-link-creator", name: "Tiny Link Creator", sub: "URL → short link", icon: "TL", status: "soon", desc: "Branded short links for swipe-ups and bios, with click tracking." },
    ],
  },
  {
    slug: "calculators",
    name: "Calculators",
    badge: "Creator calculators · free",
    h1: "Decide on <em>data</em>, not vibes.",
    sub: "Score any hook. Calculate engagement rates. Free calculators for creators who want quick, honest numbers before they hit publish.",
    primaryToolSlug: "hook-score",
    primaryLabel: "Try Hook Score",
    tools: [
      { slug: "hook-score", name: "Hook Score", sub: "Line → 0-100", icon: "HS", status: "soon", desc: "Score any opening line against patterns that historically perform." },
      { slug: "engagement-calc", name: "Engagement Calc", sub: "Reach → rate", icon: "EC", status: "soon", desc: "Quick engagement-rate math for posts, accounts, and campaigns." },
    ],
  },
  {
    slug: "ideation",
    name: "Ideation",
    badge: "Content ideation tools · free",
    h1: "Never run out of <em>ideas</em>.",
    sub: "Find the angles your competitors are missing. Free ideation tools for creators staring at a blank doc on a Monday morning.",
    primaryToolSlug: "competitor-gap-finder",
    primaryLabel: "Try Competitor Gap Finder",
    tools: [
      { slug: "competitor-gap-finder", name: "Competitor Gap Finder", sub: "Niche → openings", icon: "CG", status: "soon", desc: "Map what your competitors cover — and the high-value angles none of them have touched yet." },
    ],
  },
];

export function getCategory(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getTool(categorySlug: string, toolSlug: string): { category: Category; tool: Tool } | undefined {
  const category = getCategory(categorySlug);
  const tool = category?.tools.find((t) => t.slug === toolSlug);
  if (!category || !tool) return undefined;
  return { category, tool };
}

export const ALL_TOOLS_COUNT = CATEGORIES.reduce((n, c) => n + c.tools.length, 0);
export const LIVE_TOOLS_COUNT = CATEGORIES.reduce((n, c) => n + c.tools.filter((t) => t.status === "live").length, 0);

export const HOME_META = {
  badge: `Free · ${ALL_TOOLS_COUNT} tools for creators`,
  h1: "Your all-in-one <em>creator</em> toolkit.",
  sub: "A growing kit of single-purpose tools. Pick a category, open a tool, ship something today.",
  primaryHref: "/instagram-tiktok/carousel-builder",
  primaryLabel: "Start with Carousel Builder",
};
