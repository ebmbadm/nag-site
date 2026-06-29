# P2c — Tube amplifiers (NOVIK): design spec

**Date:** 2026-06-29
**Phase:** P2 (third catalog family slice)
**Slice source:** `docs/slices/tube-amplifiers.md`
**Depends on:** P0 (product template), P1 (`price.onRequest` schema + guarded `ProductHero` logos/quick-links), P2a/P2b (category-page pattern, `getProductsByCategory`, `ProductCard` with «По запросу»)

---

## 1. Goal

Ship the NOVIK boutique tube-amplifier family: **4 product pages** (E12, BLACK FIRE, REDBEAR MKX50,
N1202) as data MDX, plus a `/catalog/tubes` category landing. All four are **price-less**
(«Цена по запросу / изготавливается под заказ»), photo-led, prose-light, NOVIK-branded.

## 2. Scope

| # | Route | File | Kind | Source `.md` | Price |
|---|---|---|---|---|---|
| 1 | `/catalog/e12` | `content/products/e12.mdx` | data | `e12/e12.md` | по запросу |
| 2 | `/catalog/black-fire` | `content/products/black-fire.mdx` | data | `black-fire/black-fire.md` | по запросу |
| 3 | `/catalog/redbear` | `content/products/redbear.mdx` | data | `redbear/redbear.md` | по запросу |
| 4 | `/catalog/n1202` | `content/products/n1202.mdx` | data | `n1202/n1202.md` | по запросу |
| 5 | `/catalog/tubes` | `app/catalog/tubes/page.tsx` | new code | `tubes/tubes.md` | grid of 4 |

Sources under `/Users/viktor/Documents/kimi/workspace/novikamps/<folder>/`.

## 3. Decisions (approved)

### A. Defer amber — ship red structural accent + NOVIK branding

The NOVIK tube-glow amber (`--nag-amber-500 #f59e2e`) fails WCAG contrast as text on the light
paper hero (~1.7:1). Making it work needs a deliberate dark-hero treatment (amber on near-black),
which is a real design change. **For P2c: keep the existing light hero + red structural accent**;
NOVIK identity carried by the brand eyebrow («Ламповый усилитель · NOVIK»), the «HI-END»/model
badges, and the chassis photography. **No schema/component accent work.** Amber-on-dark-hero is a
tracked follow-up (own polish slice / P4).

### B. `/catalog/tubes` = category-pattern clone (not a hand-built one-off)

The slice predates the category pattern; use it. Clone `/catalog/amplifiers`:
`getProductsByCategory("Ламповые усилители")` + `ProductCard` grid (which already renders
«По запросу»). Add the source's intro («лишь 4 модели из огромного ряда») and a
«свяжитесь с нами» contact CTA (mailto/tel). `ORDER = ["e12","redbear","black-fire","n1202"]`
(source order on `tubes.md`).

### C. Minor `ProductHero` fix — on-request label

`ProductHero` already branches on `price.onRequest` (renders «Запросить расчёт», no «В корзину»),
but the price-block eyebrow still reads **«Розничная цена»** when `onRequest`. Fix: when
`price?.onRequest`, the eyebrow reads **«Цена по запросу»** (note carries «Изготавливается под
заказ»). One-line conditional; TDD the render.

## 4. What already exists (verified) vs net-new

P1/P2a/P2b already shipped every structural piece the slice asked for:
- `price.onRequest` in `lib/content/schema.ts` ✅ (price optional).
- `ProductHero` branches on `onRequest` → «Запросить расчёт» mailto, no cart ✅; partner logos
  frontmatter-driven + guarded ✅ (no D-8000 hardcode → no 404); quick-links guarded ✅.
- `ProductCard` renders «По запросу» when no amount ✅; `getProductsByCategory` ✅.

