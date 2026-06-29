# NAG · NOVIK — Site Master Plan

> Source of truth for everything not yet built. Each **slice** below is a self-contained unit of
> work: a future agent grabs one, runs its recipe (brainstorm → analyze → plan → build → review),
> and ships it without needing the others in flight. Detailed slice specs live in `docs/slices/`.

**Author/maintainer note:** keep this file's sitemap + phase table in sync as slices ship. The
design record for the foundation is `docs/superpowers/specs/2026-06-28-nag-site-foundation-design.md`.

---

## 1. Vision & principles

- **Who:** NAG · NOVIK — pro-audio manufacturer, St. Petersburg, founder S. Novikov (amps since
  1976), company since 1992. Two brands: **NAG** (transistor amps, DSP processors) and **NOVIK**
  (tube amps, boutique). `novikamps.com`.
- **Audience:** sound engineers, installers, integrators, musicians — technical buyers. The site is
  a **catalog + credibility** play; most products are quoted/ordered, not impulse-bought.
- **Language:** Russian only (`ru-RU`). Prices in roubles.
- **Tech:** Next.js 16 App Router · React 19 · TS strict · Tailwind v4 · SSG-first. Backend
  (Supabase) arrives in P5 for inquiries; commerce (P6) is optional.
- **Design:** one design system, ported in P0 (`app/globals.css` + `components/ds/`). Industrial
  warm-paper + signal-red, dark "chassis" bands for technical content. **Tokens only, no hardcoded
  hex.** Reuse primitives; extend the DS, don't fork it.
- **Method:** every slice is brainstormed and planned before code; logic-bearing code is TDD'd;
  every slice ends in code review. Faithfulness to source content is mandatory — **never invent a
  product, spec, or price.**

## 2. Status

| Phase | State |
|---|---|
| **P0 — Foundation + 2 pages** | ✅ Done — tokens, DS primitives, content pipeline, `/istoriya`, `/catalog/d-8000`, placeholder `/`, `CLAUDE.md`, this plan. |
| **P1 — Design-system completion** | ✅ Done — schema §6 fixes, 6 DS primitives (Breadcrumb, Prose, SpecMatrixTable, ProductCard, PillGroup/Tabs), MobileNav, a11y pass, motion utilities, `/_ds` dev route. |
| **P2 — Catalog (DSP + power amps + tube)** | ✅ DSP processors (6 pages + `/catalog/processors`), transistor power amps (5 pages + `/catalog/amplifiers`), NOVIK tube amps (4 pages + `/catalog/tubes`). КОНТУР family still pending. |
| **P3 — Company/legal + boutique** | 🚧 Company & legal done (`/o-kompanii`, `/garantiya`, `/kontakty`); boutique pending. |
| P4–P7 | ⏳ Planned — see roadmap + slices. |

## 3. Information architecture — full sitemap

| Route | Page | Kind | Phase | Source (`novikamps/…`) |
|---|---|---|---|---|
| `/` | Homepage | homepage | P4 (placeholder in P0) | `index/index.md` |
| `/istoriya` | История компании NOVIK | company | ✅ P0 | `history/history.md` |
| `/o-kompanii` | О компании (hub) | company | ✅ P3 | — (+ `История - направления.dc.html`) |
| `/kontakty` | Контакты | company/form | ✅ P3 (form P5) | `contacts/contacts.md` |
| `/garantiya` | Гарантия и сервис | company | ✅ P3 | `guarantee/guarantee.md` |
| `/catalog/processors` | Процессоры — модельный ряд | category | ✅ P2 | `dsp/dsp.md` |
| `/catalog/d-8000` | NAG D-8000 WI-FI | product | ✅ P0 | `d8000/d8000.md` |
| `/catalog/f-8-pro` | NAG F-8 PRO | product | ✅ P2 | `f8000/f8000.md` |
| `/catalog/f-8` | NAG F-8 | product | ✅ P2 | `f8wifi/f8wifi.md` |
| `/catalog/d-4` | DSP BY NAG D-4 | product | ✅ P2 | `dspd4/dspd4.md` |
| `/catalog/d-8` | DSP BY NAG D-8 | product | ✅ P2 | `dspd8/dspd8.md` |
| `/catalog/the-rogue` | DSP BY NAG THE ROGUE | product | ✅ P2 | `therogue/therogue.md` |
| `/catalog/amplifiers` | Усилители мощности | category | ✅ P2 | `transistors/transistors.md` |
| `/catalog/qm-400` | NAG QM-400 | product | ✅ P2 | `qm400/qm400.md` |
| `/catalog/td-series` | NAG TD SERIES | product (series) | ✅ P2 | `td-series/td-series.md` |
| `/catalog/cx-series` | CX / DSP SERIES | product (series) | ✅ P2 | `cx-series/cx-series.md` |
| `/catalog/modules` | NAG TDS / TDH | product (series) | ✅ P2 | `modules/modules.md` |
| `/catalog/tdx` | NAG TDX | product | ✅ P2 | `tdx/tdx.md` |
| `/catalog/tubes` | Ламповые усилители НОВИК | category | ✅ P2 | `tubes/tubes.md` |
| `/catalog/e12` | NOVIK E12 | product | ✅ P2 | `e12/e12.md` |
| `/catalog/black-fire` | NOVIK BLACK FIRE | product | ✅ P2 | `black-fire/black-fire.md` |
| `/catalog/redbear` | REDBEAR MKX50 / NOVIK MKX50+ | product | ✅ P2 | `redbear/redbear.md` |
| `/catalog/n1202` | NOVIK N1202 | product | ✅ P2 | `n1202/n1202.md` |
| `/catalog/kontur` | КОНТУР — автозвук DSP | category | P2 | `page47571769.html/…md` |
| `/catalog/kontur-a8` | КОНТУР A8 | product | P2 | `page48424917.html/…md` |
| `/catalog/boutique` | Бутик ламп НОВИК | category | P3 | `bt/bt.md` |
| `/catalog/savers` | Tube Savers | product | P3 | `savers/savers.md` |
| `/catalog/converters` | Tube Converters | product | P3 | `converters/converters.md` |

