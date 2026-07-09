export const POST_CATEGORIES = ["research", "product", "operation", "automation", "web3", "note"] as const;
export const POST_SERIES = ["build-log", "research-note", "ops-manual", "game-system"] as const;
export const PROOF_LEVELS = ["none", "screenshots", "live-link", "internal", "claimed"] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];
export type PostSeries = (typeof POST_SERIES)[number];
export type ProofLevel = (typeof PROOF_LEVELS)[number];

export type EditablePost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  category: PostCategory;
  tags: string[];
  cover: string;
  coverAlt: string;
  featured: boolean;
  draft: boolean;
  lang: "ko" | "en";
  series: PostSeries | "";
  relatedProject: string;
  proofLevel: ProofLevel;
  summaryBullets: string[];
  heroLabel: string;
  body: string;
  sha?: string;
};

const CATEGORY_SET = new Set<string>(POST_CATEGORIES);
const SERIES_SET = new Set<string>(POST_SERIES);
const PROOF_LEVEL_SET = new Set<string>(PROOF_LEVELS);

export function createEmptyPost(): EditablePost {
  return {
    slug: "",
    title: "",
    description: "",
    publishedAt: new Date().toISOString().slice(0, 10),
    category: "note",
    tags: [],
    cover: "/media/identity-octopus.jpg",
    coverAlt: "Nimdal pixel octopus identity.",
    featured: false,
    draft: false,
    lang: "en",
    series: "",
    relatedProject: "",
    proofLevel: "none",
    summaryBullets: [],
    heroLabel: "",
    body: ""
  };
}

export function normalizePostPayload(input: Partial<EditablePost>) {
  const post = {
    ...createEmptyPost(),
    ...input,
    tags: normalizeTags(input.tags),
    summaryBullets: normalizeStringList(input.summaryBullets)
  };

  post.slug = sanitizeSlug(post.slug || post.title);
  post.title = post.title.trim();
  post.description = post.description.trim();
  post.cover = post.cover.trim() || "/media/identity-octopus.jpg";
  post.coverAlt = post.coverAlt.trim();
  post.relatedProject = post.relatedProject.trim();
  post.heroLabel = post.heroLabel.trim();
  post.body = post.body.trim();

  if (!post.slug) throw new Error("Slug is required.");
  if (!post.title) throw new Error("Title is required.");
  if (!post.description) throw new Error("Description is required.");
  if (!CATEGORY_SET.has(post.category)) throw new Error("Invalid category.");
  if (post.series && !SERIES_SET.has(post.series)) throw new Error("Invalid series.");
  if (!PROOF_LEVEL_SET.has(post.proofLevel)) throw new Error("Invalid proof level.");
  if (post.lang !== "ko" && post.lang !== "en") throw new Error("Invalid language.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(post.publishedAt)) throw new Error("Published date must be YYYY-MM-DD.");

  return post;
}

export function postToMarkdown(input: Partial<EditablePost>) {
  const post = normalizePostPayload(input);
  const lines = [
    "---",
    `title: ${JSON.stringify(post.title)}`,
    `description: ${JSON.stringify(post.description)}`,
    `publishedAt: ${post.publishedAt}`,
    `category: ${JSON.stringify(post.category)}`,
    `tags: ${JSON.stringify(post.tags)}`,
    `cover: ${JSON.stringify(post.cover)}`,
    `coverAlt: ${JSON.stringify(post.coverAlt)}`,
    `featured: ${post.featured ? "true" : "false"}`,
    `draft: ${post.draft ? "true" : "false"}`,
    `lang: ${JSON.stringify(post.lang)}`,
    post.series ? `series: ${JSON.stringify(post.series)}` : "",
    post.relatedProject ? `relatedProject: ${JSON.stringify(post.relatedProject)}` : "",
    `proofLevel: ${JSON.stringify(post.proofLevel)}`,
    post.heroLabel ? `heroLabel: ${JSON.stringify(post.heroLabel)}` : "",
    post.summaryBullets.length ? `summaryBullets: ${JSON.stringify(post.summaryBullets)}` : "",
    "---",
    "",
    post.body || "Write your post here."
  ].filter(Boolean);

  return `${lines.join("\n")}\n`;
}

export function markdownToPost(markdown: string, slug: string, sha?: string): EditablePost {
  const empty = createEmptyPost();
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) {
    return {
      ...empty,
      slug,
      body: markdown,
      sha
    };
  }

  const frontmatter = parseFrontmatter(match[1]);
  const category = String(frontmatter.category ?? empty.category);
  const lang = String(frontmatter.lang ?? empty.lang);
  const series = String(frontmatter.series ?? "");
  const proofLevel = String(frontmatter.proofLevel ?? empty.proofLevel);

  return {
    slug,
    title: String(frontmatter.title ?? ""),
    description: String(frontmatter.description ?? ""),
    publishedAt: String(frontmatter.publishedAt ?? empty.publishedAt).slice(0, 10),
    category: CATEGORY_SET.has(category) ? (category as PostCategory) : "note",
    tags: normalizeTags(frontmatter.tags),
    cover: String(frontmatter.cover ?? empty.cover),
    coverAlt: String(frontmatter.coverAlt ?? ""),
    featured: Boolean(frontmatter.featured),
    draft: Boolean(frontmatter.draft),
    lang: lang === "ko" ? "ko" : "en",
    series: SERIES_SET.has(series) ? (series as PostSeries) : "",
    relatedProject: String(frontmatter.relatedProject ?? ""),
    proofLevel: PROOF_LEVEL_SET.has(proofLevel) ? (proofLevel as ProofLevel) : "none",
    summaryBullets: normalizeStringList(frontmatter.summaryBullets),
    heroLabel: String(frontmatter.heroLabel ?? ""),
    body: match[2].trim(),
    sha
  };
}

export function sanitizeSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTags(value: unknown) {
  return normalizeStringList(value, ",");
}

function normalizeStringList(value: unknown, separator?: string) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(separator ?? "\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function parseFrontmatter(frontmatter: string) {
  const result: Record<string, unknown> = {};

  for (const line of frontmatter.split("\n")) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;

    result[match[1]] = parseScalar(match[2]);
  }

  return result;
}

function parseScalar(value: string): unknown {
  const trimmed = value.trim();

  if (trimmed === "true") return true;
  if (trimmed === "false") return false;
  if (trimmed.startsWith("[") || trimmed.startsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}
