# P2b — Power amplifiers (transistor): design spec

**Date:** 2026-06-29
**Phase:** P2 (second catalog family slice)
**Slice source:** `docs/slices/power-amplifiers.md`
**Depends on:** P0 (product template), P1 (`models[]`/`docs[]` schema, `SpecMatrixTable` primitive, `ProductCard`), P2a (category-page pattern, `getProductsByCategory`)

---

## 1. Goal

Ship the NAG transistor power-amplifier family: **5 new product pages** (QM-400, TD SERIES,
CX/DSP SERIES, TDS/TDH modules, TDX) as data MDX, plus a `/catalog/amplifiers` category landing
(clone of `/catalog/processors`). Three are **series** pages (multiple SKUs on one page) and use a
multi-column comparison table.

## 2. Scope

| # | Route | File | Kind | Source `.md` | Price |
|---|---|---|---|---|---|
| 1 | `/catalog/qm-400` | `content/products/qm-400.mdx` | data (single SKU) | `qm400/qm400.md` | 199 900 ₽ |
| 2 | `/catalog/td-series` | `content/products/td-series.mdx` | data (series) | `td-series/td-series.md` | от 70 000 ₽ |
| 3 | `/catalog/cx-series` | `content/products/cx-series.mdx` | data (series) | `cx-series/cx-series.md` | от 49 900 ₽ |
| 4 | `/catalog/modules` | `content/products/modules.mdx` | data (series) | `modules/modules.md` | от 41 900 ₽ |
| 5 | `/catalog/tdx` | `content/products/tdx.mdx` | data (single SKU) | `tdx/tdx.md` | 49 900 ₽ |
| 6 | `/catalog/amplifiers` | `app/catalog/amplifiers/page.tsx` | new code | `transistors/transistors.md` | grid of 5 |

Sources under `/Users/viktor/Documents/kimi/workspace/novikamps/<folder>/`. Series pages model the
SKU set in `models[]` + a `specMatrix` comparison table (decisions below).

## 3. Decisions (approved)

### A. One page per series + `models[]` / `specMatrix`

TD-30/40/80/100 → one `/catalog/td-series`; CX-520/540 → one `/catalog/cx-series`; TDS/TDH-10/20 →
one `/catalog/modules`. Matches the legacy site (one page per series). 6 routes total, not 11+.

### B. Per-model prices fold into `specMatrix` (no new component)

The per-model price list becomes a **"Цена" row** in the `specMatrix` comparison table, rendered by
the existing `SpecMatrixTable`. **No `ModelMatrix` component is built.** `models[]` (already in
schema) keeps feeding `ProductHero`'s "от X ₽" entry price (existing render in `sections.tsx`).

### C. `/catalog/amplifiers` = flat 5-card grid

Exact clone of `/catalog/processors`: `Breadcrumb` → header (`Eyebrow`/H1/lede) → grid of 5
`ProductCard`s via `getProductsByCategory("Усилители мощности")`, ordered, QM-400 badged "Флагман".
No "встраиваемые модули" subgroup, no lineup hero image (consistent with processors).

## 4. What already exists (verified) vs net-new

P1/P2a already shipped most of the slice's proposed "NEW":
- `models[]` ✅, `docs[]` ✅ in `lib/content/schema.ts`. `SpecMatrixTable` ✅ built + exported
  (`SpecMatrixProps = {columns: string[]; rows: {label; values:(string|null)[]}[]; caption?}`).
  `ProductCard` ✅, `getProductsByCategory` ✅.
- `ProductHero` already derives "от X" from `models[].price`.

**Net-new only:**
| File | Change |
|---|---|
| `lib/content/schema.ts` | add optional `specMatrix` field (aligned to `SpecMatrixProps`) |
| `components/product/sections.tsx` | `SpecsSection` gains optional `specMatrix` prop → renders a `SpecMatrixTable` block above the accordion groups |
| `app/catalog/[slug]/page.tsx` | pass `specMatrix={p.specMatrix}` to `SpecsSection` |
| `components/product/icon-map.tsx` | add amp feature-card icons (`zap`, `gauge`, `shield`, `boxes`, `cable`, `speaker` — only those used) |
| `content/products/{qm-400,td-series,cx-series,modules,tdx}.mdx` | 5 new product files |
| `app/catalog/amplifiers/page.tsx` | category landing (clone of processors) |
| `public/products/<slug>/*` | images from each source `images/` dir |
| `lib/__tests__/catalog-coverage.test.ts` | **update** expected slug set 6 → 11; add amplifiers category count |

