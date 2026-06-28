# P1 — Design-system completion: design spec

**Date:** 2026-06-28
**Phase:** P1 (depends on P0)
**Slice source:** `docs/slices/design-system.md`

---

## 1. Goals

Harden the DS into a complete, documented library so every P2–P4 slice composes instead of
inventing. No new pages. Two sub-slices:

- **P1a — Foundation:** §6 schema changes + server-only primitives
- **P1b — Interactive + polish:** client primitives, a11y pass, motion utilities, `/_ds` route

`Meter` is deferred — no P2 page requires it; add as a standalone task when needed.

---

## 2. §6 Schema changes (`lib/content/schema.ts`)

All changes are **additive** — `content/products/d-8000.mdx` stays valid throughout.

### 2.1 `price` optional + `onRequest`

```ts
price: z.object({
  amount:    z.number().optional(),
  onRequest: z.boolean().optional(),
  note:      z.string().optional(),
}).optional()
```

`ProductHero` branches:
- `amount` present → formatted price + "В корзину" stub CTA
- `onRequest: true` → "Запросить расчёт" CTA (outline button, mailto)
- no `price` field → no price block rendered

### 2.2 `partnerLogos[]` optional

```ts
partnerLogos: z.array(z.object({
  src:    z.string(),
  alt:    z.string(),
  width:  z.number(),
  height: z.number(),
})).optional()
```

`ProductHero` renders the logos strip only when the array is non-empty.
Migrate current hardcoded `d-8000.mdx` paths into frontmatter as part of this change.

### 2.3 Hero quick-links guarded

`#software` and `#specs` anchors in the product hero quick-link row render only when the
corresponding frontmatter sections exist:
- `#software` → gated on `software` block present in frontmatter
- `#specs` → gated on `specGroups` array non-empty

### 2.4 `models[]` + shape

```ts
models: z.array(z.object({
  name:   z.string(),
  config: z.string().optional(),
  price:  z.number().optional(),
  note:   z.string().optional(),
})).optional()
```

When present, hero price becomes "от X ₽" derived from `Math.min(...models.filter(m => m.price != null).map(m => m.price!))`; if no model has a price, omit the price display entirely.
Used by SERIES pages (TD, CX, modules, КОНТУР).

### 2.5 `docs[]` optional

```ts
docs: z.array(z.object({
  label: z.string(),
  href:  z.string().url(),
})).optional()
```

Rendered as outline `Button` links in the software band. If `docs` is absent the software band
can still render (e.g. showing screenshots), but the download buttons are omitted.

---

## 3. Server-only DS primitives (P1a)

All added to `components/ds/`, exported from `components/ds/index.ts`. Zero client state.

### 3.1 `Breadcrumb`

**File:** `components/ds/breadcrumb.tsx`

```ts
type BreadcrumbItem = { label: string; href?: string }
// Props: items: BreadcrumbItem[]
```

- Last item = current page: no `href`, receives `aria-current="page"`
- `<nav aria-label="Хлебные крошки"><ol role="list">…</ol></nav>`
- Separator: `›` character in `aria-hidden` span
- Typography: `font-mono text-xs uppercase tracking-[var(--ls-label)]`
- Colors: links `text-text-muted hover:text-accent transition-colors`, current `text-text`
- Promoted from current product page breadcrumb; all product/category pages use this primitive

### 3.2 `Prose`

**File:** `components/ds/prose.tsx`

Wrapper `<div>` that styles MDX body output. Sets:
- `max-w-prose` container
- `lh-relaxed` line height via `style`
- Heading sizes via `[&_h2]:`, `[&_h3]:` Tailwind variants using `--text-xl`, `--text-lg`
- `[&_p]:text-text [&_p]:text-base`
- `[&_ul]:list-disc [&_ol]:list-decimal` with `pl-6`
- `[&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:text-text-muted`
- `[&_strong]:font-semibold [&_strong]:text-text`
- `[&_a]:text-accent [&_a]:underline-offset-2 hover:[&_a]:underline`

No hardcoded sizes — all `var(--text-*)` via Tailwind utilities.

### 3.3 `SpecMatrixTable`

**File:** `components/ds/spec-matrix-table.tsx`

```ts
type SpecMatrixProps = {
  columns: string[]                            // model/SKU names
  rows:    { label: string; values: (string | null)[] }[]
  caption?: string
}
```

