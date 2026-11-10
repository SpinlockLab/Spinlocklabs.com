# Data Model: SpinlockLabs Website

**Date**: 2026-11-10
**Phase**: 1 — Design & Contracts

The site is static: there is no database. "Data" means structured content documents and one metadata module. The authoritative field definitions are in [contracts/content-schemas.md](./contracts/content-schemas.md); this file describes the entities, their relationships, and the rules the spec imposes on them.

## Entities

### ResearchProject

One lab experiment, authored as a single markdown file under `src/content/research/`.

| Field | Type | Constraint | Source requirement |
|-------|------|------------|--------------------|
| title | string | 5–90 chars | FR-003 |
| status | enum | `Active` \| `Ongoing` \| `Public call` (closed set) | FR-003, spec edge case "Status vocabulary" |
| summary | string | 20–240 chars, one line | FR-003 |
| updated | date | required, ISO | FR-003 (list ordering is by `updated` desc) |
| tags | string[] | default `[]`, no length limit at launch | FR-003 |
| externalLinks | { label, href }[] | default `[]`, href must be a valid URL | FR-005 (radiance repo link), spec edge case "External links" |
| body | markdown | must follow the section order Question → Setup → Work → Status | FR-004 |

**Notes**

- The body's section order is a content convention, not a schema-enforced rule: markdown bodies cannot be structurally validated by the frontmatter schema. The quickstart checks the radiance page for the four section headings as a content audit.
- `status` is a closed set. An unknown value fails the build (User Story 3, scenario 2; spec edge case "Status vocabulary").

### BlogPost

One published write-up, authored as a single markdown file under `src/content/blog/`.

| Field | Type | Constraint | Source requirement |
|-------|------|------------|--------------------|
| title | string | 5–90 chars | FR-008 |
| description | string | 20–240 chars | FR-008 |
| pubDate | date | required, ISO | FR-008 (list ordering is by `pubDate` desc) |
| updatedDate | date | optional | FR-008 |
| tags | string[] | default `[]` | FR-008 |
| body | markdown | free-form prose | FR-010 |

**Notes**

- Launch state is zero posts. The blog index must render the explicit "no posts yet" state in that condition (FR-009). The list renders automatically when posts exist.

### SiteMetadata

One TypeScript module (`src/data/site.ts`) plus one configuration value (`site` in `astro.config.mjs`).

| Key | Type | Launch value | Consumers |
|-----|------|--------------|-----------|
| author | string | "SpinlockLabs" | head meta, footer |
| email | string | `contact@ztasecurity.com` | header Contact button, home CTA, footer |
| socials.zta | url | `https://ztasecurity.com` | footer, home |
| socials.radiance | url | `https://codeberg.org/StillDeadcode/radiance` | radiance project page |
| defaultMeta.title | string | "SpinlockLabs — AI for cybersecurity research" | head `<title>` default, FR-013 |
| defaultMeta.description | string | one-sentence lab description | head meta default, FR-013 |
| defaultMeta.keywords | string[] | lab and topic terms | head meta |
| defaultMeta.ogImage | { src, alt } | `/banner.png`, 1200x630 | og:/twitter: meta, FR-013/SC-008 |
| site (astro.config) | url | `https://spinlocklabs.com` | canonical URLs, sitemap, FR-012 |

## Relationships

- `SiteMetadata` → every page: each page's head falls back to `defaultMeta` when the page does not supply its own title/description.
- `ResearchProject` → research list: the list at `/research/` is derived from the collection, ordered by `updated` descending.
- `ResearchProject` → home page: the home page shows the same list under "Research projects".
- `BlogPost` → blog list: the list at `/blog/` is derived from the collection, ordered by `pubDate` descending; the home page does not link individual posts at launch (the blog section is the empty-state page).
- No cross-references between research projects and blog posts are required at launch. A post may reference a project by link, but there is no structural link.

## State transitions

- **ResearchProject.status**: any value in the closed set, at any time. The lab chooses; the site only validates membership. There is no enforced lifecycle (for example, Active → Ongoing → complete is a convention, not a rule).
- **BlogPost**: no lifecycle. A post is published by adding its file; unpublished drafts do not exist in the site model (a file that fails validation fails the build, so a draft must not be committed until valid).
- **SiteMetadata**: edited in place; no history requirement.

## Invariants (from the spec)

1. The research list contains exactly the files in `src/content/research/` — nothing is listed that is not authored, and every authored project is listed.
2. No research project page may contain measured numbers that the lab has not itself measured and published (FR-006). Before results exist, the page states that none have been published.
3. The contact address everywhere on the site is the single value `contact@ztasecurity.com` (FR-011); it is sourced from one place.
4. The status of every listed project is a member of the closed set (build-enforced).
