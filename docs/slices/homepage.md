# Slice: Главная страница (Homepage)  (Phase P4)

## Overview

A single page — the site root `/` (`app/page.tsx`) — that **replaces the temporary placeholder homepage** currently in `app/page.tsx`. It is the marketing entry point for NOVIK Amplifiers Group (NAG): a 40+ year manufacturer/seller/servicer of pro audio (est. 1992), whose differentiators are 100% pre-sale testing, EAC certification, a 2-year warranty, and an in-house repair/service department.

Source content: `/Users/viktor/Documents/kimi/workspace/novikamps/index/index.md` (mission copy, quick-nav to four product groups, three "advantages", and the SPb contact block). One hero banner image lives in that folder's `images/` subdir.

The page is **fully static (SSG)**. It is composition-only — there is no MDX, no zod frontmatter, and no dynamic route. All copy lives in a single typed data module (`content/home.ts`) consumed by `app/page.tsx`. It reuses the existing global `SiteHeader` / `SiteFooter` from `app/layout.tsx` (which already carry nav + contacts), so the homepage body does **not** re-render header/footer.

Sections, top → bottom:
1. **Hero** — eyebrow ("Более 40 лет на рынке · с 1992"), big display wordmark NAG · NOVIK, mission lede, primary CTAs (Каталог / О компании), against the concert-crowd banner.
2. **CategoryGrid** — 4 product groups: Процессоры (DSP), Усилители (транзисторные/мощности), Усилители ламповые, Модули встраиваемые.
3. **AdvantageStrip** — EAC сертификация · 100% тестирование · Гарантия 2 года · Постгарантийный сервис.
4. **FeaturedProduct** — NAG D-8000 WI-FI (best seller), linking to `/catalog/d-8000`.
5. **History teaser** — short pull from the история longread → CTA `/istoriya`.
6. **Contact CTA** — closing band with phone/email/address + "В каталог" CTA. (Footer already repeats contacts; this is a deliberate conversion band, kept short to avoid full duplication.)

## Pages

| Product/Page | Proposed route | Source .md | Images (dir · count) | One-liner | Key specs / price |
| --- | --- | --- | --- | --- | --- |
| Homepage (Главная) | `/` | `/Users/viktor/Documents/kimi/workspace/novikamps/index/index.md` | `/Users/viktor/Documents/kimi/workspace/novikamps/index/images/` · 1 (`concert-crowd-banner.jpg`) | NOVIK landing: 40+ yrs, mission, 4 category nav, advantages, featured D-8000, history teaser, contact CTA | No own price. Featured: NAG D-8000 — 122 900 ₽ (best seller). Category teasers carry "from" prices pulled from source (see Content notes). |

## Design reference

**Clone from:** the **homepage is bespoke composition**, not a record-template clone. It assembles existing band patterns rather than the product or company templates. Closest reference fragments to copy:

- **Hero** → adapt the wordmark/eyebrow pattern already in the placeholder `app/page.tsx` (lines 24–41: `Eyebrow accent` + `font-display font-bold uppercase` H1 at `clamp(46px,9vw,98px)` / `lineHeight: 0.92` / `letterSpacing: var(--ls-tight)` + max-prose `text-md text-text-muted` lede + `Rule`). The history hero (`components/history/hero.tsx`) is the canonical large-hero reference for spacing.
- **CategoryGrid** → clone the **edge-shared grid pattern** from the placeholder `app/page.tsx` CARDS block (`grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border md:grid-cols-2`, each cell `bg-bg p-8 hover:bg-surface-2`, with `Eyebrow` + display H-title + muted text + mono "Открыть →" with `ArrowRight` that translates on hover). Same hairline-divider-via-`bg-border` technique used by `FeatureBand` in `components/product/sections.tsx` (lines 152–166). Use 4 columns on `lg`, 2 on `md`.
- **AdvantageStrip** → clone the **dark feature band** look of `FeatureBand` (`components/product/sections.tsx` lines 134–170): `<Surface mode="dark">` + radial accent glow overlay + 4-up grid of icon-badge cards (`inline-flex size-10 ... bg-accent text-on-accent` icon, display H3, muted text). This is the one **dark band** on the page.
- **FeaturedProduct** → bespoke 2-col band: gallery/photo of D-8000 on one side, eyebrow + name + summary + spec chips + price + CTA on the other. Mirror `ProductHero` (`components/product/sections.tsx` lines 51–131) at a smaller scale, but it MUST link out to `/catalog/d-8000` (it is a teaser, not the full hero).
- **History teaser** → light band: `SectionHeader` + short lede + outline `Button` to `/istoriya`. Use `buttonVariants({ variant: "outline" })`.
- **Contact CTA** → light or `surface-2` band with `SectionHeader` + mono contact rows (`tel:`/`mailto:`) + primary CTA to `/catalog`.

