# folio-2025

Personal website of [@phucbm](https://github.com/phucbm). Built with Next.js 16, Nextra 4, Tailwind CSS v4, and shadcn/ui.

> This repository is archived. Active development continues in a fork.

## Stack

- [Next.js 16](https://nextjs.org/) + React 19 + TypeScript
- [Nextra 4](https://nextra.site/) — MDX-based content
- Tailwind CSS v4 (CSS-first config, no `tailwind.config.js`)
- [shadcn/ui](https://ui.shadcn.com/)
- [Pagefind](https://pagefind.app/) — search
- [PostHog](https://posthog.com/) — analytics (proxied via `/ingest`)
- JetBrains Mono variable font via `localFont`

## Local Development

```bash
pnpm i
pnpm dev
```

## Content

All content lives in `content/` as `.mdx` files. Do not add pages directly under `src/app/`.

## Registry

Custom components are in `registry/phucbm/`. Run `pnpm build:registry` after changes (`public/r/` is generated output — do not edit manually).