## 5. `specMatrix` schema (additive, optional → d-8000 stays valid)

```ts
specMatrix: z
  .object({
    columns: z.array(z.string()),
    rows: z.array(
      z.object({ label: z.string(), values: z.array(z.string().nullable()) }),
    ),
    caption: z.string().optional(),
  })
  .optional(),
```

Shape is exactly what `SpecMatrixTable` consumes. `values` allow `null` (renders the table's "—"
gap glyph). A `"Цена"` row carries per-model prices (decision B).

## 6. Rendering: `SpecsSection` + `specMatrix`

`SpecsSection({ groups, specMatrix? })`. When `specMatrix` is present, render — above the existing
`specGroups` accordion — a bordered card: `Eyebrow`/heading "Сравнение моделей" + `<SpecMatrixTable
columns rows caption />`. When absent, output is byte-identical to today (guards single-SKU pages
and every existing product, incl. d-8000). Template change is one prop:
`<SpecsSection groups={p.specGroups} specMatrix={p.specMatrix} />`.

## 7. Per-product content (transcribe verbatim at writing-plans; locks below)

The slice already transcribed most numbers; `/writing-plans` reads each source `.md` in full and
OCRs the spec-sheet screenshots. Locked facts that override/disambiguate:

- **QM-400** (single SKU, flagship): **199 900 ₽** (product page wins over aggregator's "199 990");
  Class-TD; 4-ch mode 8 Ω 4×1200 / 4 Ω 4×2000 / 2 Ω 4×2250 Вт; bridge 8 Ω 2×3800 / 4 Ω 2×4200 Вт;
  483×463×88 мм; 17.3 кг; `badges: ["ФЛАГМАН","EAC"]`; `docs` →
  `https://disk.yandex.ru/d/Q99G953L8Y5okQ`; TechBand internals (`nag-qm400-internal-pcb.jpg`),
  "4 автономных канала = 4 модуля TDS/TDH-20". Dual-mode = two specGroups
  ("Четырёхканальный режим" defaultOpen / "Мостовой режим (bridge)").
- **TD SERIES**: TD-30 70 000 · TD-40 **80 490** · TD-80 110 900 · TD-100 120 900 ₽; `specMatrix`
  columns = the 4 models, rows = power @8/4/2 Ω stereo + bridge, dimensions, weight, **Цена**;
  `docs` → `…/C2VIYuGsBa4doQ`; no software. `badges: ["Class-TD"]`.
- **CX / DSP SERIES**: CX-520 49 900 · CX-540 59 900 ₽; 4×700 Вт (4 Ω); 8-полос. PEQ; 11.9 кг
  (use 11.9, not marketing "10 кг"); `SoftwareSection` (`nag-cx-series-software-main-screen.png`
  hero + `…-routing.png` item, "аналогично D-8000"); `docs` → program `…/QI0coVnIuCc2Lw`;
  `specMatrix` columns CX-520/CX-540. `badges: ["Class-D · DSP"]`.
- **TDS/TDH modules** (series): TDS/TDH-10 41 900 · **TDS-20 44 490 · TDH-20 44 900** ₽ (prose
  values; the spec **table prints 44 900 for the 20s — flag the discrepancy, ship the prose
  numbers, do not invent**); POWERCON AC LINK; 376×132×78 мм; `docs` → `…/oftjOQHMSPobtg`;
  TechBand "единая схемотехника". `specMatrix` columns TDS-10/TDH-10/TDS-20/TDH-20.
- **TDX** (single SKU): **49 900 ₽**; 2×1000 Вт (4 Ω) / 2×650 Вт (8 Ω); DSP 2 вх × 2 вых; RS-485
  daisy-chain; POWERCON; 313×146.5×79 мм; 2.0 кг; software band **omitted** (source mentions
  Windows RS-485 control but ships no usable screenshot). `badges: ["Class-D · DSP"]`.

**OCR normalization (apply, don't invent):** Дэмпинг→Демпинг, Диапозон→Диапазон,
втроенным→встроенным, ">10k Омб"→">10 кОм", "25AI250V"→"25 A / 250 В". Class labels consistent:
`Class-TD` / `Class-D`.

## 8. Category page (`/catalog/amplifiers`)

Server component, static. Clone `app/catalog/processors/page.tsx`:
- `CATEGORY = "Усилители мощности"`, `ORDER = ["qm-400","td-series","cx-series","modules","tdx"]`,
  `FLAGSHIP = "qm-400"` (badge "Флагман", else `p.badges[0]`).
- Lede (humanizer-ru, draft): "Транзисторные усилители мощности NAG: классы TD и D, от
  встраиваемых модулей для активной акустики до флагманского QM-400 на 4 × 2250 Вт."
  → avoid the "от X до Y" ban; rephrase concrete: "Транзисторные усилители мощности NAG. Класс TD
  и класс D: флагман QM-400 (4 × 2250 Вт), серии TD и CX, встраиваемые модули TDS/TDH и TDX."
- `metadata`: title "Усилители мощности · NAG Pro Audio"; OG = QM-400 cover.

## 9. RU copy rules (humanizer-ru + project)

All copy Russian. No em-dash `—` in visible prose (summary/subtitle/body/captions/lede) — use `-`,
comma, colon; em-dash in `alt` strings is accepted (AT metadata, matches existing products). No
«является»/«данный»/«не просто X, а Y»/«от X до Y» (false range). Verbs over nominalizations.
**Fact-lock:** never invent a spec/price/cert; keep units (Вт, Ω, кОм, дБ, мс, мм, кг, A, В) and
labels (Class-TD, Class-D, PEQ, RS-485, POWERCON, SpeakOn, XLR, THD+N, S/N, EAC). Use `×` for
config (`4 × 2250 Вт`).

## 10. Testing

- `productFrontmatterSchema` parses a sample with `specMatrix`; **d-8000.mdx still validates**
  (no specMatrix). 
- `SpecsSection` renders a `SpecMatrixTable` when `specMatrix` present; renders none when absent
  (TDD the new branch).
- `getProductsByCategory("Усилители мощности")` returns the 5 amp slugs.
- Per-product asserts (in `products-catalog.test.ts`): QM-400 199900 + dual-mode group present;
  td-series models[] prices (incl. TD-40 80490) + specMatrix "Цена" row; cx-series software present
  + 2 models; modules TDS-20 44490 / TDH-20 44900; tdx 49900 + no software.
- **Update `catalog-coverage.test.ts`**: slug set now the 11 products
  (`d-4,d-8,d-8000,f-8,f-8-pro,the-rogue,qm-400,td-series,cx-series,modules,tdx`); every product
  loads without throw.
- `npm run build` green; `/catalog/amplifiers` + 5 products prerendered.

## 11. Acceptance criteria

- [ ] `npm run build` green; `generateStaticParams` emits 11 product slugs; `/catalog/amplifiers`
      static.
- [ ] Each new `.mdx` passes schema; d-8000.mdx still valid (no specMatrix regressions).
- [ ] `specMatrix` renders via `SpecMatrixTable` on the 3 series pages; absent → no change on the
      2 single-SKU pages and all prior products.
- [ ] Content true to source incl. the locked caveats (QM-400 199 900, TD-40 80 490, modules
      44 490/44 900 flagged, CX 11.9 кг, EAC only QM-400).
- [ ] Tokens only — zero hardcoded hex in new/changed components; dark bands via `<Surface
      mode="dark">`.
- [ ] All images copied to `public/products/<slug>/`; every `Image`/`Figure` has a real RU `alt`.
- [ ] `SpecMatrixTable` is responsive (its `overflow-x-auto` wrapper) + accessible (`<th>` headers).
- [ ] `generateMetadata`/`metadata` for every product + the category.

## 12. Out of scope

Per-product cross-sell blocks (category page covers cross-nav); legacy-URL redirects; tube/КОНТУР
families (own slices); `/catalog` index; any `ModelMatrix` component (decision B); commerce/forms.
