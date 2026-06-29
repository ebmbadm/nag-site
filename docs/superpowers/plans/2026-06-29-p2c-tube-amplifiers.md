# P2c — Tube amplifiers (NOVIK) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the NOVIK boutique tube-amplifier family — 4 price-less product MDX pages (E12, BLACK FIRE, REDBEAR, N1202) + a `/catalog/tubes` category landing.

**Architecture:** Product pages are data MDX rendered by the existing `app/catalog/[slug]/page.tsx`. `ProductHero` already branches on `price.onRequest` (renders «Запросить расчёт», no cart) and guards logos/quick-links — one tiny label fix is the only component change. Category page clones `/catalog/amplifiers`.

**Tech Stack:** Next.js 16 App Router (SSG), React 19, TS strict, Tailwind v4, zod, Vitest + @testing-library/react.

## Global Constraints

- **Russian only** (`ru-RU`). All four amps are price-less: «Цена по запросу / изготавливается под заказ» — never a formatted price or «В корзину» on tube pages.
- **Brand is NOVIK**, not NAG. Eyebrow line «Ламповый усилитель · NOVIK». No EAC / Wi-Fi / USB / Burr-Brown assets.
- **Defer amber** (decision A): red structural accent stays; no schema/accent/icon-map work.
- **Tokens only, no hardcoded hex.** Server components by default; no new `"use client"`.
- **`npm run build` must stay green** (typecheck + lint + prerender).
- **humanizer-ru on visible prose** (summary/subtitle/body/captions/lede): no em-dash `—` (use `-`, comma, colon); em-dash in image `alt` accepted. No «является»/«данный»/«не просто X, а Y»/«от X до Y».
- **Fact-lock — never invent.** Tube nomenclature verbatim Cyrillic: 6П3С-Е, 6П6С (6V6), 6Н2П-ЕВ, 6Н1П-ЕВ, 5881, 6L6, 12AX7, ЕСС81, класс AB. Normalize source «RMC» → «RMS». Use `×` for counts/power (`2×200 Вт`, `6× 6П3С-Е`).
- **Disambiguation locks:** BLACK FIRE keeps BOTH source tube figures (table «2×5881» + prose «4× 6П6С/6V6») — do not pick one. REDBEAR name carries both «MKX50» and «MKX50+». N1202 `price.note` = «Изготавливается только под заказ» and has a 2-image gallery.
- **Slugs come from filenames** — no `slug` field in frontmatter. Breadcrumb «Каталог» has NO href (matches d-8000/amplifiers).

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `public/products/{e12,black-fire,redbear,n1202}/*` | product images (5 files) | 1 |
| `components/product/sections.tsx` | `ProductHero` on-request label fix | 2 |
| `components/product/__tests__/product-hero.test.tsx` | hero label/CTA branch (TDD) | 2 |
| `content/products/{e12,black-fire,redbear,n1202}.mdx` | 4 product files | 3 |
| `lib/__tests__/products-catalog.test.ts` | per-product asserts (append) | 3 |
| `app/catalog/tubes/page.tsx` | category landing | 4 |
| `lib/__tests__/catalog-coverage.test.ts` | slug set 11→15 + tubes count 4 | 5 |
| `docs/MASTER-PLAN.md` | status update | 5 |

---

### Task 1: Copy product images

**Files:** Create `public/products/{e12,black-fire,redbear,n1202}/*`

- [ ] **Step 1: Copy**

```bash
cd /Users/viktor/Code/NAG-SITE
for pair in "e12:e12" "black-fire:black-fire" "redbear:redbear" "n1202:n1202"; do
  src="${pair%%:*}"; dst="${pair##*:}"
  mkdir -p "public/products/$dst"
  cp /Users/viktor/Documents/kimi/workspace/novikamps/$src/images/* "public/products/$dst/"
done
```

- [ ] **Step 2: Verify counts**

Run:
```bash
for d in e12 black-fire redbear n1202; do echo -n "$d: "; find public/products/$d -type f | wc -l | tr -d ' '; done
```
Expected: `e12: 1`, `black-fire: 1`, `redbear: 1`, `n1202: 2`. If any differ, STOP and report BLOCKED.

