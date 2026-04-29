# Design System: phucbm.dev

## 1. Visual Theme & Atmosphere

**Industrial Brutalism — Tactical Monospace.**

The site fuses Swiss industrial print with a terminal/telemetry aesthetic. The overall mood is **mechanical precision under restraint** — bold structural lines and high typographic contrast, but never loud. The warm substrates (cream in light, near-black in dark) soften the rigidity just enough to feel personal, not institutional.

The design philosophy: structure does the talking. No gradients, no soft shadows, no rounded corners. Every element sits on a visible grid. Negative space is generous; when something breaks the silence, it means something.

**Key Characteristics:**
- Sharp, 90-degree corners across all components
- Hard 1–2px solid borders as the primary UI language
- Monospace typography at every scale — from hero headline to micro-label
- Bimodal density: vast breathing room interrupted by data-dense grid blocks
- Single blue accent for structural dividers and interactive highlights
- Warm backgrounds (cream / near-black) soften the mechanical grid

---

## 2. Color Palette & Roles

### Light Mode (default)
- **Warm Cream Canvas** (`#faf5e9`) — Page background. Unbleached paper warmth, not pure white.
- **Carbon Ink** (`#111111`) — Primary text and structural borders (header, footer 2px rules).
- **Stone Border** (`#bfb9b0`) — Grid cell borders, dividers, component outlines.
- **Parchment Muted** (`#f0ece3`) — Secondary surfaces, hover backgrounds, tag fills.
- **Graphite Secondary** (`#555555`) — Muted text: labels, descriptions, metadata.

### Dark Mode
- **Warm Dark** (`#15120d` via page bg / `#1a1a1a` via CSS) — Page background. Warmer than pure black, avoids clinical CRT feel.
- **Phosphor White** (`#eaeaea`) — Primary text.
- **Ghost Border** (`rgba(255,255,255,0.2)`) — Grid cell borders, subtle but present.

### Accent (both modes)
- **Electric Swiss Blue** (`#0033FF`) — The single accent color. Used for: `<hr>` structural dividers, link hover states, active filter states, button backgrounds, ticker/status bar border highlights. Inspired by Swiss modernist print; feels technical and declarative against warm backgrounds.
- **Deep Blue** (`#0026CC`) — Hover/pressed state for blue interactive elements.

---

## 3. Typography Rules

**Font Family:** JetBrains Mono variable (`wght` axis, 100–900)
**Base Size:** 16px · **Line Height:** 1.5

A single monospace family carries the entire typographic system — this is deliberate. The scale variance (from 96px hero to 10px micro-label) creates all the hierarchy. No display font is needed; the weight axis (800 for hero, 400 for body) provides sufficient contrast.

### Scale

| Role | Size | Weight | Transform | Tracking |
|---|---|---|---|---|
| Hero / Page title | `clamp(3rem, 8vw, 6rem)` | 800 | Uppercase | −0.04em |
| Section heading h2 | 1.3em | 700 | — | — |
| Sub-heading h3 | 1.1em | 600 | — | — |
| Body | 1rem (16px) | 400 | — | — |
| Component title | 0.75rem | 700 | Uppercase | 0.1em wide |
| Filter label / tag | 0.75rem | 400 | Uppercase | 0.1em wide |
| Micro-label (StatusBar) | 0.6rem | 400 | Uppercase | Wide |
| Ticker strip | 0.65rem | 400 | Uppercase | 0.15em |

**Hero headline** (`brut-h1`): `line-height: 0.88` — glyphs form a solid architectural block. Applied explicitly to `<HeroName>` on the homepage only.

---

## 4. Component Stylings

### Buttons
- **Shape:** Sharp squared edges (0 border-radius globally enforced)
- **Primary:** Electric Swiss Blue (`#0033FF`) background, white text, no shadow
- **Filter buttons:** `border: 1px solid var(--border)`, `bg-accent` fill, uppercase tracking. Active state: blue border + blue text + `bg-brand/10` tint.
- **No hover lift effects.** Hover = color/border change only.

### Cards & Grid Cells (Components, Projects, Clients)
- **Technique:** Container has `border-top + border-left`. Each cell has `border-right + border-bottom`. Creates a razor-thin 1px grid without doubled borders.
- **Background:** Transparent by default. Hover: `bg-muted` (parchment tint in light, subtle white in dark).
- **Padding:** `px-3 py-2` (Clients/Stack) · `px-4 py-4` (Components/Projects — more content)
- **Shadow:** None.
- **Corner:** 0px.

### Status Bar
- 4-cell hard grid. Top-left label in micro-uppercase (`0.6rem`, muted). Bottom value in small bold uppercase (`0.75rem`). Full-width, bleeds to container edges.

### Ticker
- `border-top + border-bottom`, 1px `var(--border)`. Content scrolls via CSS `@keyframes` at `translateX(-50%)`. Speed: 35s. Items joined by ` /// `.

### Navigation Links
- No underline by default. Hover: `color: #0033FF`. Active/current: `text-primary` (foreground).
- Wrapped in `[ ... ]` ASCII decoration brackets — structural graphic element.

### Horizontal Rules (`<hr>`)
- `border-top: 2px solid #0033FF`. No spacing softness. Used as strong section breaks.

### Structural Chrome (Header / Footer)
- **Header:** `border-bottom: 2px solid var(--foreground)` — the primary horizontal landmark.
- **Footer:** `border-top: 2px solid var(--foreground)` — closes the frame.

---

## 5. Layout Principles

### Container
- Max content width: **768px**, centered.
- Outer padding: `px-1` (minimal — content sits close to edges).
- The tight container against the warm full-bleed background creates a contained editorial column feel.

### Spacing Rhythm
- Base unit: `4px` (via `--spacing`)
- Gaps between sections: `Gap` component (`height = 14` = 56px above/below content area)
- Section heading margin-top: `2rem` (h2), `1.5rem` (h3)

### Grid System
- All data grids use CSS Grid with hard border technique (no `gap`).
- 2-col default on mobile, 3-col on desktop for component/tag grids.
- 2-col for project grids.
- 3-col for client/stack name grids.

### Dark Mode
- CRT scanline texture: `repeating-linear-gradient` at 4px pitch, 4% opacity — barely perceptible grain.
- All color tokens swap via `.dark` class on `<html>`.

### Design Decisions to Preserve
- `border-radius: 0 !important` globally — never introduce rounded corners.
- One accent color only — do not add secondary accent colors.
- No soft shadows (`box-shadow`) on interactive elements — borders carry all depth.
- No Google Fonts — JetBrains Mono only.
