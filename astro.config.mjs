import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { rehypeImagePerformance } from "./src/utils/rehype-image-performance.mjs";

export default defineConfig({
  site: "https://blog.nimdal.xyz",
  adapter: vercel(),
  trailingSlash: "always",
  markdown: {
    rehypePlugins: [rehypeImagePerformance]
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/tags/")
    })
  ]
});