- [ ] **Step 3: Confirm exact filenames**

Run: `find public/products/e12 public/products/black-fire public/products/redbear public/products/n1202 -type f | sort`
Expected exactly:
```
public/products/black-fire/novik-black-fire-head-front.png
public/products/e12/novik-e12-head-front.png
public/products/n1202/novik-n1202-head-front.jpg
public/products/n1202/novik-n1202-internal-speakers.jpg
public/products/redbear/redbear-combo-amplifier.jpg
```

- [ ] **Step 4: Commit**

```bash
git add public/products
git commit -m "feat(p2c): copy NOVIK tube-amplifier images to public"
```
(End every commit in this plan with a blank line then `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.)

---

### Task 2: `ProductHero` on-request label fix

**Files:**
- Modify: `components/product/sections.tsx` (the price-block eyebrow inside `ProductHero`)
- Test: `components/product/__tests__/product-hero.test.tsx`

**Interfaces:**
- Produces: no signature change. `ProductHero` price-block eyebrow now reads «Цена по запросу» when `price?.onRequest`, «Цена от» for multi-model, else «Розничная цена».

**Context:** `ProductHero({ product })` already renders, for `price?.onRequest`, a «Запросить расчёт» mailto CTA and suppresses «В корзину» (no change needed there). Only the eyebrow label is wrong today.

- [ ] **Step 1: Write the failing test**

Create `components/product/__tests__/product-hero.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ProductHero } from "../sections";
import type { ProductFrontmatter } from "@/lib/content/schema";

// Gallery uses embla (client carousel); stub it so jsdom renders the hero cleanly.
vi.mock("@/components/ds", async (orig) => ({
  ...(await orig<typeof import("@/components/ds")>()),
  Gallery: () => null,
}));

const base: ProductFrontmatter = {
  slug: "x",
  name: "TEST",
  line: "Ламповый усилитель · NOVIK",
  badges: [],
  category: "Ламповые усилители",
  breadcrumb: [],
  summary: "summary",
  specChips: [],
  gallery: [{ src: "/a.png", alt: "a" }],
  specGroups: [{ title: "Характеристики", rows: [{ label: "Вес", value: "12 кг" }] }],
};

describe("ProductHero price branch", () => {
  test("on-request product shows «Цена по запросу» + «Запросить расчёт», no cart", () => {
    render(
      <ProductHero
        product={{ ...base, price: { onRequest: true, note: "Изготавливается под заказ" } }}
      />,
    );
    expect(screen.getByText("Цена по запросу")).toBeInTheDocument();
    expect(screen.getByText("Запросить расчёт")).toBeInTheDocument();
    expect(screen.queryByText("Розничная цена")).toBeNull();
    expect(screen.queryByText("В корзину")).toBeNull();
  });

  test("priced product still shows «Розничная цена» + «В корзину» (no regression)", () => {
    render(
      <ProductHero product={{ ...base, price: { amount: 100000, currency: "₽" } }} />,
    );
    expect(screen.getByText("Розничная цена")).toBeInTheDocument();
    expect(screen.getByText("В корзину")).toBeInTheDocument();
    expect(screen.queryByText("Цена по запросу")).toBeNull();
  });
});
```

- [ ] **Step 2: Run it, verify the first test fails**

Run: `npx vitest run components/product/__tests__/product-hero.test.tsx`
Expected: FAIL — current eyebrow renders «Розничная цена» for the on-request product, so `getByText("Цена по запросу")` throws. (Second test passes already.)

- [ ] **Step 3: Apply the fix**

In `components/product/sections.tsx`, inside `ProductHero`, find the price-block eyebrow:
```tsx
            <Eyebrow className="block">
              {models && minModelPrice.length > 0 ? "Цена от" : "Розничная цена"}
            </Eyebrow>
```
Replace with:
```tsx
            <Eyebrow className="block">
              {price?.onRequest
                ? "Цена по запросу"
                : models && minModelPrice.length > 0
                  ? "Цена от"
                  : "Розничная цена"}
            </Eyebrow>