**Net-new only:**
| File | Change |
|---|---|
| `components/product/sections.tsx` | `ProductHero` on-request label «Розничная цена» → «Цена по запросу» (TDD) |
| `content/products/{e12,black-fire,redbear,n1202}.mdx` | 4 new product files |
| `app/catalog/tubes/page.tsx` | category landing (clone of amplifiers + intro + contact CTA) |
| `public/products/<slug>/*` | images from each source `images/` dir (5 files) |
| `lib/__tests__/catalog-coverage.test.ts` | **update** slug set 11 → 15; add tubes category count 4 |

**No** schema change, **no** icon-map change (tube pages have no feature cards — hero + prose +
one specs group only).

## 5. ProductHero label fix

Current (`sections.tsx`): the price-block eyebrow is
`{models && minModelPrice.length > 0 ? "Цена от" : "Розничная цена"}`. Change to:
```tsx
{price?.onRequest
  ? "Цена по запросу"
  : models && minModelPrice.length > 0
    ? "Цена от"
    : "Розничная цена"}
```
Everything else in the hero is unchanged. NAG products (amount, no onRequest) → «Розничная цена» +
«В корзину» as before (no regression). Tube products (onRequest) → «Цена по запросу» + note +
«Запросить расчёт».

## 6. Per-product content (transcribe verbatim; RMC→RMS normalized)

All four: `line: "Ламповый усилитель · NOVIK"`, `category: "Ламповые усилители"`,
`price: { onRequest: true, note: "Изготавливается под заказ" }` (N1202 note:
«Изготавливается только под заказ»), breadcrumb Каталог (no href) / Ламповые усилители
(`/catalog/tubes`) / NAME, one `specGroups` entry «Характеристики» `defaultOpen`. No
features/tech/software keys (template omits them).

- **E12** — `badges: ["Самый мощный"]`. 2×200 Вт RMS / 2×480 Вт max; выходные лампы 6× 6П3С-Е или
  6× 5881 (6L6), подбор ≤1%; преамп на канал 1× 6Н2П-ЕВ (12AX7 опция) + 1× 6Н1П-ЕВ (ЕСС81 опция);
  вход 6.3 мм несимметричный, чувств. 0.7 мВ; выход 6.3 мм — 4 Ом (2 гнезда) и 8 Ом на канал;
  без принудительной вентиляции; ресурс без ограничения (кроме ламп). Схемотехника от NOVIK 202.
  1 image.
- **BLACK FIRE** — `badges: ["HI-END"]`. 2×60 Вт RMS / 2×150 Вт max; класс AB; выходные лампы на
  канал «2×5881 (схемотехника 602, выходной каскад 4× 6П6С / 6V6)» — keep BOTH source figures
  (table «2×5881» + prose «4× 6П6С/6V6»), do not pick one; 500×230×170 мм; 12 кг. 1 image.
- **REDBEAR** — `name: "REDBEAR MKX50 / NOVIK MKX50+"`, `subtitle` notes the combo + Gibson design,
  `badges: ["Дизайн Gibson"]`. 50 Вт RMS combo; оконечник 2× 6П3С-Е (5881/6L6 опция); преамп
  6Н2П-ЕВ (12AX7 опция); каналов 1+; 4/8/16 Ом; динамик Celestion G12T-75 (Vintage 30 опция);
  470×540×230 мм; 24 кг. MDX prose explains the режим switch (1 = REDBEAR CAB COMBO, 2 =
  классический NOVIK). 1 image (`redbear-combo-amplifier.jpg`).
- **N1202** — `badges: ["TOP"]`, `subtitle` «Гитарный ламповый топ · 3 канала». 100 Вт RMS;
  оконечник 2× / 4× 6П3С-Е (5881/6L6 опция); преамп 5× 12AX7; каналов 3 (2+); 4/8/16 Ом;
  коммутация каналов реле; петля эффектов последовательно-параллельная с плавной регулировкой;
  монтаж 100% навесной; 700×220×230 мм; 20 кг. `price.note` = «Изготавливается только под заказ».
  MDX prose adds «Возможен глубокий моддинг базовой модели». **2 images** (head-front + internal).

