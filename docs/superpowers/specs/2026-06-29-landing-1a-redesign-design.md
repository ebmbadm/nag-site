# Landing 1a Redesign — Design Spec

**Date:** 2026-06-29
**Status:** Approved
**Replaces:** `app/page.tsx` (the existing P0/P4-placeholder landing)
**Source design:** `NAC лендинга первая страница/` (Landing.dc.html variant **1a — Шасси**, `QM400Amp.jsx`, DS bundle `LevelMeter`)

## Goal

Replace the current flat landing with mockup **variant 1a**: a dark "chassis" hero
anchored by an interactive CSS-3D QM-400 power amplifier with animated VU meters, followed by
category, trust, featured-product, history, and contact sections. Faithful to the design system:
semantic tokens for all UI chrome, DS primitives reused, server components by default with
interactivity isolated to client islands.

## Decisions (locked)

- **Variant:** 1a (dark chassis). Variant 1b is out of scope.
- **3D amp:** included, **always animated** (no `prefers-reduced-motion` gate), matching source.
- **Prices:** authoritative numbers come from the **current site** (`app/page.tsx`), NOT the mockup.
  - QM-400 featured: **от 285 000 ₽**
  - Категории: Процессоры **от 95 000 ₽** · Усилители **от 85 000 ₽** · Лампа **от 120 000 ₽** · Модули **от 18 000 ₽**
- **Header/footer:** keep the existing `SiteHeader`/`SiteFooter` from `app/layout.tsx`. The mockup's
  inline header/footer are dropped (redundant).

## Architecture

`app/page.tsx` stays a **server component** rendering seven sections. All interactivity lives in
three new components under `components/landing/`:

| File | Boundary | Responsibility |
|---|---|---|
| `components/landing/level-meter.tsx` | server-safe (no `"use client"`) | Presentational segmented LED VU/peak meter. Props `value`/`peak` (0–100), `segments` (default 14), `orientation`, `length`, `label`. Ported faithfully from DS bundle `LevelMeter` incl. its zone logic (green ≤0.66, amber ≤0.86, red above) and scoped CSS. |
| `components/landing/qm400-amp.tsx` | `"use client"` | CSS-3D 2U rack amp ported from `QM400Amp.jsx` to TSX (real React, hooks instead of `React.createElement` + `window` global). `preserve-3d` box (front/back/left/right/top/bottom faces), perforated grilles, center control panel (logo, 4 LED channel stacks, 4 knobs + power rocker, silkscreen), rack ears with screws, contact shadow. Mouse-parallax + idle sinusoidal drift via `useRef` + `useEffect` + `requestAnimationFrame`. Self-injects its scoped 3D CSS once on mount. Props: `logo`, `scale`, `live`. |
| `components/landing/hero-amp.tsx` | `"use client"` | Hero right column. Composes `QM400Amp` + two `LevelMeter`s (L/R) + a `setInterval` (250 ms) randomizing meter values for the "live" feel, cleaned up on unmount. Renders the spec caption ("Флагман / QM-400 · 4 × 2250 Вт / Class-TD · КНИ 0.1 %"). |

The mockup's "dark amp stage" extra meters (`mBL`/`mBR`) belong to variant 1b and are not built.

### Token discipline & justified exception

All UI chrome (backgrounds, text, borders, radii, shadows, spacing, type) uses semantic tokens via
Tailwind utilities or `var(--…)` arbitrary values — no hardcoded UI hex. The DS helper classes from
the mockup (`nag-eyebrow-text`, `nag-display`, `nag-tabnum`, `nag-spec`, `nag-hatch`, `nag-mono`) do
**not** exist in this repo and are translated to the project's equivalents:

- `nag-eyebrow-text` → `<Eyebrow>` primitive or `font-mono uppercase tracking-[var(--ls-label)]`
- `nag-display` → `font-display uppercase`
- `nag-tabnum` → `tabular-nums` (`font-variant-numeric`)
- `nag-spec` / `nag-mono` → `font-mono`
- `nag-hatch` → existing hatch utility in `globals.css` if present; otherwise an inline
  `repeating-linear-gradient` background using token colors (verify during implementation).

**Exception (documented):** the 3D amp (`qm400-amp.tsx`) contains literal material hex values
(brushed-metal gradients such as `#26282c`, `#101113`) that model a physical object's surfaces.
These are illustration internals — directly analogous to colors inside an SVG asset — not UI tokens,
and are kept verbatim from the source so the amp renders as designed. Semantic colors that *are*
tokenized in the source are preserved as tokens: accent (`var(--accent)`), and LED colors
(`var(--nag-red-300)`, `var(--nag-amber-500)`, `var(--nag-green-500)`). The `LevelMeter` `off`
segment color (`rgba(255,255,255,.07)`) is likewise kept from the source bundle.

### LevelMeter port reference

Faithful port target (from DS bundle):

```
COLORS = { off:'rgba(255,255,255,.07)', green:'var(--nag-green-500)',
           amber:'var(--nag-amber-500)', red:'var(--accent)' }
lit     = round(value/100 * segments)
peakSeg = peak != null ? round(peak/100 * segments) : -1
zone(idx) = ratio>0.86 ? red : ratio>0.66 ? amber : green   // ratio = idx/segments
```

