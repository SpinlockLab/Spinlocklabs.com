# Contract: Routes

**Feature**: SpinlockLabs Website
**Owner**: `src/pages/`
**Consumers**: visitors, search engines, the sitemap

The route contract. Every row is a URL the site must serve, with its source, its success behavior, and the requirement it satisfies.

| Route | Source | Behavior | Requirement |
|-------|--------|----------|-------------|
| `/` | `src/pages/index.astro` | 200. Home: identity, mission, research list (derived from the research collection), blog link, contact link | FR-001, FR-002, SC-001, SC-002 |
| `/research/` | `src/pages/research/index.astro` | 200. List of all research projects: title, summary, status badge, updated date; ordered `updated` descending. Empty state if the collection is empty | FR-003, US3 |
| `/research/<slug>/` | `src/pages/research/[...slug].astro` | 200 for every slug in `src/content/research/`. 404 for any other slug. Project page: status, updated date, title, summary, external links, body | FR-004, FR-005, FR-006, FR-007 |
| `/blog/` | `src/pages/blog/index.astro` | 200. If posts exist: list of title, description, pubDate, newest first. If no posts: explicit "No posts yet" state, no broken rows | FR-008, FR-009 |
| `/blog/<slug>/` | (not generated at launch; generated per post file when posts exist) | 200 for every slug in `src/content/blog/`. 404 otherwise. Post page: title, description, date, body, back link to `/blog/` | FR-010, US4 |
| `/404.html` | `src/pages/404.astro` | Served for any unmatched path (GitHub Pages not-found). Shows the 404 state and a link to `/` | FR-014, SC-007 |
| `/favicon.svg` | `public/favicon.svg` | 200. SVG favicon, referenced in every page head | FR-013 |
| `/banner.png` | `public/banner.png` | 200. 1200x630 og:image | FR-013, SC-008 |
| `/sitemap-index.xml` | generated at build | 200. Lists all routable pages (home, research, projects, blog, and posts when they exist) | FR-012, FR-013 |

## Rules

1. **Derived lists**: `/research/` and the home page never hard-code project rows; they are derived from the collection at build time. Adding a document adds a row (FR-007).
2. **Slugs are filenames**: a content file named `radiance.md` serves at `/research/radiance/`. Renaming the file moves the page; there is no separate slug field and no redirect mechanism at launch.
3. **Trailing slashes**: all routes are served with trailing slashes (Astro static output default).
4. **No other routes exist at launch.** Notably, there is no privacy policy page (removed from the site at the lab's request after the spec was drafted) and no contact form: the contact channel is the email link (FR-011).
5. **Meta contract**: every page head carries `title`, `description`, canonical `og:url`/`twitter` tags derived from `Astro.site` (see [site-config.md](./site-config.md)). Pages may override title and description; they fall back to `defaultMeta` otherwise (FR-013).
6. **Viewport contract**: every route renders at 320 px and 1280 px without horizontal scrolling or overlap (SC-006). The header navigation collapses at narrow widths.
