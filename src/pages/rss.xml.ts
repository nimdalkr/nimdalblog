import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

import { site } from "../config";
import { getPostPath, getPublishedPosts } from "../utils/posts";

export async function GET() {
  const posts = getPublishedPosts(await getCollection("posts"));

  return rss({
    title: site.title,
    description: site.description,
    site: site.url,
    customData: "<language>ko</language>",
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.publishedAt,
      link: getPostPath(post),
      categories: post.data.tags
    }))
  });
}