Scoped CSS (`.nag-meter*`) is ported into the component (style injection or co-located), using
tokens `--font-mono`, `--nag-black-980`, `--border-strong`, `--radius-xs`, `--shadow-inset`,
`--dur-fast`. Verify each exists in `globals.css` during build; substitute the nearest token if any
is missing.

## Page sections

Container/gutter via existing `<Container>` primitive. Dark bands via `<Surface mode="dark">`.

1. **HERO** — `<Surface dark>`, radial-glow + hatch overlays. Left: accent rule + eyebrow
   ("NOVIK Amplifiers Group · Pro Audio · с 1992"), `<h1>` "МОЩНОСТЬ, / ПРОВЕРЕННАЯ /
   `<span accent>`ГОДАМИ.`</span>`", lede paragraph, two buttons — **Смотреть каталог** →`/catalog`
   (primary), **О компании** →`/o-kompanii` (secondary/outline) — and a 3-stat row
   (40+ лет на рынке / 100% тестирование / 2 года · EAC) on a top rule. Right: `<HeroAmp>`.
2. **SPEC TICKER** — reuse `components/layout/spec-ticker`. Verify its content matches the QM-400
   spec strip; keep as-is if equivalent.
3. **CATEGORIES** — section header ("Каталог" / "Четыре направления техники") + "Весь каталог"
   →`/catalog` link. 4-cell hairline grid (border-gap technique), each cell a `<Link>`:
   - Процессоры · DSP → `/catalog/processors` — "DSP-процессоры NAG: D-8000 Wi-Fi, F-8, F-8 PRO." — **от 95 000 ₽**
   - Усилители мощности → `/catalog/amplifiers` — "Транзисторные QM-400, серии TD и CX — 4 × 700 Вт с DSP." — **от 85 000 ₽**
   - Ламповые · NOVIK → `/catalog/tubes` — "Ламповые усилители — наследие NOVIK с 1976 года." — **от 120 000 ₽**
   - Модули встраиваемые → `/catalog/modules` — "Встраиваемые модули для активной акустики: TDS / TDH, TDX." — **от 18 000 ₽**
4. **TRUST BAND** — `<Surface dark>` + hatch + radial. Eyebrow "Почему NOVIK",
   h2 "Гарантия не на словах, а на стенде", 4 advantages with accent icon chips
   (lucide icons): EAC сертификация · 100% тестирование · Гарантия 2 года · Сервис в Петербурге.
5. **FEATURED QM-400** — two columns. Left: ivory photo card
   (`/products/qm-400/nag-qm400-front-panel.jpg`) with a mono spec caption. Right: Badges
   (Флагман / EAC), eyebrow "Усилитель мощности · Class-TD", h2 "NAG QM-400", description,
   3-stat hairline grid (4×2250 Вт·2Ω / 0.1% КНИ·8Ω / 950 демпинг), price **от 285 000 ₽**
   + **Открыть QM-400** button →`/catalog/qm-400`.
6. **HISTORY** — two columns. Image `/history/redbear-mk60.jpg` + text
   (eyebrow "Компания · с 1976", h2 "История NOVIK", paragraph) and **Читать историю**
   →`/istoriya`.
7. **CONTACT CTA** — heading "Подберём усилитель под вашу задачу" + lede + primary button, and a
   contact-rows card: tel `+7 921 937 25 08` (`tel:+79219372508`), mail `novikamps@mail.ru`
   (`mailto:`), address "Санкт-Петербург, Московское шоссе, 25 литера А, офис 216А".

All product specs (4 × 2250 Вт 2 Ω, bridge 2 × 4200 Вт, КНИ 0.1 %, демпинг 950, 20 Гц–20 кГц,
483 × 463 × 88 мм · 17.3 кг, Class-TD, EAC) are carried verbatim from the mockup and already match
the current site — no invented specs.

## Assets

Copy into `public/brand/` (the 3D panel logo needs a white mono mark not currently present):

- `nag-logo-mono-white.png` (used by `QM400Amp` panel logo, default prop)
- `nag-mark-white.png` (available fallback/mark)

Source: `NAC лендинга первая страница/assets/brand/`. Existing `public/products/qm-400/` and
`public/history/redbear-mk60.jpg` already cover the photo needs.

## Testing

- `npm run build` stays green (typecheck + lint + prerender). `page.tsx` must remain
  prerenderable: client islands (`qm400-amp`, `hero-amp`) must not break SSG (no access to
  `window`/`document` during render — only inside `useEffect`).
- Unit test for `LevelMeter` (pure logic): given `value`/`segments`, the correct number of segments
  are lit and zone colors map correctly — mirrors existing DS component test style under
  `components/**/__tests__/`.
- Manual: hero amp animates and responds to mouse; VU meters tick; all section links resolve to
  built routes; dark bands flip tokens correctly; no console errors.

## Out of scope

Variant 1b and its sections (dark amp stage, numbered editorial category list, light advantages row,
3:4 heritage block), the mockup's inline header/footer, the DS `SpecList` component (1b-only),
`prefers-reduced-motion` handling, and any new catalog routes (all linked routes already exist).
