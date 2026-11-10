# Quickstart: SpinlockLabs Website

**Date**: 2026-11-10
**Phase**: 1 — Design & Contracts

Validation and run guide for the site. These scenarios prove the feature works end-to-end against the spec's acceptance criteria. They are checks, not implementation instructions.

## Prerequisites

- Node.js >= 18.17 (local toolchain: Node 22) and pnpm 9
- The repository contents (this project)
- A web browser for visual checks

## Setup

```sh
pnpm install
```

## Run

```sh
pnpm dev        # dev server, prints the local URL (default http://localhost:4321)
pnpm build      # static build to dist/
pnpm preview    # serves dist/ (default http://localhost:4321)
```

## Validation scenarios

### S1. Build succeeds and produces the expected pages (FR-012, FR-018)

1. Run `pnpm build`.
2. Expected: exit 0; `dist/` contains `index.html`, `research/index.html`, `research/radiance/index.html`, `blog/index.html`, `404.html`, and `sitemap-index.xml`.
3. Expected: the build output shows no page rendering a route with an error.

### S2. All routes serve correctly (routes contract, SC-007)

1. Run `pnpm preview` after a build.
2. Request each route; expected status codes:

| Route | Expected |
|-------|----------|
| `/` | 200 |
| `/research/` | 200 |
| `/research/radiance/` | 200 |
| `/blog/` | 200 |
| `/nonexistent` | 404 |

3. Expected: the 404 response body links to `/`.

### S3. Radiance project page is accurate (FR-005, FR-006, SC-005)

1. Open `/research/radiance/`.
2. Content audit — all of the following MUST be present:
   - the engine named: `radiance`, with a link to `https://codeberg.org/StillDeadcode/radiance`
   - the hardware named: two Radeon AI PRO R9700 GPUs
   - the model class named: local 27B-class LLMs (FP8 and quantized formats)
   - the four body sections, in order: Question, Setup, What we are doing, Status
   - an explicit statement that no results have been published yet
3. Content audit — the following MUST NOT be present:
   - any tok/s, prefill, or accuracy number attributed to the lab (those belong to the upstream radiance project, not to lab results)

### S4. One-document publishing for research (FR-007, US3)

1. Copy `src/content/research/radiance.md` to `src/content/research/test-project.md`; change `title`, `summary`, `updated`, and shorten the body.
2. Run `pnpm build`. Expected: success; `dist/research/test-project/index.html` exists.
3. Open `/research/`. Expected: both projects are listed, `test-project` appears with its title and status badge.
4. **Negative case**: set `status: "Done"` in `test-project.md` and rebuild. Expected: the build FAILS with a message naming the invalid status (closed set, spec edge case).
5. Delete `src/content/research/test-project.md` and rebuild. Expected: success; the research list shows only the radiance project again.

### S5. Blog empty state and first post (FR-008, FR-009, FR-010, US4)

1. With no files in `src/content/blog/`, open `/blog/`. Expected: a clear "No posts yet" notice and no list rows.
2. Add `src/content/blog/hello-world.md` with valid frontmatter (title, description, pubDate) and a short body.
3. Run `pnpm build`. Expected: success; `dist/blog/hello-world/index.html` exists.
4. Open `/blog/`. Expected: the post is listed with title, description, and date. Open the post; expected: full body and a link back to `/blog/`.
5. Delete the post file and rebuild; the blog returns to the empty state.

### S6. Contact channel (FR-011)

1. On `/`, `/research/`, and `/blog/`, verify `contact@ztasecurity.com` appears and the Contact link is `mailto:contact@ztasecurity.com`.
2. Verify no other email address appears anywhere in `dist/`.

### S7. Meta and sitemap (FR-013, SC-008)

1. Open `/` and `/research/radiance/`; verify each head has a unique `<title>`, a `description` meta, an `og:image` pointing at `/banner.png`, and a canonical URL under the configured site.
2. Fetch `/sitemap-index.xml`. Expected: valid XML; the sitemap lists `/`, `/research/`, `/research/radiance/`, and `/blog/`.

### S8. Viewports (SC-006, FR-015)

1. In a browser dev-tools device emulation, load `/` at 320 px and 1280 px.
2. Expected at both widths: no horizontal scrollbar, no overlapping text, all navigation links reachable (header nav may collapse at narrow width), contact button visible.
3. Repeat the 320 px check for `/research/` and `/research/radiance/`.

### S9. No tracking (FR-016)

1. With a network monitor open (or by grepping the built output), load every page.
2. Expected: the only network requests are to the site's own origin (HTML, CSS, fonts, the favicon and banner). No third-party requests, no `Set-Cookie` headers, no `<script>` tags in the page markup.
3. Grep check: `grep -R "googletagmanager\|gtag\|Set-Cookie" dist/` returns nothing.

## Deployment gate

- Push to `main` runs `.github/workflows/deploy.yml`: pnpm install, `astro build`, upload, deploy. A build that fails in the scenario S4 negative case cannot be deployed, because the workflow fails on any non-zero build exit.
- Before the first real deploy, set the final domain in `astro.config.mjs` (`site`) per [site-config.md](./contracts/site-config.md) and enable the Pages environment in the GitHub repository.
