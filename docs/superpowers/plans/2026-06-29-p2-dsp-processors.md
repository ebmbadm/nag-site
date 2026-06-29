# P2a — DSP processors Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the NAG DSP-processor family — 5 new product pages (F-8 PRO, F-8, D-4, D-8, THE ROGUE) as data-only MDX clones of the D-8000 template, plus a `/catalog/processors` category landing.

**Architecture:** Product pages are pure data: each is one `content/products/<slug>.mdx` rendered by the existing `app/catalog/[slug]/page.tsx` template (which already renders every section conditionally). Net-new code is small: a category landing page, a `getProductsByCategory()` loader helper, an `icon-map` extension, a `ProductCard` type relaxation, and a `Breadcrumb` a11y fix. No schema change (P1 already shipped `partnerLogos`/`docs`/optional price).

**Tech Stack:** Next.js 16 App Router (SSG), React 19, TypeScript strict, Tailwind v4, zod frontmatter validation, Vitest + @testing-library/react.

## Global Constraints

- **Russian only** (`ru-RU`). All user-facing copy is Russian. Prices are integers in roubles.
- **Tokens only, no hardcoded hex** in components. Dark bands via `<Surface mode="dark">`. Type via `text-*`; fonts `font-display`/`font-text`/`font-mono`.
- **Server components by default**; `"use client"` only for interactivity (this slice adds none).
- **`npm run build` must stay green** (it typechecks + lints + prerenders).
- **humanizer-ru on all prose** (summaries, MDX body, feature/tech/software text, category copy): no em-dash `—` (use `-`, comma, or colon); no «является», no «данный», no «не просто X, а Y» / «не только… но и», no «в современном мире»; verbs over nominalizations; concrete. Minus signs in spec values (`-92 dB`) are data, not prose punctuation — use ASCII hyphen-minus `-`.
- **Fact-lock — never invent a spec, price, chip, or figure.** Keep source units (dBu, dB/oct, кОм, Гц, мс, taps) and technical abbreviations (FIR, PEQ, GEQ, AES/EBU, THD+N, SNR, HPF/LPF). Use `×` for config (`4 × 8`).
- **Disambiguation locks:** D-8 sampling = **96 кГц** (source header "192" contradicts its own table+callout "96"). THE ROGUE maker = **D-Factory**, pink-noise generator, total delay **40 мс**. F-8 PRO audio specs come from the source **table** (THD+N -92 dB, SNR 113 dB, Crosstalk 110 dB), not the prose block (which is a copy-paste of F-8's prose).
- **Slugs come from filenames** — do NOT add a `slug` field to frontmatter (`getProduct` injects it).
- Path alias `@/*` → repo root.

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `public/products/{f-8-pro,f-8,d-4,d-8,the-rogue}/*` | product images | 1 |
| `components/ds/breadcrumb.tsx` | gate `aria-current` on last item | 2 |
| `components/ds/__tests__/breadcrumb.test.tsx` | breadcrumb a11y test | 2 |
| `components/product/icon-map.tsx` | + git-branch, plug, usb, monitor, audio-waveform | 2 |
| `content/products/d-8000.mdx` | drop `/catalog` breadcrumb href | 2 |
| `lib/content/products.ts` | `getProductsByCategory()` | 3 |
| `components/ds/product-card.tsx` | `image.width/height` optional | 3 |
| `lib/__tests__/products.test.ts` | loader-helper + card tests | 3 |
| `content/products/f-8-pro.mdx`, `f-8.mdx` | F-series products (data) | 4 |
| `content/products/d-4.mdx`, `d-8.mdx` | DSP BY NAG D-series (data) | 5 |
| `content/products/the-rogue.mdx` | THE ROGUE product (data) | 6 |
| `lib/__tests__/products-catalog.test.ts` | per-product frontmatter assertions | 4,5,6 |
| `app/catalog/processors/page.tsx` | category landing | 7 |
| `docs/MASTER-PLAN.md` | status update | 8 |

---

### Task 1: Copy product images

**Files:**
- Create: `public/products/f-8-pro/*`, `public/products/f-8/*`, `public/products/d-4/*`, `public/products/d-8/*`, `public/products/the-rogue/*`

Source dirs: `/Users/viktor/Documents/kimi/workspace/novikamps/<folder>/images/`. Mapping:
`f8000→f-8-pro`, `f8wifi→f-8`, `dspd4→d-4`, `dspd8→d-8`, `therogue→the-rogue`.

- [ ] **Step 1: Copy each source `images/` dir into the matching public folder**

```bash
cd /Users/viktor/Code/NAG-SITE
for pair in "f8000:f-8-pro" "f8wifi:f-8" "dspd4:d-4" "dspd8:d-8" "therogue:the-rogue"; do
  src="${pair%%:*}"; dst="${pair##*:}"
  mkdir -p "public/products/$dst"
  cp /Users/viktor/Documents/kimi/workspace/novikamps/$src/images/*.{png,jpg,jpeg} "public/products/$dst/" 2>/dev/null
done
```

- [ ] **Step 2: Verify counts (expect 5, 6, 11, 10, 6)**

Run:
```bash
for d in f-8-pro f-8 d-4 d-8 the-rogue; do echo -n "$d: "; ls -1 public/products/$d | wc -l; done
```
Expected: `f-8-pro: 5`, `f-8: 6`, `d-4: 11`, `d-8: 10`, `the-rogue: 6`.

- [ ] **Step 3: Commit**

```bash
git add public/products
git commit -m "feat(p2): copy DSP processor images to public"
```

---

### Task 2: Breadcrumb a11y fix + icon-map + d-8000 breadcrumb

**Files:**
- Modify: `components/ds/breadcrumb.tsx:31-42`
- Test: `components/ds/__tests__/breadcrumb.test.tsx`
- Modify: `components/product/icon-map.tsx`
- Modify: `content/products/d-8000.mdx:7-10`

**Interfaces:**
- Produces: `Breadcrumb` renders `aria-current="page"` only on the last item; an href-less non-last item renders as plain `<span>` text. `FeatureIcon` resolves keys `git-branch`, `plug`, `usb`, `monitor`, `audio-waveform`.

- [ ] **Step 1: Write the failing breadcrumb test**

Create `components/ds/__tests__/breadcrumb.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Breadcrumb } from "../breadcrumb";

describe("Breadcrumb", () => {
  test("only the last item is aria-current=page", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Каталог" },
          { label: "Процессоры", href: "/catalog/processors" },
          { label: "D-8" },
        ]}
      />,
    );
    // href-less, NOT last → must not be marked current (the bug being fixed)
    expect(screen.getByText("Каталог")).not.toHaveAttribute("aria-current");
    // linked middle item is a real link
    expect(screen.getByText("Процессоры").tagName).toBe("A");
    // last item is the current page
    expect(screen.getByText("D-8")).toHaveAttribute("aria-current", "page");
  });
});
```

- [ ] **Step 2: Run it, verify it fails**

Run: `npx vitest run components/ds/__tests__/breadcrumb.test.tsx`
Expected: FAIL — "Каталог" currently receives `aria-current="page"` (every href-less item does).

- [ ] **Step 3: Fix the breadcrumb**

In `components/ds/breadcrumb.tsx`, replace the `item.href ? … : …` block (lines 31-42) with:
```tsx
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:rounded-[var(--radius-xs)]"
              >
                {item.label}
              </Link>
            ) : (
              <span
                aria-current={i === items.length - 1 ? "page" : undefined}
                className={i === items.length - 1 ? "text-text-muted" : undefined}
              >
                {item.label}
              </span>
            )}
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `npx vitest run components/ds/__tests__/breadcrumb.test.tsx`
Expected: PASS.

- [ ] **Step 5: Extend icon-map**

Replace `components/product/icon-map.tsx` entirely with:
```tsx
import {
  Cpu,
  Wifi,
  Activity,
  Layers,
  Star,
  SlidersHorizontal,
  GitBranch,
  Plug,
  Usb,
  Monitor,
  AudioWaveform,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  cpu: Cpu,
  wifi: Wifi,
  activity: Activity,
  layers: Layers,
  star: Star,
  sliders: SlidersHorizontal,
  "git-branch": GitBranch,
  plug: Plug,
  usb: Usb,
  monitor: Monitor,
  "audio-waveform": AudioWaveform,
};

export function FeatureIcon({ name, className }: { name?: string; className?: string }) {
  const Icon = (name && MAP[name]) || Star;
  return <Icon className={className} aria-hidden />;
}
```

- [ ] **Step 6: Drop the `/catalog` href in d-8000 breadcrumb**

In `content/products/d-8000.mdx`, change the breadcrumb block (lines 7-10) to:
```yaml
breadcrumb:
  - { label: "Каталог" }
  - { label: "Процессоры", href: "/catalog/processors" }
  - { label: "D-8000 WI-FI" }
```

- [ ] **Step 7: Commit**

```bash
git add components/ds/breadcrumb.tsx components/ds/__tests__/breadcrumb.test.tsx components/product/icon-map.tsx content/products/d-8000.mdx
git commit -m "feat(p2): breadcrumb aria-current fix, icon-map extension, d-8000 breadcrumb"
```

---

### Task 3: `getProductsByCategory()` loader + `ProductCard` dims optional

**Files:**
- Modify: `lib/content/products.ts`
- Modify: `components/ds/product-card.tsx:11`
- Test: `lib/__tests__/products.test.ts`

**Interfaces:**
- Produces: `getProductsByCategory(category: string): ProductFrontmatter[]` — frontmatter of every product whose `category` equals the argument. `ProductCard`'s `image` prop accepts `{ src; alt; width?; height? }`.
- Consumes: `getProductSlugs()`, `getProduct()` from `lib/content/products.ts`; `ProductFrontmatter` from `lib/content/schema.ts`.

- [ ] **Step 1: Write the failing loader test**

Create `lib/__tests__/products.test.ts`:
```ts
import { describe, expect, test } from "vitest";
import { getProductsByCategory } from "@/lib/content/products";

describe("getProductsByCategory", () => {
  test("returns only products in the category, each tagged correctly", () => {
    const result = getProductsByCategory("Процессоры");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.category === "Процессоры")).toBe(true);
    // D-8000 is a processor and always present
    expect(result.map((p) => p.slug)).toContain("d-8000");
  });

  test("unknown category yields empty array", () => {
    expect(getProductsByCategory("НетТакой")).toEqual([]);
  });
});
```
(Asserts behavior, not a fixed count — count is checked in the final task once all 6 products exist.)

- [ ] **Step 2: Run it, verify it fails**

Run: `npx vitest run lib/__tests__/products.test.ts`
Expected: FAIL — `getProductsByCategory` is not exported.

- [ ] **Step 3: Add the helper**

Append to `lib/content/products.ts`:
```ts
/** Frontmatter of every product in a given category (catalog grids). */
export function getProductsByCategory(category: string): ProductFrontmatter[] {
  return getProductSlugs()
    .map((slug) => getProduct(slug).frontmatter)
    .filter((fm) => fm.category === category);
}
```

- [ ] **Step 4: Run the test, verify it passes**

Run: `npx vitest run lib/__tests__/products.test.ts`
Expected: PASS.

- [ ] **Step 5: Relax `ProductCard` image dims**

In `components/ds/product-card.tsx`, change line 11 from:
```ts
  image: { src: string; alt: string; width: number; height: number };