Tube nomenclature stays verbatim Cyrillic: 6П3С-Е, 6П6С (6V6), 6Н2П-ЕВ, 6Н1П-ЕВ, 5881, 6L6, 12AX7,
ЕСС81, класс AB.

## 7. Category page (`/catalog/tubes`)

Server component, static. Clone `app/catalog/amplifiers/page.tsx`:
- `CATEGORY = "Ламповые усилители"`, `ORDER = ["e12","redbear","black-fire","n1202"]`. No flagship;
  card badge = `p.badges[0]`.
- Eyebrow «NOVIK»; H1 «Ламповые усилители».
- Lede (humanizer-ru, no em-dash): «Компания НОВИК за свою историю создала десятки ламповых
  усилителей мощности. Здесь - лишь 4 модели из огромного ряда.»
- A contact row below the grid: «По остальным моделям свяжитесь с нами» + «Запросить модель»
  (mailto `novikamps@mail.ru`) + «Позвонить» (tel `+79219372508`), using `buttonVariants`.
- `metadata`: title «Ламповые усилители · NOVIK»; OG = E12 cover
  (`/products/e12/novik-e12-head-front.png`).

## 8. RU copy rules (humanizer-ru + project)

All copy Russian. No em-dash `—` in visible prose (summary/subtitle/body/captions/lede) — use `-`,
comma, colon; em-dash in `alt` accepted. No «является»/«данный»/«не просто X, а Y»/«от X до Y».
**Fact-lock:** never invent a model/spec/price; keep tube nomenclature + units (Вт, Ом, мВ, мм, кг,
RMS) verbatim. Use `×` for tube counts/power (`2×200 Вт`, `6× 6П3С-Е`). No EAC/Wi-Fi/USB/Burr-Brown
assets (D-8000-specific). Brand is NOVIK, not NAG.

## 9. Testing

- `ProductHero` render: a price-less product (`onRequest`) shows «Цена по запросу» + «Запросить
  расчёт», and NOT «Розничная цена» / «В корзину»; a priced product (amount) still shows
  «Розничная цена» + «В корзину» (no regression). TDD the label change.
- `getProductsByCategory("Ламповые усилители")` returns the 4 tube slugs.
- Per-product asserts (`products-catalog.test.ts`): each tube `price.onRequest === true` and
  `price.amount == null`; N1202 gallery length 2; REDBEAR name contains both MKX50 and MKX50+;
  E12 RMS row «2×200 Вт».
- **Update `catalog-coverage.test.ts`**: slug set now the 15 products (11 prior + `e12`,
  `black-fire`, `redbear`, `n1202`); every product loads without throw.
- `npm run build` green; `/catalog/tubes` + 4 products prerendered.

## 10. Acceptance criteria

- [ ] `npm run build` green; `generateStaticParams` emits 15 product slugs; `/catalog/tubes` static.
- [ ] Each new `.mdx` passes schema; price-less heroes render «Цена по запросу» + «Запросить
      расчёт» / «Позвонить», never «В корзину» or a formatted price. D-8000 unregressed (real price).
- [ ] No 404s: no D-8000 hero logos / `#software` quick-link on tube pages (absent data → not
      rendered).
- [ ] Content true to source: no invented models/specs; tube nomenclature verbatim; RMC→RMS;
      BLACK FIRE keeps both tube figures; REDBEAR dual name + switch; N1202 2-image gallery.
- [ ] Tokens only — zero hardcoded hex; red structural accent (amber deferred). NOVIK brand eyebrow.
- [ ] All images copied to `public/products/<slug>/`; every `Image` has a real RU `alt`.
- [ ] `generateMetadata`/`metadata` for every product + the category.

## 11. Out of scope

Amber accent / dark tube hero (deferred — own follow-up); the rest of the «десятки» tube models
(only 4 shipped, by source design); legacy-URL redirects; КОНТУР family (own slice); boutique
(savers/converters → P3); commerce/forms.
