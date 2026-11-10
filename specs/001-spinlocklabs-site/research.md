# Research: SpinlockLabs Website

**Date**: 2026-11-10
**Phase**: 0 — Outline & Research

No NEEDS CLARIFICATION markers remained in the Technical Context; every open question had a documented default from the specification's Assumptions section. This file records the design decisions, their rationale, and the alternatives evaluated.

## R1. Site framework: Astro 5 with static output

- **Decision**: Build the site with Astro 5 (installed: 5.18.2) in static output mode.
- **Rationale**: The user explicitly specified Astro, and the reference site (ZTA Security, `~/programming/ZTASecurity/ZTASecurity-website`) is an Astro 5 project whose layout, meta, and deploy patterns are proven for this lab's needs. Static output satisfies FR-018 (fully static, no server processing) with zero extra configuration.
- **Alternatives considered**:
  - *The ZTA site's full stack* (Astro + Tailwind + astro-compressor + sharp image service + satori OG-image generation + Netlify adapter + Preact + expressive-code). Rejected in part: the lab site has no images to process, no interactive components, and no serverless functions, so compressor/satori/sharp/Preact/Netlify are dead weight. Kept: Astro, Tailwind, content collections, the GitHub Pages workflow shape.
  - *Hugo / Eleventy / Next.js static export*. Rejected: the user specified Astro; migration to another generator would add a second convention alongside the parent org's site.

## R2. Content publishing: Astro content collections with Zod schemas

- **Decision**: Research projects and blog posts are markdown files in `src/content/research/` and `src/content/blog/`, each collection validated by a Zod schema at build time.
- **Rationale**: FR-007 and FR-010 require one-document publishing with no code changes. Content collections provide the route (`/research/[...slug]`), the list data (frontmatter), and the body render from a single file. Schema validation makes FR-003's field requirements (title, status, summary, updated) and the fixed status set a build-time error (User Story 3, scenario 2) instead of a runtime blank.
- **Alternatives considered**:
  - *Hand-written pages per project*. Rejected: breaks FR-007/FR-010.
  - *A CMS (Sanity, Contentful)*. Rejected: adds a service, an account, and a network dependency; contradicts the static, no-account posture and single-author scope.
  - *MDX instead of markdown*. Rejected: content is prose with code blocks, no interactivity needed; plain markdown keeps the authoring surface minimal.

## R3. Styling: Tailwind CSS 3 with a white, research-oriented theme

- **Decision**: Tailwind 3 (via `@astrojs/tailwind`) with a custom token set: white background (`#FFFFFF`), near-black ink (`#16181D`), neutral gray lines, one blue accent (`#3542FA`). Serif (Source Serif 4) for headings, Inter for UI, JetBrains Mono for tags.
- **Rationale**: The user asked for a white, researchy, non-fluffy theme, distinct from the ZTA site's warm paper theme. A single accent color and a two-font hierarchy keep the visual language calm and editorial. Tokens live in one file (`tailwind.config.cjs`) so the theme is a single-point change.
- **Alternatives considered**:
  - *Reuse the ZTA paper theme*. Rejected: user explicitly requested white.
  - *A CSS framework (Pico, Water.css)*. Rejected: two styling systems across the org; the ZTA site's utility-class patterns port directly and are already familiar.
  - *Tailwind 4*. Rejected: the reference site uses 3.x; matching it avoids a config-format migration.

## R4. Validation strategy: build as the test, preview as the acceptance check

- **Decision**: No automated test framework. Validation is (a) the build itself — content schema violations, type errors, and broken routes fail `astro build`; (b) `astro preview` plus scripted checks against the served pages (status codes, key content strings, viewport CSS); (c) the GitHub Actions build as the deployment gate.
- **Rationale**: The site has no business logic, no API, and no state. The failure modes are content errors (caught by schema validation at build), broken routes (caught by static generation), and visual regressions (checked in preview). A test runner would test the framework, not the site.
- **Alternatives considered**:
  - *astro test (Vitest)*. Rejected: nothing to unit-test; a page render test duplicates the build's own static generation.
  - *Playwright e2e suite*. Rejected: disproportionate for a 5-route static site; the quickstart's preview checks cover the same assertions with less infrastructure. (Revisit if the site grows interactive components.)

## R5. Deployment: GitHub Pages via `withastro/action`

- **Decision**: GitHub Pages, built by `.github/workflows/deploy.yml` (checkout → pnpm → `withastro/action@v2` → `actions/deploy-pages@v4`) on every push to `main` and on manual dispatch.
- **Rationale**: The user specified GitHub Pages and the ZTA site deploys the same way, so the workflow is a proven copy with org-specific values removed. The `site` URL in `astro.config.mjs` is a single placeholder (`https://spinlocklabs.github.io`) until the user picks the Pages target; changing it is a one-line edit (spec edge case "Placeholder domain").
- **Alternatives considered**:
  - *Netlify/Vercel*. Rejected: user specified GitHub Pages.
  - *Subpath of ztasecurity.com*. Considered during intake; the user chose GitHub Pages for the lab.

## R6. Radiance project facts (verified against the source)

- **Decision**: The radiance research page states only facts verified against the upstream project and the user's description.
- **Rationale**: FR-005 and FR-006 require accuracy and forbid unmeasured numbers.
- **Verified facts** (source: `codeberg.org/StillDeadcode/radiance` README, read 2026-11-10):
  - radiance is "an inference server for AMD GPUs, in C++ and HIP."
  - Its HTTP API "speaks OpenAI's chat, completions, Responses, images, audio and video APIs, Anthropic's Messages API and llama-server's native one, so their clients and SDKs work unchanged."
  - The reference hardware in the README is "two 32 GB cards (Radeon AI PRO R9700)," matching the user's "pair of 9700 AI pros."
  - The README's model table lists 27B-class models (e.g., Qwen3.8-27B) in FP8 and 4-bit formats, matching the page's "27B-class local models in FP8 and quantized formats."
- **Excluded**: all per-model throughput numbers from the upstream README (tok/s, prefill rates, draft acceptance). Those are radiance project measurements, not lab results; publishing them would violate FR-006 (results the lab has not measured itself are not presented as lab findings) and would blur the line between the upstream project and the lab's own work.
- **Alternatives considered**: *Quote upstream benchmarks as context.* Rejected for the reason above; the lab page links to the radiance repository instead, where those numbers live with their own hardware and methodology.

## R7. No tracking, no cookies

- **Decision**: The site ships no analytics, no tag managers, no cookies.
- **Rationale**: FR-016. The ZTA site loads Google Tag Manager; that script was deliberately not ported.
- **Alternatives considered**: *First-party-only analytics (Plausible).* Rejected: still a script and a tracker; the user asked for research-oriented, not for traffic numbers.
