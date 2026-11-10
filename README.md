# SpinlockLabs

Research website for SpinlockLabs, a lab under
[ZTA Security](https://ztasecurity.com) studying AI for cybersecurity.

## Stack

- [Astro](https://astro.build) 7 with [Tailwind CSS](https://tailwindcss.com) 4 (CSS-first config via `@tailwindcss/vite`)
- Content Layer collections: `research/` (projects) and `blog/` (articles)
- Static build, no runtime JS, no analytics
- Requires Node >= 22.23.4 (see `.nvmrc`; CI pins Node 24)

## Commands

```sh
pnpm install
pnpm dev       # local dev server
pnpm build     # static build to dist/
pnpm preview   # serve the build
```

## Structure

```
src/
  components/   Logo, Link, Footer, PostList, ProjectList
  content.config.ts  Content Layer schemas (research, blog)
  content/
    research/   one markdown file per project
    blog/       one markdown file per post (empty until the first write-up)
  data/site.ts  site metadata, links, contact email
  layouts/      AppLayout (header/footer/meta), ResearchLayout
  pages/        index, research/, blog/, 404
  styles/       global.css (Tailwind @theme tokens, typography, prose)
```

## Deployment

GitHub Pages via `.github/workflows/deploy.yml`, served at
[spinlocklabs.com](https://spinlocklabs.com) (custom domain set in the
repository's Pages settings; `site` in `astro.config.mjs` must match it).