~28 pages total. Embedded modules menu (`modules_menu`) and `rqst-tubes` are nav/form fragments,
folded into `/catalog/modules` and the P5 inquiry flow respectively.

## 4. Navigation & URL conventions

- **Russian-translit slugs.** Products under `/catalog/<slug>` (served by the existing
  `app/catalog/[slug]/page.tsx` template via `generateStaticParams`). Category/landing pages are
  separate static routes (`/catalog/processors`, `/catalog/amplifiers`, `/catalog/tubes`,
  `/catalog/kontur`, `/catalog/boutique`).
- Header nav (`components/layout/site-header.tsx`) currently links to category routes that 404
  until P2/P3 ship — wire them as their slices land. The **mobile nav drawer** is a P1 item.
- Footer already links История / Гарантия / Контакты / catalog groups.

## 5. Phase roadmap

| Phase | Scope | Slice spec | Depends on |
|---|---|---|---|
| **P1** | Design-system completion (missing primitives, mobile nav, a11y, dark polish, DS reference route) | [design-system.md](slices/design-system.md) | P0 |
| **P2** | Catalog + all product/category pages (DSP, power amps, tube, КОНТУР) | [dsp-processors.md](slices/dsp-processors.md), [power-amplifiers.md](slices/power-amplifiers.md), [tube-amplifiers.md](slices/tube-amplifiers.md), [kontur-car-audio.md](slices/kontur-car-audio.md) | P1 (primitives), §6 schema work |
| **P3** | Company/legal + boutique | [company-legal.md](slices/company-legal.md), [boutique.md](slices/boutique.md) | P0 |
| **P4** | Real homepage (replaces placeholder) | [homepage.md](slices/homepage.md) | P2 (products to feature) |
| **P5** | Inquiries/forms on Supabase (replaces CTA stubs) | [forms-supabase.md](slices/forms-supabase.md) | P3 pages exist |
| **P6** | Commerce — cart/checkout/payments (optional, go/no-go) | [commerce.md](slices/commerce.md) | P2, P5 |
| **P7** | SEO · performance · analytics (cross-cutting, run anytime + pre-launch) | [seo-perf.md](slices/seo-perf.md) | — |

P2 can be sub-sliced per family (each is independent). A single agent can also take one product at
a time — every product page is a pure-data MDX clone of `content/products/d-8000.mdx`.

## 6. Schema-evolution backlog (do these before/within P2)

The D-8000 template hardcodes a few things that break for other products. Address in P1 or at the
start of P2 (each change is **additive → keeps `d-8000.mdx` valid**):

- **`price` optional + `price.onRequest`** — tube amps & boutique have **no retail price**
  («Цена по запросу»). `lib/content/schema.ts` currently requires `price.amount`; `getProduct`
  throws otherwise. Make price optional; `ProductHero` must branch to a "Запросить расчёт" CTA.
- **`partnerLogos[]` (optional media)** — `ProductHero` hardcodes
  `/products/d-8000/burr-brown-logo.png` + `wifi-usb-rj45-connectivity.png`; these 404 for every
  other product. Make them frontmatter-driven (or guard/omit when absent).
- **Guard hero quick-links** — `#software` / `#specs` anchors and the price/cart block must render
  conditionally (a product may have no software band, no price).
- **`models[]` + `specMatrix` / `SpecMatrixTable`** — SERIES pages (TD, CX, modules, КОНТУР, and
  the category comparison) list multiple SKUs with per-model power + price on one page. `SpecTable`
  is strictly 2-column; add an N-column `SpecMatrixTable` (DS primitive) and a `models[]`
  frontmatter shape (`{name, config, price?, note?}`). Hero price becomes "от X ₽".
- **`docs[]` (optional `{label, href}[]`)** — software/manual download links (Yandex.Disk) appear
  in DSP/amp sources; render as outline buttons. No schema field today.