```
(`price` is already destructured at the top of `ProductHero`. No other change.)

- [ ] **Step 4: Run the test, verify pass**

Run: `npx vitest run components/product/__tests__/product-hero.test.tsx`
Expected: PASS (both).

- [ ] **Step 5: Build sanity (no regression)**

Run: `npm run build`
Expected: green (d-8000 + all existing products still render their real price block).

- [ ] **Step 6: Commit**

```bash
git add components/product/sections.tsx components/product/__tests__/product-hero.test.tsx
git commit -m "fix(p2c): ProductHero on-request label reads «Цена по запросу»"
```

---

### Task 3: Tube product MDX (E12, BLACK FIRE, REDBEAR, N1202)

**Files:** Create `content/products/{e12,black-fire,redbear,n1202}.mdx`; append asserts to `lib/__tests__/products-catalog.test.ts`.

- [ ] **Step 1: Write `content/products/e12.mdx`**

```mdx
---
name: "NOVIK E12"
line: "Ламповый усилитель · NOVIK"
subtitle: "Самый мощный серийный ламповый усилитель мощности"
badges: ["Самый мощный"]
category: "Ламповые усилители"
breadcrumb:
  - { label: "Каталог" }
  - { label: "Ламповые усилители", href: "/catalog/tubes" }
  - { label: "E12" }
price:
  onRequest: true
  note: "Изготавливается под заказ"
summary: "Самый мощный серийный ламповый усилитель мощности NOVIK для профессионального применения. Унифицированное шасси, общий для двух каналов только силовой трансформатор. Схемотехника от модели NOVIK 202, в каждый выходной канал добавлены 2× 6П3С-Е, выходная мощность до 2×200 Вт RMS (2×480 Вт максимум)."
specChips:
  - "2×200 Вт RMS"
  - "2×480 Вт max"
  - "6× 6П3С-Е / 5881"
  - "преамп 6Н2П-ЕВ"
  - "0.7 мВ"
gallery:
  - { src: "/products/e12/novik-e12-head-front.png", alt: "NOVIK E12 — передняя панель", caption: "NOVIK E12" }
specGroups:
  - title: "Характеристики"
    defaultOpen: true
    rows:
      - { label: "Мощность RMS", value: "2×200 Вт" }
      - { label: "Мощность Max", value: "2×480 Вт" }
      - { label: "Выходные лампы", value: "6× 6П3С-Е или 6× 5881 (6L6)" }
      - { label: "Подбор выходных ламп", value: "разброс не более 1%" }
      - { label: "Лампы преампа (на канал)", value: "1× 6Н2П-ЕВ (12AX7 опция) + 1× 6Н1П-ЕВ (ЕСС81 опция)" }
      - { label: "Входные гнёзда", value: "6.3 мм, несимметричные" }
      - { label: "Входная чувствительность", value: "0.7 мВ" }
      - { label: "Выходные гнёзда", value: "6.3 мм - 4 Ом (2 гнезда) и 8 Ом на канал" }
      - { label: "Охлаждение", value: "без принудительной вентиляции" }
      - { label: "Ресурс", value: "без ограничения (кроме ламп)" }
---

Усилитель **NOVIK E12** - самый мощный серийный ламповый усилитель мощности для профессионального применения. Для модели разработано новое унифицированное шасси; общий для двух каналов только силовой трансформатор.

Схемотехника идёт от модели NOVIK 202, но в каждый выходной канал добавлены 2× 6П3С-Е, и выходная мощность растёт до 2×200 Вт RMS (2×480 Вт максимум). Конструкция шасси и корпуса допускает долгую работу без принудительной вентиляции, а ресурс ограничен только лампами.
```

- [ ] **Step 2: Write `content/products/black-fire.mdx`**

```mdx
---
name: "NOVIK BLACK FIRE"
line: "Ламповый усилитель · NOVIK"
subtitle: "Усилитель Hi-End класса, малая партия"
badges: ["HI-END"]
category: "Ламповые усилители"
breadcrumb:
  - { label: "Каталог" }
  - { label: "Ламповые усилители", href: "/catalog/tubes" }
  - { label: "BLACK FIRE" }
