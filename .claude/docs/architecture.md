# Architecture

## Stack
- Next.js 15 (App Router, Turbopack) + React 19 + TypeScript
- Nextra 4 + nextra-theme-blog for MDX routing and layout
- Tailwind CSS v4 (CSS-first, no config file) + shadcn/ui
- PostHog (analytics + error tracking), Umami, Google Analytics

## Directory Structure
- `content/` — MDX pages/posts; filenames become routes via `src/app/[[...mdxPath]]`
- `src/app/` — App Router: layout, API routes (`bookmarks`, `og-image`, `physics`, `jsdelivr`)
- `src/components/` — UI components; `ui/` for shadcn, `fancy/` for animated/interactive pieces
- `src/lib/` — data fetching helpers (GitHub repos, registry items, posts, tags)
- `src/styles/` — `globals.css` (Tailwind entry + shadcn vars), `theme.css`, `typography.css`
- `registry/phucbm/` — shadcn registry source (blocks + lib)
- `public/r/` — built registry JSON (output of `pnpm build:registry`)
- `scripts/` — `index-registry.ts` and `clean-example-registry.ts` run as postbuild

## Build Pipeline
1. `next build` compiles the app
2. `postbuild` runs automatically: pagefind indexes `.next/server/app` → `public/_pagefind`, then registry is indexed and built
3. Registry build: `index-registry.ts` → `shadcn build` → `clean-example-registry.ts`

## Key Files
- `next.config.mjs` — Nextra wrapper, Turbopack alias, PostHog proxy rewrites, open images
- `src/app/layout.tsx` — root layout: font, Head colors, Nextra Layout, analytics tags
- `mdx-components.tsx` — MDX component overrides for Nextra
- `components.json` — shadcn config (registry namespace: `phucbm`)
- `src/lib/seo.ts` — shared metadata config used by `generatePageMetadata`

## Routing
- All MDX content in `content/` is served by `src/app/[[...mdxPath]]/`
- `src/app/_meta.global.ts` controls sidebar/nav ordering
- Tags are served by `src/app/tags/`
