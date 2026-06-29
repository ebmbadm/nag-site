# P3b — NOVIK Tubes Boutique Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the 3 boutique pages (`/catalog/boutique`, `/catalog/savers`, `/catalog/converters`) as typed-data-module server pages, closing the `/catalog/*` tree.

**Architecture:** Typed data in `content/boutique/boutique.ts` (interfaces in `lib/content/types.ts`, loaders in `lib/content/boutique.ts`), rendered by static server pages assembled from DS primitives + 3 small `components/boutique/` parts. No product schema, no price, no SKU list.

**Tech Stack:** Next.js 16 App Router (SSG), React 19, TS strict, Tailwind v4, Vitest + @testing-library/react.

## Global Constraints

- **Russian only** (`ru-RU`). Server components; no `"use client"` in this slice.
- **Tokens only, no hardcoded hex.** Dark band via `<Surface mode="dark">`. Eyebrows = mono uppercase `tracking-[var(--ls-label)]`.
- **No price, no cart, no SKU list, no spec accordion.** Single inquiry CTA per page → **`/kontakty`** (decision A; never `/rqst-tubes`, which would 404).
- **humanizer-ru on visible prose:** no em-dash `—` (use `-`, comma, colon); em-dash in `alt` accepted. No «является» (rephrase «являются уникальными» → «уникальна»), «данный», «не просто X, а Y», «от X до Y».
- **Fact-lock:** no invented products/prices/SKUs/model names. «Pro 40» (a filename) is NOT a product name. Converter dark/light = ONE product (light in hero, dark on the dark band).
- **Do NOT touch `productFrontmatterSchema`.** Boutique uses its own data module.
- `npm run build` + `npx tsc --noEmit` + lint stay green.

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `public/boutique/**` | 4 images (1 root + 1 savers + 2 converters) | 1 |
| `lib/content/types.ts` | + boutique interfaces | 2 |
| `content/boutique/boutique.ts` | typed page data (boutique/savers/converters) | 2 |
| `lib/content/boutique.ts` | `getBoutique`/`getSavers`/`getConverters` | 2 |
| `lib/__tests__/boutique-content.test.ts` | loader shape + CTA fact-lock | 2 |
| `components/boutique/area-cards.tsx` | landing 3-up link grid | 3 |
| `components/boutique/feature-strip.tsx` | dark feature band (+ optional image) | 3 |
| `components/boutique/custom-order-cta.tsx` | `#custom` callout + inquiry button | 3 |
| `components/boutique/__tests__/area-cards.test.tsx` | area-cards render (TDD) | 3 |
| `app/catalog/{boutique,savers,converters}/page.tsx` | 3 pages | 4 |
| `docs/MASTER-PLAN.md` | status update (P3 complete) | 5 |

---

### Task 1: Copy boutique images

**Files:** Create `public/boutique/**`

- [ ] **Step 1: Copy**

```bash
cd /Users/viktor/Code/NAG-SITE
SRC=/Users/viktor/Documents/kimi/workspace/novikamps
mkdir -p public/boutique/savers public/boutique/converters
cp "$SRC/bt/images/vintage-radio-tubes-collection.jpg" public/boutique/
cp "$SRC/savers/images/novik-tube-saver-amphenol-black.png" public/boutique/savers/
cp "$SRC/converters/images/novik-converter-pro-40-dark.png" public/boutique/converters/
cp "$SRC/converters/images/novik-converter-pro-40-light.png" public/boutique/converters/
```

- [ ] **Step 2: Verify the 4 files**

Run: `find public/boutique -type f | sort`
Expected exactly:
```
public/boutique/converters/novik-converter-pro-40-dark.png
public/boutique/converters/novik-converter-pro-40-light.png
public/boutique/savers/novik-tube-saver-amphenol-black.png
public/boutique/vintage-radio-tubes-collection.jpg
```
If any differ, STOP and report BLOCKED.

- [ ] **Step 3: Commit**

