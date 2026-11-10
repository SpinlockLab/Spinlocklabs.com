# Contract: Site Configuration

**Feature**: SpinlockLabs Website
**Owner**: `src/data/site.ts`, `astro.config.mjs`
**Consumers**: layouts, pages, build (sitemap, canonical URLs)

Site-wide values are defined once and consumed everywhere. This contract exists so that "change the domain later" and "change the contact email" are one-line edits, and so no page hard-codes a value that another page could drift from.

## `src/data/site.ts`

| Export | Shape | Launch value | Consumed by |
|--------|-------|--------------|-------------|
| `author` | string | `"SpinlockLabs"` | AppLayout head meta, ResearchLayout byline, Footer |
| `email` | string | `"contact@ztasecurity.com"` | AppLayout header Contact button, home page CTA, Footer, FR-011 |
| `socials.zta` | URL string | `"https://ztasecurity.com"` | Footer ("under ZTA Security" link) |
| `socials.radiance` | URL string | `"https://codeberg.org/StillDeadcode/radiance"` | radiance project page external link (FR-005) |
| `defaultMeta.title` | string | `"SpinlockLabs — AI for cybersecurity research"` | AppLayout `<title>` fallback, FR-013 |
| `defaultMeta.description` | string | one-sentence mission | AppLayout meta description fallback, FR-013 |
| `defaultMeta.keywords` | string[] | `["SpinlockLabs", "ZTA Security", "AI security", "local LLMs", "radiance", "AMD GPU"]` | AppLayout meta keywords |
| `defaultMeta.ogImage` | `{ src: string, alt: string }` | `{ src: "/banner.png", alt: "SpinlockLabs" }` | og:/twitter: image meta, SC-008 |

Rules:

- `email` is the single source of the contact address (data-model invariant 3). A page MUST NOT hard-code an address.
- `ogImage.src` points at a file that exists in `public/`. The launch banner is a 1200x630 PNG (SC-008 link preview).

## `astro.config.mjs`

| Key | Shape | Launch value | Notes |
|-----|-------|--------------|-------|
| `site` | URL | `https://spinlocklabs.com` | GitHub Pages custom domain (repo `CNAME`). It drives canonical URLs, the sitemap, and og:url. |

Rules:

- No other configuration value is part of this contract. Theme tokens live in `tailwind.config.cjs`; they are design, not site configuration.
- The build must not depend on the `site` value being final: every page must render identically (paths are absolute, assets are root-relative) regardless of what `site` is set to.