- N+1 column `<table>` (first col = spec label, N cols = per-model values)
- First col: `font-mono text-xs text-text-muted w-40`
- Value cols: `tabular-nums text-sm text-text text-center`
- Even rows: `bg-surface-2`
- Null/missing values render as `—`
- `<caption>` when provided, visually hidden but read by AT
- Horizontally scrollable wrapper on small viewports: `overflow-x-auto`
- Handles the same data as `SpecTable` but for N models; replaces ad-hoc comparison markup

### 3.4 `ProductCard`

**File:** `components/ds/product-card.tsx`

```ts
type ProductCardProps = {
  slug:    string
  name:    string
  eyebrow: string          // brand / category label
  image:   { src: string; alt: string; width: number; height: number }
  price?:  { amount?: number; onRequest?: boolean }
  badge?:  string          // e.g. "NEW", "BEST SELLER"
}
```

- Server component — wraps in `<Link href={/catalog/${slug}}>`
- Layout (vertical card): `next/image` top, `Eyebrow` brand, `font-display uppercase` name,
  price row (formatted or "по запросу"), optional `Badge` overlay on image corner
- Hover: `shadow-[var(--shadow-2)]` lift + `border-accent` ring transition using DS motion tokens
- All colors via semantic tokens; no hardcoded hex
- Grid usage: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4` (category page sets the grid)

---

## 4. Interactive primitives (P1b)

### 4.1 `PillGroup` (`"use client"`)

**File:** `components/ds/pill-group.tsx`

```ts
type PillGroupProps = {
  options:   { value: string; label: string }[]
  value:     string
  onChange:  (value: string) => void
  tabRole?:  boolean   // true → role="tablist"/role="tab"; false (default) → role="group"/<button>
  className?: string
}
```

- `tabRole=false` (default): `<div role="group">` of plain `<button>` — use for standalone filter/variant selectors
- `tabRole=true`: `<div role="tablist">` of `<button role="tab" aria-selected>` — used only when `Tabs` wraps it
- Selected: `bg-accent text-on-accent border-accent`
- Unselected: `border-border text-text-muted hover:border-accent hover:text-accent`
- Border radius: `var(--radius-pill)`
- Typography: `font-mono text-xs uppercase tracking-[var(--ls-label)]`
- Focus ring: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]`
- Purely presentational — no internal state, fully controlled

### 4.2 `Tabs` (`"use client"`)

**File:** `components/ds/tabs.tsx`

```ts
type TabsProps = {
  items:         { value: string; label: string; content: React.ReactNode }[]
  defaultValue?: string
  value?:        string
  onChange?:     (value: string) => void
}
```

- Wraps `PillGroup` (the tab bar) + content panels
- Uncontrolled when only `defaultValue` provided (`useState` internally)
- Controlled when `value` + `onChange` provided
- Panel: `<div role="tabpanel" id={panelId} aria-labelledby={tabId}>`, inactive panels use `hidden`
- Full ARIA: `role="tab"`, `aria-selected`, `aria-controls`, `aria-labelledby`

### 4.3 `MobileNav` (`"use client"`)

**File:** `components/layout/mobile-nav.tsx` (layout component, not DS primitive)

Integrated into `SiteHeader`:
- Hamburger `<button>` visible at `< lg`, `aria-label="Открыть меню"`, `aria-expanded={open}`
- On open: renders `fixed inset-0 z-50` dark `<Surface mode="dark">` overlay
- `useEffect` applies `overflow-hidden` to `document.body` when open; reverts on close/unmount
- Layout inside overlay: same `Container` header row (logo left, close `×` right), then nav links below
- Nav links: `font-display text-4xl uppercase tracking-[var(--ls-tight)]`, full-width tap targets,
  `Rule` accent separator between links, links are `text-text hover:text-accent`
- Animation: CSS transitions `opacity 0→1` + `transform translateY(-8px)→translateY(0)` using
  `--dur-slow` + `--ease-out`; `@media (prefers-reduced-motion)` skips translate, keeps opacity
- Keyboard: `Escape` key closes, focus trap (first/last focusable element cycling on Tab/Shift+Tab),
  focus returns to hamburger trigger on close

---

## 5. A11y pass

Scope: all existing interactive primitives + new P1 primitives.

### Focus rings (all interactive elements)

Utility: `focus-visible:outline-[length:2px] focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]`

