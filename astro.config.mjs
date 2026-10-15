import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://grapipe.com",
  trailingSlash: "always",
  build: { format: "directory" },
  markdown: {
    shikiConfig: { theme: "github-light", wrap: true },
  },
});