**Tokens & DS primitives:** strictly tokens-only — `bg-bg`, `bg-surface-2`, `border-border`, `text-text`, `text-text-muted`, `text-text-faint`, `text-accent`, `text-on-accent`, fonts `font-display` / `font-text` / `font-mono`, type scale (`text-2xs`…`text-7xl` and the `clamp(var(--text-*) …)` idiom used in `SectionHeader`), spacing via `py-[clamp(...)]`, radius `var(--radius-lg)`, accent rule `var(--border-w-rule)`. Reuse the radial-glow inline style verbatim from `FeatureBand` for the dark strip.

**Differences from D-8000 product page:**
- No `Breadcrumb`, no specs `AccordionItem` table, no `SpecTable`, no `Gallery` lightbox, no `Toc`, no `ScrollProgress`, no `Mdx` body. The homepage is shorter, navigational, and conversion-oriented.
- Only **one** dark band (AdvantageStrip), versus the product page's multiple dark bands (FeatureBand + TechBand).
- Uses a full-bleed photographic hero (concert banner) — a treatment not present on the product or history pages.

## Data model

**No zod frontmatter.** This is a typed data module like the история pattern (`content/company/istoriya.ts` typed by `lib/content/types.ts`). Create:

- `lib/content/home.ts` — `HomeContent` TypeScript type (interface only; no zod needed since it is author-controlled, not file-loaded). Add the type either here or extend `lib/content/types.ts`.
- `content/home.ts` — the `home: HomeContent` literal.

Suggested shape (concrete, faithful to source):

```ts
// lib/content/home.ts (type)
export interface HomeCategory {
  eyebrow: string;        // "Процессоры · DSP"
  title: string;          // "Процессоры"
  text: string;           // one-liner
  href: string;           // "/catalog/processors"
  priceNote?: string;     // "от 79 990 ₽" (optional)
}
export interface HomeAdvantage {
  icon: string;           // lucide name resolved via icon-map
  title: string;          // "EAC сертификация"
  text: string;
}
export interface HomeContent {
  hero: {
    kicker: string;       // "Более 40 лет на рынке · с 1992"
    titleLead: string;    // "NAG"
    titleAccent: string;  // "NOVIK"  (rendered after a · separator)
    lede: string;         // mission paragraph (condensed)
    banner: { src: string; alt: string };
    primaryCta: { label: string; href: string };   // "Смотреть каталог" → /catalog
    secondaryCta: { label: string; href: string };  // "О компании" → /istoriya
  };
  categoriesEyebrow: string;   // "Наши продукты"
  categoriesTitle: string;     // "Быстрая навигация"
  categories: HomeCategory[];  // exactly 4
  advantagesEyebrow: string;   // "Наши преимущества"
  advantagesTitle: string;     // "Почему NOVIK"
  advantages: HomeAdvantage[]; // exactly 4
  featured: {
    eyebrow: string;     // "Хит продаж · Процессоры"
    name: string;        // "NAG D-8000 WI-FI"
    summary: string;
    specChips: string[]; // reuse a subset of d-8000 chips
    price: string;       // "122 900 ₽" (use formatPrice or literal)
    href: string;        // "/catalog/d-8000"
    image: { src: string; alt: string };
  };
  history: {
    eyebrow: string;     // "Компания · с 1976"
    title: string;       // "История NOVIK"
    lede: string;        // 1–2 sentences pulled from istoriya hero subLead
    cta: { label: string; href: string };  // "Читать историю" → /istoriya
  };
  contact: {
    eyebrow: string;
    title: string;       // "Связаться с нами"
    phone: string;       // "+7 921 937 25 08"
    phoneHref: string;   // "tel:+79219372508"
    email: string;       // "novikamps@mail.ru"
    address: string;     // "Санкт-Петербург, Московское шоссе, 25 литера А, офис 216А"
    cta: { label: string; href: string };  // "В каталог" → /catalog
  };
}
```