```bash
git add public/boutique
git commit -m "feat(p3b): copy NOVIK boutique images to public"
```
(End every commit in this plan with a blank line then `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.)

---

### Task 2: Types + data module + loaders

**Files:** Modify `lib/content/types.ts`; Create `content/boutique/boutique.ts`, `lib/content/boutique.ts`, `lib/__tests__/boutique-content.test.ts`.

**Interfaces produced:** `getBoutique(): BoutiquePage`, `getSavers(): BoutiquePage`, `getConverters(): BoutiquePage`.

- [ ] **Step 1: Append interfaces to `lib/content/types.ts`** (after the company interfaces):

```ts
/* ---- Tubes boutique (P3) ---- */

export interface BoutiqueCta { label: string; href: string }
export interface BoutiqueFeature { title: string }
export interface BoutiqueAreaCard { title: string; text: string; href: string }
export interface BoutiqueCustom { title: string; body: string[]; cta: BoutiqueCta }
export interface BoutiquePage {
  slug: "boutique" | "savers" | "converters";
  eyebrow: string;
  title: string;
  lede: string;
  hero?: { src: string; alt: string; caption?: string };
  heroDark?: { src: string; alt: string };
  features?: { title: string; items: BoutiqueFeature[] };
  areaCards?: BoutiqueAreaCard[];
  custom?: BoutiqueCustom;
  cta: BoutiqueCta;
}
```

- [ ] **Step 2: Create `content/boutique/boutique.ts`**

```ts
import type { BoutiquePage } from "@/lib/content/types";

const FEATURES = {
  title: "Особенности разработки и производства",
  items: [
    { title: "Оригинальные, винтажные компоненты" },
    { title: "Ручная сборка" },
    { title: "Качественные материалы" },
    { title: "Уникальная технология" },
  ],
};

const SHORT_CUSTOM = {
  title: "Индивидуальный заказ",
  body: [
    "Не нашли нужный переходник или сейвер?",
    "Изготовим устройство на заказ, учитывая ваши пожелания по материалам.",
  ],
  cta: { label: "Заполнить заявку на заказ", href: "/kontakty" },
};

export const boutique: BoutiquePage = {
  slug: "boutique",
  eyebrow: "NOVIK TUBES BOUTIQUE",
  title: "Ламповый бутик NOVIK",
  lede:
    "Подбор ламп и аксессуары для ламповой техники. Новый раздел: сейверы и конвертеры для винтажных ламп, позже появятся подобранные лампы. Есть конкретный запрос - свяжитесь с нами.",
  hero: {
    src: "/boutique/vintage-radio-tubes-collection.jpg",
    alt: "Коллекция винтажных радиоламп NOVIK",
    caption: "NOVIK Tubes Boutique",
  },
  areaCards: [
    {
      title: "Сейверы",
      text: "Делаем вручную из старых (NOS) советских деталей: винтажные лампы как основа плюс бакелитовые и керамические панельки.",
      href: "/catalog/savers",
    },
    {
      title: "Конвертеры",
      text: "Позволяют использовать разные лампы в одном усилителе. Из NOS советских деталей, часть из них уникальна - таких переходников не найти больше нигде.",
      href: "/catalog/converters",
    },
    {
      title: "Индивидуальный заказ",
      text: "Ищете конкретную советскую лампу определённого года, завода, параметров? Найдём, проверим и подберём. Изготовим сейвер или конвертер по вашим материалам.",
      href: "#custom",
    },
  ],
  custom: {
    title: "Индивидуальный заказ",
    body: [
      "Ищете конкретную советскую лампу - определённого года, завода или с нужными параметрами? Мы найдём, проверим и подберём для вас эксклюзивную лампу.",
      "Также изготовим сейвер или конвертер по индивидуальному заказу, учитывая ваши пожелания по материалам и методам изготовления.",
    ],
    cta: { label: "Связаться с нами", href: "/kontakty" },
  },
  cta: { label: "Связаться с нами", href: "/kontakty" },
};

export const savers: BoutiquePage = {
  slug: "savers",
  eyebrow: "NOVIK TUBES BOUTIQUE",
  title: "Сейверы для винтажных радиоламп",
  lede:
    "Сейверы сохраняют оригинальные разъёмы в усилителях и избавляют от дорогой замены панелек. Пригодятся, когда вы проверяете лампы. И, конечно, сейвер бывает просто красивой деталью.",
  hero: {
    src: "/boutique/savers/novik-tube-saver-amphenol-black.png",
    alt: "Сейвер NOVIK на бакелитовой панельке Amphenol",
    caption: "Сейвер NOVIK",
  },
  features: FEATURES,
  custom: SHORT_CUSTOM,
  cta: { label: "Заполнить заявку на заказ", href: "/kontakty" },
};

export const converters: BoutiquePage = {
  slug: "converters",
  eyebrow: "NOVIK TUBES BOUTIQUE",
  title: "Конвертеры для ламп",
  lede: "Конвертеры позволяют использовать в вашем устройстве больший спектр ламп.",
  hero: {
    src: "/boutique/converters/novik-converter-pro-40-light.png",
    alt: "Конвертер NOVIK для винтажных ламп",
    caption: "Конвертер NOVIK",
  },
  heroDark: {
    src: "/boutique/converters/novik-converter-pro-40-dark.png",
    alt: "Конвертер NOVIK, деталь",
  },
  features: FEATURES,
  custom: SHORT_CUSTOM,
  cta: { label: "Заполнить заявку на заказ", href: "/kontakty" },
};
```

- [ ] **Step 3: Create `lib/content/boutique.ts`**

```ts
import { boutique, savers, converters } from "@/content/boutique/boutique";
import type { BoutiquePage } from "./types";

/** Boutique landing content. */
export function getBoutique(): BoutiquePage {
  return boutique;
}

/** Savers page content. */
export function getSavers(): BoutiquePage {
  return savers;
}

/** Converters page content. */
export function getConverters(): BoutiquePage {
  return converters;
}
```

- [ ] **Step 4: Write `lib/__tests__/boutique-content.test.ts`**

```ts
import { describe, expect, test } from "vitest";
import { getBoutique, getSavers, getConverters } from "@/lib/content/boutique";

describe("boutique content loaders", () => {
  test("every CTA targets /kontakty (never /rqst-tubes)", () => {
    for (const p of [getBoutique(), getSavers(), getConverters()]) {
      expect(p.cta.href).toBe("/kontakty");
      expect(JSON.stringify(p)).not.toContain("/rqst-tubes");
    }
  });

  test("landing: 3 area cards to savers / converters / #custom", () => {
    expect(getBoutique().areaCards?.map((c) => c.href)).toEqual([
      "/catalog/savers",
      "/catalog/converters",
      "#custom",
    ]);
  });

  test("savers + converters: 4 feature items; converters has a dark hero variant", () => {
    expect(getSavers().features?.items).toHaveLength(4);
    expect(getConverters().features?.items).toHaveLength(4);
    expect(getConverters().heroDark?.src).toContain("converter-pro-40-dark");
  });
});
```

- [ ] **Step 5: Run + commit**

Run: `npx vitest run lib/__tests__/boutique-content.test.ts` → PASS. Then:
```bash
git add lib/content/types.ts content/boutique/boutique.ts lib/content/boutique.ts lib/__tests__/boutique-content.test.ts
git commit -m "feat(p3b): boutique content types, data module + loaders"
```

---

### Task 3: Boutique components

**Files:** Create `components/boutique/{area-cards,feature-strip,custom-order-cta}.tsx`, `components/boutique/__tests__/area-cards.test.tsx`. **Consumes:** boutique types (Task 2).

- [ ] **Step 1: Write the failing test** `components/boutique/__tests__/area-cards.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { AreaCards } from "../area-cards";

const cards = [
  { title: "Сейверы", text: "t1", href: "/catalog/savers" },
  { title: "Конвертеры", text: "t2", href: "/catalog/converters" },
  { title: "Индивидуальный заказ", text: "t3", href: "#custom" },
];

describe("AreaCards", () => {
  test("renders one link per card to the right href", () => {
    render(<AreaCards cards={cards} />);
    expect(screen.getByRole("link", { name: /Сейверы/ })).toHaveAttribute("href", "/catalog/savers");
    expect(screen.getByRole("link", { name: /Конвертеры/ })).toHaveAttribute("href", "/catalog/converters");
    expect(screen.getByRole("link", { name: /Индивидуальный заказ/ })).toHaveAttribute("href", "#custom");
  });
});
```

- [ ] **Step 2: Run → FAIL** (`Cannot find module '../area-cards'`).

Run: `npx vitest run components/boutique/__tests__/area-cards.test.tsx`

- [ ] **Step 3: Write `components/boutique/area-cards.tsx`**

```tsx
import Link from "next/link";
import type { BoutiqueAreaCard } from "@/lib/content/types";

export function AreaCards({ cards }: { cards: BoutiqueAreaCard[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group flex flex-col bg-bg p-6 transition-colors duration-[var(--dur-base)] hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]"
        >
          <span className="font-display text-xl uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>
            {card.title}
          </span>
          <span className="mt-2 text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
            {card.text}
          </span>
          <span className="mt-4 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">Открыть →</span>
        </Link>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run → PASS.** `npx vitest run components/boutique/__tests__/area-cards.test.tsx`

- [ ] **Step 5: Write `components/boutique/feature-strip.tsx`**

```tsx
import { Container, Chip, Surface, Figure } from "@/components/ds";
import type { BoutiquePage } from "@/lib/content/types";

export function FeatureStrip({
  features,
  image,
}: {
  features: NonNullable<BoutiquePage["features"]>;
  image?: { src: string; alt: string };
}) {
  return (
    <Surface mode="dark" className="py-16">
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h2
            className="font-display uppercase text-text"
            style={{ fontSize: "clamp(var(--text-xl), 3vw, var(--text-2xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
          >
            {features.title}
          </h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {features.items.map((item) => (
              <Chip key={item.title}>{item.title}</Chip>
            ))}
          </div>
        </div>
        {image ? <Figure src={image.src} alt={image.alt} className="lg:order-last" /> : null}
      </Container>
    </Surface>
  );
}
```

- [ ] **Step 6: Write `components/boutique/custom-order-cta.tsx`**

```tsx
import Link from "next/link";
import { Container, buttonVariants } from "@/components/ds";
import type { BoutiqueCustom } from "@/lib/content/types";

export function CustomOrderCta({ custom }: { custom: BoutiqueCustom }) {
  return (
    <section id="custom" className="scroll-mt-20 border-t border-border bg-surface-2 py-16">
      <Container>
        <div className="max-w-prose">
          <h2
            className="font-display uppercase text-text"
            style={{ fontSize: "clamp(var(--text-2xl), 4vw, var(--text-3xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
          >
            {custom.title}
          </h2>
          {custom.body.map((p, i) => (
            <p key={i} className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              {p}
            </p>
          ))}
          <div className="mt-6">
            <Link href={custom.cta.href} className={buttonVariants({ variant: "primary", size: "lg" })}>
              {custom.cta.label}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 7: Run full suite + commit**

Run: `npx vitest run` → all pass. Then:
```bash
git add components/boutique
git commit -m "feat(p3b): boutique components (area-cards, feature-strip, custom-order-cta)"
```

---

### Task 4: The three pages

**Files:** Create `app/catalog/{boutique,savers,converters}/page.tsx`. **Consumes:** loaders (Task 2) + components (Task 3).

- [ ] **Step 1: Write `app/catalog/boutique/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb, Figure } from "@/components/ds";
import { AreaCards } from "@/components/boutique/area-cards";
import { CustomOrderCta } from "@/components/boutique/custom-order-cta";
import { getBoutique } from "@/lib/content/boutique";

const b = getBoutique();

export const metadata: Metadata = {
  title: "Ламповый бутик NOVIK",
  description: b.lede,
};

export default function BoutiqueLandingPage() {
  return (
    <div>
      <Container className="py-10">
        <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Каталог" }, { label: "Бутик ламп" }]} />
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="max-w-prose">
            <Eyebrow accent>{b.eyebrow}</Eyebrow>
            <h1
              className="mt-3 font-display uppercase text-text"
              style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
            >
              {b.title}
            </h1>
            <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{b.lede}</p>
          </div>
          {b.hero ? <Figure src={b.hero.src} alt={b.hero.alt} caption={b.hero.caption} /> : null}
        </div>
      </Container>

      {b.areaCards ? (
        <Container className="pb-12">
          <AreaCards cards={b.areaCards} />
        </Container>
      ) : null}

      {b.custom ? <CustomOrderCta custom={b.custom} /> : null}
    </div>
  );
}
```

- [ ] **Step 2: Write `app/catalog/savers/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb, Figure } from "@/components/ds";
import { FeatureStrip } from "@/components/boutique/feature-strip";
import { CustomOrderCta } from "@/components/boutique/custom-order-cta";
import { getSavers } from "@/lib/content/boutique";

const s = getSavers();

export const metadata: Metadata = {
  title: "Сейверы для винтажных радиоламп · NOVIK",
  description: s.lede,
};

export default function SaversPage() {
  return (
    <div>
      <Container className="py-10">
        <Breadcrumb
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог" },
            { label: "Бутик ламп", href: "/catalog/boutique" },
            { label: "Сейверы" },
          ]}
        />
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="max-w-prose">
            <Eyebrow accent>{s.eyebrow}</Eyebrow>
            <h1
              className="mt-3 font-display uppercase text-text"
              style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
            >
              {s.title}
            </h1>
            <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{s.lede}</p>
          </div>
          {s.hero ? <Figure src={s.hero.src} alt={s.hero.alt} caption={s.hero.caption} /> : null}
        </div>
      </Container>

      {s.features ? <FeatureStrip features={s.features} /> : null}
      {s.custom ? <CustomOrderCta custom={s.custom} /> : null}
    </div>
  );
}
```

- [ ] **Step 3: Write `app/catalog/converters/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb, Figure } from "@/components/ds";
import { FeatureStrip } from "@/components/boutique/feature-strip";
import { CustomOrderCta } from "@/components/boutique/custom-order-cta";
import { getConverters } from "@/lib/content/boutique";

