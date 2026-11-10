# Tasks: SpinlockLabs Website

**Input**: Design documents from `specs/001-spinlocklabs-site/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Not requested in the feature specification. Validation is build-based (content schema failures break the build) plus the preview scenarios in quickstart.md. No test framework tasks are generated.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

**Story map** (from spec.md):

- US1 (P1): Understand the lab from the home page
- US2 (P1): Read the radiance research project
- US3 (P2): Publish a new research project
- US4 (P2): Check the blog
- US5 (P3): Recover from a bad link

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Initialize the project manifest with `dev`/`start`/`build`/`preview` scripts, packageManager pnpm@9, Node >= 18.17 engine, and devDependencies: astro ^5, @astrojs/tailwind + tailwindcss ^3.4, @astrojs/sitemap, @fontsource-variable/inter, @fontsource-variable/source-serif-4, @fontsource-variable/jetbrains-mono, @tailwindcss/typography, typescript in package.json
- [X] T002 Configure the Astro build in astro.config.mjs: integrations tailwind() and sitemap(), and `site` set to `https://spinlocklabs.com` (single change point per contracts/site-config.md)
- [X] T003 Define the white research theme in tailwind.config.cjs: colors ink DEFAULT #16181D / 700 #3E424B / 500 #61666F / 400 #8B8F97, paper DEFAULT #FFFFFF / 50 #F7F8FA / 200 #ECEEF1, line DEFAULT #E2E4E8 / strong #C9CCD2, accent #3542FA; fonts sans "Inter Variable", serif "Source Serif 4 Variable", mono "JetBrains Mono Variable"; @tailwindcss/typography prose theme using those tokens
- [X] T004 [P] Create tsconfig.json extending astro/tsconfigs/strictest with path aliases @components/*, @layouts/*, @data/*, @styles/*
- [X] T005 [P] Create .gitignore excluding node_modules/, dist/, .astro/, .DS_Store, .env, *.local
- [X] T006 [P] Create src/env.d.ts (astro/client + generated types reference) and src/styles/global.css (smooth scroll, scroll-padding-top 5rem, accent focus-visible outline)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Create the single-source site metadata module in src/data/site.ts: `author` = "SpinlockLabs"; `email` = "contact@ztasecurity.com" (the only place the address may live, data-model invariant 3); `socials.zta` = "https://ztasecurity.com"; `socials.radiance` = "https://codeberg.org/StillDeadcode/radiance"; `defaultMeta` with title, one-sentence mission description, keywords array, and ogImage { src: "/banner.png", alt: "SpinlockLabs" }
- [X] T008 [P] Create the lab mark + wordmark component in src/components/Logo.astro: spinlock stroke icon (viewBox 0 0 24 24, four interlocking arcs) plus "SpinlockLabs" wordmark with accent-colored "Labs"; props: `class`, `wordmark` (default true)
- [X] T009 [P] Create the nav link component in src/components/Link.astro: accepts text/href, applies active state (aria-current="page", medium weight) when Astro.url.pathname starts with the href, inactive state otherwise
- [X] T010 [P] Create the site footer in src/components/Footer.astro: logo + "A research lab under ZTA Security" with external link to https://ztasecurity.com (target _blank, rel noopener), copyright line, and links: /research/, /blog/, mailto of `email` from @data/site.ts
- [X] T011 Create both content collection schemas in src/content/config.ts: **research** — title string min 5 max 90; status enum exactly `Active` | `Ongoing` | `Public call`; summary string min 20 max 240; updated date required; tags string[] default []; externalLinks array of { label string, href string } default []; **blog** — title string min 5 max 90; description string min 20 max 240; pubDate date required; updatedDate date optional; tags string[] default [] (verbatim constraints from contracts/content-schemas.md; a document violating any of them must fail `astro build`)
- [X] T012 Create the application shell in src/layouts/AppLayout.astro: full head per the routes meta contract (charset, viewport, title with defaultMeta fallback, canonical URL from Astro.site, og:type/og:url/og:title/og:description/og:image/og:site_name, twitter summary_large_image, theme-color #ffffff, color-scheme light, favicon.svg link, keywords, article:tag per tag, pubdate/date meta); sticky header with Logo link to /, nav (Research /research/, Blog /blog/) hidden below sm, and a Contact button linking to mailto of `email`; main with skip-link target; Footer at the bottom; NO analytics scripts, NO tracking, NO cookie code (FR-016)

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Understand the lab from the home page (Priority: P1) 🎯 MVP

**Goal**: A first-time visitor can state what the lab does, that it is under ZTA Security, and where to find research, the blog, and contact — from the home page alone.

**Independent Test**: Load `/` at desktop and 320 px width. The mission statement, a visible "Current research" link, a "Blog" link, and the contact address are all visible; navigation works at both widths.

### Implementation for User Story 1

- [X] T013 [P] [US1] Create the research list component in src/components/ProjectList.astro: takes `projects` (CollectionEntry<"research">[]), renders one row per project with status badge (Active = solid ink, Ongoing = neutral, Public call = accent), updated date (en, short month, UTC), title, summary, and mono-styled tags; links each row to /research/<slug>/
- [X] T014 [US1] Create the home page in src/pages/index.astro: eyebrow "Research lab under ZTA Security"; H1 mission ("Measuring what local AI can do in security." or equivalent); 2–3 sentence factual mission paragraph (local LLMs, own hardware, published numbers, no marketing claims — FR-017); buttons: Current research → /research/, Blog → /blog/, Contact → mailto of `email`; "How we work" section (four factual principles: local by design, fixed probes, failures included, hardware named); "Research projects" section rendering ProjectList from `getCollection("research")` (empty state: explicit notice if the collection is empty); contact band repeating the email

**Checkpoint**: Home page complete — US1 independently testable at `/`

---

## Phase 4: User Story 2 - Read the radiance research project (Priority: P1)

**Goal**: A visitor can read what the lab is actually doing: the research question, the exact setup, the work, and an honest status.

**Independent Test**: Open `/research/`, then `/research/radiance/`. The list row shows title, status, and updated date. The page names the radiance engine (with repository link), two Radeon AI PRO R9700 GPUs, and local 27B-class LLMs in FP8 and quantized formats; shows the four sections in order (Question, Setup, What we are doing, Status); and states that no results have been published yet. It contains zero lab-attributed performance numbers.

### Implementation for User Story 2

- [X] T015 [US2] Create the project page layout in src/layouts/ResearchLayout.astro: back link to /research/; status badge + "Updated <date>" line (en, long month, UTC); H1 title; summary paragraph; externalLinks rendered as external buttons (target _blank, rel noopener, ↗ suffix); lab byline; prose article slot (prose prose-lg, prose-hr, prose-img) rendering the project body
- [X] T016 [P] [US2] Create the research index in src/pages/research/index.astro: H1 "Research", one-line description, ProjectList fed by `getCollection("research")` sorted by `updated` descending; if the collection is empty render an explicit empty state (no blank section, no error)
- [X] T017 [P] [US2] Create the project route in src/pages/research/[...slug].astro: `getStaticPaths` mapping every research collection entry to { params: { slug }, props: { project } }; destructure `project` from Astro.props; render ResearchLayout with it
- [X] T018 [P] [US2] Author the launch project document in src/content/research/radiance.md: frontmatter title "Local LLMs for security research on radiance", status "Active", one-line summary naming radiance and the 2x R9700 hardware, updated date, tags (llm, local-inference, amd-gpu, radiance), externalLinks [{ label: "radiance", href: "https://codeberg.org/StillDeadcode/radiance" }]; body with exactly the four `##` sections in order — Question, Setup, What we are doing, Status. Facts only (research.md R6): radiance is a C++/HIP inference server for AMD GPUs speaking OpenAI-compatible APIs; hardware is two Radeon AI PRO R9700 GPUs tensor-parallel; models are 27B-class local LLMs in FP8 and quantized formats; work threads: capability probes with fixed rubrics, failure-mode catalogue, quantization trade-offs; Status: harness in progress, "No published results yet". MUST NOT include any upstream tok/s/prefill/acceptance numbers (FR-006)

**Checkpoint**: US2 independently testable at /research/ and /research/radiance/

---

## Phase 5: User Story 3 - Publish a new research project (Priority: P2)

**Goal**: Adding one structured markdown document publishes a new project: it appears in the list, gets its page, and invalid documents cannot be published.

**Independent Test**: quickstart S4 — copy radiance.md to a scratch project, rebuild, verify the new page and list row; set `status: "Done"`, verify the build fails naming the invalid status; delete the scratch file, verify the list returns to one project.

### Validation for User Story 3

> US3 is a property of the T011 + T016 + T017 mechanism (collection → route → list). No new code is expected; these tasks prove the property. If a check fails, fix the mechanism (not the check).

- [X] T019 [US3] Prove one-document publishing per quickstart S4: add a scratch document to src/content/research/, run `pnpm build`, verify /research/<new-slug>/ exists (200 in preview) and appears in the /research/ list ordered by `updated` descending; then delete it and verify the list reverts
- [X] T020 [US3] Prove the closed status set per quickstart S4: in a scratch document set `status: "Done"` (not in the set `Active` | `Ongoing` | `Public call`), run `pnpm build`, verify the build exits non-zero with a message naming the field and file; also verify a missing `updated` fails the build the same way

**Checkpoint**: US3 verified — publishing works with zero code changes

---

## Phase 6: User Story 4 - Check the blog (Priority: P2)

**Goal**: The blog is a named part of the site: an honest empty state at launch, and one-document publishing for the first post.

**Independent Test**: quickstart S5 — with no posts, /blog/ shows "No posts yet" with no broken rows; add one valid post, rebuild, verify it is listed (title, description, date) and its page renders with a back link; delete it, verify the empty state returns.

### Implementation for User Story 4

- [X] T021 [P] [US4] Create the post list component in src/components/PostList.astro: takes `posts` (CollectionEntry<"blog">[]), one row per post with pubDate (en, short month, UTC), title, description; links each row to /blog/<slug>/
- [X] T022 [US4] Create the blog index in src/pages/blog/index.astro: H1 "Blog", description "Write-ups of methods, measurements, and findings from the lab"; if `getCollection("blog")` is empty render an explicit "No posts yet" state (dashed border panel, with a pointer to /research/); otherwise PostList sorted by `pubDate` descending (FR-008, FR-009)
- [X] T023 [US4] Create the post route in src/pages/blog/[...slug].astro: `getStaticPaths` over the blog collection; post page with back link to /blog/, H1 title, description, pubDate (en, long month, UTC) plus updatedDate when present (used as the meta date), prose body, and tag pills when tags exist
- [X] T024 [P] [US4] Create src/content/blog/.gitkeep so the blog collection directory exists at launch (the empty collection is a supported state, FR-009); only `.md` documents and `.gitkeep` belong in this directory

**Checkpoint**: US4 independently testable at /blog/

---

## Phase 7: User Story 5 - Recover from a bad link (Priority: P3)

**Goal**: A stale or mistyped URL ends on a not-found page with a way home — never a raw server error.

**Independent Test**: quickstart S2 row 5 — request a non-existent path in preview; a 404 status and the not-found page render, with a working link to /.

### Implementation for User Story 5

- [X] T025 [US5] Create the not-found page in src/pages/404.astro: "404" eyebrow, H1 "Page not found", one-line description, and a "Back to home" button linking to / (FR-014, SC-007); AppLayout so header/footer/meta render as on every page

**Checkpoint**: All user stories independently functional

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Deployment, assets, documentation, and full validation

- [X] T026 [P] Create the favicon in public/favicon.svg: white tile, spinlock arcs in ink (#16181D), one accent dot (#3542FA) — matching the Logo mark
- [X] T027 [P] Create the 1200x630 og:image in public/banner.png: white background, serif "SpinlockLabs" wordmark, one-line subtitle, spinlock mark + accent dot — referenced by defaultMeta.ogImage (FR-013, SC-008)
- [X] T028 [P] Create the GitHub Pages workflow in .github/workflows/deploy.yml: on push to main and workflow_dispatch; permissions contents:read, pages:write, id-token:write; build job (actions/checkout@v4 → pnpm/action-setup@v3 version 9 → withastro/action@v2); deploy job (actions/deploy-pages@v4, environment github-pages) (FR-012)
- [X] T029 [P] Write the operator README in README.md: what the site is, stack (Astro + Tailwind, static, no runtime JS, no analytics), commands (pnpm install / dev / build / preview), source structure, and the deployment note (set the final domain in astro.config.mjs and the Pages target before the first deploy)
- [X] T030 Run the full quickstart validation S1–S9 against the built site: build output pages; route status table (200/404); radiance content audit (FR-005/FR-006, SC-005); research publishing drill (S4); blog drill (S5); contact audit — `contact@ztasecurity.com` on home/research/blog and no other address anywhere in dist/ (FR-011); meta + sitemap check (FR-013); 320 px and 1280 px viewport check (SC-006); no-tracking check — no third-party requests, no Set-Cookie, and `grep -R "googletagmanager\|gtag\|Set-Cookie" dist/` returns nothing (FR-016)
- [X] T031 Set the final domain in astro.config.mjs (`site`) to `https://spinlocklabs.com` (GitHub Pages custom domain, `CNAME` in repo root) and enable the Pages environment in the GitHub repository

**Checkpoint**: Site deployable and validated end-to-end

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Stories (Phase 3–7)**: All depend on Foundational completion
  - US1 and US2 (both P1) can run in parallel (disjoint files except ProjectList, owned by US1's T013 which US2's T016 reuses — if run in parallel, T016 starts after T013)
  - US3 depends on US2 (it validates US2's mechanism)
  - US4 is independent of US1/US2 (only shared dependency: T011 blog schema, in Foundational)
  - US5 is independent (single file)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Starts after Foundational — no dependencies on other stories
- **User Story 2 (P1)**: Starts after Foundational — reuses T013 (US1) if both run in parallel
- **User Story 3 (P2)**: Starts after US2 — validates the publishing mechanism US2 builds
- **User Story 4 (P2)**: Starts after Foundational — no dependencies on other stories
- **User Story 5 (P3)**: Starts after Foundational — no dependencies on other stories

### Within Each User Story

- Models (content documents) before the pages that render them where the page shows that document's content (T018 before preview checks, not before T015–T017)
- Layouts before routes that import them (T015 before T017)
- Lists before indexes that render them (T013 before T014/T016; T021 before T022)
- Core implementation before validation tasks (US3 phase is validation only)
- Story complete before moving to next priority

### Parallel Opportunities

- Phase 1: T004, T005, T006 in parallel with each other (and with T001–T003 sequencing)
- Phase 2: T007, T008, T009, T010 in parallel (four distinct files); T011 then T012
- US2: T016, T017, T018 in parallel (distinct files) once T015 exists
- US4: T021 and T024 in parallel; then T022 and T023 in parallel
- US1 + US4 + US5 together: fully disjoint file sets — three implementers can work simultaneously after Foundational
- Polish: T026, T027, T028, T029 in parallel

---

## Parallel Example: User Stories 1, 4, 5 (after Foundational)

```text
# Three disjoint file sets — run concurrently:
Developer A (US1): "Create ProjectList in src/components/ProjectList.astro"
                    → "Create home page in src/pages/index.astro"
Developer B (US4): "Create PostList in src/components/PostList.astro" ∥ "Create src/content/blog/.gitkeep"
                    → "Create blog index in src/pages/blog/index.astro" ∥ "Create post route in src/pages/blog/[...slug].astro"
Developer C (US5): "Create not-found page in src/pages/404.astro"
```

---

## Implementation Strategy

### MVP First (User Story 1, with US2 completing the P1 milestone)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 → home page stands alone
4. Complete Phase 4: User Story 2 → the site has its reason to exist (the radiance project)
5. **STOP and VALIDATE**: run quickstart S1–S3, S8 at the P1 checkpoint; both P1 stories test independently
6. Deploy/demo if ready (requires T028 + T031 or a manual `pnpm build` upload)

### Incremental Delivery

1. Setup + Foundational → foundation ready
2. US1 → test at `/` → (MVP)
3. US2 → test at `/research/` → demo-ready site
4. US3 → validation drill (S4) → publishing is proven, not assumed
5. US4 → test at `/blog/` (empty state, then first post drill)
6. US5 → test a bad path
7. Polish → assets, workflow, full S1–S9 run, domain

### Parallel Team Strategy

1. One person completes Setup + Foundational
2. Once Foundational is done: Developer A on US1, Developer B on US4, Developer C on US5
3. US2 follows US1 (shared ProjectList); US3 validates US2; US4/US5 are independent throughout

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to a specific user story for traceability
- Each user story is independently completable and testable
- US3 contains validation tasks by design: its capability is a property of the T011/T016/T017 mechanism
- Commit after each task or logical group
- Stop at any checkpoint to validate the story independently
- **Current state of this repository**: a working implementation matching this task list already exists in the working tree (built and verified 2026-11-10). When executing this list, treat each task as "create-or-verify": if the file exists and matches the task's spec, verify it (build + quickstart scenario) and tick the box; if it deviates, fix to the spec. The privacy policy page deliberately does NOT exist (removed at the lab's request after drafting) — do not re-add it.