```
to:
```ts
  image: { src: string; alt: string; width?: number; height?: number };
```
(The component renders with `<Image fill>` and never reads width/height — render is unchanged. This lets gallery media `{src, alt}` map without fabricated dimensions.)

- [ ] **Step 6: Add a ProductCard render test (no dims)**

Append to `lib/__tests__/products.test.ts`:
```ts
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/ds";

describe("ProductCard", () => {
  test("renders with image lacking width/height", () => {
    render(
      <ProductCard
        slug="d-8"
        name="DSP BY NAG D-8"
        eyebrow="DSP BY NAG"
        image={{ src: "/products/d-8/x.jpg", alt: "D-8" }}
        price={{ amount: 39900 }}
      />,
    );
    expect(screen.getByText("DSP BY NAG D-8")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/catalog/d-8");
  });
});
```

- [ ] **Step 7: Run the full file, verify it passes**

Run: `npx vitest run lib/__tests__/products.test.ts`
Expected: PASS (all tests).

- [ ] **Step 8: Commit**

```bash
git add lib/content/products.ts components/ds/product-card.tsx lib/__tests__/products.test.ts
git commit -m "feat(p2): getProductsByCategory loader + optional ProductCard image dims"
```

---

### Task 4: F-series product MDX (F-8 PRO, F-8)

**Files:**
- Create: `content/products/f-8-pro.mdx`
- Create: `content/products/f-8.mdx`
- Test: `lib/__tests__/products-catalog.test.ts`

**Interfaces:**
- Consumes: `productFrontmatterSchema` (validated at build by `getProduct`). No new code.

- [ ] **Step 1: Write `content/products/f-8-pro.mdx`**

```mdx
---
name: "NAG F-8 PRO"
line: "DSP-процессор · Серия NAG F"
subtitle: "Продвинутый процессор 4 × 8 с FIR"
badges: ["FIR", "AES/EBU"]
category: "Процессоры"
breadcrumb:
  - { label: "Каталог" }
  - { label: "Процессоры", href: "/catalog/processors" }
  - { label: "F-8 PRO" }
price:
  amount: 139900
  currency: "₽"
  note: "Без НДС · Гарантия 2 года · EAC"
summary: "Продвинутый цифровой контроллер-корректор 4 × 8 серии NAG F с FIR-фильтрами до 512 taps на каждом входе и выходе, цифровыми входами AES и ЦАП/АЦП экспертного уровня. Свободная маршрутизация, кроссоверы до 48 dB/oct и задержки до 2000 мс."
specChips:
  - "4 вх. XLR"
  - "8 вых. XLR"
  - "512 taps FIR"
  - "AES/EBU"
  - "Ethernet · USB"
  - "SNR 113 dB"
gallery:
  - { src: "/products/f-8-pro/nag-f8pro-front-panel.png", alt: "NAG F-8 PRO — передняя панель", caption: "Передняя панель" }
features:
  eyebrow: "Ключевые преимущества"
  title: "Почему F-8 PRO"
  cards:
    - { icon: "activity", title: "FIR-фильтры 512 taps", text: "До 512 taps на каждом из 4 входов и 8 выходов. Импорт внешних кривых, автокалибровка, окна Kaiser, Nuttall, Hanning, Blackman." }
    - { icon: "git-branch", title: "Свободная маршрутизация", text: "Любые физические входы и выходы, смешение и комбинация каналов до и после FIR. Матрица 4 × 4." }
    - { icon: "sliders", title: "Гибкий DSP", text: "15 полос PEQ на входах, 10 на выходах. Shelf, All-Pass, Phase, Notch, Elliptic, VariQ. Кроссоверы до 48 dB/oct." }
    - { icon: "usb", title: "Ethernet / USB", text: "Прямое подключение к ПК по USB и Ethernet с группировкой нескольких устройств." }
tech:
  eyebrow: "Архитектура"
  title: "DSP и преобразователи экспертного уровня"
  lede: "Низкие искажения и широкий динамический диапазон: THD+N -92 dB, SNR 113 dB, переходное затухание 110 dB."
  cards:
    - { label: "FIR", chip: "512 taps", text: "512 на вход и 512 на выход. Окна Kaiser, Nuttall, Hanning, Blackman." }
    - { label: "Кроссоверы", chip: "3 типа · 48 dB/oct", text: "Крутизна до 48 dB/oct на каждом выходе." }
    - { label: "Задержка", chip: "0-2000 мс", text: "На каждом входе и выходе." }
software:
  eyebrow: "Программное обеспечение"
  title: "Графическая панель управления"
  lede: "Логичная цепочка модулей: NOISE GATE → PEQ-X → DEQ → DELAY → MATRIX1 → FIR → PEQ-X → COMP → LIMIT. Каждый модуль - отдельная иконка с активацией и глубокой настройкой."
  hero: { src: "/products/f-8-pro/nag-f8pro-software-routing.jpg", alt: "Главный экран ПО F-8 PRO — маршрутизация", caption: "Маршрутизация и цепочка обработки" }
  items:
    - { src: "/products/f-8-pro/nag-f8pro-software-eq.jpg", alt: "ПО F-8 PRO — графический эквалайзер", title: "Эквалайзер", text: "До 15 полос PEQ на входах, 10 на выходах. Parametric, Shelf, Allpass, Notch, Elliptic, VariQ." }
    - { src: "/products/f-8-pro/nag-f8pro-software-channel-settings.jpg", alt: "ПО F-8 PRO — настройка каналов", title: "Настройка каналов", text: "Источник, mute, фаза, маршрутизация - независимо по каждому каналу." }
    - { src: "/products/f-8-pro/nag-f8pro-software-compressor.jpg", alt: "ПО F-8 PRO — компрессор и лимитер", title: "Компрессор и лимитер", text: "Threshold, Ratio, Attack, Release, Knee с мгновенной визуализацией." }
specGroups:
  - title: "Аналоговые интерфейсы и уровни"
    defaultOpen: true
    rows:
      - { label: "Аналоговые интерфейсы", value: "4 × XLR F (бал.), 8 × XLR M (бал.)" }
      - { label: "Макс. уровень", value: "+20 dBu" }
      - { label: "Частотный диапазон", value: "20 Гц - 20 кГц (A-wt)" }
      - { label: "Уровень шума", value: "-93 dBu (A-wt)" }
      - { label: "THD+N", value: "-92 dB @ 0 dBu, 1 kHz" }
      - { label: "Динамический диапазон / SNR", value: "113 dB @ 20 dBu, 1 kHz" }
      - { label: "Переходное затухание", value: "110 dB" }
  - title: "Обработка сигнала"
    rows:
      - { label: "FIR-taps", value: "512 на вход / 512 на выход" }
      - { label: "Кроссоверы", value: "3 типа, до 48 dB/oct" }
      - { label: "EQ-полосы", value: "вход - 15, выход - 10" }
      - { label: "Задержка", value: "0 - 2000 мс (вход/выход)" }
      - { label: "Матрица маршрутизации", value: "4 × 4 (любые комбинации вход⇄выход)" }
      - { label: "Пресеты", value: "30, с опцией блокировки" }
  - title: "Питание и габариты"
    rows:
      - { label: "Питание", value: "90 - 245 V AC, 50/60 Hz" }
      - { label: "Энергопотребление", value: "< 20 W" }
      - { label: "Габариты / Вес", value: "481 × 268 × 45 мм, ~3,6 кг" }
---

Процессор **NAG F-8 PRO** - продвинутый цифровой контроллер-корректор 4 × 8 серии NAG F. Поддерживает FIR-фильтры до 512 taps на каждом входе и выходе, цифровые входы AES и ЦАП/АЦП экспертного уровня.

Логично выстроенная цепочка обработки, свободная маршрутизация каналов и встроенный FIR-дизайнер с импортом измерительных кривых и автокалибровкой. Кроссоверы трёх типов с крутизной до 48 dB/oct, задержки до 2000 мс на каждом канале.
```

- [ ] **Step 2: Write `content/products/f-8.mdx`**

```mdx
---
name: "NAG F-8"
line: "DSP-процессор · Серия NAG F"
subtitle: "Процессор 4 × 8 с FIR и Wi-Fi"
badges: ["FIR", "Wi-Fi"]
category: "Процессоры"
breadcrumb:
  - { label: "Каталог" }
  - { label: "Процессоры", href: "/catalog/processors" }
  - { label: "F-8" }
price:
  amount: 79900
  currency: "₽"
  note: "Без НДС · Гарантия 2 года · EAC"
summary: "Цифровой контроллер-корректор 4 × 8 серии NAG F с FIR-фильтрами и управлением по Wi-Fi. DSP ADAU1452 и преобразователи ES9018K2M, поканальный PEQ с переключением IIR↔FIR, FIR-режим до 512 taps, 24 пресета с паролями."
specChips:
  - "4 вх. XLR"
  - "8 вых. XLR"
  - "512 taps FIR"
  - "Wi-Fi · LAN · USB"
  - "ADAU1452 · ES9018K2M"
  - "24 пресета"
gallery:
  - { src: "/products/f-8/nag-f8-front-panel-interface.png", alt: "NAG F-8 — передняя панель и интерфейс", caption: "Передняя панель" }
features:
  eyebrow: "Ключевые преимущества"
  title: "Почему F-8"
  cards:
    - { icon: "wifi", title: "Wi-Fi / Ethernet / USB", text: "Подключение по USB, RS-232/RS-485 и Ethernet с сетевой группировкой. Опциональный Wi-Fi-модуль для беспроводного управления." }
    - { icon: "activity", title: "FIR до 512 taps", text: "До 512 taps на каждый выход, конвертация IIR→FIR, импорт измерительных кривых для авто-EQ и фазовой коррекции." }
    - { icon: "sliders", title: "Гибкий DSP", text: "8 полос PEQ, Shelf, Notch, Band-Pass, All-Pass. Кроссоверы Linkwitz-Riley / Bessel / Butterworth, 12/18/24/48 dB/oct." }
    - { icon: "layers", title: "Память и защита", text: "24 пользовательских пресета, пароль на каждую ячейку и отдельный канал." }
tech:
  eyebrow: "Архитектура"
  title: "Hi-Fi ЦАП и АЦП"
  lede: "Преобразователи ES9018K2M и DSP ADAU1452: THD+N < 0.002 %, SNR ≥ 100 dB, переходное затухание > 88 dB."
  cards:
    - { label: "DSP", chip: "ADAU1452", text: "32-битное ядро обработки." }
    - { label: "ЦАП/АЦП", chip: "ES9018K2M", text: "32-битное преобразование A/D и D/A." }
    - { label: "Задержка", chip: "шаг 21 µs", text: "Независимо на каждом входе и выходе." }
software:
  eyebrow: "Программное обеспечение"
  title: "Управление по входам и выходам"
  lede: "Gains View, маршрутизация с задержкой, поканальный PEQ с переключением IIR↔FIR и FIR-режим до 512 taps."
  hero: { src: "/products/f-8/nag-f8-software-routing-screen.png", alt: "Главный экран ПО F-8 — маршрутизация", caption: "Маршрутизация и источники" }
  items:
    - { src: "/products/f-8/nag-f8-software-matrix-screen.png", alt: "ПО F-8 — матрица маршрутизации", title: "Матрица маршрутизации", text: "Выбор, какие входы идут на какие выходы. Задержка в миллисекундах и метрах." }
    - { src: "/products/f-8/nag-f8-software-eq-screen.png", alt: "ПО F-8 — эквалайзер", title: "PEQ и фильтры", text: "До 8 полос на канал, переключение IIR↔FIR по каждой полосе, АЧХ в реальном времени." }
    - { src: "/products/f-8/nag-f8-software-fir-screen.png", alt: "ПО F-8 — FIR-режим", title: "FIR-режим", text: "До 512 taps, загрузка внешнего FIR-файла, настройка сглаживания, фазы и усиления." }
    - { src: "/products/f-8/nag-f8-software-level-meters.png", alt: "ПО F-8 — индикаторы уровня", title: "Индикаторы и лимитеры", text: "Поканальные индикаторы уровня с лимитерами и отображением перегрузки." }
specGroups:
  - title: "Аудио-интерфейсы и уровни"
    defaultOpen: true
    rows:
      - { label: "Аудио-интерфейсы", value: "4 × XLR Female (бал.), 8 × XLR Male (бал.)" }
      - { label: "Импеданс", value: "вход - 20 kΩ, выход - 100 Ω" }
      - { label: "Макс. уровень входа", value: "≤ +22 dBu" }
      - { label: "Регулировка уровня (вход/выход)", value: "-40 … +12 dB, шаг 0.1 dB" }
      - { label: "Частотный отклик", value: "20 Hz - 20 kHz (-0.5 dB)" }
      - { label: "SNR / Crosstalk", value: "≥ 100 dB @ 0 dBu / > 88 dB @ 1 kHz" }
      - { label: "THD+N", value: "< 0.002 % @ 0 dBu, 1 kHz" }
  - title: "Обработка и DSP"
    rows:
      - { label: "DSP / преобразователи", value: "ADAU1452 (32-bit), ES9018K2M (32-bit A/D и D/A)" }
      - { label: "Выходные фильтры (HPF/LPF)", value: "Linkwitz-Riley, Bessel, Butterworth; 12/18/24/48 dB/oct; 20 Hz-20 kHz, шаг 1 Hz" }
      - { label: "FIR-обработка", value: "3 - 512 taps / канал, IIR→FIR, импорт внешних FIR" }
      - { label: "Задержка", value: "шаг 21 µs (вход и выход)" }
      - { label: "Пресеты", value: "24, индивидуальные пароли и блокировка каналов" }
  - title: "Коммутация, питание, габариты"
    rows:
      - { label: "Коммутация и контроль", value: "USB (plug-n-play), RS-232, RS-485, Ethernet (сетевая группировка), опц. Wi-Fi" }
      - { label: "Питание / потребление", value: "90 - 245 V AC, 50/60 Hz / ≤ 25 W" }
      - { label: "Габариты / Вес", value: "485 × 200 × 45 mm (1U), 4 kg" }
---

Процессор **NAG F-8** - цифровой контроллер-корректор 4 × 8 серии NAG F с FIR-фильтрами и управлением по Wi-Fi.

В основе - DSP ADAU1452 и преобразователи ES9018K2M. Поканальный PEQ с переключением IIR↔FIR, FIR-режим до 512 taps, кроссоверы Linkwitz-Riley, Bessel и Butterworth до 48 dB/oct. 24 пресета с индивидуальными паролями и блокировкой каналов.
```

- [ ] **Step 3: Write per-product assertions**

Create `lib/__tests__/products-catalog.test.ts`:
```ts
import { describe, expect, test } from "vitest";
import { getProduct } from "@/lib/content/products";

describe("F-series products", () => {
  test("f-8-pro: price + config + table-sourced SNR", () => {
    const p = getProduct("f-8-pro").frontmatter;
    expect(p.price?.amount).toBe(139900);
    expect(p.specChips).toContain("AES/EBU");
    const proc = p.specGroups.flatMap((g) => g.rows);
    expect(proc.find((r) => r.label === "Динамический диапазон / SNR")?.value).toContain("113 dB");
  });

  test("f-8: price + chips", () => {
    const p = getProduct("f-8").frontmatter;
    expect(p.price?.amount).toBe(79900);
    expect(p.specChips).toContain("ADAU1452 · ES9018K2M");
  });
});
```

- [ ] **Step 4: Run the tests, verify they pass**

Run: `npx vitest run lib/__tests__/products-catalog.test.ts`
Expected: PASS (both F-series products parse and assertions hold).

- [ ] **Step 5: Commit**

```bash
git add content/products/f-8-pro.mdx content/products/f-8.mdx lib/__tests__/products-catalog.test.ts
git commit -m "feat(p2): F-8 PRO and F-8 product pages"
```

---

### Task 5: DSP BY NAG D-series MDX (D-4, D-8)

**Files:**
- Create: `content/products/d-4.mdx`
- Create: `content/products/d-8.mdx`
- Modify: `lib/__tests__/products-catalog.test.ts`

D-4 and D-8 share one source table (`dspd4.md` / `dspd8.md` are mirror). They differ only in I/O (2×6 vs 4×8) and price (34 900 vs 39 900). Both 96 кГц.

> **FIDELITY FLAG (for final review):** the source prints output impedance as `100 кОм` (`dspd4.md`/`dspd8.md` line 50). The F-8 sister product lists output impedance `100 Ω`, and a 100 кОм output into a 600 Ω min load is physically inconsistent — almost certainly an OCR slip for `100 Ω`. Transcribed verbatim below per fact-lock; surface to the human in the final review to confirm before launch. Do NOT silently change it.

- [ ] **Step 1: Write `content/products/d-4.mdx`**

```mdx
---
name: "DSP BY NAG D-4"
line: "DSP BY NAG"
subtitle: "Контроллер-корректор 2 × 6 · 96 кГц / 32 бит"
badges: ["Трансформаторный БП"]
category: "Процессоры"
breadcrumb:
  - { label: "Каталог" }
  - { label: "Процессоры", href: "/catalog/processors" }
  - { label: "D-4" }
price:
  amount: 34900
  currency: "₽"
  note: "Без НДС · Гарантия 2 года · Трансформаторный БП"
summary: "Простой и надёжный контроллер-корректор 2 × 6 на сигнальном процессоре 32 бит / 96 кГц с 24-битными ЦАП и АЦП. Трансформаторный блок питания, настройка с передней панели и подключение PLUG N PLAY."
specChips:
  - "2 вх. XLR"
  - "6 вых. XLR"
  - "96 кГц / 32 бит"
  - "GEQ 31 + PEQ 10"
  - "USB Type A"
  - "Задержка 1000 мс"
gallery:
  - { src: "/products/d-4/nag-d4-front-panel.jpg", alt: "DSP BY NAG D-4 — передняя панель", caption: "Передняя панель" }
  - { src: "/products/d-4/nag-d4-front-rear-panel.png", alt: "DSP BY NAG D-4 — передняя и задняя панели", caption: "Передняя и задняя панели" }
  - { src: "/products/d-4/nag-d4-pcb-internal.jpg", alt: "DSP BY NAG D-4 — печатная плата", caption: "Внутри: трансформаторный блок питания" }
features:
  eyebrow: "Ключевые преимущества"
  title: "Почему D-4"
  cards:
    - { icon: "plug", title: "Трансформаторный блок питания", text: "Надёжен и неприхотлив даже в сетях низкого качества." }
    - { icon: "monitor", title: "Настройка с передней панели", text: "Качественный экран и мультифункциональный селектор. Большинство параметров - без подключения к компьютеру." }
    - { icon: "usb", title: "PLUG N PLAY", text: "Встроенные драйверы. Достаточно подключить процессор кабелем и открыть приложение." }
    - { icon: "sliders", title: "GEQ 31 + PEQ 10", text: "31-сегментный графический эквалайзер и 10 полос параметрического на входах." }
software:
  eyebrow: "Программное обеспечение"
  title: "Простая панель управления"
  lede: "Коммутация и mute каналов на главном экране, уровни сигнала в реальном времени, NOISE GATE на входах."
  hero: { src: "/products/d-4/nag-d4-software-routing-matrix.png", alt: "Главный экран ПО D-4 — маршрутизация", caption: "Коммутация каналов" }
  items:
    - { src: "/products/d-4/nag-d4-software-channel-overview.png", alt: "ПО D-4 — обзор каналов", title: "Настройка каналов", text: "Переход к параметрам каждого канала с главного экрана." }
    - { src: "/products/d-4/nag-d4-software-eq-graph.png", alt: "ПО D-4 — графический эквалайзер", title: "Эквалайзер", text: "GEQ 31 сегмент и PEQ 10 полос, наглядная коррекция АЧХ." }
    - { src: "/products/d-4/nag-d4-software-channel-copy.png", alt: "ПО D-4 — копирование канала", title: "Копирование настроек", text: "Перенос настроек на другой канал." }
    - { src: "/products/d-4/nag-d4-software-multiple-units.png", alt: "ПО D-4 — несколько устройств", title: "Группа устройств", text: "Управление несколькими процессорами с одного экрана." }
docs:
  - { label: "Скачать ПО (Яндекс.Диск)", href: "https://disk.yandex.ru/d/EDKxSOM4s-4yfg" }
specGroups:
  - title: "Входы и выходы"
    defaultOpen: true
    rows:
      - { label: "Аналоговый вход", value: "2 канала, XLR" }
      - { label: "Импеданс (входной)", value: "симметричный >20 кОм, несимметричный >10 кОм" }
      - { label: "Ослабление синфазного сигнала", value: ">65 dB, 1 кГц" }
      - { label: "Аналоговый выход", value: "6 каналов, XLR" }
      - { label: "Импеданс на выходе", value: "100 кОм" }
      - { label: "Минимальная нагрузка", value: "600 Ом" }
      - { label: "Макс. выходной уровень", value: "+20 dBu при нагрузке 600 Ом" }
  - title: "Сигнал и обработка"
    rows:
      - { label: "Частотный диапазон", value: "±0,5 dB при 20 Гц - 20 кГц" }
      - { label: "Динамический диапазон", value: ">80 dB при 1 кГц" }
      - { label: "Искажения", value: "< 0,01 % @ 1 кГц, 0 dBm" }
      - { label: "SNR", value: ">100 dB" }
      - { label: "Максимальная задержка", value: "500 мс (173 м) на каждом входе и выходе, до 1000 мс суммарно" }
      - { label: "Эквалайзер (вход)", value: "GEQ 31 сегмент + PEQ 10 полос (20 Гц-20 кГц, шаг 1 Гц; Q 0.404-28.8; ±20 dB, шаг 0.1 dB)" }
      - { label: "Эквалайзер (выход)", value: "10 полос PEQ, режимы PEQ, Lo-Shelf, Hi-Shelf" }
      - { label: "Кроссовер", value: "Линквиц-Райли, Бессель, Баттерворт; 12/18/24 dB/oct" }
      - { label: "Компрессор", value: "на каждом выходе; атака 0,3-100 мс, затухание ×2/4/6/8/16/32 от атаки" }
  - title: "Процессор и питание"
    rows:
      - { label: "Сигнальный процессор", value: "96 кГц, 32-битный DSP, 24-битные ЦАП и АЦП" }
      - { label: "Интерфейс управления", value: "USB Type A" }
      - { label: "Потребление", value: "менее 30 W" }
      - { label: "Блок питания", value: "трансформаторный" }
      - { label: "Питание", value: "AC 90-240 В, 50/60 Гц" }
      - { label: "Габариты (Ш×В×Г)", value: "480 × 240 × 45 мм" }
      - { label: "Масса нетто", value: "5,5 кг" }
---

Линейка **DSP BY NAG** - простая и надёжная техника за разумные деньги. Общая черта всех моделей: трансформаторный блок питания, который повышает надёжность даже в сетях низкого качества.

**D-4** - контроллер-корректор 2 × 6 на современном сигнальном процессоре 32 бит / 96 кГц с 24-битными ЦАП и АЦП. Настраивается с передней панели без компьютера, а программа управления ставится по принципу PLUG N PLAY: встроенные драйверы, подключил кабель и работай.
```

- [ ] **Step 2: Write `content/products/d-8.mdx`**

Identical structure to D-4, with these changes: I/O 4 × 8, price 39 900, slug-folder `d-8`, image filenames `nag-d8-*`, last breadcrumb `D-8`, and the input/output channel rows say 4 / 8 channels.

```mdx
---
name: "DSP BY NAG D-8"
line: "DSP BY NAG"
subtitle: "Контроллер-корректор 4 × 8 · 96 кГц / 32 бит"
badges: ["Трансформаторный БП"]
category: "Процессоры"
breadcrumb:
  - { label: "Каталог" }
  - { label: "Процессоры", href: "/catalog/processors" }
  - { label: "D-8" }
price:
  amount: 39900
  currency: "₽"
  note: "Без НДС · Гарантия 2 года · Трансформаторный БП"
summary: "Простой и надёжный контроллер-корректор 4 × 8 на сигнальном процессоре 32 бит / 96 кГц с 24-битными ЦАП и АЦП. Трансформаторный блок питания, настройка с передней панели и подключение PLUG N PLAY."
specChips:
  - "4 вх. XLR"
  - "8 вых. XLR"
  - "96 кГц / 32 бит"
  - "GEQ 31 + PEQ 10"
  - "USB Type A"
  - "Задержка 1000 мс"
gallery:
  - { src: "/products/d-8/nag-d8-front-panel.jpg", alt: "DSP BY NAG D-8 — передняя панель", caption: "Передняя панель" }
  - { src: "/products/d-8/nag-d8-front-rear-panel.png", alt: "DSP BY NAG D-8 — передняя и задняя панели", caption: "Передняя и задняя панели" }
  - { src: "/products/d-8/nag-d8-pcb-internal.jpg", alt: "DSP BY NAG D-8 — печатная плата", caption: "Внутри: трансформаторный блок питания" }
features:
  eyebrow: "Ключевые преимущества"
  title: "Почему D-8"
  cards:
    - { icon: "plug", title: "Трансформаторный блок питания", text: "Надёжен и неприхотлив даже в сетях низкого качества." }
    - { icon: "monitor", title: "Настройка с передней панели", text: "Качественный экран и мультифункциональный селектор. Большинство параметров - без подключения к компьютеру." }
    - { icon: "usb", title: "PLUG N PLAY", text: "Встроенные драйверы. Достаточно подключить процессор кабелем и открыть приложение." }
    - { icon: "sliders", title: "GEQ 31 + PEQ 10", text: "31-сегментный графический эквалайзер и 10 полос параметрического на входах." }
software:
  eyebrow: "Программное обеспечение"
  title: "Простая панель управления"
  lede: "Коммутация и mute каналов на главном экране, уровни сигнала в реальном времени, NOISE GATE на входах."
  hero: { src: "/products/d-8/nag-d8-software-routing-matrix.png", alt: "Главный экран ПО D-8 — маршрутизация", caption: "Коммутация каналов" }
  items:
    - { src: "/products/d-8/nag-d8-software-channel-overview.png", alt: "ПО D-8 — обзор каналов", title: "Настройка каналов", text: "Переход к параметрам каждого канала с главного экрана." }
    - { src: "/products/d-8/nag-d8-software-eq-graph.png", alt: "ПО D-8 — графический эквалайзер", title: "Эквалайзер", text: "GEQ 31 сегмент и PEQ 10 полос, наглядная коррекция АЧХ." }
    - { src: "/products/d-8/nag-d8-software-channel-copy.png", alt: "ПО D-8 — копирование канала", title: "Копирование настроек", text: "Перенос настроек на другой канал." }
    - { src: "/products/d-8/nag-d8-software-multiple-units.png", alt: "ПО D-8 — несколько устройств", title: "Группа устройств", text: "Управление несколькими процессорами с одного экрана." }
docs:
  - { label: "Скачать ПО (Яндекс.Диск)", href: "https://disk.yandex.ru/d/EDKxSOM4s-4yfg" }
specGroups:
  - title: "Входы и выходы"
    defaultOpen: true
    rows:
      - { label: "Аналоговый вход", value: "4 канала, XLR" }
      - { label: "Импеданс (входной)", value: "симметричный >20 кОм, несимметричный >10 кОм" }
      - { label: "Ослабление синфазного сигнала", value: ">65 dB, 1 кГц" }
      - { label: "Аналоговый выход", value: "8 каналов, XLR" }
      - { label: "Импеданс на выходе", value: "100 кОм" }
      - { label: "Минимальная нагрузка", value: "600 Ом" }
      - { label: "Макс. выходной уровень", value: "+20 dBu при нагрузке 600 Ом" }
  - title: "Сигнал и обработка"
    rows:
      - { label: "Частотный диапазон", value: "±0,5 dB при 20 Гц - 20 кГц" }
      - { label: "Динамический диапазон", value: ">80 dB при 1 кГц" }
      - { label: "Искажения", value: "< 0,01 % @ 1 кГц, 0 dBm" }
      - { label: "SNR", value: ">100 dB" }
      - { label: "Максимальная задержка", value: "500 мс (173 м) на каждом входе и выходе, до 1000 мс суммарно" }
      - { label: "Эквалайзер (вход)", value: "GEQ 31 сегмент + PEQ 10 полос (20 Гц-20 кГц, шаг 1 Гц; Q 0.404-28.8; ±20 dB, шаг 0.1 dB)" }
      - { label: "Эквалайзер (выход)", value: "10 полос PEQ, режимы PEQ, Lo-Shelf, Hi-Shelf" }
      - { label: "Кроссовер", value: "Линквиц-Райли, Бессель, Баттерворт; 12/18/24 dB/oct" }
      - { label: "Компрессор", value: "на каждом выходе; атака 0,3-100 мс, затухание ×2/4/6/8/16/32 от атаки" }
  - title: "Процессор и питание"
    rows:
      - { label: "Сигнальный процессор", value: "96 кГц, 32-битный DSP, 24-битные ЦАП и АЦП" }
      - { label: "Интерфейс управления", value: "USB Type A" }
      - { label: "Потребление", value: "менее 30 W" }
      - { label: "Блок питания", value: "трансформаторный" }
      - { label: "Питание", value: "AC 90-240 В, 50/60 Гц" }
      - { label: "Габариты (Ш×В×Г)", value: "480 × 240 × 45 мм" }
      - { label: "Масса нетто", value: "5,5 кг" }
---

Линейка **DSP BY NAG** - простая и надёжная техника за разумные деньги. Общая черта всех моделей: трансформаторный блок питания, который повышает надёжность даже в сетях низкого качества.

**D-8** - контроллер-корректор 4 × 8 на современном сигнальном процессоре 32 бит / 96 кГц с 24-битными ЦАП и АЦП. Настраивается с передней панели без компьютера, а программа управления ставится по принципу PLUG N PLAY: встроенные драйверы, подключил кабель и работай.
```

- [ ] **Step 3: Add D-series assertions (incl. the 96-kHz lock)**

Append to `lib/__tests__/products-catalog.test.ts`:
```ts
describe("DSP BY NAG D-series", () => {
  test("d-4: price + 2×6 config", () => {
    const p = getProduct("d-4").frontmatter;
    expect(p.price?.amount).toBe(34900);
    expect(p.specChips).toContain("2 вх. XLR");
  });

  test("d-8: price + 96 kHz (NOT 192) + docs", () => {
    const p = getProduct("d-8").frontmatter;
    expect(p.price?.amount).toBe(39900);
    const proc = p.specGroups.flatMap((g) => g.rows).find((r) => r.label === "Сигнальный процессор");
    expect(proc?.value).toContain("96 кГц");
    expect(proc?.value).not.toContain("192");
    expect(p.docs?.[0].href).toBe("https://disk.yandex.ru/d/EDKxSOM4s-4yfg");
  });
});
```

- [ ] **Step 4: Run the tests, verify they pass**

Run: `npx vitest run lib/__tests__/products-catalog.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add content/products/d-4.mdx content/products/d-8.mdx lib/__tests__/products-catalog.test.ts
git commit -m "feat(p2): DSP BY NAG D-4 and D-8 product pages"
```

---

### Task 6: THE ROGUE product MDX

**Files:**
- Create: `content/products/the-rogue.mdx`
- Modify: `lib/__tests__/products-catalog.test.ts`

- [ ] **Step 1: Write `content/products/the-rogue.mdx`**

```mdx
---
name: "DSP BY NAG THE ROGUE"
line: "DSP BY NAG"
subtitle: "Бюджетный процессор 2 × 4 · 96 кГц / 32 бит"
badges: ["Трансформаторный БП"]
category: "Процессоры"
breadcrumb:
  - { label: "Каталог" }
  - { label: "Процессоры", href: "/catalog/processors" }
  - { label: "THE ROGUE" }
price:
  amount: 24900
  currency: "₽"
  note: "Без НДС · Гарантия 2 года · Трансформаторный БП"
summary: "Хорошо известный процессор от компании D-Factory: неплохой функционал за низкую цену. Контроллер-корректор 2 × 4 на 96 кГц / 32 бит, 8-полосный PEQ в каждом канале, компрессор, лимитер и встроенный генератор розового шума."
specChips:
  - "2 вх. XLR"
  - "4 вых. XLR"
  - "96 кГц / 32 бит"
  - "8 полос PEQ"
  - "Розовый шум"
  - "USB Type B"
gallery:
  - { src: "/products/the-rogue/nag-therogue-front-panel.jpg", alt: "DSP BY NAG THE ROGUE — передняя панель", caption: "Передняя панель" }
  - { src: "/products/the-rogue/nag-therogue-rear-panel.png", alt: "DSP BY NAG THE ROGUE — задняя панель", caption: "Задняя панель и коммутация" }
features:
  eyebrow: "Ключевые преимущества"
  title: "Почему THE ROGUE"
  cards:
    - { icon: "plug", title: "Трансформаторный блок питания", text: "Надёжен и неприхотлив даже в сетях низкого качества." }
    - { icon: "audio-waveform", title: "Генератор розового шума", text: "Встроенный генератор розового шума на каждый канал с регулировкой уровня." }
    - { icon: "sliders", title: "8 полос PEQ", text: "Параметрический эквалайзер 8 полос в каждом канале, компрессор и лимитер." }
    - { icon: "usb", title: "PLUG N PLAY", text: "Встроенные драйверы. Подключил кабель и работай." }
software:
  eyebrow: "Программное обеспечение"
  title: "Простой и понятный интерфейс"
  lede: "Настройки каждого канала в графике, как в D-8000. Коммутация каналов и подача розового шума на выходы с регулировкой уровня."
  hero: { src: "/products/the-rogue/nag-therogue-software-main-screen.png", alt: "Главный экран ПО THE ROGUE", caption: "Настройки каналов в графике" }
  items:
    - { src: "/products/the-rogue/nag-therogue-software-routing.png", alt: "ПО THE ROGUE — коммутация каналов", title: "Коммутация и розовый шум", text: "Назначение входных групп на выходы, подача розового шума с регулировкой уровня." }
docs:
  - { label: "Скачать ПО (Яндекс.Диск)", href: "https://disk.yandex.ru/d/c553-lrsMrqrLA" }
specGroups:
  - title: "Входы и выходы"
    defaultOpen: true
    rows:
      - { label: "Аналоговый вход", value: "2 канала, XLR" }
      - { label: "Входное сопротивление", value: "10 кОм" }
      - { label: "Номинальный входной сигнал", value: "0,775 В (0 dB)" }
      - { label: "Аналоговый выход", value: "4 канала, XLR" }
      - { label: "Выходное сопротивление", value: "50 Ω (балансный)" }
      - { label: "Макс. выходной сигнал", value: "3 В (+12 dB)" }
  - title: "Сигнал и обработка"
    rows:
      - { label: "Частотный диапазон", value: "20 Гц - 30 кГц ±1 dB" }
      - { label: "Частота дискретизации", value: "96 кГц" }
      - { label: "THD", value: "< 0,01 % @ 20 Гц - 30 кГц" }
      - { label: "Динамический диапазон", value: "110 dB" }
      - { label: "Переходное затухание", value: ">75 dB" }
      - { label: "Задержка", value: "20 мс на каждом канале, до 40 мс суммарно" }
      - { label: "Эквалайзер", value: "8 полос PEQ (20 Гц-20 кГц, шаг 1 Гц; Q 0.404-28.8; -40…+12 dB, шаг 0.1 dB)" }
      - { label: "Кроссовер", value: "Линквиц-Райли, Бессель, Баттерворт; 12/18/24/48 dB/oct" }
      - { label: "Компрессор", value: "порог -20…+20 dB; атака 1/2/5/10/20/50/90 мс; затухание ×2/4/8/16/32 от атаки" }
      - { label: "Генератор розового шума", value: "отдельным каналом на выходы" }
  - title: "Управление и питание"
    rows:
      - { label: "Интерфейс управления", value: "USB Type B" }
      - { label: "Блок питания", value: "трансформаторный" }
      - { label: "Питание", value: "AC 220 В, 50 Гц" }
      - { label: "Габариты (Ш×В×Г)", value: "484 × 44 × 190 мм" }
      - { label: "Масса нетто", value: "1,3 кг" }
---

Линейка **DSP BY NAG** - простая и надёжная техника за разумные деньги, общая черта всех моделей: трансформаторный блок питания.

**THE ROGUE** - хорошо известный процессор от компании D-Factory, неплохой функционал за низкую цену. Контроллер-корректор 2 × 4 на 96 кГц / 32 бит. Задержка, 8-полосный параметрический эквалайзер в каждом канале, компрессор и лимитер. Отдельная фишка - встроенный генератор розового шума на каждый канал, удобно настраивать систему на слух.
```

- [ ] **Step 2: Add THE ROGUE assertions**

Append to `lib/__tests__/products-catalog.test.ts`:
```ts
describe("THE ROGUE", () => {
  test("price + pink noise + 40 ms total delay + USB-B", () => {
    const p = getProduct("the-rogue").frontmatter;
    expect(p.price?.amount).toBe(24900);
    expect(p.specChips).toContain("Розовый шум");
    const rows = p.specGroups.flatMap((g) => g.rows);
    expect(rows.find((r) => r.label === "Задержка")?.value).toContain("40 мс");
    expect(rows.find((r) => r.label === "Интерфейс управления")?.value).toBe("USB Type B");
  });
});
```

- [ ] **Step 3: Run the tests, verify they pass**

Run: `npx vitest run lib/__tests__/products-catalog.test.ts`
Expected: PASS (all product assertions).

- [ ] **Step 4: Commit**

```bash
git add content/products/the-rogue.mdx lib/__tests__/products-catalog.test.ts
git commit -m "feat(p2): THE ROGUE product page"
```

---

### Task 7: Category landing `/catalog/processors`

**Files:**
- Create: `app/catalog/processors/page.tsx`

**Interfaces:**
- Consumes: `getProductsByCategory("Процессоры")` (Task 3); `Container`, `Eyebrow`, `Breadcrumb`, `ProductCard` from `@/components/ds`.

This is a static segment (`processors`) — it takes priority over the dynamic `[slug]` route, so no conflict with `app/catalog/[slug]/page.tsx`.

- [ ] **Step 1: Write the page**

Create `app/catalog/processors/page.tsx`:
```tsx
import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb, ProductCard } from "@/components/ds";
import { getProductsByCategory } from "@/lib/content/products";