- **Category template** — a small reusable category/landing route + `ProductCard`/`CategoryGrid`
  (coordinate with P1). First built in whichever P2 family ships first.

These are documented per-area in the slice files with exact line references.

## 7. Design-system contract (every slice obeys this)

- **Tokens only.** Colors/space/type/elevation/motion come from `app/globals.css`. No hex in
  components. Light is default; technical/dark bands use `<Surface mode="dark">`.
- **Fonts:** `font-display` (Oswald, headings, uppercase), `font-text` (Golos Text, body),
  `font-mono` (JetBrains Mono, specs/labels). Eyebrows = mono uppercase + `tracking-[var(--ls-label)]`.
- **Primitives (`components/ds/`)** — reuse, don't re-implement: `Button`, `Container`, `Eyebrow`,
  `Badge`, `Chip`, `Divider`, `Rule`, `Surface`, `SectionHeader`, `SpecTable`, `AccordionItem`,
  `Figure`, `Gallery`, `Toc`, `ScrollProgress`, `ExpandAllControl`. New primitives go in
  `components/ds` and get exported from `index.ts` (see P1 backlog: `Meter`, `Tabs`/`PillGroup`,
  `SpecMatrixTable`, `Breadcrumb`, `ProductCard`, `Prose`, `MobileNav`, form inputs).
- **Content patterns:** (1) MDX + zod frontmatter for product/marketing pages
  (`content/products/*.mdx` → `/catalog/[slug]`); (2) typed data module for complex editorial
  longreads (`content/company/istoriya.ts`). Validate frontmatter (build fails on invalid).
- **Brand accent:** NAG = signal red. NOVIK tube line may shift accent to tube-glow amber
  (`--nag-amber-500`); decide at the tube slice's brainstorm.
- **Server components by default**; `"use client"` only for interactivity.

## 8. Per-slice recipe (how a future agent runs a slice)

Every slice file in `docs/slices/` follows the same shape (Overview · Pages · Design reference ·
Data model · Components needed · Content notes · Acceptance criteria · Run-recipe). To execute one:

1. **`/brainstorming`** — read the slice spec; confirm scope, routes, and any open decisions
   (e.g. amber accent for NOVIK, КОНТУР software band). Don't expand scope.
2. **Analyze** — read the exact source `.md` files listed in the slice (and design `.dc.html`
   where referenced). Copy specs/prices **verbatim**; normalize obvious OCR typos; never invent.
3. **`/writing-plans`** — produce the implementation plan; apply the §6 schema changes first if the
   slice needs them.
4. **Build** — clone the relevant template (product MDX / category / company). TDD any logic
   (galleries, model matrices, forms, payments). Copy images to `public/…`. Keep `npm run build`
   green throughout.
5. **`/requesting-code-review`** (+ security review for P5/P6). Update this plan's status table.

## 9. Content source map

- **Markdown + images:** `/Users/viktor/Documents/kimi/workspace/novikamps/<folder>/` — one folder
  per page (see §3 sitemap "Source" column). Each has `*.md` + `images/`.
- **Approved design exports:** `/Users/viktor/Downloads/NAC история компании/` — the three
  `.dc.html` pages (history longread = built; D-8000 product = built; "История — направления" = a
  3-variant timeline exploration for the P3 `/o-kompanii` hub) + `_ds/` tokens (already ported) +
  higher-res D-8000/history images.
- **Reference stack:** `/Users/viktor/Code/NB-site-main/` — the author's house conventions
  (Tailwind v4 `@theme`, MDX pipeline, Supabase/forms patterns for P5/P6).
- Image handling: copy into `public/<area>/…`; reference absolute public paths in frontmatter; use
  `next/image`. Large marketing PNGs (software screenshots, spec sheets) should be compressed and,
  where they're really data tables, transcribed into `specGroups` rather than shipped as images.

## 10. Slice index

| Slice | Phase | Spec |
|---|---|---|
| Design-system completion | P1 | [slices/design-system.md](slices/design-system.md) |
| DSP processors | P2 | [slices/dsp-processors.md](slices/dsp-processors.md) |
| Power amplifiers (transistor) | P2 | [slices/power-amplifiers.md](slices/power-amplifiers.md) |
| Tube amplifiers (NOVIK) | P2 | [slices/tube-amplifiers.md](slices/tube-amplifiers.md) |
| КОНТУР car-audio | P2 | [slices/kontur-car-audio.md](slices/kontur-car-audio.md) |
| Company & legal | P3 | [slices/company-legal.md](slices/company-legal.md) |
| Boutique (savers/converters) | P3 | [slices/boutique.md](slices/boutique.md) |
| Homepage | P4 | [slices/homepage.md](slices/homepage.md) |
| Forms & inquiries (Supabase) | P5 | [slices/forms-supabase.md](slices/forms-supabase.md) |
| Commerce (cart/checkout) | P6 | [slices/commerce.md](slices/commerce.md) |
| SEO · performance · analytics | P7 | [slices/seo-perf.md](slices/seo-perf.md) |
