# Landing Prices and Category Images Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Update landing page prices to match product catalog prices and add product photos to category cards.

**Architecture:** Single-file change in `app/page.tsx`: update the `CATEGORIES` constant with corrected prices and image paths, adjust the featured QM-400 price, and render the category image inside each category card.

**Tech Stack:** Next.js 15, React, TypeScript, Tailwind CSS, next/image.

---

### Task 1: Update `CATEGORIES` constant with correct prices and images

**Files:**
- Modify: `app/page.tsx:23-52`

- [ ] **Step 1: Update constant data**

Replace the `CATEGORIES` array so each entry has the corrected `price` and a new `image` object:

```ts
const CATEGORIES = [
  {
    eyebrow: "Процессоры · DSP",
    title: "Процессоры",
    text: "DSP-процессоры NAG: D-8000 Wi-Fi, F-8, F-8 PRO.",
    href: "/catalog/processors",
    price: "от 24 900 ₽",
    image: {
      src: "/products/d-8000/nag-d8000-front-panel.jpg",
      alt: "NAG D-8000 — передняя панель",
    },
  },
  {
    eyebrow: "Усилители мощности",
    title: "Усилители",
    text: "Транзисторные QM-400, серии TD и CX — 4 × 700 Вт с DSP.",
    href: "/catalog/amplifiers",
    price: "от 41 900 ₽",
    image: {
      src: "/products/qm-400/nag-qm400-front-panel.jpg",
      alt: "NAG QM-400 — передняя панель",
    },
  },
  {
    eyebrow: "Ламповые · NOVIK",
    title: "Лампа",
    text: "Ламповые усилители — наследие NOVIK с 1976 года.",
    href: "/catalog/tubes",
    price: "Цена по запросу",
    image: {
      src: "/products/e12/novik-e12-head-front.png",
      alt: "NOVIK E12 — передняя панель",
    },
  },
  {
    eyebrow: "Модули встраиваемые",
    title: "Модули",
    text: "Встраиваемые модули для активной акустики: TDS / TDH, TDX.",
    href: "/catalog/amplifiers",
    price: "от 41 900 ₽",
    image: {
      src: "/products/modules/nag-module-tds-rear-panel.png",
      alt: "NAG TDS — задняя панель модуля",
    },
  },
];
```

- [ ] **Step 2: Update featured QM-400 price**

Change the featured QM-400 block price from `от 285 000 ₽` to `199 900 ₽` around line 318.

```tsx
<div
  className="font-display font-bold uppercase tabular-nums text-text"
  style={{ fontSize: "var(--text-3xl)", lineHeight: 1 }}
>
  199 900 ₽
</div>
```

---

### Task 2: Render category images in category cards

**Files:**
- Modify: `app/page.tsx:183-209`

- [ ] **Step 1: Add Image import and render image inside category link**

Ensure `Image` from `next/image` is already imported at the top of the file (it is on line 2).

Update the category card mapping to render the image above the eyebrow:

```tsx
{CATEGORIES.map((cat) => (
  <Link
    key={cat.href}
    href={cat.href}
    className="flex min-h-[226px] flex-col bg-bg p-[26px] transition-colors hover:bg-surface-2"
  >
    <div className="mb-4 -mt-1 overflow-hidden rounded-[var(--radius-sm)]">
      <Image
        src={cat.image.src}
        alt={cat.image.alt}
        width={320}
        height={160}
        className="h-[120px] w-full object-cover"
      />
    </div>
    <Eyebrow accent className="mb-3.5 block">
      {cat.eyebrow}
    </Eyebrow>
    <h3
      className="mb-2.5 font-display uppercase text-text"
      style={{ fontSize: "var(--text-xl)", lineHeight: 1.04 }}
    >
      {cat.title}
    </h3>
    <p
      className="flex-1 text-sm text-text-muted"
      style={{ lineHeight: "var(--lh-normal)" }}
    >
      {cat.text}
    </p>
    <div className="mt-[18px] flex items-center justify-between">
      <span className="font-mono text-xs text-text-faint">{cat.price}</span>
      <ArrowRight className="size-[18px] text-accent" aria-hidden />
    </div>
  </Link>
))}
```

---

### Task 3: Verify the build

**Files:**
- Run: project root

- [ ] **Step 1: Type-check and lint**

```bash
npm run lint
npx tsc --noEmit
```

Expected: no errors related to `app/page.tsx`.

- [ ] **Step 2: Build the project**

```bash
npm run build
```

Expected: build succeeds.

---

## Self-Review

- Spec coverage: price updates covered in Task 1, image additions covered in Task 2, verification in Task 3.
- Placeholder scan: no TBD/TODO placeholders; all code, paths, and prices are explicit.
- Type consistency: `image` field is added to every `CATEGORIES` entry and used in the render loop.
