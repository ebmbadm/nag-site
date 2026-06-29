# P3b — NOVIK Tubes Boutique: design spec

**Date:** 2026-06-29
**Phase:** P3 (second/last slice; closes the `/catalog/*` tree)
**Slice source:** `docs/slices/boutique.md`
**Depends on:** P0 (DS primitives, typed-data-module pattern), P3a (`/kontakty` exists as the inquiry destination)

---

## 1. Goal

Ship the **NOVIK Tubes Boutique** — three editorial/marketing pages for hand-built NOS tube
accessories: `/catalog/boutique` (landing), `/catalog/savers`, `/catalog/converters`. Bespoke,
single-piece, **no price, no SKU list, no cart**; every CTA funnels to an inquiry. These are NOT
product-template pages.

## 2. Scope

| # | Route | File | Source | Images |
|---|---|---|---|---|
| 1 | `/catalog/boutique` | `app/catalog/boutique/page.tsx` | `bt/bt.md` | `vintage-radio-tubes-collection.jpg` |
| 2 | `/catalog/savers` | `app/catalog/savers/page.tsx` | `savers/savers.md` | `novik-tube-saver-amphenol-black.png` |
| 3 | `/catalog/converters` | `app/catalog/converters/page.tsx` | `converters/converters.md` | `novik-converter-pro-40-{dark,light}.png` |

All three: static (SSG), `ru-RU`, **server components**, each exports `metadata`. Built from DS
primitives — NOT `ProductHero`/`SpecsSection` (those assume price + spec accordions).

## 3. Decisions (approved)

- **A. Inquiry CTA → `/kontakty`.** Source links point at `/rqst-tubes` (the P5 form, would 404 on
  the now-live public site). Every boutique CTA instead targets the live `/kontakty` page. (Repoint
  to `/rqst-tubes` later if P5 wants a dedicated boutique form.)
- **B. Typed data module** (`content/boutique/boutique.ts` + types + `lib/content/boutique.ts`
  loaders), mirroring the company pattern. Do NOT touch `productFrontmatterSchema`.
- **C. New components in `components/boutique/`** — `feature-strip`, `area-cards`,
  `custom-order-cta` (all server, no `"use client"`).
- **D. Converter dark/light pair = one product.** Light variant in the light hero `Figure`; dark
  variant on the dark `<Surface mode="dark">` feature band. Never two SKUs.
- **E. No SKU catalog.** Sources have a «Каталог» heading but no populated gallery/SKU list — do
  NOT fabricate one. Photo-led: one hero image per page (`Figure`, not `Gallery`).
- **F. No global-nav change.** Discoverability via the landing's area cards + breadcrumbs. (Adding
  «Бутик ламп» to the footer is an optional later follow-up, out of scope here.)

## 4. Data model (add to `lib/content/types.ts`)

```ts
export interface BoutiqueCta { label: string; href: string }       // href "/kontakty"
export interface BoutiqueFeature { title: string }                  // hand-build bullet → Chip
export interface BoutiqueAreaCard { title: string; text: string; href: string }
export interface BoutiqueCustom { title: string; body: string[]; cta: BoutiqueCta }
export interface BoutiquePage {
  slug: "boutique" | "savers" | "converters";
  eyebrow: string;
  title: string;
  lede: string;
  hero?: { src: string; alt: string; caption?: string };
  heroDark?: { src: string; alt: string };                         // converter dark, for dark band
  features?: { title: string; items: BoutiqueFeature[] };          // savers/converters
  areaCards?: BoutiqueAreaCard[];                                  // landing only
  custom?: BoutiqueCustom;
  cta: BoutiqueCta;
}
```

Data: `content/boutique/boutique.ts` exports `boutique`, `savers`, `converters`. Loaders in
`lib/content/boutique.ts`: `getBoutique()`, `getSavers()`, `getConverters()` (mirror
`lib/content/company.ts`).

## 5. Content (faithful to source; humanizer-ru applied)

### Landing (`bt.md`)
- eyebrow «NOVIK TUBES BOUTIQUE»; title «Ламповый бутик NOVIK»; lede «Подбор ламп и аксессуары для
  ламповой техники. Новый раздел: сейверы и конвертеры для винтажных ламп, позже появятся
  подобранные лампы. Есть конкретный запрос - свяжитесь с нами.»
- hero `vintage-radio-tubes-collection.jpg`.
- `areaCards` (3):
  - «Сейверы» → `/catalog/savers`: «Делаем вручную из старых (NOS) советских деталей: винтажные
    лампы как основа плюс бакелитовые и керамические панельки.»
  - «Конвертеры» → `/catalog/converters`: «Позволяют использовать разные лампы в одном усилителе.
    Из NOS советских деталей, часть из них уникальна - таких переходников не найти больше нигде.»
  - «Индивидуальный заказ» → `#custom`: «Ищете конкретную советскую лампу определённого года,
    завода, параметров? Найдём, проверим и подберём. Изготовим сейвер или конвертер по вашим
    материалам.»
- `custom` (the richer landing callout): title «Индивидуальный заказ»; body = the lamp-sourcing +
  bespoke-make paragraphs above; cta → `/kontakty`.

### Savers (`savers.md`)
- eyebrow «NOVIK TUBES BOUTIQUE»; title «Сейверы для винтажных радиоламп»; lede «Сейверы сохраняют
  оригинальные разъёмы в усилителях и избавляют от дорогой замены панелек. Пригодятся, когда вы
  проверяете лампы. И, конечно, сейвер бывает просто красивой деталью.»
