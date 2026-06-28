# Slice: Усилители мощности (транзисторные)  (Phase P2)

NAG / "By NAG" transistor power amplifiers — Class-TD and Class-D output stages, plus
embedded amplifier modules for active loudspeakers. This slice covers one category
landing page, four product pages, and two embedded-module product pages. Two of the
product pages describe **series** (multiple models on one page) and need a multi-column
model-comparison table that the current DS does **not** have yet.

---

## Overview

The transistor-amplifier family on the legacy site (`novikamps.com`) is reachable from an
aggregator page (`/transistors`) and a modules sub-menu (`/modules_menu`). It contains:

| # | Legacy URL | What it is | Single product or series |
|---|------------|-----------|---------------------------|
| 1 | `/transistors` | Aggregator/menu listing the 4 amp families | category landing |
| 2 | `/qm400` | NAG QM-400 — flagship 4-channel Class-TD amp (4×2250 W) | single product |
| 3 | `/td-series` | NAG TD SERIES — 2-channel Class-TD amps | **series**: TD-30 / TD-40 / TD-80 / TD-100 |
| 4 | `/cx-series` | AMP By NAG CX (DSP SERIES) — 4×700 W Class-D amp with DSP | **series**: CX-520 / CX-540 |
| 5 | `/modules` | NAG TDS / TDH — embedded Class-TD amp modules | **series**: TDS/TDH-10 / TDS/TDH-20 |
| 6 | `/tdx` | NAG TDX — embedded 2×1000 W Class-D module with DSP | single product |
| 7 | `/modules_menu` | sub-menu pointing to `/tdx` + `/modules` | menu fragment (fold into category page) |

**Page count to build: 1 category page + 5 product pages = 6 routes.** The `/transistors`
and `/modules_menu` menus are not separate pages — they become the category landing page
(`/catalog/amplifiers`) plus its product cards. All six product pages reuse the existing
`/catalog/[slug]` MDX product template; the category page is a new (small) route.

---

## Pages

| Product/Page | Proposed route | Source .md | Images (dir · count) | One-liner | Key specs / price |
|---|---|---|---|---|---|
| Category: Усилители мощности | `/catalog/amplifiers` | `novikamps/transistors/transistors.md` + `novikamps/modules_menu/modules_menu.md` | `transistors/images` · 1 (`nag-transistor-amplifiers-lineup.png`); `modules_menu/images` · 1 (`nag-active-modules-lineup.png`) | Landing that lists all transistor amps + embedded modules | n/a — links to the 5 product pages, "от 41 900 ₽" range |
| NAG QM-400 | `/catalog/qm-400` | `novikamps/qm400/qm400.md` | `qm400/images` · 4 (`nag-qm400-front-panel.jpg`, `nag-qm400-rear-panel.jpg`, `nag-qm400-front-rear-comparison.png`, `nag-qm400-internal-pcb.jpg`) | Флагманский 4-канальный усилитель Class-TD, 4×2250 Вт | 4×2250 Вт (2 Ω) / 4×2000 Вт (4 Ω) / 4×1200 Вт (8 Ω); bridge 2×4200 Вт; Class-TD; 483×463×88 мм; 17.3 кг; **199 900 ₽** |
| NAG TD SERIES | `/catalog/td-series` | `novikamps/td-series/td-series.md` | `td-series/images` · 2 (`nag-td-series-front-panel.png`, `nag-td-series-specifications-table.jpeg`) | 2-канальные универсальные усилители Class-TD, 4 модели | TD-30 2×400, TD-40 2×600, TD-80 2×1400, TD-100 2×2000 Вт (4 Ω); Class-TD; стабильны на 2 Ω; **от 70 000 ₽** |
| AMP By NAG CX (DSP SERIES) | `/catalog/cx-series` | `novikamps/cx-series/cx-series.md` | `cx-series/images` · 6 (`nag-cx-series-front-panel.jpg`, `nag-cx-series-rear-panel.jpg`, `nag-cx-series-promo-features.png`, `nag-cx-series-software-main-screen.png`, `nag-cx-series-software-routing.png`, `nag-cx-series-specifications-sheet.png`) | 4×700 Вт усилитель Class-D со встроенным 32-бит DSP, 1U | CX-520 (2×4 DSP) **49 900 ₽**, CX-540 (4×4 DSP) **59 900 ₽**; 4×700 Вт (4 Ω); 8-полос. PEQ; 11.9 кг; **от 49 900 ₽** |
| NAG TDS / TDH SERIES | `/catalog/modules` | `novikamps/modules/modules.md` | `modules/images` · 3 (`nag-module-tds-rear-panel.png`, `nag-module-tds-tdh-dimensions.png`, `nag-module-tds-tdh-specifications.png`) | Встраиваемые усилительные модули Class-TD для активной акустики | TDS/TDH-10 960 Вт (4 Ω), -20 2200 Вт (4 Ω); POWERCON AC LINK; 376×132×78 мм; **от 41 900 ₽** |
| NAG TDX | `/catalog/tdx` | `novikamps/tdx/tdx.md` | `tdx/images` · 3 (`nag-tdx-module-rear-panel.png`, `nag-tdx-module-dimensions.jpg`, `nag-tdx-module-specifications.png`) | Встраиваемый 2×1000 Вт Class-D модуль с DSP, RS-485 | 2×1000 Вт (4 Ω) / 2×650 Вт (8 Ω); DSP 2 вх × 2 вых; RS-485; 313×146.5×79 мм; 2.0 кг; **49 900 ₽** |

