import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://blog.nimdal.xyz",
  adapter: vercel(),
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/tags/")
    })
  ]
});