const c = getConverters();

export const metadata: Metadata = {
  title: "Конвертеры для ламп · NOVIK",
  description: c.lede,
};

export default function ConvertersPage() {
  return (
    <div>
      <Container className="py-10">
        <Breadcrumb
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог" },
            { label: "Бутик ламп", href: "/catalog/boutique" },
            { label: "Конвертеры" },
          ]}
        />
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="max-w-prose">
            <Eyebrow accent>{c.eyebrow}</Eyebrow>
            <h1
              className="mt-3 font-display uppercase text-text"
              style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
            >
              {c.title}
            </h1>
            <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{c.lede}</p>
          </div>
          {c.hero ? <Figure src={c.hero.src} alt={c.hero.alt} caption={c.hero.caption} /> : null}
        </div>
      </Container>

      {c.features ? <FeatureStrip features={c.features} image={c.heroDark} /> : null}
      {c.custom ? <CustomOrderCta custom={c.custom} /> : null}
    </div>
  );
}
```

- [ ] **Step 4: Build + verify routes + CTA links**

Run: `npm run build` → green; `/catalog/boutique`, `/catalog/savers`, `/catalog/converters` prerendered static (`○`).

Run (local export emits `out/<route>/index.html`):
```bash
grep -o 'href="[^"]*kontakty[^"]*"' out/catalog/boutique/index.html | head -1
grep -c 'rqst-tubes' out/catalog/boutique/index.html out/catalog/savers/index.html out/catalog/converters/index.html
```
Expected: a `/kontakty` href present; `rqst-tubes` count `0` in all three. (Build runs static export per the deploy config; `out/` is gitignored.)

- [ ] **Step 5: Commit**

```bash
git add app/catalog/boutique/page.tsx app/catalog/savers/page.tsx app/catalog/converters/page.tsx
git commit -m "feat(p3b): boutique landing + savers + converters pages"
```

---

### Task 5: Final verification + master-plan

**Files:** Modify `docs/MASTER-PLAN.md`.

- [ ] **Step 1: Full suite**

Run: `npx vitest run`
Expected: PASS — all prior suites + `boutique-content` + `area-cards`.

- [ ] **Step 2: Build + hex grep**

Run:
```bash
npm run build
grep -rEn '#[0-9a-fA-F]{3,6}' app/catalog/boutique app/catalog/savers app/catalog/converters components/boutique content/boutique 2>/dev/null || echo "NO HEX"
```
Expected: green build (3 boutique routes static); hex grep prints `NO HEX`. If real hex appears, STOP and report.

- [ ] **Step 3: Update master plan** (`docs/MASTER-PLAN.md`)

- §2 status: update the P3 row to mark the phase complete:
```markdown
| **P3 — Company/legal + boutique** | ✅ Company & legal (`/o-kompanii`, `/garantiya`, `/kontakty`) + NOVIK Tubes Boutique (`/catalog/boutique`, `/catalog/savers`, `/catalog/converters`). |
```
- §3 sitemap: tick `/catalog/boutique`, `/catalog/savers`, `/catalog/converters` from `P3` to `✅ P3`.

- [ ] **Step 4: Commit**

```bash
git add docs/MASTER-PLAN.md
git commit -m "docs(p3b): mark boutique + P3 complete in master plan"
```

---

## Self-Review

**Spec coverage:** images → Task 1 ✓; types/data/loaders → Task 2 ✓; 3 components → Task 3 (area-cards TDD) ✓; 3 pages → Task 4 ✓; decision A (CTA → /kontakty, no /rqst-tubes) → data + loader test asserts it ✓; decision D (converter dark on band via FeatureStrip `image={heroDark}`, light in hero) → Task 4 converters page ✓; decision E (no SKU catalog) — no such task, photo-led hero only ✓; decision F (no nav change) — none ✓; master-plan → Task 5 ✓.

**Placeholder scan:** none. All component/page/data code is complete; copy is the humanized, faithful text from the spec.

**Type consistency:** `BoutiquePage`/`BoutiqueAreaCard`/`BoutiqueCustom`/`BoutiqueCta`/`BoutiqueFeature` defined in Task 2 are consumed with matching field names in Tasks 3-4. `getBoutique`/`getSavers`/`getConverters` names match across loader, test, and pages. `FeatureStrip` takes `features` + optional `image`; converters passes `image={c.heroDark}`. `CustomOrderCta` renders `id="custom"`, matching the landing area-card `href: "#custom"`. `Figure` props (`src`/`alt`/`caption`/`className`) match its signature. Page titles are explicit `<h1>`; `FeatureStrip`/`CustomOrderCta` use `<h2>` (heading order sane).