> **Slug note:** legacy paths use `/qm400`, `/td-series`, `/cx-series`, `/modules`, `/tdx`.
> Per the SHARED-CONTEXT routing rule, products live at `/catalog/<slug>`. Use
> `qm-400`, `td-series`, `cx-series`, `modules`, `tdx` as MDX filenames. Add a redirect
> map later if SEO from the legacy URLs matters (out of scope for this slice).

---

## Design reference

**Clone the product template** (`/catalog/[slug]` → `app/catalog/[slug]/page.tsx`,
content in `content/products/<slug>.mdx`, rendered by `components/product/sections.tsx`).
All five product pages fit the existing pipeline: Breadcrumb → ProductHero (Gallery + price
+ chips + CTA) → MDX body → optional FeatureBand (dark) → optional TechBand (dark) →
optional SoftwareSection → SpecsSection (accordion). The **category page** is a NEW small
route modeled on the company-page layout conventions (Container + SectionHeader + Surface),
not on the product template.

**Tokens & DS primitives (tokens-only, no hex):**
- Surfaces: `bg-bg`, `bg-surface`, `bg-surface-2`, borders `border-border` / `border-border-faint`.
- Text: `text-text`, `text-text-muted`, `text-text-faint`, accent `text-accent`.
- Type scale `text-2xs … text-5xl`, fonts `font-display` (headings, uppercase),
  `font-text` (body), `font-mono` (labels/specs, with `tabular`).
- Radii `--radius-md` / `--radius-lg`, letter-spacing `--ls-tight` / `--ls-label`,
  line-height `--lh-tight` / `--lh-relaxed`.

**Dark bands:** use `<Surface mode="dark">` for the "ВНУТРИ / Внутри" (internals) reveal
and for any "почему" feature band. The `FeatureBand` and `TechBand` components are already
dark. QM-400, CX and the modules all have a strong "усилитель внутри / фото внутри"
internals motif in the source — render those as a `TechBand` (PCB image + component chips)
or as a `FeatureBand`.

**Galleries:** every product page uses the standard `Gallery` (≥1 image, schema `.min(1)`).
QM-400 → 4 images; CX → front/rear + promo; modules/TDX → rear + dimensions drawing. The
dimension/spec **screenshots** (e.g. `nag-td-series-specifications-table.jpeg`,
`nag-module-tds-tdh-dimensions.png`, `nag-tdx-module-dimensions.jpg`) should be transcribed
into real `specGroups` rows where legible; keep the dimension *drawing* as a `Figure` (in a
TechBand image slot or appended to the gallery) since it is genuinely informative.