const CATEGORY = "Процессоры";
const ORDER = ["f-8-pro", "f-8", "d-8000", "the-rogue", "d-4", "d-8"];
const FLAGSHIP = "d-8000";

const LEDE =
  "Цифровые корректоры-контроллеры акустических систем NAG. Шесть моделей: процессоры серии F с FIR и AES/EBU, флагман D-8000 Wi-Fi и доступная линейка DSP BY NAG с трансформаторным блоком питания.";

export const metadata: Metadata = {
  title: "Процессоры · NAG Pro Audio",
  description: LEDE,
  openGraph: {
    title: "Процессоры · NAG Pro Audio",
    description: LEDE,
    images: ["/products/d-8000/nag-d8000-front-panel.jpg"],
  },
};

export default function ProcessorsPage() {
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
            { label: "Процессоры" },
          ]}
        />

        <header className="mt-8 max-w-prose">
          <Eyebrow accent>NAG Pro Audio</Eyebrow>
          <h1
            className="mt-3 font-display uppercase text-text"
            style={{
              fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))",
              lineHeight: "var(--lh-tight)",
              letterSpacing: "var(--ls-tight)",
            }}
          >
            Процессоры
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
              badge={p.slug === FLAGSHIP ? "Флагман" : p.badges[0]}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
```

- [ ] **Step 2: Build and verify the route prerenders**

Run: `npm run build`
Expected: green build; output lists `/catalog/processors` as a static (prerendered) route alongside the 6 `/catalog/[slug]` pages (`d-4`, `d-8`, `d-8000`, `f-8`, `f-8-pro`, `the-rogue`).

- [ ] **Step 3: Smoke-check links in the built HTML**

Run:
```bash
grep -o 'href="/catalog/[a-z0-9-]*"' .next/server/app/catalog/processors.html | sort -u
```
Expected: lines for `/catalog/f-8-pro`, `/catalog/f-8`, `/catalog/d-8000`, `/catalog/the-rogue`, `/catalog/d-4`, `/catalog/d-8` (no legacy `/f-series`, `/d8000`, `/dspd4`, `/dspd8`, `/therogue`).

- [ ] **Step 4: Commit**

```bash
git add app/catalog/processors/page.tsx
git commit -m "feat(p2): /catalog/processors category landing"
```

---

### Task 8: Final verification + master-plan update

**Files:**
- Create: `lib/__tests__/catalog-coverage.test.ts`
- Modify: `docs/MASTER-PLAN.md:30-36`

- [ ] **Step 1: Write the coverage test (all 6 slugs, category count, load without throw)**

Create `lib/__tests__/catalog-coverage.test.ts`:
```ts
import { describe, expect, test } from "vitest";
import { getProductSlugs, getProduct, getProductsByCategory } from "@/lib/content/products";