Concrete representative example — the **four categories** (routes match `SiteHeader`/`SiteFooter` nav: `/catalog/processors`, `/catalog/amplifiers`, `/catalog/tubes`, `/catalog/modules`):

```ts
categories: [
  {
    eyebrow: "Процессоры · DSP",
    title: "Процессоры",
    text: "Звуковые DSP-процессоры NAG для согласования акустики и усилителей: D-8000, F-8, F-8 PRO.",
    href: "/catalog/processors",
    priceNote: "от 79 990 ₽",
  },
  {
    eyebrow: "Усилители · NAG & AMP by NAG",
    title: "Усилители транзисторные",
    text: "Усилители мощности QM-400, серии TD и CX 4×700 Вт с DSP.",
    href: "/catalog/amplifiers",
    priceNote: "от 49 900 ₽",
  },
  {
    eyebrow: "Ламповые усилители",
    title: "Усилители ламповые",
    text: "Производство ламповых усилителей — наследие NOVIK с 1976 года.",
    href: "/catalog/tubes",
  },
  {
    eyebrow: "Модули встраиваемые",
    title: "Модули",
    text: "Встраиваемые модули для активной акустики: NAG TDS/TDH и TDX.",
    href: "/catalog/modules",
    priceNote: "от 41 990 ₽",
  },
],
```

> Map source quick-nav (`/dsp`, `/transistors`, `/tubes`, `/modules_menu`) → the site's category routes (`/catalog/processors`, `/catalog/amplifiers`, `/catalog/tubes`, `/catalog/modules`). The site uses translit catalog routes, NOT the original numeric/legacy URLs.

## Components needed

**Reuse from `components/ds` (`@/components/ds`):** `Container`, `Eyebrow`, `Rule`, `Divider`, `Chip`, `Badge`, `Surface`, `SectionHeader`, `Button` / `buttonVariants`.
**Reuse elsewhere:** `FeatureIcon` from `components/product/icon-map.tsx` (for AdvantageStrip card icons — extend `components/product/icon-map.tsx` if needed icons like `shield-check`, `badge-check`, `flask-conical`, `wrench` are missing; verify against the current `icon-map.tsx` map). `formatPrice` from `lib/format.ts` for any rendered prices. `next/image` for the hero banner + featured product photo, `next/link` + `lucide-react` `ArrowRight` for nav cards.

**New components (proposed, in `components/home/`):**

