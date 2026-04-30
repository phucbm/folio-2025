# Migrating Next.js + Nextra from Vercel to Cloudflare Pages

## Conclusion

Not viable for large Next.js apps on Cloudflare's free plan. The bundled worker size is the hard blocker. Lightweight projects (few dependencies) work fine.

---

## Two Cloudflare Adapters — Pick the Right One

### `@cloudflare/next-on-pages` (older)
- Splits each route into a separate edge function
- **Requires every dynamic route to export `runtime='edge'`**
- Hard incompatibility: Next.js throws if you combine `runtime='edge'` with `generateStaticParams` in the same route
- Any Node.js module (`fs`, `path`, `child_process`) anywhere in a route's import chain breaks the build
- Not recommended for Nextra or content-heavy apps

### `@opennextjs/cloudflare` (recommended)
- Bundles the entire app into a single `handler.mjs` worker
- Does NOT require `runtime='edge'` on all routes
- Supports Node.js APIs via the `nodejs_compat` Cloudflare compatibility flag
- Correct choice for apps with Node.js-dependent server components

---

## Migration Steps (`@opennextjs/cloudflare`)

1. Install: `pnpm add -D @opennextjs/cloudflare wrangler`
2. Create `open-next.config.ts`:
   ```ts
   import { defineCloudflareConfig } from "@opennextjs/cloudflare";
   export default defineCloudflareConfig({});
   ```
3. Create `wrangler.jsonc`:
   ```jsonc
   {
     "$schema": "node_modules/wrangler/config-schema.json",
     "main": ".open-next/worker.js",
     "name": "<your-cloudflare-worker-name>",
     "compatibility_date": "<today>",
     "compatibility_flags": ["nodejs_compat"],
     "assets": {
       "directory": ".open-next/assets",
       "binding": "ASSETS"
     },
     "observability": { "enabled": true }
   }
   ```
   - Worker name must match the name in your Cloudflare dashboard exactly
   - Only add the `services` / `WORKER_SELF_REFERENCE` binding if you use ISR (`export const revalidate = X` at page level). Most apps don't need it.
4. In Cloudflare Pages dashboard: set build command to `opennextjs-cloudflare build`, output directory to `.open-next/assets`

---

## The Real Blocker: Worker Size

`@opennextjs/cloudflare` collapses everything into one `handler.mjs`. Cloudflare enforces a compressed size limit on this file:

| Plan | Limit |
|---|---|
| Free | 3 MiB |
| Paid | 10 MiB |

**How to measure before deploying:**
```bash
opennextjs-cloudflare build
du -sh .open-next/server-functions/default/handler.mjs
```

A lightweight Nextra docs site (minimal dependencies) produces a ~4 MB `handler.mjs` — deployable on paid, too large for free.

A full-featured Next.js app with Sandpack, GSAP, Shiki language packs, Radix UI, and a component registry can produce a ~42 MB `handler.mjs` — exceeds even the paid plan limit.

**Important:** Shiki language chunks and `.next/server/chunks/` are served as CDN assets and do NOT count toward the worker size limit. The worker size is driven by `node_modules` included in the worker context, primarily heavy packages imported by server components or API routes.

---

## If the Worker Is Too Large

Options in order of effort:

1. **Upgrade plan** — only useful if `handler.mjs` is between 3–10 MB
2. **Remove or lazy-load heavy dependencies** — likely candidates: Sandpack, GSAP, icon libraries, OG image generation (`@vercel/og` adds ~3.6 MB to the worker via `resvg.wasm`)
3. **Limit Shiki language packs** — configure Nextra/Shiki to only bundle languages actually used
4. **Accept it's not viable** — some apps are simply too large for Cloudflare's worker model

---

## Pitfalls to Avoid

- **`runtime='edge'` on API routes for Cloudflare breaks Vercel** — Vercel's edge bundler may flag Node.js module references that weren't a problem in Node.js runtime. Only add `runtime='edge'` to routes that genuinely need it (stateless, no Node.js APIs).
- **`WORKER_SELF_REFERENCE` service binding** — only needed for ISR. Without it, the binding name must match your exact worker name or the deploy fails.
- **Worker name mismatch** — the `name` in `wrangler.jsonc` must match the worker name Cloudflare expects (visible in the CI warning if wrong).
- **Cloudflare doesn't auto-update build settings** — when switching adapters on an existing project, you must manually update the build command and output directory in the dashboard.