- hero `novik-tube-saver-amphenol-black.png`.
- `features` «Особенности разработки и производства»: Оригинальные, винтажные компоненты · Ручная
  сборка · Качественные материалы · Уникальная технология.
- `custom` (short, shared): title «Индивидуальный заказ»; body «Не нашли нужный переходник или
  сейвер? Изготовим устройство на заказ, учитывая ваши пожелания по материалам.»; cta → `/kontakty`
  («Заполнить заявку на заказ»).

### Converters (`converters.md`)
- eyebrow «NOVIK TUBES BOUTIQUE»; title «Конвертеры для ламп»; lede «Конвертеры позволяют
  использовать в вашем устройстве больший спектр ламп.»
- hero `novik-converter-pro-40-light.png`; `heroDark` `novik-converter-pro-40-dark.png` (on the
  dark feature band).
- same `features` list; same short `custom` callout; cta → `/kontakty`.

«Pro 40» (filename) is NOT surfaced as a product name (not in source text). No prices, no EAC, no
part numbers.

## 6. Components (`components/boutique/`, server)

1. **`feature-strip.tsx`** — `<Surface mode="dark">` band: heading «Особенности разработки и
   производства» + the bullet items as `Chip`s (or a `gap-px` card grid). Optional `image` prop
   (converter dark variant) shown via `Figure` on the band.
2. **`area-cards.tsx`** — landing 3-up grid of `next/link` cards (kicker/title/text), reusing the
   `FeatureBand` `grid gap-px … bg-border` idiom wrapped in `<Link>`.
3. **`custom-order-cta.tsx`** — the «Индивидуальный заказ» callout (`id="custom"` so the landing
   area-card anchor `#custom` lands here): title + body paragraphs + a primary button → `/kontakty`.
   Reused on all three pages (DRY).

Reuse from `components/ds`: `Container`, `Eyebrow`, `Chip`, `Rule`, `Divider`, `Surface`, `Figure`,
`Breadcrumb`, `buttonVariants`. Pages assemble: breadcrumb → light hero (`Eyebrow` + `<h1>` + lede +
`Figure`) → `FeatureStrip` (savers/converters) or `AreaCards` (landing) → `CustomOrderCTA`.

## 7. Images

Copy to `public/boutique/`:
- `bt/images/vintage-radio-tubes-collection.jpg` → `public/boutique/vintage-radio-tubes-collection.jpg`
- `savers/images/novik-tube-saver-amphenol-black.png` → `public/boutique/savers/novik-tube-saver-amphenol-black.png`
- `converters/images/novik-converter-pro-40-dark.png` → `public/boutique/converters/novik-converter-pro-40-dark.png`
- `converters/images/novik-converter-pro-40-light.png` → `public/boutique/converters/novik-converter-pro-40-light.png`

`rqst-tubes/images/…` is a byte-dup of the bt image — do not copy again. Reference via `next/image`
(through `Figure`). (The custom basePath image loader from the deploy slice handles Pages paths.)

## 8. RU copy rules (humanizer-ru + project)

All Russian. No em-dash `—` in visible prose (use `-`, comma, colon); em-dash in `alt` accepted. No
«является» (rephrase «являются уникальными» → «уникальны»), «данный», «не просто X, а Y», «от X до
Y». Keep the NOS / hand-build value prop verbatim in spirit: вручную, NOS советские детали,
бакелитовые/керамические панельки, уникальная технология, «не найти больше нигде». **Fact-lock:** no
invented products, prices, model names, specs.

## 9. Testing

- `lib/content/boutique.ts` loaders return the 3 pages: each `cta.href === "/kontakty"`; landing
  `areaCards` length 3 (hrefs `/catalog/savers`, `/catalog/converters`, `#custom`); savers + converters
  `features.items` length 4; converters has `heroDark`.
- `AreaCards` renders 3 links to the right hrefs (TDD this one component).
- `npm run build` green; `/catalog/boutique`, `/catalog/savers`, `/catalog/converters` prerendered
  static; `npx tsc --noEmit` + lint clean.

## 10. Acceptance criteria

- [ ] Three routes render as static server components, each with `metadata` (RU title + description).
- [ ] Content faithful to `bt.md` / `savers.md` / `converters.md` — no invented products/prices/SKUs;
      NOS + hand-build framing preserved; «Pro 40» not surfaced as a product name.
- [ ] **No price UI, no cart, no spec accordion, no software band.** Single inquiry CTA per page →
      `/kontakty` (never a `/rqst-tubes` 404).
- [ ] Tokens only — no hardcoded hex; dark band via `<Surface mode="dark">`. New components in
      `components/boutique/`.
- [ ] Images copied to `public/boutique/…` and shown via `next/image`/`Figure`; converter dark/light
      handled as one product (dark on band, light in hero), not two SKUs.
- [ ] Landing cross-links to savers, converters, and the `#custom` callout; breadcrumbs on all three
      (Главная → Каталог [no href] → Бутик ламп → …).
- [ ] Data in `content/boutique/*.ts` typed by `lib/content/types.ts`, loaded via
      `lib/content/boutique.ts`; `productFrontmatterSchema` untouched.

## 11. Out of scope

The `/rqst-tubes` form (P5); a populated SKU/«Каталог» gallery (no source data); a dedicated boutique
sub-nav bar; global-nav/footer boutique link (optional follow-up); КОНТУР car-audio (P2 leftover);
homepage (P4); any commerce.