**Specs accordion:** yes — all five products have rich spec tables → `SpecsSection` with
`specGroups`. QM-400 and TD-series have **dual-mode** (4-ch / 2-ch bridge, or stereo/bridge)
data; group those as separate accordion sections ("Четырёхканальный режим" / "Мостовой
режим (bridge)").

**Feature / tech / software bands:**
- **QM-400:** FeatureBand (autonomy of 4 channels, unification with TDS/TDH modules,
  "4 модуля TDS/TDH-20 в одном корпусе"), TechBand for internals PCB. No DSP software.
- **TD SERIES:** FeatureBand (Class-TD benefits, 1U/1.5U form factors, stable at 2 Ω,
  bridge mono). No software.
- **CX:** FeatureBand (1U, 8-band PEQ, pink-noise generator, plug-n-play, ≤40 ms delay) +
  **SoftwareSection** (main screen + routing screenshots — DSP analogous to D-8000 / The
  Rogue). This is the page most similar to D-8000.
- **TDS/TDH:** FeatureBand (≤2200 W/4 Ω, Class-TD, LINK ports, POWERCON AC LINK, unified
  schematic). No software.
- **TDX:** FeatureBand (2×1000 W Class-D, RS-485 remote control, daisy-chain, POWERCON) +
  optional SoftwareSection (DSP control software for Windows — source mentions "ПО для
  управления DSP" but provides no usable screenshots; render as a single `Figure` placeholder
  or omit until an asset exists).

**Differences from D-8000:**
1. **Series pages** (TD, CX, modules) list several SKUs on one page with per-model power and
   price. D-8000 is a single SKU. This needs a model/variant comparison table + a price
   matrix — see *Components needed* (NEW `ModelMatrix` / variant table).
2. **Per-model pricing.** D-8000 has one `price`. Series pages have multiple prices ("TD-30 —
   70 000 ₽ … TD-100 — 120 900 ₽"). Hero `price` becomes the *entry* price with
   `note: "цена за модель — см. таблицу"`; the per-model prices live in a new `models[]`
   frontmatter field rendered by the variant table.
3. **Documents links.** Each legacy page links Yandex.Disk docs (e.g. QM-400
   `https://disk.yandex.ru/d/Q99G953L8Y5okQ`, TD `…C2VIYuGsBa4doQ`, modules `…oftjOQHMSPobtg`)
   and CX a program download (`…QI0coVnIuCc2Lw`). D-8000 had no external doc link. Add an
   optional `docs[]` field (label + href) rendered as outline buttons in the hero or a small
   "Документы / Программа" row.
4. **No badge culture.** Only QM-400 carries an implicit "флагман / EAC / Гарантия" emphasis;
   use badges sparingly (e.g. QM-400 `["ФЛАГМАН", "EAC"]`). TD/CX/modules/TDX: `[]` or a single
   class badge ("Class-TD" / "Class-D · DSP").

---

## Data model

Reuse `productFrontmatterSchema` (`lib/content/schema.ts`) for all five product pages. Two
**new optional fields** are needed for the series pages and the doc links; both are additive
and default-empty so D-8000 stays valid:

```ts
// add to productFrontmatterSchema (all optional → no migration of d-8000.mdx):
models: z
  .array(
    z.object({
      name: z.string(),          // "TD-40"
      config: z.string(),        // "2 × 600 Вт (4 Ω)"
      price: z.number().optional(),
      note: z.string().optional(),// "1U" / "2×4 DSP"
    }),
  )
  .default([]),
docs: z
  .array(z.object({ label: z.string(), href: z.string() }))
  .default([]),
// OPTIONAL: a wide comparison table for series spec sheets
specMatrix: z
  .object({
    columns: z.array(z.string()),               // ["TD-30","TD-40","TD-80","TD-100"]
    rows: z.array(z.object({ label: z.string(), values: z.array(z.string()) })),
  })
  .optional(),
```

`specMatrix` is the structured replacement for the per-model comparison tables that the
two-column `SpecTable` cannot express (it is strictly label|value — see
`components/ds/spec-table.tsx`). Render it via the NEW `SpecMatrixTable` component (below)
inside `SpecsSection` (e.g. as the `defaultOpen` group "Сравнение моделей").

**Concrete example — `content/products/td-series.mdx` (representative series page):**

```mdx
---
name: "NAG TD SERIES"
line: "Усилители мощности · NAG Pro Audio"
subtitle: "Двухканальные усилители TD класса"
badges: ["Class-TD"]
category: "Усилители мощности"
breadcrumb:
  - { label: "Каталог", href: "/catalog" }
  - { label: "Усилители мощности", href: "/catalog/amplifiers" }
  - { label: "TD SERIES" }
price:
  amount: 70000
  currency: "₽"
  note: "цена за модель — см. таблицу · Гарантия · EAC"
summary: "Универсальные двухканальные усилители TD класса. Серия TD совмещает преимущества TD-класса в выходном каскаде (как у QM-серии) с компактностью и лёгкостью корпуса. Выходные каскады развивают заявленную мощность без мостового включения в каждом канале и стабильно работают на нагрузке 2 Ом."
specChips:
  - "Class-TD"
  - "2 канала"
  - "до 2×2000 Вт"
  - "стабильно на 2 Ω"
  - "1U / 1.5U"
docs:
  - { label: "Документы", href: "https://disk.yandex.ru/d/C2VIYuGsBa4doQ" }
models:
  - { name: "TD-30",  config: "2 × 400 Вт (4 Ω)",  price: 70000,  note: "1U" }
  - { name: "TD-40",  config: "2 × 600 Вт (4 Ω)",  price: 80490,  note: "1U" }
  - { name: "TD-80",  config: "2 × 1400 Вт (4 Ω)", price: 110900, note: "1.5U" }
  - { name: "TD-100", config: "2 × 2000 Вт (4 Ω)", price: 120900, note: "1.5U" }
gallery:
  - { src: "/products/td-series/nag-td-series-front-panel.png", alt: "NAG TD SERIES — передняя панель", caption: "Передняя панель" }
  - { src: "/products/td-series/nag-td-series-specifications-table.jpeg", alt: "NAG TD SERIES — таблица характеристик", caption: "Сравнение моделей" }
features:
  eyebrow: "Преимущества серии"
  title: "Почему TD SERIES"
  cards:
    - { icon: "activity", title: "Выходной каскад TD-класса", text: "Те же преимущества TD-класса, что и в QM-серии, в компактном корпусе." }
    - { icon: "layers",   title: "Стабильность на 2 Ω", text: "Каскады развивают мощность без мостового включения в каждом канале — стабильная работа на 2 Ом." }
    - { icon: "cpu",      title: "Мостовой режим (bridge)", text: "В моно-режиме (bridge) усилитель уверенно работает на нагрузке 4 Ом." }
    - { icon: "wifi",     title: "Компактные 1U / 1.5U", text: "TD-30/40 — 1U; TD-80/100 — 1.5U: больше мощности в той же стойке." }
specMatrix:
  columns: ["TD-30", "TD-40", "TD-80", "TD-100"]
  rows:
    - { label: "8 Ом стерео",  values: ["2 × 300 Вт", "2 × 400 Вт", "2 × 800 Вт", "2 × 1200 Вт"] }
    - { label: "4 Ом стерео",  values: ["2 × 400 Вт", "2 × 600 Вт", "2 × 1400 Вт", "2 × 2000 Вт"] }
    - { label: "2 Ом стерео",  values: ["2 × 400 Вт", "2 × 600 Вт", "2 × 1500 Вт", "2 × 2100 Вт"] }
    - { label: "8 Ом bridge",  values: ["700 Вт", "1100 Вт", "2800 Вт", "3900 Вт"] }
    - { label: "4 Ом bridge",  values: ["800 Вт", "1200 Вт", "3000 Вт", "4100 Вт"] }
    - { label: "Размеры",      values: ["483×325×50 (1U)", "483×325×50 (1U)", "483×361×66 (1.5U)", "483×361×66 (1.5U)"] }
    - { label: "Вес",          values: ["5 кг", "5 кг", "8.2 кг", "8.5 кг"] }
specGroups:
  - title: "Сравнение моделей"
    defaultOpen: true
    rows: []   # rendered via specMatrix in this group; or move matrix above SpecsSection
  - title: "Общие характеристики"
    rows:
      - { label: "Диапазон частот", value: "20 Гц – 20 кГц, ±0.5 дБ" }
      - { label: "THD+N", value: "0.1 %" }
      - { label: "S/N", value: "−105 дБ" }
      - { label: "Демпинг-фактор", value: ">900" }
      - { label: "Входная чувствительность", value: "1.0 В · 1.4 В · 2.0 В" }
      - { label: "Входной импеданс", value: "20 кОм / 10 кОм (балансный / небалансный)" }
      - { label: "Тип выходного каскада", value: "Класс TD" }
      - { label: "Защита", value: "Short circuit, open circuit, thermal, RF, On/Off muting, DC fault shutdown, inrush limiting" }
---

Серия **NAG TD SERIES** — универсальные двухканальные усилители TD-класса …
(прозаическое описание из источника).
```

**QM-400 spec example (dual-mode grouping, single SKU, no `models[]`):**
- `price.amount: 199900`, `badges: ["ФЛАГМАН", "EAC"]`,
  `docs: [{ label: "Документы", href: "https://disk.yandex.ru/d/Q99G953L8Y5okQ" }]`.
- `specGroups`:
  - "Четырёхканальный режим" (defaultOpen): 8 Ω 4×1200 Вт, 4 Ω 4×2000 Вт, 2 Ω 4×2250 Вт.
  - "Мостовой режим (bridge)": 8 Ω 2×3800 Вт, 4 Ω 2×4200 Вт.
  - "Общие": THD 0.1 %, частота 20 Гц–20 кГц ±0.1 дБ, шум −99 дБ, демпинг 950,
    выходной каскад Class-TD, чувствительность 1.0/1.4/2.0 В, входной импеданс >10 кОм
    (балансный/небалансный), коннекторы SpeakOn (×1/канал) + XLR M/F пара с LINK,
    защита (полный список из источника), питание/шнур, габариты 483×463×88 мм, вес брутто 17.3 кг.
- `tech` band: "QM-400 ВНУТРИ" → PCB image `nag-qm400-internal-pcb.jpg`, chip cards about
  "4 автономных канала = 4 модуля TDS/TDH-20".

> **Data fidelity caveats (carry to the build agent):**
> - QM-400 source title says "4x2250 Вт" and header "199 990 р." on the aggregator but the
>   product page states **199 900 ₽** — use **199 900 ₽** (product page wins).
> - TD-40 price appears as **80 490 ₽** in the matrix and prose — keep 80 490.
> - Modules: aggregator/menu say "от 41 990 ₽"; the modules page says TDS-20 = **44 490 ₽**
>   in prose but **44 900 ₽** in the table (TDH-20). List TDS-10/TDH-10 = 41 900,
>   TDS-20 = 44 490, TDH-20 = 44 900 as in the prose; flag the table discrepancy, do not invent.
> - CX "Net mass 11.9 кг"; source line 6 says "весящие 10кг" (marketing round number) — use 11.9 кг in specs.
> - Do **not** invent EAC/warranty where the source is silent; QM-400 explicitly carries
>   "EAC! Гарантия!" in its title — apply EAC/warranty notes only there (and optionally
>   modules/TDX which share the same product family) but keep copy faithful.

---

## Components needed

**Reuse from `components/ds` (and `components/product/sections.tsx`):**
- `Container`, `Eyebrow`, `Badge`, `Chip`, `Divider`, `Rule`, `Surface`, `SectionHeader`,
  `Button` / `buttonVariants`.
- `Gallery`, `Figure`, `SpecTable`, `AccordionItem`, `Toc`, `ScrollProgress`, `ExpandAllControl`.
- Product sections: `Breadcrumb`, `ProductHero`, `FeatureBand`, `TechBand`,
  `SoftwareSection`, `SpecsSection` — all reused as-is for the product pages.
- Feature icons via `components/product/icon-map.tsx` (`FeatureIcon`) — reuse existing icon
  names (`cpu`, `activity`, `layers`, `wifi`). If a fitting amp icon is missing (e.g.
  "speaker", "zap", "sliders"), add it to the icon map (cheap, additive).

**NEW components to propose:**

1. **`SpecMatrixTable`** (`components/ds/spec-matrix.tsx`) — *justified*: the existing
   `SpecTable` is strictly two-column (`label | value`); the series spec sheets (TD ×4 models,
   modules ×2, CX ×2) are genuinely N-column comparison tables. Signature:
   `{ columns: string[]; rows: { label: string; values: string[] }[] }`. Mobile: horizontal
   scroll wrapper (`overflow-x-auto`) or stacked per-column cards. Tokens: same striping as
   `SpecTable` (`bg-surface-2` on odd rows, `font-mono`/`tabular` values, `border-border-faint`).
   Add to `components/ds/index.ts`. `SpecsSection` (or a `SeriesSpecsSection` variant) renders
   it when `specMatrix` is present.

2. **`ModelMatrix` / variant price table** (`components/product/model-matrix.tsx`) —
   *justified*: series pages show a per-model **price** list ("TD-30 … 70 000 ₽"). Render the
   new `models[]` field as a compact card row or table (name · config · price · note CTA).
   Placed under the hero or as its own band. Could be folded into `SpecMatrixTable` + a price
   row, but a dedicated, CTA-bearing component is cleaner. If kept minimal, reuse `Chip` +
   `formatPrice` (`lib/format.ts`) and skip a new file.

3. **`CategoryLanding` / amp category page** (`app/catalog/amplifiers/page.tsx` + a small
   `ProductCard`/`CategoryGrid` in `components/catalog/`) — *justified*: `/catalog/amplifiers`
   has no existing template. Needs a hero (lineup image
   `nag-transistor-amplifiers-lineup.png`), an intro paragraph, and a grid of cards linking to
   the 5 product pages (plus a "встраиваемые модули" sub-group from `modules_menu`). Build a
   reusable `ProductCard` (image + name + line + price-from + href) so other category pages
   (processors, etc.) can reuse it. Static `generateStaticParams` not needed (fixed route).

**Optional NEW field-render helper:** a small `DocLinks` row (label + outline `Button`) for
the `docs[]` field, reused in the hero. Trivial; can live inline in `ProductHero` behind a
`product.docs?.length` guard.

---

## Content notes

- **Aggregator vs category page.** `/transistors` and `/modules_menu` are pure menu pages
  (link lists). They collapse into the single `/catalog/amplifiers` landing. `modules_menu`
  adds an "встраиваемые модули" grouping (TDX + TDS/TDH) — render as a labelled sub-section
  on the category page, not a separate route.
- **Shared family / cross-sell.** The CX page source ends with a "весь модельный ряд наших
  транзисторных усилителей" block linking QM-400, TD, modules, CX. Mirror this as a
  cross-sell `SectionHeader` + `ProductCard` grid at the bottom of each product page (or only
  on the category page) — faithful to the source, reuses the new `ProductCard`.
- **Pricing present** on every page (unlike some processor pages). Series pages carry
  per-model prices; honor the *exact* RU numbers (see fidelity caveats). Hero shows the
  entry price ("от X ₽") with the note pointing to the model table.
- **EAC / warranty.** Only QM-400 explicitly states "EAC! Гарантия!" — apply EAC + 2-year
  warranty note there. Modules/TDX/TD/CX: state warranty only if you keep it generic and
  consistent with the rest of the catalog (confirm with site-wide policy; do not fabricate
  certification claims).
- **Unification theme.** A recurring RU selling point: QM-400 = "4 модуля TDS/TDH-20 в одном
  корпусе", "единая схемотехника со всей линейкой TD/QM". Surface this as a FeatureBand /
  TechBand card and link QM-400 ↔ modules pages.
- **DSP software.** Only CX (and weakly TDX) has DSP. CX software is explicitly "аналогично
  D-8000 / The Rogue" — reuse the `SoftwareSection` with `nag-cx-series-software-main-screen.png`
  (hero) + `nag-cx-series-software-routing.png` (item). TDX mentions Windows RS-485 control
  software but ships no usable screenshot — omit `software` or use a single placeholder Figure.
- **RU copy specifics.** Source has frequent OCR artifacts and typos — normalize: "Дэмпинг"→
  "Демпинг", "Диапозон"→"Диапазон", "втроенным"→"встроенным", ">10k Омб"→">10 кОм",
  "25AI250V"→"25 A / 250 В". Keep Class labels as "Class-TD" / "Class-D" or "TD-класс" /
  "D-класс" consistently. Use `₽`, non-breaking spaces in numbers where the type system allows.
- **Dimension drawings as content.** `nag-td-series-specifications-table.jpeg`,
  `nag-module-tds-tdh-dimensions.png`, `nag-module-tds-tdh-specifications.png`,
  `nag-tdx-module-dimensions.jpg`, `nag-tdx-module-specifications.png`,
  `nag-cx-series-specifications-sheet.png` are screenshots of spec/dimension sheets.
  Transcribe legible numbers into `specGroups` / `specMatrix`; keep the *drawing* images as
  `Figure`s (TechBand image slot or gallery) since they convey mechanical layout.

---

## Acceptance criteria

- `next build` is green; `next lint` and `tsc --noEmit` pass (TS strict).
- All 6 routes render statically: `/catalog/amplifiers`, `/catalog/qm-400`,
  `/catalog/td-series`, `/catalog/cx-series`, `/catalog/modules`, `/catalog/tdx`.
  `app/catalog/[slug]/page.tsx` `generateStaticParams` picks up the 5 new MDX files via
  `getProductSlugs()`; the category page is its own static route.
- Zod validation passes for every new `content/products/*.mdx` (build throws on bad
  frontmatter — see `lib/content/products.ts`). New optional fields (`models`, `docs`,
  `specMatrix`) added to `lib/content/schema.ts` without breaking `d-8000.mdx`.
- Tokens-only: no hardcoded hex anywhere; all color/space/type via tokens & DS primitives.
  Dark bands use `<Surface mode="dark">`.
- Content fidelity: every model, power figure, dimension, weight and price matches the source
  `.md` exactly (with the documented caveats); no invented products, prices, or certifications.
- Images copied from `novikamps/<area>/images/` to
  `public/products/<slug>/` (and `public/catalog/amplifiers/` for the lineup images) with
  the exact filenames referenced in frontmatter; every `gallery`/`Figure`/hero `Image` has a
  real RU `alt`.
- `generateMetadata` produces title/description/OG for each product (already handled by the
  template); category page gets its own `metadata` export.
- New `SpecMatrixTable` (and any series renderer) is responsive (mobile horizontal-scroll or
  stacked) and accessible (proper `<th scope>`).

---

## Run-recipe

1. **/brainstorming** — confirm: (a) whether series prices live in a new `models[]` field
   vs. one MDX per SKU (recommended: one MDX per *series* + `models[]`, since the legacy site
   has one page per series); (b) `SpecMatrixTable` vs. stacked cards on mobile; (c) whether
   the category page reuses a new shared `ProductCard`.
2. **Analyze sources** (read in full):
   - `/Users/viktor/Documents/kimi/workspace/novikamps/transistors/transistors.md`
   - `/Users/viktor/Documents/kimi/workspace/novikamps/modules_menu/modules_menu.md`
   - `/Users/viktor/Documents/kimi/workspace/novikamps/qm400/qm400.md`
   - `/Users/viktor/Documents/kimi/workspace/novikamps/td-series/td-series.md`
   - `/Users/viktor/Documents/kimi/workspace/novikamps/cx-series/cx-series.md`
   - `/Users/viktor/Documents/kimi/workspace/novikamps/modules/modules.md`
   - `/Users/viktor/Documents/kimi/workspace/novikamps/tdx/tdx.md`
   - Skim every `images/` subdir; OCR/transcribe the spec-sheet screenshots listed above.
   - Reference templates: `content/products/d-8000.mdx`, `app/catalog/[slug]/page.tsx`,
     `components/product/sections.tsx`, `lib/content/schema.ts`, `components/ds/*`.
3. **/writing-plans** — produce the implementation plan: schema additions →
   `SpecMatrixTable` + (optional) `ModelMatrix`/`ProductCard` → 5 product MDX files →
   `/catalog/amplifiers` page → image copy → metadata → cross-sell block.
4. **Implement (TDD where logic exists):**
   - Schema change in `lib/content/schema.ts` — add a zod test/sample-parse for the new
     fields; ensure `d-8000.mdx` still validates.
   - `SpecMatrixTable` component — unit-test it renders N columns + striping; export via
     `components/ds/index.ts`.
   - Add icons to `components/product/icon-map.tsx` if needed.
   - Write the 5 MDX files with transcribed specs (fidelity caveats applied).
   - Copy images: `novikamps/<area>/images/* → public/products/<slug>/`;
     lineup images → `public/catalog/amplifiers/`.
   - Build `app/catalog/amplifiers/page.tsx` + shared `ProductCard` / `CategoryGrid`.
   - Wire `docs[]` rendering in the hero (or a small `DocLinks` row).
5. **Verify** — `next build`, visit all 6 routes, check the series matrix on mobile, confirm
   every price/spec matches source.
6. **/requesting-code-review** — focus on tokens-only compliance, schema back-compat, content
   fidelity (numbers vs. source), responsive `SpecMatrixTable`, and static-export correctness.
