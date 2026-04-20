# phucbm-web

## Commands
- Dev: `pnpm dev`
- Build: `pnpm build`
- Start: `pnpm start`

## Rules
- Content lives in `content/` as `.mdx` files — never add pages under `src/app/` directly
- Registry components go in `registry/phucbm/` — `public/r/` is generated output, never edit it manually
- Run `pnpm build:registry` after changing registry components (or let `postbuild` handle it)
- Tailwind v4: no `tailwind.config.js` — config is CSS-first in `src/styles/globals.css`
- shadcn components belong in `src/components/ui/`, custom components in `src/components/`
- PostHog is proxied via `/ingest` rewrites — do not change those rewrite rules
- Font is JetBrainsMono variable via `localFont`; do not add Google Fonts
- Theme background: dark `#15120d`, light `#faf5e9` — set in `<Head backgroundColor>` in layout

@.claude/docs/architecture.md
