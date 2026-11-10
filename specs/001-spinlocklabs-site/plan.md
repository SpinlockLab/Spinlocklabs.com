# Implementation Plan: SpinlockLabs Website

**Branch**: `[001-spinlocklabs-site]` (no git repository is initialized in the working directory; the branch name is recorded from the setup script for when the repo is created) | **Date**: 2026-11-10 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/001-spinlocklabs-site/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Deliver a static, research-oriented website for SpinlockLabs (a research lab under ZTA Security studying AI for cybersecurity). The site presents the lab identity and mission, serves a research section with per-project pages (launching with one project: local LLMs on the radiance inference engine, 2x R9700 GPUs), an empty-state blog that supports one-document publishing, a contact channel, a not-found page, and GitHub Pages deployment on push. Technical approach: Astro 5 with content collections and Tailwind CSS, no runtime JavaScript, no analytics, validated by build + preview checks.

## Technical Context

**Language/Version**: JavaScript/TypeScript (Astro 5.18, Node >= 18.17; local toolchain Node 22)

**Primary Dependencies**: `astro` 5, `@astrojs/tailwind` + `tailwindcss` 3, `@astrojs/sitemap`, `@fontsource-variable` (Inter, Source Serif 4, JetBrains Mono). No other runtime dependencies; the build produces a fully static site.

**Storage**: N/A. Content is markdown files in content collections; site metadata is one TypeScript data module. No database.

**Testing**: Build-based validation (schema-validated content fails the build; see [research.md](./research.md) R4) plus manual preview checks documented in [quickstart.md](./quickstart.md). No automated test framework (see Complexity note under Constitution Check).

**Target Platform**: Static hosting on GitHub Pages (final domain pending user decision; one configuration point in `astro.config.mjs`)

**Project Type**: Static web application (content site, single project)

**Performance Goals**: SC-004: every page loads in under 3 seconds on standard broadband. Static HTML with minimal CSS and no JavaScript makes this a build-output-size concern rather than a runtime concern.

**Constraints**: FR-016: no analytics, tracking, or cookies. FR-018: fully static, no server-side processing, no accounts. FR-017: factual content only. SC-006: usable at 320 px and 1280 px viewports.

**Scale/Scope**: ~5 routes at launch (home, research index, 1 research project, blog index, 404); single author; growth is content, not code.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

`.specify/memory/constitution.md` is an unfilled template: every principle is a `[PRINCIPLE_N_NAME]` placeholder with no defined constraints, gates, or workflow requirements.

- Gates determined: **none active.** There are no enforceable principles in the current constitution, so the gate passes vacuously.
- When the constitution is ratified with real principles, this section MUST be re-evaluated before implementation.

**Post-design re-check (after Phase 1)**: Design introduced no new dependencies, no accounts, no tracking, no server processing. No violations of the recorded assumptions in the spec. Gate result: PASS (vacuous, see above).

## Project Structure

### Documentation (this feature)

```text
specs/001-spinlocklabs-site/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── contracts/           # Phase 1 output (/speckit.plan command)
    ├── content-schemas.md
    ├── site-config.md
    └── routes.md
```

### Source Code (repository root)

```text
src/
├── components/          # Logo, Link, Footer, PostList, ProjectList
├── content/
│   ├── config.ts        # Content collection schemas (see contracts/content-schemas.md)
│   ├── research/        # One markdown file per research project
│   └── blog/            # One markdown file per blog post (empty at launch)
├── data/
│   └── site.ts          # Site metadata (see contracts/site-config.md)
├── layouts/
│   ├── AppLayout.astro  # Head/meta, header nav, footer
│   └── ResearchLayout.astro
├── pages/
│   ├── index.astro      # Home
│   ├── research/
│   │   ├── index.astro  # Research list
│   │   └── [...slug].astro  # Per-project pages
│   ├── blog/
│   │   └── index.astro  # Blog list with empty state
│   └── 404.astro
├── styles/
│   └── global.css
└── env.d.ts

public/
├── favicon.svg
└── banner.png           # 1200x630 og:image

.github/workflows/
└── deploy.yml           # GitHub Pages on push to main

astro.config.mjs         # site URL (placeholder until domain is decided)
tailwind.config.cjs      # White research theme tokens
```

**Structure Decision**: Single static web project, no backend. The layout above is the delivered layout of this repository. Content lives in Astro content collections so that FR-007 and FR-010 (one-document publishing) hold without code changes.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No constitution violations, so no entries are required.

One scoping note for the record (not a violation): no automated test framework is introduced. The constitution is empty, the site is static with no business logic, and the spec's verification surface (routes, empty states, content accuracy, viewports, deployment) is covered by build output and the preview-based validation in [quickstart.md](./quickstart.md). FR-007/FR-010's build-failure-on-bad-content behavior is exercised in the quickstart.