Apply to: `Button` (verify existing), `AccordionItem` summary, `Gallery` prev/next arrows,
`Toc` links, `PillGroup` pills, `Tabs` tab buttons, `MobileNav` hamburger + links + close button.

### ARIA additions

| Component | Addition |
|---|---|
| `Gallery` | `role="region"` + `aria-label="Галерея изображений"`, arrow buttons `aria-label="Предыдущий/Следующий"` |
| `Toc` | Active link gets `aria-current="location"` |
| `AccordionItem` | No change needed — native `<details>/<summary>` exposes open state to AT automatically |
| `MobileNav` | Hamburger `aria-expanded`, `aria-controls` pointing to nav overlay id |

### Reduced motion

| Component | Behavior under `prefers-reduced-motion: reduce` |
|---|---|
| `ScrollProgress` | `display: none` (decorative, adds no information) |
| `MobileNav` | Skip `translateY` animation; opacity transition only |
| `Gallery` | Disable CSS scroll-snap animation (instant scroll) |

---

## 6. Motion utilities (`app/globals.css`)

Add to the utilities section:

```css
@utility transition-base {
  transition-property: color, background-color, border-color, box-shadow, opacity, transform;
  transition-duration: var(--dur-base);
  transition-timing-function: var(--ease-out);
}

@utility transition-slow {
  transition-property: color, background-color, border-color, box-shadow, opacity, transform;
  transition-duration: var(--dur-slow);
  transition-timing-function: var(--ease-out);
}

@utility glow-red   { box-shadow: var(--glow-red); }
@utility glow-amber { box-shadow: var(--glow-amber); }
```

Existing components that use inline `transition-colors` / `transition-shadow` can migrate to
`transition-base` where the full property set is wanted.

---

## 7. `/_ds` dev-only reference route

**File:** `app/_ds/page.tsx`

```ts
// First statement in the page component:
if (process.env.NODE_ENV === 'production') notFound()
```

Static route — no `generateStaticParams` needed. `notFound()` in production means the page
pre-renders in `next build` (as a 404 shell) but is inaccessible. Excluded from any sitemap.

Page sections (server component, functional over polished):

1. **Palette** — one swatch per semantic color token, rendered in both light and dark `Surface` bands
2. **Typography** — `--text-2xs` through `--text-7xl`, all three font stacks, eyebrow/label samples
3. **Server primitives** — `Badge`, `Chip`, `Eyebrow`, `Rule`, `Divider`, `Breadcrumb`, `Prose` sample,
   `SpecTable`, `SpecMatrixTable`, `ProductCard` — each in light + dark band
4. **Buttons** — all `Button` variants (primary, secondary, outline, ghost) in both surface modes
5. **Interactive** — `AccordionItem`, `Tabs`/`PillGroup`, `Gallery` (static placeholder), `MobileNav` trigger
6. **Motion** — three labeled boxes animating with `transition-base`, `transition-slow`, `--ease-snap`

---

## 8. Sub-slice breakdown

### P1a — Foundation (server-only, no client components)

1. §6 schema changes in `lib/content/schema.ts`
2. Update `ProductHero` for optional price / guarded quick-links / `partnerLogos` frontmatter
3. Migrate `d-8000.mdx` `partnerLogos` to frontmatter
4. `Breadcrumb` primitive + promote from product page
5. `Prose` primitive
6. `SpecMatrixTable` primitive
7. `ProductCard` primitive
8. Export all from `components/ds/index.ts`
9. `npm run build` green

### P1b — Interactive + polish

1. Motion utilities in `globals.css`
2. `PillGroup` + `Tabs` primitives
3. `MobileNav` in `components/layout/`; wire into `SiteHeader`
4. A11y pass on all interactive primitives (focus rings, ARIA, reduced motion)
5. `/_ds` reference route
6. Final `npm run build` green; grep check for hardcoded hex

---

## 9. Acceptance criteria

- `npm run build` green throughout both sub-slices
- `grep -rE '#[0-9a-fA-F]{3,6}' components/` returns only token definitions, not usage in components
- All primitives render correctly in both `data-surface` modes
- `/_ds` returns 404 in production build, renders in dev
- `MobileNav` opens/closes, Escape works, focus trap works, reduced-motion skips translate
- `Tabs` keyboard navigable (`aria-selected`, Enter/Space activates)
- `SpecMatrixTable` horizontally scrolls on narrow viewports
- `components/ds/index.ts` exports the full public API (all new + existing primitives)
