import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// Set the real domain here when the GitHub Pages target is chosen.
// The build does not depend on this value except for sitemap/OG URLs.
export default defineConfig({
  site: "https://spinlocklabs.github.io",
  // Preserve Astro 5/6 HTML-aware whitespace compression. Astro 7 changed the
  // default to "jsx" (JSX-style stripping), which would glue adjacent inline
  // elements on separate source lines together.
  compressHTML: true,
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
