# Logo & Brand Notes — "Aperture P"

Status: **current** · Last updated: 2026-06-29

The visual identity for **Prompt Expert**, designed to sit inside the existing
**"Ink & Signal"** design system (dark-first terminal-workbench; near-monochrome
cool charcoal + a single electric-lime signal accent; Inter + Geist Mono).

---

## Final direction — Aperture P

A constructed geometric **P** whose counter is hollowed into a **prompt-input
window**, with a single **electric-lime block cursor** seated inside it.

> The letterform and the workbench metaphor are the same shape.

- **P = Prompt** — an instant verbal anchor for a skeptical, technical audience.
- The **counter is a window**, not a typographic hole: squared on the stem side,
  rounded on the outside, so it reads as an input field.
- The **lime block** is the same blinking cursor that lives in the app's `.term`
  instrument panels (hero, before/after diff, CTA) — the mark reuses the
  product's own signature device rather than inventing decoration.
- The mark is a **self-contained dark "instrument" tile** (theme-independent,
  like `.term`) so the lime signal always sits on a dark surface.

### Why it fits

Prompt Expert turns a vague ask into a structured spec inside a prompt window
with a cursor. The mark encodes exactly that, while staying disciplined: lime is
~3% of the inked area (a spark, not a fill), three load-bearing shapes (tile, P,
cursor), no hairline carries the identity, and it reads at 16px.

### Alternatives explored

A 4-direction design panel was scored by three independent judge lenses (brand,
product/icon-systems, visual-craft/motion). Aperture P won all three.

| Direction | Idea | Verdict |
| --- | --- | --- |
| **Aperture P** ✅ | P whose counter is a prompt window + seated lime cursor | Winner — only mark whose whole concept survives 16px; verbal anchor + product truth; most disciplined lime |
| Sharpening Funnel | 3 opacity-stepped chevrons → lime signal ray | Premium at large size, but collapses to a generic arrowhead at 16px; chevron ≈ old caret |
| Landing Node | Faceted aim-caret → lime "landing node" on a calibrated baseline | Best narrative, weakest pixels; degrades to the rejected `>` + cursor |
| Structured Spec Stack | Builder rail + spec lines + one lime "+added" diff line | Truest product diagram, but lime overshot to a fill and details die small; near a list/settings glyph |

Ideas grafted from the runners-up: the **Geist-Mono `PROMPT · WORKBENCH`
sublabel** (from Spec Stack) into the full lockup, and the **cubic ease-out
"settle"** feel (from Landing Node) into the cursor animation.

---

## Animation

A single calm **"cursor settle"** plays once on mount: the lime block fades+scales
in, holds, does one slow blink, then rests solid. ~1.8s, `cubic-bezier(.22,1,.36,1)`,
no looping.

- **Lightweight**: `opacity` + `transform: scale` on one tiny rect only — GPU-cheap,
  no layout shift, no JS, no filters/blur, no canvas/Lottie.
- **Reduced-motion**: gated by `@media (prefers-reduced-motion: reduce)` in both the
  standalone SVG and `globals.css`; degrades to the solid static cursor.
- **Restraint**: it's a micro-interaction, not a motion graphic — it never loops, so
  the navbar stays calm.

Source of truth: `@keyframes logo-cursor-settle` + `.logo-cursor` in
`src/app/globals.css`; the standalone `public/logo-mark-animated.svg` carries an
equivalent inline `<style>`.

---

## Files

### Source SVG (`public/`)
| File | What | Animated |
| --- | --- | --- |
| `logo-mark.svg` | Primary square mark — dark tile, near-white P, lime cursor | static |
| `logo-mark-animated.svg` | Same mark with the cursor-settle animation | **animated** |
| `logo-mark-light.svg` | Light-tile variant for light surfaces (deeper lime) | static |
| `logo-mark-mono.svg` | Single-colour stamp (`currentColor`, no tile/signal) | static |
| `icon.svg` | Minimal mark (no hairline frame) | static |
| `logo.svg` | Horizontal lockup — mark + `Prompt Expert` (Inter) + mono sublabel, dark bg | static |
| `logo-light.svg` | Horizontal lockup for light backgrounds | static |

### Generated rasters (`pnpm gen:icons` → `scripts/generate-favicon.mjs`)
| File | Use |
| --- | --- |
| `src/app/favicon.ico` | Browser tab (16/32/48/64) |
| `public/logo-mark-512.png`, `public/logo.png` | README / sharing |
| `public/icon-192.png`, `public/icon-512.png` | PWA / maskable (full-bleed, safe-zone padded) |
| `public/og-image.png` | 1200×630 Open Graph card |

### React + metadata
| File | What |
| --- | --- |
| `src/components/layout/logo-mark.tsx` | `LogoMark` chip component; `animated` prop |
| `src/app/icon.tsx`, `src/app/apple-icon.tsx` | Next dynamic icon routes (apple = full-bleed) |
| `src/app/manifest.ts` | Web manifest (name, icons, theme/background `#0D0E11`) |
| `src/app/layout.tsx` | Wires `openGraph.images` / `twitter.images` + `themeColor` |

---

## Usage

**Animated mark** — high-visibility, single instance: header/navbar logo, landing
hero, brand previews, welcome/empty states.

**Static mark** — everywhere else: favicon, app/PWA icons, OG image, footer,
repeated/dense UI, mobile. **Never animate the favicon.**

In React: `<LogoMark animated />` for the header, `<LogoMark />` (static) for the
footer and anywhere calm. The component is theme-independent (always the dark
instrument tile), so it looks identical in light and dark mode.

### Colour / background
- Tokens (sRGB of the live OKLCH): tile `#101216`, ink `#F2F4F5`, signal `#B1EF4A`,
  deeper signal (light surfaces) `#6FB200`, page `#0D0E11`.
- The dark tile sits on **both** light and dark surfaces. On a dark page/header bar
  the 7%-opacity hairline edge defines the chip.
- Keep the wordmark **monochrome** — the mark owns the only lime in any lockup.

### Performance / accessibility
- 3 shapes, no runtime animation cost beyond one CSS keyframe on mount.
- No layout shift (fixed viewBox; animation is `opacity`/`scale` only).
- `prefers-reduced-motion` honoured; static fallback is always valid.

---

## Future ideas
- Optional very-slow idle "breath" on the hero mark (off by default; only if it
  stays imperceptible).
- A secondary in-app builder glyph using Spec Stack's left-rail-as-spine.
- Outline the wordmark to paths in `logo.svg` if a fully font-independent export is
  ever needed (currently relies on the Inter/system stack, which is correct for the
  app context).
