import type { CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

export function getPublishedPosts(posts: Post[]) {
  return posts
    .filter((post) => !post.data.draft)
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export function getPostPath(post: Post) {
  return `/posts/${post.id}/`;
}

export function tagToSlug(tag: string) {
  return tag
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getTags(posts: Post[]) {
  const map = new Map<string, { label: string; slug: string; count: number }>();

  for (const post of posts) {
    for (const tag of post.data.tags) {
      const slug = tagToSlug(tag);
      const current = map.get(slug);

      map.set(slug, {
        label: current?.label ?? tag,
        slug,
        count: (current?.count ?? 0) + 1
      });
    }
  }

  return [...map.values()].sort((a, b) => a.label.localeCompare(b.label));
}

export function getPostsByTag(posts: Post[], tagSlug: string) {
  return posts.filter((post) => post.data.tags.some((tag) => tagToSlug(tag) === tagSlug));
}

export function getRelatedPosts(posts: Post[], currentPost: Post, limit = 2) {
  const currentTags = new Set(currentPost.data.tags.map(tagToSlug));

  return posts
    .filter((post) => post.id !== currentPost.id)
    .map((post) => {
      const sharedTags = post.data.tags.filter((tag) => currentTags.has(tagToSlug(tag))).length;
      const sameCategory = post.data.category === currentPost.data.category ? 1 : 0;

      return {
        post,
        score: sharedTags * 2 + sameCategory
      };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.post.data.publishedAt.getTime() - a.post.data.publishedAt.getTime();
    })
    .slice(0, limit)
    .map((item) => item.post);
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(date);
}

export function estimateReadingTime(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 260));

  return `${minutes} min`;
}
