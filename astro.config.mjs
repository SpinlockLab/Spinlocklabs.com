import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// Canonical site URL (GitHub Pages custom domain, see CNAME). Drives canonical
// links, the sitemap, and og:url.
export default defineConfig({
  site: "https://spinlocklabs.com",
  // Preserve Astro 5/6 HTML-aware whitespace compression. Astro 7 changed the
  // default to "jsx" (JSX-style stripping), which would glue adjacent inline
  // elements on separate source lines together.
  compressHTML: true,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