price:
  onRequest: true
  note: "Изготавливается под заказ"
summary: "Усилитель Hi-End класса. По просьбе клиентов NOVIK выпустил небольшую партию усилителей в дизайне и с входными и выходными разъёмами Hi-End типа. Схемотехника от модели 602, с выходными лампами 4× 6П6С (6V6) в каждом канале."
specChips:
  - "2×60 Вт RMS"
  - "2×150 Вт max"
  - "класс AB"
  - "6П6С / 6V6"
  - "12 кг"
gallery:
  - { src: "/products/black-fire/novik-black-fire-head-front.png", alt: "NOVIK BLACK FIRE — передняя панель", caption: "BLACK FIRE · Hi-End" }
specGroups:
  - title: "Характеристики"
    defaultOpen: true
    rows:
      - { label: "Мощность RMS", value: "2×60 Вт" }
      - { label: "Мощность Max", value: "2×150 Вт" }
      - { label: "Выходные лампы на канал", value: "2×5881 (схемотехника 602, выходной каскад 4× 6П6С / 6V6)" }
      - { label: "Режим работы", value: "класс AB" }
      - { label: "Габариты", value: "500×230×170 мм" }
      - { label: "Вес", value: "12 кг" }
---

Усилитель **NOVIK BLACK FIRE** - модель Hi-End класса. По просьбе многих клиентов NOVIK выпустил небольшую партию усилителей в особом дизайне и с входными и выходными разъёмами Hi-End типа.

Схемотехника идёт от модели 602, с выходными лампами 4× 6П6С (6V6) в каждом канале. Режим работы - класс AB.
```

- [ ] **Step 3: Write `content/products/redbear.mdx`**

```mdx
---
name: "REDBEAR MKX50 / NOVIK MKX50+"
line: "Ламповый усилитель · NOVIK"
subtitle: "Гитарный комбо, дизайн Gibson"
badges: ["Дизайн Gibson"]
category: "Ламповые усилители"
breadcrumb:
  - { label: "Каталог" }
  - { label: "Ламповые усилители", href: "/catalog/tubes" }
  - { label: "REDBEAR MKX50" }
price:
  onRequest: true
  note: "Изготавливается под заказ"
summary: "Первый серийный комбоусилитель NOVIK. Необычный внешний дизайн полностью разработан компанией Gibson. Усилитель близок к MKE60, но по просьбе инженеров Gibson получил оригинальное схемное решение под звучание гитар этой марки. Позже NOVIK доработал модель и выпустил вариант NOVIK MKX50+ с переключателем режимов оконечного каскада."
specChips:
  - "50 Вт RMS"
  - "2× 6П3С-Е / 5881"
  - "Celestion G12T-75"
  - "4 / 8 / 16 Ом"
  - "24 кг"
gallery:
  - { src: "/products/redbear/redbear-combo-amplifier.jpg", alt: "REDBEAR MKX50 — комбоусилитель", caption: "REDBEAR MKX50 CAB COMBO" }
specGroups:
  - title: "Характеристики"
    defaultOpen: true
    rows:
      - { label: "Тип", value: "гитарный комбоусилитель" }
      - { label: "Мощность RMS", value: "50 Вт" }
      - { label: "Лампы оконечного каскада", value: "2× 6П3С-Е (5881 или 6L6 опция)" }
      - { label: "Лампы предварительного каскада", value: "6Н2П-ЕВ (12AX7 опция)" }
      - { label: "Число каналов", value: "1+" }
      - { label: "Выходная нагрузка", value: "4 / 8 / 16 Ом" }
      - { label: "Динамик", value: "Celestion G12T-75 (Vintage 30 опция)" }
      - { label: "Габариты", value: "470×540×230 мм" }
      - { label: "Вес", value: "24 кг" }
---

**REDBEAR MKX50 CAB COMBO** - первый серийный комбоусилитель NOVIK. Необычный внешний дизайн полностью разработан компанией Gibson. Усилитель близок к MKE60, но по просьбе инженеров Gibson в нём реализовано оригинальное схемное решение, которое полнее раскрывает звучание гитар этой марки, особенно дорогих моделей.