- `components/home/hero.tsx` — `HomeHero` (justification: full-bleed photographic banner + overlaid wordmark + dual CTA is a layout not covered by `HistoryHero`, which has no background image and a portrait figure). Use `next/image` with `priority` + a dark scrim overlay (token-driven `rgba` over the banner) so white display text stays legible; render text in a `Surface mode="dark"` scope so `text-text` resolves to ivory over the photo.
- `components/home/category-grid.tsx` — `CategoryGrid` (justification: reused list-of-link-cards pattern; small enough to inline but cleaner as its own component; mirrors the placeholder CARDS grid but driven by `HomeCategory[]` and 4-up).
- `components/home/advantage-strip.tsx` — `AdvantageStrip` (justification: dark icon-card band; nearly identical to `FeatureBand` but it is a standalone homepage band fed by `HomeAdvantage[]`, not by product frontmatter — do not import the product `FeatureBand` to avoid coupling the homepage to the product schema).
- `components/home/featured-product.tsx` — `FeaturedProduct` (justification: 2-col teaser linking to `/catalog/d-8000`; smaller than `ProductHero` and must not include cart/spec anchors).
- `components/home/sections.tsx` (optional) — small `HistoryTeaser` + `ContactCta` bands, or inline them in `app/page.tsx`. Prefer one `components/home/sections.tsx` barrel exporting all four homepage bands + hero to keep `app/page.tsx` thin (mirror how `components/product/sections.tsx` is organized).

No new **DS primitive** is genuinely needed — the homepage composes existing primitives. (If a reusable "PriceTag" or "LinkCard" appears in 2+ slices later, promote then; not now.)

## Content notes

- **No homepage product price of its own.** The page sells navigation + trust, not a SKU. Featured D-8000 price (122 900 ₽) and category "from" prices come from the source quick-nav lines (index.md lines 18–29): Модули TDS/TDH от 41 990 ₽, TDX 49 990 ₽; D-8000 122 900 ₽, F-8 79 990 ₽, F-8 PRO 139 900 ₽; QM-400 199 900 ₽, TD 74 990 ₽, CX от 49 900 ₽. Use these only as category "от …" hints; do NOT invent per-product detail pages here.
- **Aggregator/category pages are out of scope** for this slice — the four category cards link to `/catalog/{processors,amplifiers,tubes,modules}` which are built by separate category slices. If those routes don't yet exist at build time that's fine (links are static, not `generateStaticParams`-validated); note the dependency.
- **Shared nav/contacts:** `SiteHeader` and `SiteFooter` (`components/layout/`) already render the four category links, contacts, and "EAC · Гарантия 2 года". The homepage's Contact CTA band should be a short conversion band, not a full re-listing — keep copy minimal to avoid redundancy with the footer.
- **EAC / warranty / service:** these are the three source "advantages" (index.md lines 31–37). Expand to **four** strip items by splitting "100% тестирование" out of the mission paragraph (index.md line 9) as its own trust point — faithful to source emphasis, not invented.
- **RU copy specifics:** preserve "NOVIK Amplifiers Group" framing, "с 1992 года", "100% тестирование", "EAC", "гарантия в течение двух лет", "постгарантийное обслуживание". Condense the long run-on mission paragraph (index.md line 9) into a tight 2–3 sentence lede; do not invent claims. Brand is rendered "NAG · NOVIK" per existing layout metadata and placeholder hero.
- **Hero image** is a stock concert-crowd photo with English worship-lyric text baked into projection screens at the top. Crop/position so that baked-in text is out of frame or heavily scrimmed (use `object-position` + a dark gradient overlay), and supply a neutral RU `alt` (e.g. "Концертная площадка"). Copy the asset into `public/home/concert-crowd-banner.jpg` (or `public/home/hero.jpg`).
- **Image copy step:** copy `/Users/viktor/Documents/kimi/workspace/novikamps/index/images/concert-crowd-banner.jpg` → `/Users/viktor/Code/NAG-SITE/public/home/concert-crowd-banner.jpg`. Featured product reuses the already-present `/products/d-8000/nag-d8000-front-panel.jpg`.

## Acceptance criteria

