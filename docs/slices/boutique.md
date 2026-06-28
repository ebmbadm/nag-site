# Slice: NOVIK Tubes Boutique — savers · converters · custom order  (Phase P3)

## Overview

The **NOVIK Tubes Boutique** is a small, editorial sub-section of the site selling
hand-built tube accessories made from NOS (new-old-stock) Soviet components: **savers**
(сейверы — protective tube-socket adapters), **converters** (конвертеры/переходники — adapters
that let one tube type run in another amp), and a **custom-order** service (подбор/изготовление
эксклюзивных советских ламп, сейверов и конвертеров на заказ).

Unlike the NAG catalog products (D-8000 etc.), these items are **bespoke, single-piece, no fixed
price** — there is no SKU list, no price, no add-to-cart. Every CTA funnels to an inquiry/request
flow (`/rqst-tubes` → **deferred to P5**, see Content notes). So this slice is **3 marketing /
category pages**, NOT product-template pages:

1. `/catalog/boutique` — boutique landing (the section's front door; links to the three areas).
2. `/catalog/savers` — savers category/explainer page.
3. `/catalog/converters` — converters category/explainer page.

The custom-order story lives as a section on the landing page (and a repeated callout on the two
category pages); it has no page of its own. The request **form page** (`/rqst-tubes`) is a **P5
dependency** — in P3 the CTAs link to it as a route that may 404 until P5 (same pattern CLAUDE.md
already documents for un-built category routes), or to a `mailto:`/`tel:` stub.

Source markdown is thin (these are short pages), so the build will need light, faithful copy
expansion — **do not invent products, model names, prices, or spec numbers** that aren't in source.

## Pages

| Product/Page | Proposed route | Source .md | Images (dir · count) | One-liner | Key specs / price |
|---|---|---|---|---|---|
| Boutique landing | `/catalog/boutique` | `novikamps/bt/bt.md` | `novikamps/bt/images/` · 1 (`vintage-radio-tubes-collection.jpg`) | Front door of NOVIK Tubes Boutique: intro + 3 area cards (savers / converters / custom) + inquiry CTA | No price — custom order → inquiry |
| Savers | `/catalog/savers` | `novikamps/savers/savers.md` | `novikamps/savers/images/` · 1 (`novik-tube-saver-amphenol-black.png`) | Why savers exist + hand-build features + custom-order callout | No price — custom order → inquiry |
| Converters | `/catalog/converters` | `novikamps/converters/converters.md` | `novikamps/converters/images/` · 2 (`novik-converter-pro-40-dark.png`, `novik-converter-pro-40-light.png`) | What converters do + hand-build features + custom-order callout | No price — custom order → inquiry |
| Request form (P5) | `/rqst-tubes` | `novikamps/rqst-tubes/rqst-tubes.md` | `novikamps/rqst-tubes/images/` · 1 (`vintage-radio-tubes-collection.jpg`, dup of bt) | Inquiry/contact form — **NOT in P3 scope** | Deferred to P5 |

> Note: `bt/images/vintage-radio-tubes-collection.jpg` and `rqst-tubes/images/vintage-radio-tubes-collection.jpg` are the **same file** (179,453 bytes). Copy once to `public/boutique/vintage-radio-tubes-collection.jpg` and reuse.

**Image → public mapping** (do this in the build):
- `novikamps/bt/images/vintage-radio-tubes-collection.jpg` → `public/boutique/vintage-radio-tubes-collection.jpg`
- `novikamps/savers/images/novik-tube-saver-amphenol-black.png` → `public/boutique/savers/novik-tube-saver-amphenol-black.png`
- `novikamps/converters/images/novik-converter-pro-40-dark.png` → `public/boutique/converters/novik-converter-pro-40-dark.png`
- `novikamps/converters/images/novik-converter-pro-40-light.png` → `public/boutique/converters/novik-converter-pro-40-light.png`

(Converter images come as a **dark/light pair** of the same product — good candidate for a single
`Figure` using the dark variant on the dark band, or a 2-up comparison; do not treat as two SKUs.)

## Design reference

**Template to clone: NONE of the existing templates 1:1.** These are **category / marketing pages**,
not product-template (`/catalog/[slug]`) pages and not the company longread. Build them as
**bespoke server-component pages** under `app/catalog/<route>/page.tsx`, assembled entirely from
existing DS primitives. Borrow *section patterns* from `components/product/sections.tsx` but DO NOT
reuse `ProductHero` / `SpecsSection` (those assume price + spec accordions, which we don't have).

Closest pattern references to read before building:
- `app/catalog/[slug]/page.tsx` + `components/product/sections.tsx` — for `Surface mode="dark"`
  band composition, `Container`/`SectionHeader`/`Eyebrow`/`Figure`/`Gallery` usage, and the
  feature-grid markup (`FeatureBand`).
- `app/istoriya/page.tsx` — for an editorial, content-first page assembled from DS primitives with
  a typed data module (the data-module loader pattern; see Data model).

**Tokens & primitives** (tokens-only, per CLAUDE.md — never hardcode hex):
- Light editorial body on `bg-bg` / `bg-surface`; **one dark technical band** per page via
  `<Surface mode="dark">` for the "Особенности разработки и производства" feature strip
  (mirrors `FeatureBand`). The converter `-dark.png` image belongs on this dark band.
- Headings: `font-display uppercase`, `letterSpacing: var(--ls-tight)`, `lineHeight: var(--lh-tight)`.
  Eyebrows: `Eyebrow accent` (`font-mono uppercase`, `tracking-[var(--ls-label)]`).
- `Chip` for the hand-build feature tokens ("Ручная сборка", "NOS компоненты", "Уникальная
  технология"). `Rule` (3px accent) as a section divider. `Divider` hairlines.
- `Button` / `buttonVariants({ variant: "primary"|"outline", size: "lg" })` for the inquiry CTAs.

**Differences from D-8000 product page:**
- **No price block, no "В корзину" / "Купить в 1 клик"** — single CTA: "Свяжитесь с нами" /
  "Заполнить заявку" → `/rqst-tubes`.
- **No `specGroups` accordion** (`SpecsSection`) — these items have no spec table.
- **No `software` band.** Optional light `tech`-style feature cards only.
- **Gallery:** product page uses multi-image `Gallery` (embla). Boutique pages have 1–2 images
  each → use **`Figure`** (single image, server, no client JS) rather than `Gallery`. Only the
  landing could use a small `Figure`/hero image. Keep these pages mostly **static, no `"use client"`**.
- **Landing has 3 nav cards** (savers / converters / custom) linking onward — a small bespoke
  card grid (reuse `FeatureBand`'s `grid gap-px … bg-border` card-grid markup but with `<Link>`
  wrappers). This is the one genuinely new layout piece (see Components).

## Data model

These pages do **not** fit `productFrontmatterSchema` (no price/specGroups/gallery-min-1 product
shape). Two acceptable approaches — **recommend the typed data module** (pattern 2 in CLAUDE.md,
like `content/company/istoriya.ts`) because the content is editorial and shared across pages
(the custom-order callout + feature list repeat):

### Recommended: typed data module `content/boutique/boutique.ts`

Define a small typed shape in `lib/content/types.ts` (extend it) and export typed objects, loaded
via a thin `lib/content/boutique.ts` (mirror `lib/content/company.ts`). Concrete shape:

```ts
// lib/content/types.ts (add)
export interface BoutiqueCta {
  label: string;
  href: string; // "/rqst-tubes" (P5) — may be a mailto: stub until then
}
export interface BoutiqueFeature { title: string; text?: string } // hand-build bullets → Chips/cards
export interface BoutiqueAreaCard {
  title: string;
  text: string;
  href: string; // "/catalog/savers" | "/catalog/converters" | "#custom"
  image?: { src: string; alt: string };
}
export interface BoutiquePage {
  slug: string;            // "boutique" | "savers" | "converters"
  eyebrow: string;         // mono kicker, e.g. "NOVIK TUBES BOUTIQUE"
  title: string;
  lede: string;            // hero paragraph
  hero?: { src: string; alt: string; caption?: string };
  features?: { title: string; items: BoutiqueFeature[] }; // dark band strip
  areaCards?: BoutiqueAreaCard[]; // landing only
  custom?: { title: string; body: string[]; cta: BoutiqueCta }; // custom-order callout
  cta: BoutiqueCta;        // primary inquiry CTA
}
```

### Concrete example — the **Savers** page (faithful to `savers/savers.md`)

```ts
export const savers: BoutiquePage = {
  slug: "savers",
  eyebrow: "NOVIK TUBES BOUTIQUE",
  title: "Сейверы для винтажных радиоламп",
  lede:
    "Сейверы призваны сохранить оригинальные разъёмы в ваших усилителях, чтобы избежать " +
    "дорогостоящей процедуры замены панелек. Также сейверы пригодятся, если вы проверяете " +
    "лампы. Безусловно, сейвер может играть и просто декоративную роль.",
  hero: {
    src: "/boutique/savers/novik-tube-saver-amphenol-black.png",
    alt: "Сейвер NOVIK на бакелитовой панельке Amphenol",
  },
  features: {
    title: "Особенности разработки и производства",
    items: [
      { title: "Оригинальные, винтажные компоненты" },
      { title: "Ручная сборка" },
      { title: "Качественные материалы" },
      { title: "Уникальная технология" },
    ],
  },
  custom: {
    title: "Индивидуальный заказ",
    body: [
      "Не нашли необходимый переходник или сейвер?",
      "Мы можем изготовить необходимое вам устройство на заказ, учитывая ваши пожелания по материалам.",
    ],
    cta: { label: "Напишите нам или заполните заявку", href: "/rqst-tubes" },
  },
  cta: { label: "Заполнить заявку на заказ", href: "/rqst-tubes" },
};
```

Landing (`bt.md`) additionally supplies `areaCards` (Savers / Converters / Индивидуальный заказ),
each with the source one-liner, plus the boutique hero `vintage-radio-tubes-collection.jpg`.
Converters page mirrors Savers with its own lede ("Конвертеры позволяют вам использовать больший
спектр различных ламп…") and the dark/light image pair.

### Alternative (if a future agent prefers MDX): NOT recommended
`productFrontmatterSchema` would need `price` made optional and `gallery` `.min(1)` relaxed — too
invasive for 3 pages. Prefer the typed module above. **Note for build: do NOT loosen the product
schema** unless explicitly ticketed; keep boutique data separate.

## Components needed

**Reuse from `components/ds/` (no changes):**
`Container`, `Eyebrow`, `Badge` (optional "NEW" on landing), `Chip` (feature tokens), `Rule`,
`Divider`, `Surface` (dark band), `SectionHeader`, `Figure` (single images), `Button` /
`buttonVariants` (CTAs). Read patterns from `components/product/sections.tsx`.

**Reuse from `components/product/`:**
`Breadcrumb` (from `sections.tsx`) — works for all three pages (pass `breadcrumb` items like
`[{label:"Каталог",href:"/catalog"},{label:"Бутик ламп",href:"/catalog/boutique"},{label:"Сейверы"}]`).

**New components to propose (justified):**
1. `components/boutique/feature-strip.tsx` — a light wrapper rendering the
   "Особенности разработки и производства" bullet list as `Chip`s or a `gap-px` card grid on a
   `<Surface mode="dark">`. *Justification:* repeated on both savers & converters pages; the
   `FeatureBand` in `sections.tsx` is coupled to `ProductFrontmatter["features"]` (icon + title +
   text cards) and is heavier than needed — a thin boutique-specific strip avoids forcing
   icon/text fields the source doesn't have.
2. `components/boutique/area-cards.tsx` — the landing's 3-up linked card grid (savers / converters
   / custom). *Justification:* no existing primitive renders a grid of `<Link>` navigation cards;
   it borrows `FeatureBand`'s `grid gap-px overflow-hidden … bg-border` markup but wraps each cell
   in `next/link`.
3. `components/boutique/custom-order-cta.tsx` — the repeated "Индивидуальный заказ" callout +
   inquiry button. *Justification:* identical block on landing + both category pages; DRY.

Keep all three as **server components** (no interactivity → no `"use client"`).

## Content notes

- **No prices anywhere.** Custom, single-piece items. Every conversion goes to inquiry — there is
  no cart, no `formatPrice`, no "Розничная цена" block. Do not fabricate prices.
- **`/rqst-tubes` form is a P5 dependency.** Source `rqst-tubes.md` is just a heading ("Заполните
  форму ниже … также вы можете позвонить или написать нам") — no fields defined. **In P3:** CTAs
  link to `/rqst-tubes` (route may 404 until P5, consistent with CLAUDE.md's note on un-built
  routes) OR a `mailto:novikamps@mail.ru` / `tel:+79219372508` stub (constants already in
  `components/product/sections.tsx`: `CONTACT_EMAIL = "novikamps@mail.ru"`, `CONTACT_TEL =
  "+79219372508"`). **Do not build the form** — that's P5.
- **Shared "BOUTIQUE MENU" sub-nav.** All four source pages show a `[ BOUTIQUE MENU ]` link
  (placeholder `https://google.com` in source — ignore that URL). This implies the boutique
  section has its own small nav across savers/converters/custom. P3 scope: at minimum cross-link
  the three pages via the landing's `areaCards` + breadcrumbs. A dedicated boutique sub-nav bar is
  optional polish (can defer to global nav work).
- **NOS / "ручная сборка" framing is the whole value prop.** Copy must keep: hand-built (вручную),
  NOS Soviet parts (старые советские детали), bakelite & ceramic sockets (бакелитовые/керамические
  панельки), "уникальная технология", unique converters "вы не найдёте нигде в мире". Faithful to
  source — expand sparingly, don't invent specs.
- **No EAC / no warranty / no part numbers** on these pages (those belong to NAG hardware). The
  only "model-ish" string is the image filename `novik-converter-pro-40` — do **not** surface
  "Pro 40" as a product name/spec unless source text supports it (it doesn't); treat as bespoke.
- **Converter image pair:** `-dark` / `-light` are the same product on different backgrounds. Use
  `-dark` on the dark `Surface` band and/or `-light` in the light hero `Figure`; never present as
  two products.
- **RU-only**, `ru-RU`. Slugs are translit/RU words already in use (`savers`, `converters`,
  `boutique`) — keep them; they match source URLs (`/savers`, `/converters`, `/bt`→`/boutique`).

## Acceptance criteria

- [ ] `npm run build` is green (typecheck + lint + SSG prerender) with the 3 new pages.
- [ ] Routes exist and are statically rendered: `/catalog/boutique`, `/catalog/savers`,
      `/catalog/converters`. If implemented as a dynamic boutique segment, `generateStaticParams`
      + `dynamicParams = false` cover all three; if static folders, each has its own `page.tsx`.
- [ ] Each page exports `generateMetadata`/`metadata` (RU title + description from the page lede).
- [ ] **Tokens-only** — zero hardcoded hex/rgb; dark band via `<Surface mode="dark">`; DS
      primitives reused; any new component lives in `components/boutique/` and is token-clean.
- [ ] Content is **faithful to source** (`bt.md`, `savers.md`, `converters.md`) — no invented
      products, prices, model names, or specs. NOS / hand-build framing preserved.
- [ ] **No price UI, no cart CTAs, no spec accordion, no software band.** Single inquiry CTA per
      page → `/rqst-tubes` (or `mailto:`/`tel:` stub).
- [ ] Landing cross-links to savers, converters, and the custom-order section; breadcrumbs on all
      three (`Главная → Каталог → Бутик ламп → …`).
- [ ] Images copied to `public/boutique/…` and referenced via `next/image`/`Figure`; converter
      dark/light pair handled correctly (not as two SKUs).
- [ ] `/rqst-tubes` is **not** built here (P5). CTAs degrade gracefully (documented stub).
- [ ] No accidental loosening of `productFrontmatterSchema`; boutique uses its own data module.

## Run-recipe

A future agent builds this slice as follows (exact files in parentheses):

1. **`/brainstorming`** (`superpowers:brainstorming`) — confirm: 3 marketing pages vs product
   template; typed-data-module vs MDX (recommend module); `/rqst-tubes` stub strategy for P3
   (link-and-404 vs mailto/tel); whether a boutique sub-nav is in scope.
2. **Analyze sources** — re-read:
   - `novikamps/bt/bt.md` (landing copy, 3 areas, hero image)
   - `novikamps/savers/savers.md` (savers lede + features + custom callout)
   - `novikamps/converters/converters.md` (converters lede + features + custom callout)
   - `novikamps/rqst-tubes/rqst-tubes.md` (confirm form is P5, note contact channels)
   - List images: `novikamps/{bt,savers,converters,rqst-tubes}/images/` (4 unique files).
   - Reference impls: `app/catalog/[slug]/page.tsx`, `components/product/sections.tsx`,
     `app/istoriya/page.tsx`, `lib/content/company.ts`, `lib/content/types.ts`,
     `components/ds/index.ts`.
3. **`/writing-plans`** (`superpowers:writing-plans`) — plan: image copy step; data module
   (`content/boutique/boutique.ts` + types in `lib/content/types.ts` + loader
   `lib/content/boutique.ts`); 3 page files; 3 new boutique components; metadata; breadcrumbs.
4. **Implement** (TDD where logic exists — `superpowers:test-driven-development`): the only real
   logic is the data loader (mirror `lib/content/company.ts`) — write a small test that the module
   parses and exposes `boutique`/`savers`/`converters`. Pages are presentational (assemble DS
   primitives). Copy images to `public/boutique/…`. Keep pages server-only (no `"use client"`).
   Verify `npm run build` green.
5. **`/requesting-code-review`** (`superpowers:requesting-code-review`) — check tokens-only, DS
   reuse, fidelity to source, no price/cart leakage, P5 form correctly deferred, routes prerender.