Позже NOVIK доработал модель и выпустил свой вариант **NOVIK MKX50+** с переключателем режимов оконечного каскада: положение 1 - оригинальный звук REDBEAR CAB COMBO, положение 2 - классический звук NOVIK.
```

- [ ] **Step 4: Write `content/products/n1202.mdx`**

```mdx
---
name: "NOVIK N1202"
line: "Ламповый усилитель · NOVIK"
subtitle: "Гитарный ламповый топ, 3 канала"
badges: ["TOP"]
category: "Ламповые усилители"
breadcrumb:
  - { label: "Каталог" }
  - { label: "Ламповые усилители", href: "/catalog/tubes" }
  - { label: "N1202" }
price:
  onRequest: true
  note: "Изготавливается только под заказ"
summary: "Первый серийный гитарный ламповый усилитель под брендом NOVIK. Усилитель мощности близок к модели NOVIK МКЕ120, преамп 3-канальный (2+), в доводке участвовали немецкие инженеры. Предварительный усилитель собран на 5 лампах 12AX7, монтаж на 100% навесной. Коммутация каналов только на реле, без транзисторных ключей и микросхем. Петля эффектов последовательно-параллельная, с плавной регулировкой входа и выхода."
specChips:
  - "100 Вт RMS"
  - "до 4× 6П3С-Е"
  - "преамп 5× 12AX7"
  - "3 канала (2+)"
  - "реле-коммутация"
gallery:
  - { src: "/products/n1202/novik-n1202-head-front.jpg", alt: "NOVIK N1202 — передняя панель", caption: "N1202 (TOP)" }
  - { src: "/products/n1202/novik-n1202-internal-speakers.jpg", alt: "NOVIK N1202 — внутреннее устройство, навесной монтаж", caption: "Навесной монтаж" }
specGroups:
  - title: "Характеристики"
    defaultOpen: true
    rows:
      - { label: "Мощность RMS", value: "100 Вт" }
      - { label: "Лампы оконечного каскада", value: "2× / 4× 6П3С-Е (5881 или 6L6 опция)" }
      - { label: "Лампы предварительного каскада", value: "5× 12AX7" }
      - { label: "Число каналов", value: "3 (2+)" }
      - { label: "Выходная нагрузка", value: "4 / 8 / 16 Ом" }
      - { label: "Коммутация каналов", value: "реле" }
      - { label: "Петля эффектов", value: "последовательно-параллельная, плавная регулировка входа и выхода" }
      - { label: "Монтаж", value: "100% навесной" }
      - { label: "Габариты", value: "700×220×230 мм" }
      - { label: "Вес", value: "20 кг" }
---

Усилитель **NOVIK N1202** - первый серийный гитарный ламповый усилитель, который NOVIK начал продавать под своим брендом. Усилитель мощности близок к модели NOVIK МКЕ120, а 3-канальный преамп (2+) доводили с участием немецких инженеров.

Предварительный усилитель собран на 5 лампах 12AX7, монтаж на 100% навесной. Коммутация каналов идёт только на реле, без транзисторных ключей и микросхем. Применена переключаемая последовательно-параллельная петля эффектов с плавной регулировкой входа и выхода. Возможен глубокий моддинг базовой модели.
```

- [ ] **Step 5: Append per-product asserts**

Append to `lib/__tests__/products-catalog.test.ts`:
```ts
describe("Tube amps (NOVIK) — по запросу", () => {
  test("all four are price-less (onRequest, no amount)", () => {
    for (const slug of ["e12", "black-fire", "redbear", "n1202"]) {
      const p = getProduct(slug).frontmatter;
      expect(p.price?.onRequest).toBe(true);
      expect(p.price?.amount).toBeUndefined();
      expect(p.line).toBe("Ламповый усилитель · NOVIK");
    }
  });

  test("e12: 2×200 Вт RMS row", () => {
    const rows = getProduct("e12").frontmatter.specGroups.flatMap((g) => g.rows);
    expect(rows.find((r) => r.label === "Мощность RMS")?.value).toBe("2×200 Вт");
  });

  test("redbear: name carries both MKX50 and MKX50+", () => {
    const name = getProduct("redbear").frontmatter.name;
    expect(name).toContain("MKX50");
    expect(name).toContain("MKX50+");
  });

  test("n1202: 2-image gallery + only-on-order note", () => {
    const p = getProduct("n1202").frontmatter;
    expect(p.gallery).toHaveLength(2);
    expect(p.price?.note).toBe("Изготавливается только под заказ");
  });
});
```

- [ ] **Step 6: Run, verify pass**

Run: `npx vitest run lib/__tests__/products-catalog.test.ts`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add content/products/e12.mdx content/products/black-fire.mdx content/products/redbear.mdx content/products/n1202.mdx lib/__tests__/products-catalog.test.ts
git commit -m "feat(p2c): NOVIK tube product pages (E12, BLACK FIRE, REDBEAR, N1202)"
```