- `npm run build` is green; `app/page.tsx` is statically rendered (no client-only data fetching; mark interactive bits — none expected — appropriately).
- Visual fidelity to the NAG design language: hairline grids via `bg-border`, hardware-square radii, mono uppercase eyebrows, display H-titles, the single dark AdvantageStrip band with radial accent glow.
- **Tokens-only** — zero hardcoded hex (lint/grep clean); colors, type scale, spacing, radii all via tokens / CSS vars exactly as in `components/product/sections.tsx`.
- Content validated against source `index/index.md`: four categories, ≥3 advantages (4 recommended), correct contacts (`+7 921 937 25 08`, `novikamps@mail.ru`, SPb address), correct featured price 122 900 ₽, "с 1992".
- All internal links resolve to existing or planned routes: `/catalog`, `/catalog/processors`, `/catalog/amplifiers`, `/catalog/tubes`, `/catalog/modules`, `/catalog/d-8000`, `/istoriya`. (Homepage has no params → **no `generateStaticParams` needed**; it is the static root.)
- Page-level `metadata` set in `app/page.tsx` (title can rely on the layout default "NAG · NOVIK — профессиональное звуковое оборудование"; supply a focused `description` + OG image = the hero banner).
- Hero banner served via `next/image` with `priority`; baked-in English lyric text not legible (scrimmed/cropped); banner has RU `alt`.
- Accessible: hero text contrast ≥ AA over the scrim; CTAs are real `<a>`/`Link`; one `<h1>` (hero wordmark), section `<h2>`s via `SectionHeader`.
- Replaces — does not append to — the placeholder body in `app/page.tsx`.

## Run-recipe

A future agent runs:

1. **`/brainstorming`** — confirm section order, the four category→route mappings, and whether the AdvantageStrip is 3 or 4 cards; confirm hero treatment (full-bleed photo vs. solid).
2. **Analyze sources (exact files):**
   - Source copy: `/Users/viktor/Documents/kimi/workspace/novikamps/index/index.md`
   - Hero asset: `/Users/viktor/Documents/kimi/workspace/novikamps/index/images/concert-crowd-banner.jpg`
   - Tokens: `/Users/viktor/Code/NAG-SITE/app/globals.css`
   - DS primitives: `/Users/viktor/Code/NAG-SITE/components/ds/primitives.tsx`, `button.tsx`, `index.ts`
   - Band patterns to clone: `/Users/viktor/Code/NAG-SITE/components/product/sections.tsx` (FeatureBand → AdvantageStrip; ProductHero → FeaturedProduct), `/Users/viktor/Code/NAG-SITE/components/history/hero.tsx` (large hero spacing)
   - Layout/nav/contacts (do not duplicate): `/Users/viktor/Code/NAG-SITE/components/layout/site-header.tsx`, `site-footer.tsx`, `/Users/viktor/Code/NAG-SITE/app/layout.tsx`
   - Icons: `/Users/viktor/Code/NAG-SITE/components/product/icon-map.tsx`
   - Helpers: `/Users/viktor/Code/NAG-SITE/lib/format.ts`
   - Current placeholder to replace: `/Users/viktor/Code/NAG-SITE/app/page.tsx`
   - Featured product data reference: `/Users/viktor/Code/NAG-SITE/content/products/d-8000.mdx`
3. **`/writing-plans`** — produce a plan: create `lib/content/home.ts` (type) + `content/home.ts` (data); create `components/home/{hero,category-grid,advantage-strip,featured-product,sections}.tsx`; rewrite `app/page.tsx`; copy hero asset into `public/home/`; extend `components/product/icon-map.tsx` if advantage icons are missing.
4. **Implement (TDD where logic exists):** logic is minimal (mostly static composition), so heavy TDD is unwarranted. DO add a tiny test/assert only if a helper (e.g. price formatting in featured card) is introduced — otherwise rely on `tsc`/build + a manual visual check. Keep `app/page.tsx` thin: import `home` data + the band components.
5. **Verify:** `npm run build` green; load `/` and eyeball hero/legibility, the 4-up grids, the dark strip, and that all links route correctly; grep for stray hex.
6. **`/requesting-code-review`** — review for tokens-only compliance, no header/footer duplication, source fidelity (prices, contacts, "с 1992"), and accessibility (h1/h2 hierarchy, hero contrast, image alts).
