# P2b — Power amplifiers (transistor) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the NAG transistor power-amplifier family — 5 product MDX pages (QM-400, TD SERIES, CX/DSP SERIES, TDS/TDH modules, TDX) + a `/catalog/amplifiers` category landing, with a multi-column `specMatrix` for the three series pages.

**Architecture:** Product pages are data MDX rendered by the existing `app/catalog/[slug]/page.tsx`. One new schema field (`specMatrix`) + one render change (`SpecsSection` renders the existing `SpecMatrixTable` when `specMatrix` is present). Per-model prices fold into a `specMatrix` "Цена" row (no new component). Category page clones `/catalog/processors`.

**Tech Stack:** Next.js 16 App Router (SSG), React 19, TS strict, Tailwind v4, zod, Vitest + @testing-library/react.

## Global Constraints

- **Russian only** (`ru-RU`). Prices integers in roubles.
- **Tokens only, no hardcoded hex.** Dark bands via `<Surface mode="dark">`. Fonts `font-display`/`font-text`/`font-mono`.
- **Server components by default**; no new `"use client"`.
- **`npm run build` must stay green** (typecheck + lint + prerender).
- **humanizer-ru on visible prose** (summary/subtitle/body/captions/lede): no em-dash `—` (use `-`, comma, colon); no «является»/«данный»/«не просто X, а Y»/«от X до Y» (false range). Em-dash inside image `alt` strings is accepted (AT metadata, matches existing products). Verbs over nominalizations.
- **Fact-lock — never invent.** Keep units (Вт, Ω, кОм, дБ, мс, мм, кг, A, В, dB) and labels (Class-TD, Class-D, PEQ, RS-485, POWERCON, SpeakOn, XLR, THD+N, S/N, EAC, LINK). Use `×` for config (`4 × 2250 Вт`), `Ω` for ohms in chips/matrix.
- **Disambiguation locks:** QM-400 price **199 900** (product page; not aggregator 199 990). TD-40 **80 490**. Modules **TDS-20 44 490 / TDH-20 44 900** (prose; table lumps 44 900 — ship prose). CX mass **11.9 кг** (not "10 кг"). TDX output stage = **Class-D** (header + bullets say "D класс"; the spec-table "Класс TD" row is a copy-paste from the modules sheet — sanctioned deviation, like F-8 PRO's table-vs-prose).
- **OCR normalization:** Дэмпинг→Демпинг, Диапозон→Диапазон, втроенным→встроенным, ">10k Омб"→">10 кОм", "25AI250V"→"25 A / 250 В", "15AI250V"→"15 A / 250 В", "484мм*44м*400мм"→"484 × 44 × 400 мм".
- **Slugs come from filenames** — no `slug` field in frontmatter.

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `public/products/{qm-400,td-series,cx-series,modules,tdx}/*` | product images | 1 |
| `lib/content/schema.ts` | add optional `specMatrix` field | 2 |
| `components/product/sections.tsx` | `SpecsSection` renders `SpecMatrixTable` when `specMatrix` present | 2 |
| `app/catalog/[slug]/page.tsx` | pass `specMatrix` to `SpecsSection` | 2 |
| `components/product/icon-map.tsx` | add amp icons (zap, gauge, shield, boxes, cable, server, radio) | 2 |
| `components/product/__tests__/specs-section.test.tsx` | SpecsSection specMatrix branch | 2 |
| `lib/__tests__/schema.test.ts` | specMatrix parses; back-compat | 2 |
| `content/products/qm-400.mdx`, `tdx.mdx` | single-SKU products | 3 |
| `content/products/td-series.mdx`, `modules.mdx` | 4-col series | 4 |
| `content/products/cx-series.mdx` | 2-col series + software | 5 |
| `lib/__tests__/products-catalog.test.ts` | per-product asserts (append) | 3,4,5 |
| `app/catalog/amplifiers/page.tsx` | category landing | 6 |
| `lib/__tests__/catalog-coverage.test.ts` | update slug set 6→11 + amplifiers count | 7 |
| `docs/MASTER-PLAN.md` | status update | 7 |

---

### Task 1: Copy product images

**Files:** Create `public/products/{qm-400,td-series,cx-series,modules,tdx}/*`

Source → dest: `qm400→qm-400`, `td-series→td-series`, `cx-series→cx-series`, `modules→modules`, `tdx→tdx`. (Skip `transistors`/`modules_menu` lineup images — category uses per-product covers, decision C.)

- [ ] **Step 1: Copy**

```bash
cd /Users/viktor/Code/NAG-SITE
for pair in "qm400:qm-400" "td-series:td-series" "cx-series:cx-series" "modules:modules" "tdx:tdx"; do
  src="${pair%%:*}"; dst="${pair##*:}"
  mkdir -p "public/products/$dst"
  cp /Users/viktor/Documents/kimi/workspace/novikamps/$src/images/* "public/products/$dst/"
done
```

- [ ] **Step 2: Verify counts**

Run:
```bash
for d in qm-400 td-series cx-series modules tdx; do echo -n "$d: "; find public/products/$d -type f | wc -l; done
```
Expected: `qm-400: 4`, `td-series: 2`, `cx-series: 6`, `modules: 3`, `tdx: 3`. If any differ, STOP and report.

- [ ] **Step 3: Commit**

```bash
git add public/products
git commit -m "feat(p2b): copy power-amplifier images to public"
```
(End every commit in this plan with a blank line then `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.)

---

### Task 2: `specMatrix` schema + `SpecsSection` render + icon-map

**Files:**
- Modify: `lib/content/schema.ts`
- Modify: `components/product/sections.tsx` (`SpecsSection`)
- Modify: `app/catalog/[slug]/page.tsx:76`
- Modify: `components/product/icon-map.tsx`
- Test: `lib/__tests__/schema.test.ts`, `components/product/__tests__/specs-section.test.tsx`

**Interfaces:**
- Produces: `productFrontmatterSchema` gains optional `specMatrix: { columns: string[]; rows: { label: string; values: (string|null)[] }[]; caption?: string }` (matches `SpecMatrixProps`). `SpecsSection({ groups, specMatrix? })` renders a `SpecMatrixTable` block headed "Сравнение моделей" above the accordion when `specMatrix` is set; unchanged when absent. `FeatureIcon` resolves `zap`, `gauge`, `shield`, `boxes`, `cable`, `server`, `radio`.

- [ ] **Step 1: Write the failing schema test**

Create `lib/__tests__/schema.test.ts`:
```ts
import { describe, expect, test } from "vitest";
import { productFrontmatterSchema } from "@/lib/content/schema";

const base = {
  slug: "x", name: "X", line: "L", category: "C",
  summary: "s", gallery: [{ src: "/a.jpg", alt: "a" }], specGroups: [],
};

describe("productFrontmatterSchema.specMatrix", () => {
  test("parses a product with specMatrix", () => {
    const r = productFrontmatterSchema.safeParse({
      ...base,
      specMatrix: {
        columns: ["A", "B"],
        rows: [{ label: "P", values: ["1", null] }],
        caption: "cmp",
      },
    });
    expect(r.success).toBe(true);
  });

  test("specMatrix is optional (back-compat)", () => {
    expect(productFrontmatterSchema.safeParse(base).success).toBe(true);
  });
});
```

- [ ] **Step 2: Run it, verify it fails**

Run: `npx vitest run lib/__tests__/schema.test.ts`
Expected: FAIL — `specMatrix` not in schema (first test fails: extra key is stripped, `r.data.specMatrix` undefined → actually `safeParse` succeeds with unknown key stripped). To make the test meaningful, assert the parsed value:

Replace the first test's body with:
```ts
    expect(r.success).toBe(true);
    expect(r.success && r.data.specMatrix?.columns).toEqual(["A", "B"]);
```
Now Step 2 fails because `specMatrix` is stripped (undefined).

- [ ] **Step 3: Add the field**

In `lib/content/schema.ts`, after the `docs` field (before `features`), add:
```ts
  // §6 — N-column comparison table for series pages
  specMatrix: z
    .object({
      columns: z.array(z.string()),
      rows: z.array(
        z.object({
          label: z.string(),
          values: z.array(z.string().nullable()),
        }),
      ),
      caption: z.string().optional(),
    })
    .optional(),
```

- [ ] **Step 4: Run schema test, verify pass**

Run: `npx vitest run lib/__tests__/schema.test.ts`
Expected: PASS.

- [ ] **Step 5: Write the failing SpecsSection test**

Create `components/product/__tests__/specs-section.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SpecsSection } from "../sections";

const groups = [{ title: "Общие", rows: [{ label: "THD+N", value: "0.1 %" }] }];

describe("SpecsSection", () => {
  test("renders the SpecMatrixTable when specMatrix is present", () => {
    render(
      <SpecsSection
        groups={groups}
        specMatrix={{
          columns: ["TD-30", "TD-40"],
          rows: [{ label: "4 Ω", values: ["2 × 400 Вт", "2 × 600 Вт"] }],
        }}
      />,
    );
    expect(screen.getByText("Сравнение моделей")).toBeInTheDocument();
    expect(screen.getByText("TD-30")).toBeInTheDocument();
    expect(screen.getByText("2 × 600 Вт")).toBeInTheDocument();
  });

  test("renders no matrix when specMatrix is absent", () => {
    render(<SpecsSection groups={groups} />);
    expect(screen.queryByText("Сравнение моделей")).toBeNull();
  });
});
```

- [ ] **Step 6: Run it, verify it fails**

Run: `npx vitest run components/product/__tests__/specs-section.test.tsx`
Expected: FAIL — `SpecsSection` does not accept/render `specMatrix`.

- [ ] **Step 7: Update `SpecsSection`**

In `components/product/sections.tsx`: add `SpecMatrixTable` to the `@/components/ds` import, and replace the `SpecsSection` function with:
```tsx
export function SpecsSection({
  groups,
  specMatrix,
}: {
  groups: ProductFrontmatter["specGroups"];
  specMatrix?: ProductFrontmatter["specMatrix"];
}) {
  return (
    <section id="specs" className="scroll-mt-20 border-t border-border bg-surface-2 py-16">
      <Container>
        <Eyebrow accent className="mb-3 block">
          Технические данные
        </Eyebrow>
        <h2
          className="mb-8 font-display uppercase text-text"
          style={{ fontSize: "clamp(var(--text-2xl), 4vw, var(--text-3xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
        >
          Характеристики
        </h2>
        {specMatrix ? (
          <div className="mb-8 rounded-[var(--radius-lg)] border border-border bg-bg p-5">
            <h3
              className="mb-4 font-display text-md uppercase text-text"
              style={{ letterSpacing: "var(--ls-tight)" }}
            >
              Сравнение моделей
            </h3>
            <SpecMatrixTable
              columns={specMatrix.columns}
              rows={specMatrix.rows}
              caption={specMatrix.caption}
            />
          </div>
        ) : null}
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg">
          {groups.map((group) => (
            <AccordionItem
              key={group.title}
              summary={group.title}
              defaultOpen={group.defaultOpen}
              className="border-t-0 px-5 [&+*]:border-t [&+*]:border-border"
            >
              <SpecTable rows={group.rows} />
            </AccordionItem>
          ))}
        </div>
      </Container>
    </section>
  );
}
```
Add `SpecMatrixTable` to the existing `@/components/ds` import block at the top of the file.

- [ ] **Step 8: Run SpecsSection test, verify pass**

Run: `npx vitest run components/product/__tests__/specs-section.test.tsx`
Expected: PASS (both).

- [ ] **Step 9: Wire the template**

In `app/catalog/[slug]/page.tsx`, change line 76 from `<SpecsSection groups={p.specGroups} />` to:
```tsx
      <SpecsSection groups={p.specGroups} specMatrix={p.specMatrix} />
```

- [ ] **Step 10: Extend icon-map**

Replace `components/product/icon-map.tsx` imports + MAP to add the amp icons:
```tsx
import {
  Cpu, Wifi, Activity, Layers, Star, SlidersHorizontal, GitBranch, Plug, Usb,
  Monitor, AudioWaveform, Zap, Gauge, Shield, Boxes, Cable, Server, Radio,
  type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  cpu: Cpu, wifi: Wifi, activity: Activity, layers: Layers, star: Star,
  sliders: SlidersHorizontal, "git-branch": GitBranch, plug: Plug, usb: Usb,
  monitor: Monitor, "audio-waveform": AudioWaveform,
  zap: Zap, gauge: Gauge, shield: Shield, boxes: Boxes, cable: Cable,
  server: Server, radio: Radio,
};
```
(Keep the existing `FeatureIcon` function unchanged.)

- [ ] **Step 11: Run both new test files + build**

Run: `npx vitest run lib/__tests__/schema.test.ts components/product/__tests__/specs-section.test.tsx && npm run build`
Expected: tests PASS; build green (d-8000 + all existing products still valid, no specMatrix regressions).

- [ ] **Step 12: Commit**

```bash
git add lib/content/schema.ts components/product/sections.tsx app/catalog/[slug]/page.tsx components/product/icon-map.tsx lib/__tests__/schema.test.ts components/product/__tests__/specs-section.test.tsx
git commit -m "feat(p2b): specMatrix schema + SpecsSection render + amp icons"
```

---

### Task 3: Single-SKU products (QM-400, TDX)

**Files:** Create `content/products/qm-400.mdx`, `content/products/tdx.mdx`; create `lib/__tests__/products-catalog.test.ts` (append if it already exists from P2a — it does; **append**).

- [ ] **Step 1: Write `content/products/qm-400.mdx`**

```mdx
---
name: "NAG QM-400"
line: "Усилитель мощности · NAG Pro Audio"
subtitle: "Флагманский 4-канальный усилитель Class-TD"
badges: ["ФЛАГМАН", "EAC"]
category: "Усилители мощности"
breadcrumb:
  - { label: "Каталог" }
  - { label: "Усилители мощности", href: "/catalog/amplifiers" }
  - { label: "QM-400" }
price:
  amount: 199900
  currency: "₽"
  note: "Без НДС · Гарантия 2 года · EAC"
summary: "Флагманский четырёхканальный усилитель мощности Class-TD. Полная автономность четырёх независимых каналов даёт высокую надёжность; по элементам и сервису QM-400 унифицирован с модулями NAG TDS/TDH - схемотехнически это четыре модуля TDS/TDH-20 в одном корпусе."
specChips:
  - "4 × 2250 Вт (2 Ω)"
  - "Class-TD"
  - "bridge 2 × 4200 Вт"
  - "SpeakOn"
  - "483 × 463 × 88 мм"
  - "17.3 кг"
docs:
  - { label: "Документы (Яндекс.Диск)", href: "https://disk.yandex.ru/d/Q99G953L8Y5okQ" }
gallery:
  - { src: "/products/qm-400/nag-qm400-front-panel.jpg", alt: "NAG QM-400 — передняя панель", caption: "Передняя панель" }
  - { src: "/products/qm-400/nag-qm400-rear-panel.jpg", alt: "NAG QM-400 — задняя панель", caption: "Задняя панель" }
  - { src: "/products/qm-400/nag-qm400-front-rear-comparison.png", alt: "NAG QM-400 — передняя и задняя панели", caption: "Передняя и задняя панели" }
features:
  eyebrow: "Преимущества"
  title: "Почему QM-400"
  cards:
    - { icon: "layers", title: "Четыре автономных канала", text: "Полная автономность 4 независимых каналов - высокая надёжность и безотказность." }
    - { icon: "boxes", title: "Унификация с модулями", text: "Схемотехнически - четыре модуля TDS/TDH-20 в одном корпусе. Единые элементы и сервис со всей линейкой TD/QM." }
    - { icon: "zap", title: "Мощность Class-TD", text: "4 × 2250 Вт на 2 Ω, до 2 × 4200 Вт в мостовом режиме." }
    - { icon: "shield", title: "Полная защита", text: "Short circuit, thermal, RF, DC fault, On/Off muting, active inrush limiting." }
tech:
  eyebrow: "Внутри"
  title: "QM-400 внутри"
  lede: "Четыре автономных канала на единой схемотехнике с модулями TDS/TDH."
  cards:
    - { label: "Каналы", chip: "4 автономных", text: "Каждый канал - отдельный модуль TDS/TDH-20." }
    - { label: "Класс", chip: "Class-TD", text: "Выходной каскад TD-класса." }
    - { label: "Демпинг-фактор", chip: "950", text: "Контроль НЧ на сложной нагрузке." }
  image: { src: "/products/qm-400/nag-qm400-internal-pcb.jpg", alt: "NAG QM-400 — внутреннее устройство, печатная плата", caption: "Четыре автономных канала в одном корпусе" }
specGroups:
  - title: "Четырёхканальный режим"
    defaultOpen: true
    rows:
      - { label: "Мощность 8 Ω (RMS, 1 кГц, 1% THD)", value: "4 × 1200 Вт" }
      - { label: "Мощность 4 Ω (RMS, 1 кГц, 1% THD)", value: "4 × 2000 Вт" }
      - { label: "Мощность 2 Ω (RMS, 1 кГц, 1% THD)", value: "4 × 2250 Вт" }
  - title: "Мостовой режим (bridge)"
    rows:
      - { label: "Мощность 8 Ω (EIA, 1 кГц, 1% THD)", value: "2 × 3800 Вт" }
      - { label: "Мощность 4 Ω (EIA, 1 кГц, 1% THD)", value: "2 × 4200 Вт" }
  - title: "Общие характеристики"
    rows:
      - { label: "Максимальное искажение (8 Ω)", value: "0.1 %" }
      - { label: "Частотный диапазон", value: "20 Гц - 20 кГц, ±0.1 дБ" }
      - { label: "Уровень шума", value: "-99 дБ" }
      - { label: "Демпинг-фактор", value: "950" }
      - { label: "Тип выходного каскада", value: "Class-TD" }
      - { label: "Входная чувствительность", value: "1.0 В · 1.4 В · 2.0 В" }
      - { label: "Входной импеданс", value: ">10 кОм (балансный и небалансный)" }
      - { label: "Выходные коннекторы", value: "SpeakOn (по одному на канал)" }
      - { label: "Входные коннекторы", value: "XLR M/F, пара на канал, режим LINK" }
      - { label: "Защита", value: "short circuit, open circuit, thermal, RF, On/Off muting, DC fault shutdown, active inrush limiting" }
      - { label: "Питание (100-120 В, 50/60 Гц)", value: "25 A / 250 В" }
      - { label: "Питание (200-240 В, 50 Гц)", value: "15 A / 250 В" }
      - { label: "Габариты", value: "483 × 463 × 88 мм" }
      - { label: "Вес (брутто)", value: "17.3 кг" }
---

Усилитель **NAG QM-400** - флагманский четырёхканальный усилитель мощности Class-TD. Полная автономность четырёх независимых каналов даёт высокую надёжность и безотказность, проверенную годами.

QM-400 унифицирован по элементам и сервису с линейкой усилительных модулей NAG TDS/TDH: схемотехнически это четыре модуля TDS/TDH-20 в одном корпусе. В четырёхканальном режиме - 4 × 2250 Вт на 2 Ω, в мостовом - до 2 × 4200 Вт на 4 Ω.
```

- [ ] **Step 2: Write `content/products/tdx.mdx`**

```mdx
---
name: "NAG TDX"
line: "Усилитель мощности · NAG Pro Audio"
subtitle: "Встраиваемый модуль 2 × 1000 Вт Class-D с DSP"
badges: ["Class-D · DSP"]
category: "Усилители мощности"
breadcrumb:
  - { label: "Каталог" }
  - { label: "Усилители мощности", href: "/catalog/amplifiers" }
  - { label: "TDX" }
price:
  amount: 49900
  currency: "₽"
  note: "Без НДС · Гарантия"
summary: "Встраиваемый двухканальный модуль Class-D с DSP для активной акустики. 2 × 1000 Вт на 4 Ω, полностью удалённое управление по RS-485 с последовательным подключением модулей и питание POWERCON (AC LINK)."
specChips:
  - "Class-D"
  - "2 × 1000 Вт (4 Ω)"
  - "DSP 2 вх × 2 вых"
  - "RS-485"
  - "POWERCON"
  - "2.0 кг"
gallery:
  - { src: "/products/tdx/nag-tdx-module-rear-panel.png", alt: "NAG TDX — задняя панель модуля", caption: "Задняя панель" }
  - { src: "/products/tdx/nag-tdx-module-dimensions.jpg", alt: "NAG TDX — чертёж с размерами", caption: "Габаритный чертёж" }
features:
  eyebrow: "Преимущества"
  title: "Почему TDX"
  cards:
    - { icon: "zap", title: "2 × 1000 Вт Class-D", text: "Двухканальный модуль D-класса для активной акустики." }
    - { icon: "radio", title: "Управление по RS-485", text: "Полностью удалённое управление по сети RS-485." }
    - { icon: "layers", title: "Последовательное подключение", text: "Несколько модулей в цепочке с одновременным управлением." }
    - { icon: "plug", title: "Питание POWERCON", text: "POWERCON с последовательным подключением (AC LINK)." }
specGroups:
  - title: "Усилитель"
    defaultOpen: true
    rows:
      - { label: "Мощность 8 Ω", value: "650 + 650 Вт" }
      - { label: "Мощность 4 Ω", value: "1000 + 1000 Вт" }
      - { label: "Вес", value: "2.0 кг" }
      - { label: "Частотный диапазон", value: "20 Гц - 20 кГц, ±0.5 дБ" }
      - { label: "THD+N", value: "0.1 %" }
      - { label: "S/N", value: "-103 дБ" }
      - { label: "Демпинг-фактор", value: ">900" }
      - { label: "Тип выходного каскада", value: "Class-D" }
      - { label: "Входная чувствительность", value: "1.0 В" }
      - { label: "Входной импеданс", value: "10 кОм" }
      - { label: "Входные коннекторы", value: "XLR M/F с LINK" }
      - { label: "Защита", value: "short circuit, open circuit, thermal, RF, On/Off muting, DC fault shutdown, active inrush limiting" }
      - { label: "Питание", value: "AC 200-240 В / 50-60 Гц" }
      - { label: "Размеры", value: "313 × 146.5 × 79 мм" }
  - title: "Контроллер-корректор (DSP)"
    rows:
      - { label: "Конфигурация", value: "2 входа × 2 выхода" }
      - { label: "Задержка (вход)", value: "до 20 мс" }
      - { label: "Эквалайзер (вход)", value: "PEQ, 4 точки" }
      - { label: "Фильтры НЧ/ВЧ (вход)", value: "H-shelf, L-shelf, AllPass1, AllPass2" }
      - { label: "Noise gate", value: "да" }
      - { label: "Задержка (выход)", value: "до 10 мс" }
      - { label: "Эквалайзер (выход)", value: "PEQ, 10 точек" }
      - { label: "Кроссовер", value: "Линквиц-Райли (12-48), Бессель (12-48), Баттерворт (6-48)" }
      - { label: "Свободная коммутация", value: "да" }
      - { label: "Пресеты", value: "загрузка и хранение" }
      - { label: "Управление", value: "RS-485 (Windows), последовательное подключение" }
---

Модуль **NAG TDX** - встраиваемый двухканальный усилитель Class-D с DSP для активной акустики. 2 × 1000 Вт на 4 Ω.

Полностью удалённое управление по сети RS-485, последовательное подключение нескольких модулей с одновременным управлением и питание POWERCON (AC LINK). Встроенный DSP: задержка, параметрический эквалайзер, фильтры и кроссоверы на входе и выходе.
```

- [ ] **Step 3: Append per-product asserts**

Append to `lib/__tests__/products-catalog.test.ts`:
```ts
describe("Power amps — single SKU", () => {
  test("qm-400: price 199900 + dual-mode groups", () => {
    const p = getProduct("qm-400").frontmatter;
    expect(p.price?.amount).toBe(199900);
    const titles = p.specGroups.map((g) => g.title);
    expect(titles).toContain("Четырёхканальный режим");
    expect(titles).toContain("Мостовой режим (bridge)");
  });

  test("tdx: price 49900 + Class-D (not Class-TD)", () => {
    const p = getProduct("tdx").frontmatter;
    expect(p.price?.amount).toBe(49900);
    const stage = p.specGroups.flatMap((g) => g.rows).find((r) => r.label === "Тип выходного каскада");
    expect(stage?.value).toBe("Class-D");
  });
});
```

- [ ] **Step 4: Run, verify pass**

Run: `npx vitest run lib/__tests__/products-catalog.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add content/products/qm-400.mdx content/products/tdx.mdx lib/__tests__/products-catalog.test.ts
git commit -m "feat(p2b): QM-400 and TDX product pages"
```

---

### Task 4: Series products (TD SERIES, TDS/TDH modules) — 4-column matrix

**Files:** Create `content/products/td-series.mdx`, `content/products/modules.mdx`; append to `lib/__tests__/products-catalog.test.ts`.

> **Modules price caveat:** prose gives TDS-10 41 900, TDH-10 41 900, **TDS-20 44 490, TDH-20 44 900**; the spec table lumps both -20s at 44 900. Ship the prose values (below); do not invent.

- [ ] **Step 1: Write `content/products/td-series.mdx`**

```mdx
---
name: "NAG TD SERIES"
line: "Усилитель мощности · NAG Pro Audio"
subtitle: "Двухканальные усилители Class-TD"
badges: ["Class-TD"]
category: "Усилители мощности"
breadcrumb:
  - { label: "Каталог" }
  - { label: "Усилители мощности", href: "/catalog/amplifiers" }
  - { label: "TD SERIES" }
price:
  amount: 70000
  currency: "₽"
  note: "цена за модель - см. таблицу · Гарантия"
summary: "Универсальные двухканальные усилители Class-TD. Серия TD совмещает преимущества TD-класса в выходном каскаде (как у серии QM) с компактностью и лёгкостью корпуса. Каскады развивают заявленную мощность без мостового включения в каждом канале и стабильно работают на нагрузке 2 Ω."
specChips:
  - "Class-TD"
  - "2 канала"
  - "до 2 × 2000 Вт (4 Ω)"
  - "стабильно на 2 Ω"
  - "1U / 1.5U"
docs:
  - { label: "Документы (Яндекс.Диск)", href: "https://disk.yandex.ru/d/C2VIYuGsBa4doQ" }
models:
  - { name: "TD-30", config: "2 × 400 Вт (4 Ω)", price: 70000, note: "1U" }
  - { name: "TD-40", config: "2 × 600 Вт (4 Ω)", price: 80490, note: "1U" }
  - { name: "TD-80", config: "2 × 1400 Вт (4 Ω)", price: 110900, note: "1.5U" }
  - { name: "TD-100", config: "2 × 2000 Вт (4 Ω)", price: 120900, note: "1.5U" }
gallery:
  - { src: "/products/td-series/nag-td-series-front-panel.png", alt: "NAG TD SERIES — передняя панель", caption: "Передняя панель" }
  - { src: "/products/td-series/nag-td-series-specifications-table.jpeg", alt: "NAG TD SERIES — таблица характеристик", caption: "Сравнение моделей" }
features:
  eyebrow: "Преимущества серии"
  title: "Почему TD SERIES"
  cards:
    - { icon: "activity", title: "Выходной каскад TD-класса", text: "Преимущества TD-класса, как в серии QM, в компактном корпусе." }
    - { icon: "gauge", title: "Стабильность на 2 Ω", text: "Каскады развивают мощность без мостового включения в каждом канале - стабильная работа на 2 Ω." }
    - { icon: "layers", title: "Мостовой режим", text: "В моно-режиме (bridge) усилитель уверенно работает на нагрузке 4 Ω." }
    - { icon: "server", title: "Компактные 1U / 1.5U", text: "TD-30/40 - 1U; TD-80/100 - 1.5U: больше мощности в той же стойке." }
specMatrix:
  caption: "Сравнение моделей серии TD"
  columns: ["TD-30", "TD-40", "TD-80", "TD-100"]
  rows:
    - { label: "8 Ω стерео", values: ["2 × 300 Вт", "2 × 400 Вт", "2 × 800 Вт", "2 × 1200 Вт"] }
    - { label: "4 Ω стерео", values: ["2 × 400 Вт", "2 × 600 Вт", "2 × 1400 Вт", "2 × 2000 Вт"] }
    - { label: "2 Ω стерео", values: ["2 × 400 Вт", "2 × 600 Вт", "2 × 1500 Вт", "2 × 2100 Вт"] }
    - { label: "8 Ω bridge", values: ["700 Вт", "1100 Вт", "2800 Вт", "3900 Вт"] }
    - { label: "4 Ω bridge", values: ["800 Вт", "1200 Вт", "3000 Вт", "4100 Вт"] }
    - { label: "Размеры", values: ["483×325×50 (1U)", "483×325×50 (1U)", "483×361×66 (1.5U)", "483×361×66 (1.5U)"] }
    - { label: "Вес", values: ["5 кг", "5 кг", "8.2 кг", "8.5 кг"] }
    - { label: "Цена", values: ["70 000 ₽", "80 490 ₽", "110 900 ₽", "120 900 ₽"] }
specGroups:
  - title: "Общие характеристики"
    defaultOpen: true
    rows:
      - { label: "Частотный диапазон", value: "20 Гц - 20 кГц, ±0.5 дБ" }
      - { label: "THD+N", value: "0.1 %" }
      - { label: "S/N", value: "-105 дБ" }
      - { label: "Демпинг-фактор", value: ">900" }
      - { label: "Тип выходного каскада", value: "Class-TD" }
      - { label: "Входная чувствительность", value: "1.0 В · 1.4 В · 2.0 В" }
      - { label: "Входной импеданс", value: "20 кОм / 10 кОм (балансный / небалансный)" }
      - { label: "Защита", value: "short circuit, open circuit, thermal, RF, On/Off muting, DC fault shutdown, inrush limiting" }
---

Серия **NAG TD SERIES** - универсальные двухканальные усилители Class-TD. Та же схемотехника TD-класса в выходном каскаде, что и в серии QM, но в компактном и лёгком корпусе.

Каскады развивают заявленную мощность без мостового включения в каждом канале, поэтому усилители стабильно работают на нагрузке 2 Ω. В моно-режиме (bridge) усилитель уверенно работает на 4 Ω. TD-30 и TD-40 - в корпусе 1U, TD-80 и TD-100 - 1.5U.
```

- [ ] **Step 2: Write `content/products/modules.mdx`**

```mdx
---
name: "NAG TDS / TDH SERIES"
line: "Усилитель мощности · NAG Pro Audio"
subtitle: "Встраиваемые модули Class-TD для активной акустики"
badges: ["Class-TD"]
category: "Усилители мощности"
breadcrumb:
  - { label: "Каталог" }
  - { label: "Усилители мощности", href: "/catalog/amplifiers" }
  - { label: "TDS / TDH" }
price:
  amount: 41900
  currency: "₽"
  note: "цена за модель - см. таблицу · Гарантия"
summary: "Встраиваемые усилительные модули Class-TD для активной акустики. Мощность до 2200 Вт на 4 Ω, дополнительные LINK-порты для пассивной акустики и питание POWERCON с последовательным подключением (AC LINK). Единая схемотехника со всей линейкой TD/QM."
specChips:
  - "Class-TD"
  - "до 2200 Вт (4 Ω)"
  - "LINK-порты"
  - "POWERCON AC LINK"
  - "376 × 132 × 78 мм"
docs:
  - { label: "Документы (Яндекс.Диск)", href: "https://disk.yandex.ru/d/oftjOQHMSPobtg" }
models:
  - { name: "TDS-10", config: "960 Вт (4 Ω)", price: 41900 }
  - { name: "TDH-10", config: "960 Вт (4 Ω)", price: 41900 }
  - { name: "TDS-20", config: "2200 Вт (4 Ω)", price: 44490 }
  - { name: "TDH-20", config: "2200 Вт (4 Ω)", price: 44900 }
gallery:
  - { src: "/products/modules/nag-module-tds-rear-panel.png", alt: "NAG TDS — задняя панель модуля", caption: "Задняя панель" }
  - { src: "/products/modules/nag-module-tds-tdh-dimensions.png", alt: "NAG TDS / TDH — чертёж с размерами", caption: "Габаритный чертёж" }
features:
  eyebrow: "Преимущества"
  title: "Почему TDS / TDH"
  cards:
    - { icon: "zap", title: "До 2200 Вт на 4 Ω", text: "Выходной каскад Class-TD в компактном встраиваемом модуле." }
    - { icon: "cable", title: "LINK-порты", text: "Дополнительные LINK-порты для подключения пассивной акустики." }
    - { icon: "plug", title: "Питание POWERCON", text: "POWERCON с последовательным подключением устройств (AC LINK)." }
    - { icon: "boxes", title: "Единая схемотехника", text: "Общие элементы и сервис со всей линейкой TD/QM." }
specMatrix:
  caption: "Сравнение модулей TDS / TDH"
  columns: ["TDS-10", "TDH-10", "TDS-20", "TDH-20"]
  rows:
    - { label: "8 Ω", values: ["600 Вт", "600 Вт", "1200 Вт", "1200 Вт"] }
    - { label: "4 Ω", values: ["960 Вт", "960 Вт", "2200 Вт", "2200 Вт"] }
    - { label: "2 Ω", values: ["1000 Вт", "1000 Вт", "2200 Вт", "2200 Вт"] }
    - { label: "Вес", values: ["3.4 кг", "3.4 кг", "3.5 кг", "3.5 кг"] }
    - { label: "Цена", values: ["41 900 ₽", "41 900 ₽", "44 490 ₽", "44 900 ₽"] }
specGroups:
  - title: "Общие характеристики"
    defaultOpen: true
    rows:
      - { label: "Частотный диапазон", value: "20 Гц - 20 кГц, ±0.5 дБ" }
      - { label: "THD+N", value: "0.1 %" }
      - { label: "S/N", value: "-105 дБ" }
      - { label: "Демпинг-фактор", value: ">900" }
      - { label: "Тип выходного каскада", value: "Class-TD" }
      - { label: "Входная чувствительность", value: "1.0 В" }
      - { label: "Входной импеданс", value: "20 кОм / 10 кОм (балансный / небалансный)" }
      - { label: "Входные коннекторы", value: "XLR M/F с LINK" }
      - { label: "Защита", value: "short circuit, open circuit, thermal, RF, On/Off muting, DC fault shutdown, active inrush limiting" }
      - { label: "Питание", value: "AC 200-240 В / 50-60 Гц" }
      - { label: "Размеры", value: "376 × 132 × 78 мм" }
---

Модули **NAG TDS / TDH SERIES** - встраиваемые усилители Class-TD для активной акустики, мощностью до 2200 Вт на 4 Ω.

Дополнительные LINK-порты позволяют подключить пассивную акустику, а питание POWERCON - собрать цепочку устройств (AC LINK). Единая схемотехника со всей линейкой TD/QM упрощает сервис и обслуживание.
```

- [ ] **Step 3: Append series asserts**

Append to `lib/__tests__/products-catalog.test.ts`:
```ts
describe("Power amps — series (matrix)", () => {
  test("td-series: models prices incl TD-40 80490 + matrix Цена row", () => {
    const p = getProduct("td-series").frontmatter;
    expect(p.models?.find((m) => m.name === "TD-40")?.price).toBe(80490);
    const priceRow = p.specMatrix?.rows.find((r) => r.label === "Цена");
    expect(priceRow?.values).toEqual(["70 000 ₽", "80 490 ₽", "110 900 ₽", "120 900 ₽"]);
  });

  test("modules: TDS-20 44490 / TDH-20 44900 (prose, not table 44900)", () => {
    const p = getProduct("modules").frontmatter;
    const byName = Object.fromEntries((p.models ?? []).map((m) => [m.name, m.price]));
    expect(byName["TDS-20"]).toBe(44490);
    expect(byName["TDH-20"]).toBe(44900);
    expect(p.specMatrix?.columns).toEqual(["TDS-10", "TDH-10", "TDS-20", "TDH-20"]);
  });
});
```

- [ ] **Step 4: Run, verify pass**

Run: `npx vitest run lib/__tests__/products-catalog.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add content/products/td-series.mdx content/products/modules.mdx lib/__tests__/products-catalog.test.ts
git commit -m "feat(p2b): TD SERIES and TDS/TDH modules product pages"
```

---

### Task 5: CX / DSP SERIES (2-column matrix + software)

**Files:** Create `content/products/cx-series.mdx`; append to `lib/__tests__/products-catalog.test.ts`.

- [ ] **Step 1: Write `content/products/cx-series.mdx`**

```mdx
---
name: "AMP By NAG CX"
line: "Усилитель мощности · AMP by NAG"
subtitle: "4 × 700 Вт Class-D со встроенным DSP"
badges: ["Class-D · DSP"]
category: "Усилители мощности"
breadcrumb:
  - { label: "Каталог" }
  - { label: "Усилители мощности", href: "/catalog/amplifiers" }
  - { label: "CX" }
price:
  amount: 49900
  currency: "₽"
  note: "цена за модель - см. таблицу · Гарантия"
summary: "Компактные четырёхканальные усилители Class-D со встроенным 32-битным DSP, аналогичным DSP BY NAG THE ROGUE. Корпус 1U: задержка, 8-полосный PEQ в каждом канале, компрессор, лимитер и генератор розового шума. Подключение plug-n-play."
specChips:
  - "4 × 700 Вт (4 Ω)"
  - "Class-D"
  - "DSP 32 бит"
  - "8 полос PEQ"
  - "1U"
  - "11.9 кг"
docs:
  - { label: "Программа (Яндекс.Диск)", href: "https://disk.yandex.ru/d/QI0coVnIuCc2Lw" }
models:
  - { name: "CX-520", config: "4 × 700 Вт · 2 × 4 DSP", price: 49900, note: "2 входа" }
  - { name: "CX-540", config: "4 × 700 Вт · 4 × 4 DSP", price: 59900, note: "4 входа" }
gallery:
  - { src: "/products/cx-series/nag-cx-series-front-panel.jpg", alt: "AMP By NAG CX — передняя панель", caption: "Передняя панель" }
  - { src: "/products/cx-series/nag-cx-series-rear-panel.jpg", alt: "AMP By NAG CX — задняя панель", caption: "Задняя панель" }
features:
  eyebrow: "Преимущества"
  title: "Почему CX"
  cards:
    - { icon: "server", title: "Компактный 1U", text: "Лёгкий четырёхканальный усилитель в корпусе 1U." }
    - { icon: "sliders", title: "8 полос PEQ", text: "Параметрический эквалайзер 8 полос в каждом канале, компрессор и лимитер." }
    - { icon: "audio-waveform", title: "Генератор розового шума", text: "Встроенный генератор розового шума на каждый канал." }
    - { icon: "usb", title: "Plug-n-play", text: "Встроенные драйверы. Подключил кабелем и работай. Задержка до 40 мс." }
software:
  eyebrow: "Программное обеспечение"
  title: "Управление DSP"
  lede: "Графический интерфейс, как у D-8000: настройки каждого канала, коммутация и подача розового шума на выходы."
  hero: { src: "/products/cx-series/nag-cx-series-software-main-screen.png", alt: "ПО AMP By NAG CX — главный экран", caption: "Настройки каналов в графике" }
  items:
    - { src: "/products/cx-series/nag-cx-series-software-routing.png", alt: "ПО AMP By NAG CX — коммутация каналов", title: "Коммутация и розовый шум", text: "Назначение входных групп на выходы, подача розового шума с регулировкой уровня." }
specMatrix:
  caption: "Сравнение моделей CX"
  columns: ["CX-520", "CX-540"]
  rows:
    - { label: "Мощность 4 Ω", values: ["4 × 700 Вт", "4 × 700 Вт"] }
    - { label: "Мощность 8 Ω", values: ["4 × 500 Вт", "4 × 500 Вт"] }
    - { label: "DSP-конфигурация", values: ["2 × 4", "4 × 4"] }
    - { label: "Аналоговые входы", values: ["2 канала XLR", "4 канала XLR"] }
    - { label: "Цена", values: ["49 900 ₽", "59 900 ₽"] }
specGroups:
  - title: "Усилитель"
    defaultOpen: true
    rows:
      - { label: "Мощность 4 Ω (RMS, 1 кГц)", value: "4 × 700 Вт" }
      - { label: "Мощность 8 Ω (RMS, 1 кГц)", value: "4 × 500 Вт" }
      - { label: "Уровень шума (SNR)", value: ">109 дБ" }
      - { label: "Демпинг-фактор", value: ">900" }
      - { label: "Максимальное искажение (8 Ω)", value: "<0.1 %" }
      - { label: "Входной импеданс", value: "30 кОм (балансный)" }
      - { label: "Защита", value: "short circuit, open circuit, thermal, RF, On/Off muting, DC fault shutdown, inrush limiting" }
      - { label: "Питание", value: "AC 220 В, 50 Гц" }
      - { label: "Габариты", value: "484 × 44 × 400 мм" }
      - { label: "Масса нетто", value: "11.9 кг" }
  - title: "Контроллер-корректор (DSP)"
    rows:
      - { label: "Аналоговый вход", value: "CX-520 - 2 канала XLR; CX-540 - 4 канала XLR" }
      - { label: "Входное сопротивление", value: "10 кОм" }
      - { label: "Номинальный входной сигнал", value: "0,775 В (0 dB)" }
      - { label: "Аналоговый выход", value: "4 канала" }
      - { label: "Выходное сопротивление", value: "50 Ω (балансный)" }
      - { label: "Частотный диапазон", value: "20 Гц - 30 кГц, ±1 dB" }
      - { label: "Частота дискретизации", value: "96 кГц" }
      - { label: "Динамический диапазон", value: "110 dB" }
      - { label: "Переходное затухание", value: ">75 dB" }
      - { label: "Задержка", value: "20 мс на канал, до 40 мс суммарно" }
      - { label: "Интерфейс управления", value: "USB Type B" }
      - { label: "Эквалайзер", value: "8 полос PEQ (20 Гц-20 кГц, шаг 1 Гц; Q 0.404-28.8; -40…+12 dB, шаг 0.1 dB)" }
      - { label: "Кроссовер", value: "Линквиц-Райли, Бессель, Баттерворт; 12/18/24/48 dB/oct" }
      - { label: "Компрессор", value: "порог -20…+20 dB; атака 1/2/5/10/20/50/90 мс; затухание ×2/4/8/16/32" }
      - { label: "Генератор розового шума", value: "отдельным каналом на выходы" }
---

Усилители **AMP By NAG CX (DSP SERIES)** - компактные четырёхканальные усилители Class-D со встроенным 32-битным DSP, аналогичным DSP BY NAG THE ROGUE.

Корпус 1U: задержка, 8-полосный параметрический эквалайзер в каждом канале, компрессор, лимитер и генератор розового шума. Подключение plug-n-play - встроенные драйверы, подключил кабелем и работай. CX-520 принимает 2 входных канала (2 × 4 DSP), CX-540 - 4 (4 × 4 DSP).
```

- [ ] **Step 2: Append CX asserts**

Append to `lib/__tests__/products-catalog.test.ts`:
```ts
describe("Power amps — CX", () => {
  test("cx-series: 2 models, software present, 11.9 кг", () => {
    const p = getProduct("cx-series").frontmatter;
    expect(p.models?.map((m) => m.name)).toEqual(["CX-520", "CX-540"]);
    expect(p.software).toBeTruthy();
    expect(p.docs?.[0].href).toBe("https://disk.yandex.ru/d/QI0coVnIuCc2Lw");
    const mass = p.specGroups.flatMap((g) => g.rows).find((r) => r.label === "Масса нетто");
    expect(mass?.value).toBe("11.9 кг");
  });
});
```

- [ ] **Step 3: Run, verify pass**

Run: `npx vitest run lib/__tests__/products-catalog.test.ts`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add content/products/cx-series.mdx lib/__tests__/products-catalog.test.ts
git commit -m "feat(p2b): AMP By NAG CX (DSP SERIES) product page"
```

---

### Task 6: Category landing `/catalog/amplifiers`

**Files:** Create `app/catalog/amplifiers/page.tsx`.

**Interfaces:** Consumes `getProductsByCategory("Усилители мощности")` and `Container`/`Eyebrow`/`Breadcrumb`/`ProductCard` from `@/components/ds`. Clone of `app/catalog/processors/page.tsx`.

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb, ProductCard } from "@/components/ds";
import { getProductsByCategory } from "@/lib/content/products";

const CATEGORY = "Усилители мощности";
const ORDER = ["qm-400", "td-series", "cx-series", "modules", "tdx"];
const FLAGSHIP = "qm-400";

const LEDE =
  "Транзисторные усилители мощности NAG. Класс TD и класс D: флагман QM-400 (4 × 2250 Вт), серии TD и CX, встраиваемые модули TDS/TDH и TDX.";

export const metadata: Metadata = {
  title: "Усилители мощности · NAG Pro Audio",
  description: LEDE,
  openGraph: {
    title: "Усилители мощности · NAG Pro Audio",
    description: LEDE,
    images: ["/products/qm-400/nag-qm400-front-panel.jpg"],
  },
};

export default function AmplifiersPage() {
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
            { label: "Усилители мощности" },
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
            Усилители мощности
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

- [ ] **Step 2: Build + verify route + links**

Run: `npm run build`
Expected: green; `/catalog/amplifiers` prerendered (static); the 5 `/catalog/<slug>` amp routes present.

Run:
```bash
grep -o 'href="/catalog/[a-z0-9-]*"' .next/server/app/catalog/amplifiers.html | sort -u
```
Expected: `/catalog/qm-400`, `/catalog/td-series`, `/catalog/cx-series`, `/catalog/modules`, `/catalog/tdx` (no legacy `/qm400`, `/transistors`, …).

- [ ] **Step 3: Commit**

```bash
git add app/catalog/amplifiers/page.tsx
git commit -m "feat(p2b): /catalog/amplifiers category landing"
```

---

### Task 7: Final verification + master-plan update

**Files:** Modify `lib/__tests__/catalog-coverage.test.ts`; modify `docs/MASTER-PLAN.md`.

- [ ] **Step 1: Update coverage test (6 → 11 slugs + amplifiers count)**

In `lib/__tests__/catalog-coverage.test.ts`, replace the expected slug set and add the amplifiers category assertion:
```ts
  test("exactly the eleven expected product slugs exist", () => {
    expect(new Set(getProductSlugs())).toEqual(
      new Set([
        "d-4", "d-8", "d-8000", "f-8", "f-8-pro", "the-rogue",
        "qm-400", "td-series", "cx-series", "modules", "tdx",
      ]),
    );
  });
```
And add:
```ts
  test("all five amplifiers are in the Усилители мощности category", () => {
    expect(getProductsByCategory("Усилители мощности")).toHaveLength(5);
  });
```
(Keep the existing "every product loads without throwing" test — it now covers 11. Keep the processors length-6 test as-is.)

- [ ] **Step 2: Run the whole suite**

Run: `npx vitest run`
Expected: PASS — all prior suites + schema, specs-section, new product asserts, updated coverage.

- [ ] **Step 3: Full build + lint + hex grep**

Run:
```bash
npm run build
grep -rE '#[0-9a-fA-F]{3,6}' components/product/ app/catalog/amplifiers/ content/products/qm-400.mdx content/products/td-series.mdx content/products/cx-series.mdx content/products/modules.mdx content/products/tdx.mdx || echo "NO HEX"
```
Expected: green build (11 products + `/catalog/amplifiers` + `/catalog/processors` prerendered); hex grep prints `NO HEX`.

- [ ] **Step 4: Update master plan**

In `docs/MASTER-PLAN.md`:
- §2 status table, replace the P2 row with one reflecting both families done so far:
```markdown
| **P2 — Catalog (DSP + power amps)** | ✅ DSP processors (6 pages + `/catalog/processors`) and transistor power amps (5 pages + `/catalog/amplifiers`, `specMatrix` series tables). Tube / КОНТУР families still pending. |
```
- §3 sitemap: tick `/catalog/amplifiers`, `/catalog/qm-400`, `/catalog/td-series`, `/catalog/cx-series`, `/catalog/modules`, `/catalog/tdx` from `P2` to `✅ P2`.

- [ ] **Step 5: Commit**

```bash
git add lib/__tests__/catalog-coverage.test.ts docs/MASTER-PLAN.md
git commit -m "test(p2b): catalog coverage (11 products) + master-plan status"
```

---

## Self-Review

**Spec coverage:** 5 products → Tasks 3-5 ✓; category → Task 6 ✓; images → Task 1 ✓; `specMatrix` schema+render+icons → Task 2 ✓; decisions A (one page/series) ✓, B (price row in specMatrix, no ModelMatrix) ✓, C (flat grid) ✓; fidelity locks (QM-400 199 900, TD-40 80 490, modules 44 490/44 900, CX 11.9 кг, TDX Class-D) → Tasks 3-5 + tests ✓; coverage update → Task 7 ✓.

**Placeholder scan:** none. Every MDX complete; every test has real assertions; the modules price caveat and TDX Class-D deviation are documented decisions with the exact shipped values present.

**Type consistency:** `specMatrix` schema shape == `SpecMatrixProps` (`columns: string[]`, `rows: {label, values:(string|null)[]}`, `caption?`). `SpecsSection({groups, specMatrix?})` consumed in `app/catalog/[slug]/page.tsx` Task 2 Step 9. Category `getProductsByCategory("Усилители мощности")` matches the `category` field in all 5 MDX. Icon keys used in MDX (`layers,boxes,zap,shield,activity,gauge,server,cable,plug,sliders,audio-waveform,usb,radio`) all exist after Task 2 Step 10. Slugs in `ORDER`/coverage test match MDX filenames.
