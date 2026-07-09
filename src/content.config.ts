import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({
    base: "./src/content/posts",
    pattern: ["**/*.md", "**/*.mdx"],
    generateId: ({ entry }) => entry.replace(/\\/g, "/").replace(/\.(md|mdx)$/i, "")
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    category: z.enum(["research", "product", "operation", "automation", "web3", "note"]),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    lang: z.enum(["ko", "en"]).default("ko"),
    canonicalUrl: z.string().url().optional(),
    noindex: z.boolean().default(false),
    series: z.enum(["build-log", "research-note", "ops-manual", "game-system"]).optional(),
    relatedProject: z.string().optional(),
    proofLevel: z.enum(["none", "screenshots", "live-link", "internal", "claimed"]).default("none"),
    summaryBullets: z.array(z.string()).default([]),
    heroLabel: z.string().optional()
  })
});

export const collections = { posts };