describe("catalog coverage", () => {
  test("exactly the six expected product slugs exist", () => {
    expect(new Set(getProductSlugs())).toEqual(
      new Set(["d-4", "d-8", "d-8000", "f-8", "f-8-pro", "the-rogue"]),
    );
  });

  test("every product loads without throwing", () => {
    for (const slug of getProductSlugs()) {
      expect(() => getProduct(slug)).not.toThrow();
    }
  });

  test("all six are in the Процессоры category", () => {
    expect(getProductsByCategory("Процессоры")).toHaveLength(6);
  });
});
```

- [ ] **Step 2: Run the whole test suite**

Run: `npx vitest run`
Expected: PASS — all P1 tests plus the new breadcrumb, products, products-catalog, and catalog-coverage suites.

- [ ] **Step 3: Full build + lint + hex-grep**

Run:
```bash
npm run build
grep -rE '#[0-9a-fA-F]{3,6}' components/ app/catalog/processors/ content/products/ || echo "NO HEX"
```
Expected: green build; hex grep prints `NO HEX` (or only token definitions, never usage).

- [ ] **Step 4: Update the master plan status table**

In `docs/MASTER-PLAN.md`, update the P2 row of the §2 status table. Change the `P2–P7` line so P2 is recorded as done for the processor family:
```markdown
| **P2 — DSP processors** | ✅ Done — 5 product pages (F-8 PRO, F-8, D-4, D-8, THE ROGUE) + `/catalog/processors` landing; `getProductsByCategory` loader; breadcrumb a11y fix. Power-amp / tube / КОНТУР families still pending. |
| P3–P7 | ⏳ Planned — see roadmap + slices. |
```
Also tick the §3 sitemap rows for `f-8-pro`, `f-8`, `d-4`, `d-8`, `the-rogue`, and `/catalog/processors` from `P2` to `✅ P2`.

- [ ] **Step 5: Commit**

```bash
git add lib/__tests__/catalog-coverage.test.ts docs/MASTER-PLAN.md
git commit -m "test(p2): catalog coverage + master-plan status update"
```

---

## Self-Review

**Spec coverage:**
- 5 products → Tasks 4-6 ✓; category page → Task 7 ✓; images → Task 1 ✓; no schema change → confirmed (Global Constraints) ✓; decision A (DRY grid + helper + ProductCard dims) → Tasks 3, 7 ✓; decision B (breadcrumb fix + drop href) → Task 2 ✓; decision C (`docs[]`) → Tasks 5, 6 ✓; icon-map → Task 2 ✓; fidelity locks (D-8 96 kHz, ROGUE 40 ms/D-Factory/pink-noise, F-8 PRO table specs) → Tasks 5, 6, 4 + tests ✓; testing → Tasks 2, 3, 4, 5, 6, 8 ✓; acceptance criteria → Task 8 ✓.

**Placeholder scan:** No TBD/TODO; every MDX is complete; every test has real assertions; every code step shows code. The "FIDELITY FLAG" in Task 5 is an intentional human-review note, not a placeholder (the value is transcribed in full).

**Type consistency:** `getProductsByCategory(category: string): ProductFrontmatter[]` defined in Task 3, consumed in Task 7. `ProductCard` `image` prop relaxed in Task 3, used without width/height in Task 7. Breadcrumb item shape `{label, href?}` matches existing `BreadcrumbItem`. Icon keys used in product MDX (`git-branch`, `plug`, `usb`, `monitor`, `audio-waveform`) all added to the map in Task 2. Slugs used in `ORDER`/tests match the MDX filenames.
