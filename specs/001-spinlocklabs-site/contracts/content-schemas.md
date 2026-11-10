# Contract: Content Schemas

**Feature**: SpinlockLabs Website
**Owner**: site code (`src/content/config.ts`)
**Consumers**: authors (markdown files), the build (validation), list pages and project pages (rendering)

The contract is the frontmatter of content documents. A document that does not match the schema fails `astro build` with a message naming the field and file. This is the mechanism behind FR-007, FR-010, and User Story 3 scenario 2.

## Research project document

Location: `src/content/research/<slug>.md` (the filename is the URL slug: `/research/<slug>/`).

| Field | Required | Type | Validation |
|-------|----------|------|------------|
| title | yes | string | min 5, max 90 characters |
| status | yes | string | exactly one of: `Active`, `Ongoing`, `Public call` |
| summary | yes | string | min 20, max 240 characters; used verbatim as the list row's description |
| updated | yes | date | ISO date (e.g. `2026-11-10`); the list orders by this field, descending |
| tags | no | string[] | defaults to `[]` |
| externalLinks | no | array of objects | each object: `label` (string), `href` (string, absolute URL); defaults to `[]` |

Body convention (content rule, not schema-enforced): the markdown body follows four `##` sections in order — **Question**, **Setup**, **What we are doing**, **Status**. The radiance launch page is the reference.

### Valid example (launch document, abbreviated)

```markdown
---
title: "Local LLMs for security research on radiance"
status: "Active"
summary: "Running local large language models for security tasks on a pair of Radeon AI PRO R9700 GPUs with the radiance inference engine."
updated: 2026-11-10
tags: ["llm", "local-inference", "amd-gpu", "radiance"]
externalLinks:
  - label: "radiance"
    href: "https://codeberg.org/StillDeadcode/radiance"
---

## Question
...
## Setup
...
## What we are doing
...
## Status
The harness is being built. No published results yet.
```

### Failure cases the build must catch

- `status: "Done"` → build fails (not a member of the closed set).
- missing `updated` → build fails.
- `summary` under 20 characters → build fails.

## Blog post document

Location: `src/content/blog/<slug>.md` (the filename is the URL slug: `/blog/<slug>/`).

| Field | Required | Type | Validation |
|-------|----------|------|------------|
| title | yes | string | min 5, max 90 characters |
| description | yes | string | min 20, max 240 characters; used as the list row's description and the page's meta description |
| pubDate | yes | date | ISO date; the list orders by this field, descending |
| updatedDate | no | date | ISO date; when present it is shown as the meta "last modified" date |
| tags | no | string[] | defaults to `[]` |

Body: free-form markdown, rendered in the standard prose layout.

### Notes

- At launch `src/content/blog/` contains no post files. The directory is kept with a `.gitkeep` so the collection exists and the blog index renders its empty state (FR-009).
- Non-markdown files placed in a content directory would be picked up by the collection loader and fail validation; only `.md` documents (plus `.gitkeep`) belong there.