---

### Task 4: Category landing `/catalog/tubes`

**Files:** Create `app/catalog/tubes/page.tsx`.

**Interfaces:** Consumes `getProductsByCategory("Ламповые усилители")` and `Container`/`Eyebrow`/`Breadcrumb`/`ProductCard`/`buttonVariants` from `@/components/ds`. Clone of `app/catalog/amplifiers/page.tsx` + a contact CTA row.

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb, ProductCard, buttonVariants } from "@/components/ds";
import { getProductsByCategory } from "@/lib/content/products";

const CATEGORY = "Ламповые усилители";
const ORDER = ["e12", "redbear", "black-fire", "n1202"];
const CONTACT_EMAIL = "novikamps@mail.ru";
const CONTACT_TEL = "+79219372508";

const LEDE =
  "Компания НОВИК за свою историю создала десятки ламповых усилителей мощности. Здесь - лишь 4 модели из огромного ряда.";

export const metadata: Metadata = {
  title: "Ламповые усилители · NOVIK",
  description: LEDE,
  openGraph: {
    title: "Ламповые усилители · NOVIK",
    description: LEDE,
    images: ["/products/e12/novik-e12-head-front.png"],
  },
};

export default function TubesPage() {
  const rank = (slug: string) => {
    const i = ORDER.indexOf(slug);
    return i === -1 ? ORDER.length : i;
  };
  const products = getProductsByCategory(CATEGORY).sort(
    (a, b) => rank(a.slug) - rank(b.slug),
  );

  return (
    <div className="py-6">
      <Container>
        <Breadcrumb
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог" },
            { label: "Ламповые усилители" },
          ]}
        />

        <header className="mt-8 max-w-prose">
          <Eyebrow accent>NOVIK</Eyebrow>
          <h1
            className="mt-3 font-display uppercase text-text"
            style={{
              fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))",
              lineHeight: "var(--lh-tight)",
              letterSpacing: "var(--ls-tight)",
            }}
          >
            Ламповые усилители
          </h1>
          <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
            {LEDE}
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              slug={p.slug}
              name={p.name}
              eyebrow={p.line}
              image={{ src: p.gallery[0].src, alt: p.gallery[0].alt }}
              price={{ amount: p.price?.amount, onRequest: p.price?.onRequest }}
              badge={p.badges[0]}
            />
          ))}
        </div>

        <div className="mt-12 rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8">
          <p className="max-w-prose text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
            По остальным моделям свяжитесь с нами - подберём конфигурацию и рассчитаем срок
            изготовления под заказ.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Ламповые усилители NOVIK")}`}
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              Запросить модель
            </a>
            <a href={`tel:${CONTACT_TEL}`} className={buttonVariants({ variant: "outline", size: "lg" })}>
              Позвонить
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
```

- [ ] **Step 2: Build + verify route + links**

Run: `npm run build`
Expected: green; `/catalog/tubes` prerendered (static); the 4 `/catalog/<slug>` tube routes present.

Run:
```bash
grep -o 'href="/catalog/[a-z0-9-]*"' .next/server/app/catalog/tubes.html | sort -u
```
Expected: `/catalog/e12`, `/catalog/redbear`, `/catalog/black-fire`, `/catalog/n1202` (no legacy `/e12` bare slugs, no `/catalog/tubes` self-loop in the grid).

- [ ] **Step 3: Commit**

```bash
git add app/catalog/tubes/page.tsx
git commit -m "feat(p2c): /catalog/tubes category landing"
```

---

### Task 5: Final verification + master-plan update

**Files:** Modify `lib/__tests__/catalog-coverage.test.ts`; modify `docs/MASTER-PLAN.md`.

- [ ] **Step 1: Update coverage test (11 → 15 slugs + tubes count)**

In `lib/__tests__/catalog-coverage.test.ts`, replace the expected slug set with the 15 products and add the tubes category assertion:
```ts
  test("exactly the fifteen expected product slugs exist", () => {
    expect(new Set(getProductSlugs())).toEqual(
      new Set([
        "d-4", "d-8", "d-8000", "f-8", "f-8-pro", "the-rogue",
        "qm-400", "td-series", "cx-series", "modules", "tdx",
        "e12", "black-fire", "redbear", "n1202",
      ]),
    );
  });
