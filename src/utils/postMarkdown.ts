export const POST_CATEGORIES = ["research", "product", "operation", "automation", "web3", "note"] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

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
  body: string;
  sha?: string;
};

const CATEGORY_SET = new Set<string>(POST_CATEGORIES);

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
    body: ""
  };
}

export function normalizePostPayload(input: Partial<EditablePost>) {
  const post = {
    ...createEmptyPost(),
    ...input,
    tags: normalizeTags(input.tags)
  };

  post.slug = sanitizeSlug(post.slug || post.title);
  post.title = post.title.trim();
  post.description = post.description.trim();
  post.cover = post.cover.trim() || "/media/identity-octopus.jpg";
  post.coverAlt = post.coverAlt.trim();
  post.body = post.body.trim();

  if (!post.slug) throw new Error("Slug is required.");
  if (!post.title) throw new Error("Title is required.");
  if (!post.description) throw new Error("Description is required.");
  if (!CATEGORY_SET.has(post.category)) throw new Error("Invalid category.");
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
    "---",
    "",
    post.body || "Write your post here."
  ];

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
  if (Array.isArray(value)) {
    return value.map((tag) => String(tag).trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((tag) => tag.trim())
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