```
And add:
```ts
  test("all four tube amps are in the Ламповые усилители category", () => {
    expect(getProductsByCategory("Ламповые усилители")).toHaveLength(4);
  });
```
(Keep the existing "every product loads without throwing", the processors length-6, and the amplifiers length-5 tests. Update the prior slug-count test's title if it says "eleven".)

- [ ] **Step 2: Run the whole suite**

Run: `npx vitest run`
Expected: PASS — all prior suites + the new hero-label, tube product asserts, and updated coverage.

- [ ] **Step 3: Full build + hex grep**

Run:
```bash
npm run build
grep -rE '#[0-9a-fA-F]{3,6}' components/product/sections.tsx app/catalog/tubes/ content/products/e12.mdx content/products/black-fire.mdx content/products/redbear.mdx content/products/n1202.mdx || echo "NO HEX"
```
Expected: green build (15 products + `/catalog/tubes` + `/catalog/amplifiers` + `/catalog/processors` prerendered); hex grep prints `NO HEX`.

- [ ] **Step 4: Update master plan**

In `docs/MASTER-PLAN.md`:
- §2 status table, update the P2 row to include the tube family:
```markdown
| **P2 — Catalog (DSP + power amps + tube)** | ✅ DSP processors (6 pages + `/catalog/processors`), transistor power amps (5 pages + `/catalog/amplifiers`), NOVIK tube amps (4 pages + `/catalog/tubes`). КОНТУР family still pending. |
```
- §3 sitemap: tick `/catalog/tubes`, `/catalog/e12`, `/catalog/black-fire`, `/catalog/redbear`, `/catalog/n1202` from `P2` to `✅ P2`.

- [ ] **Step 5: Commit**

```bash
git add lib/__tests__/catalog-coverage.test.ts docs/MASTER-PLAN.md
git commit -m "test(p2c): catalog coverage (15 products) + master-plan status"
```

---

## Self-Review

**Spec coverage:** 4 products → Task 3 ✓; category → Task 4 ✓; images → Task 1 ✓; hero on-request label fix → Task 2 (TDD) ✓; decision A (defer amber, red accent, no schema/icon work) honored — no such tasks ✓; decision B (category-pattern clone + intro + contact CTA) → Task 4 ✓; fidelity locks (RMC→RMS, BLACK FIRE both tube figures, REDBEAR dual name + switch in prose, N1202 2-image + only-on-order note) → Task 3 + asserts ✓; coverage 11→15 → Task 5 ✓.

**Placeholder scan:** none. Every MDX complete; tests assert real values; the BLACK FIRE tube reconciliation and N1202 note are explicit.

**Type consistency:** `price: { onRequest: true, note }` matches the existing optional `price` schema (amount omitted). `ProductHero` change is label-only (no signature change). Category page mirrors `app/catalog/amplifiers/page.tsx` exactly (same `getProductsByCategory`/`ProductCard` props: `slug,name,eyebrow,image,price,badge`). `getProductsByCategory("Ламповые усилители")` matches the `category` field in all 4 MDX. `ORDER` slugs match the MDX filenames and the coverage slug set.
