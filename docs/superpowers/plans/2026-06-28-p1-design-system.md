# P1 Design-System Completion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Harden the NAG·NOVIK design system into a complete, documented library — 5 §6 schema fixes, 6 new DS primitives, mobile nav, a11y pass, motion utilities, and a dev-only `/_ds` reference route.

**Architecture:** Two sub-slices: P1a ships server-only work (schema + 4 primitives); P1b ships client components + polish. Each sub-slice ends with a green `npm run build`. The `/_ds` route is guarded by `process.env.NODE_ENV` and returns `notFound()` in production.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript strict · Tailwind CSS v4 · Zod v4 · Vitest + Testing Library · Embla Carousel (existing) · Lucide React (existing)

## Global Constraints

- **Tokens only** — no hardcoded hex/rgb in `components/`. `grep -rE '#[0-9a-fA-F]{3,6}' components/` must return zero matches (excluding `globals.css` and token definitions).
- **DS primitives** — all new components in `components/ds/` (except `MobileNav` which is a layout component in `components/layout/`), all exported from `components/ds/index.ts`.
- **Server components by default** — `"use client"` only for: `PillGroup`, `Tabs`, `MobileNav`.
- **Russian copy** — all user-visible strings are Russian; no English placeholder text.
- **`npm run build` must stay green** throughout — run after every task that touches TSX/TS/MDX.
- **`content/products/d-8000.mdx`** frontmatter must remain parseable after every schema change (all changes are additive).

---

## File Map

### P1a — Foundation

| File | Action |
|---|---|
| `lib/content/schema.ts` | Modify — 5 schema field additions |
| `lib/format.ts` | Read-only — `formatPrice` unchanged (callers guard before calling) |
| `components/product/sections.tsx` | Modify — `ProductHero` price/logos/quick-links; promote `Breadcrumb` |
| `content/products/d-8000.mdx` | Modify — add `partnerLogos` frontmatter |
| `components/ds/breadcrumb.tsx` | Create |
| `components/ds/prose.tsx` | Create |
| `components/ds/spec-matrix-table.tsx` | Create |
| `components/ds/product-card.tsx` | Create |
| `components/ds/index.ts` | Modify — add 4 exports |
| `app/catalog/[slug]/page.tsx` | Modify — use DS `Breadcrumb`, wrap MDX in `Prose` |

### P1b — Interactive + Polish

| File | Action |
|---|---|
| `app/globals.css` | Modify — add 4 motion utilities |
| `components/ds/pill-group.tsx` | Create |
| `components/ds/tabs.tsx` | Create |
| `components/layout/mobile-nav.tsx` | Create |
| `components/layout/site-header.tsx` | Modify — wire `MobileNav`, fix 2 hardcoded rgba values |
| `components/ds/gallery.tsx` | Modify — ARIA: `role="region"`, `aria-label`, arrow labels |
| `components/ds/toc.tsx` | Modify — ARIA: `aria-current="location"` on active link |
| `components/ds/scroll-progress.tsx` | Modify — `prefers-reduced-motion`: hide |
| `app/_ds/page.tsx` | Create — dev-only DS reference route |

### Tests

| File | Action |
|---|---|
| `vitest.config.ts` | Create |
| `vitest.setup.ts` | Create |
| `lib/__tests__/schema.test.ts` | Create — zod parse tests |
| `components/ds/__tests__/spec-matrix-table.test.tsx` | Create — null rendering |
| `components/ds/__tests__/tabs.test.tsx` | Create — state management |
| `components/layout/__tests__/mobile-nav.test.tsx` | Create — Escape + open/close |

---

### Task 1: Set up Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `package.json` (add `test` script)

**Interfaces:**
- Produces: `npm test` runs vitest; `@testing-library/jest-dom` matchers available globally

- [ ] **Step 1: Install test dependencies**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Expected: packages added to `devDependencies` in `package.json`.

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    globals: true,
    include: ["**/__tests__/**/*.{test,spec}.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": path.resolve(__dirname, ".") },
  },
});
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom";
```

- [ ] **Step 4: Add test script to `package.json`**

In the `"scripts"` section, add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Write a smoke test to verify setup**

Create `lib/__tests__/smoke.test.ts`:
```ts
import { describe, it, expect } from "vitest";

describe("vitest setup", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 6: Run tests**

```bash
npm test
```

Expected output: `1 passed`.

- [ ] **Step 7: Delete the smoke test**

```bash
rm lib/__tests__/smoke.test.ts
```

- [ ] **Step 8: Commit**

```bash
git add vitest.config.ts vitest.setup.ts package.json package-lock.json
git commit -m "test: set up vitest + @testing-library/react"
```

---

### Task 2: Schema changes

**Files:**
- Modify: `lib/content/schema.ts`
- Create: `lib/__tests__/schema.test.ts`

**Interfaces:**
- Produces:
  - `ProductFrontmatter["price"]` is `{ amount?: number; currency: string; onRequest?: boolean; note?: string } | undefined`
  - `ProductFrontmatter["partnerLogos"]` is `{ src: string; alt: string; width: number; height: number }[] | undefined`
  - `ProductFrontmatter["models"]` is `{ name: string; config?: string; price?: number; note?: string }[] | undefined`
  - `ProductFrontmatter["docs"]` is `{ label: string; href: string }[] | undefined`
  - `ProductFrontmatter["software"]` is unchanged but `software` presence → hero `#software` link shown
  - `ProductFrontmatter["specGroups"]` is unchanged but non-empty → hero `#specs` link shown

- [ ] **Step 1: Write failing tests**

Create `lib/__tests__/schema.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { productFrontmatterSchema } from "../content/schema";

const BASE = {
  slug: "test-product",
  name: "Test",
  line: "Test Line",
  category: "Процессоры",
  breadcrumb: [],
  summary: "Summary text.",
  specChips: [],
  gallery: [{ src: "/img.jpg", alt: "img" }],
  specGroups: [],
};

describe("productFrontmatterSchema", () => {
  it("accepts product with no price field", () => {
    const result = productFrontmatterSchema.safeParse(BASE);
    expect(result.success).toBe(true);
  });

  it("accepts product with onRequest price", () => {
    const result = productFrontmatterSchema.safeParse({
      ...BASE,
      price: { onRequest: true },
    });
    expect(result.success).toBe(true);
  });

  it("accepts product with numeric amount", () => {
    const result = productFrontmatterSchema.safeParse({
      ...BASE,
      price: { amount: 122900 },
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.price?.amount).toBe(122900);
  });

  it("accepts partnerLogos array", () => {
    const result = productFrontmatterSchema.safeParse({
      ...BASE,
      partnerLogos: [{ src: "/logo.png", alt: "Logo", width: 84, height: 24 }],
    });
    expect(result.success).toBe(true);
  });

  it("accepts models array with optional price", () => {
    const result = productFrontmatterSchema.safeParse({
      ...BASE,
      models: [
        { name: "TD-2000", config: "2×1000W", price: 85000 },
        { name: "TD-1000", config: "2×500W" },
      ],
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.models?.[1].price).toBeUndefined();
  });

  it("accepts docs array", () => {
    const result = productFrontmatterSchema.safeParse({
      ...BASE,
      docs: [{ label: "Скачать ПО", href: "https://disk.yandex.ru/d/abc123" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects docs with non-url href", () => {
    const result = productFrontmatterSchema.safeParse({
      ...BASE,
      docs: [{ label: "Скачать", href: "not-a-url" }],
    });
    expect(result.success).toBe(false);
  });

  it("d-8000 existing shape still parses (additive check)", () => {
    const result = productFrontmatterSchema.safeParse({
      ...BASE,
      slug: "d-8000",
      name: "NAG D-8000 WI-FI",
      price: { amount: 122900, currency: "₽", note: "Без НДС" },
      badges: ["BEST SELLER"],
    });
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npm test lib/__tests__/schema.test.ts
```

Expected: multiple FAIL (price is currently required with `amount: z.number()`).

- [ ] **Step 3: Update `lib/content/schema.ts`**

Replace the `price` field and add new fields. The full updated schema:

```ts
import { z } from "zod";

const media = z.object({
  src: z.string(),
  alt: z.string(),
  caption: z.string().optional(),
});

export const productFrontmatterSchema = z.object({
  slug: z.string(),
  name: z.string(),
  line: z.string(),
  subtitle: z.string().optional(),
  badges: z.array(z.string()).default([]),
  category: z.string(),
  breadcrumb: z
    .array(z.object({ label: z.string(), href: z.string().optional() }))
    .default([]),

  // §6.1 — price optional, onRequest variant
  price: z
    .object({
      amount: z.number().optional(),
      currency: z.string().default("₽"),
      onRequest: z.boolean().optional(),
      note: z.string().optional(),
    })
    .optional(),

  // §6.2 — partner logo strip
  partnerLogos: z
    .array(
      z.object({
        src: z.string(),
        alt: z.string(),
        width: z.number(),
        height: z.number(),
      }),
    )
    .optional(),

  summary: z.string(),
  specChips: z.array(z.string()).default([]),
  gallery: z.array(media).min(1),

  // §6.4 — multi-model series pages
  models: z
    .array(
      z.object({
        name: z.string(),
        config: z.string().optional(),
        price: z.number().optional(),
        note: z.string().optional(),
      }),
    )
    .optional(),

  // §6.5 — download links (software / manuals)
  docs: z
    .array(z.object({ label: z.string(), href: z.string().url() }))
    .optional(),

  features: z
    .object({
      eyebrow: z.string().optional(),
      title: z.string(),
      cards: z.array(
        z.object({
          icon: z.string().optional(),
          title: z.string(),
          text: z.string(),
        }),
      ),
    })
    .optional(),
  tech: z
    .object({
      eyebrow: z.string().optional(),
      title: z.string(),
      lede: z.string().optional(),
      cards: z.array(
        z.object({ label: z.string(), chip: z.string(), text: z.string() }),
      ),
      image: media.optional(),
    })
    .optional(),
  software: z
    .object({
      eyebrow: z.string().optional(),
      title: z.string(),
      lede: z.string().optional(),
      hero: media,
      items: z.array(
        media.extend({ title: z.string(), text: z.string().optional() }),
      ),
    })
    .optional(),
  specGroups: z.array(
    z.object({
      title: z.string(),
      defaultOpen: z.boolean().optional(),
      rows: z.array(z.object({ label: z.string(), value: z.string() })),
    }),
  ),
});

export type ProductFrontmatter = z.infer<typeof productFrontmatterSchema>;
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test lib/__tests__/schema.test.ts
```

Expected: `7 passed`.

- [ ] **Step 5: Verify build still compiles**

```bash
npm run build
```

Expected: build succeeds. TypeScript will flag `product.price.amount` usages in `ProductHero` — that is expected and will be fixed in Task 3. If TypeScript errors appear in `sections.tsx`, that's acceptable at this step — the build may fail here. Proceed to Task 3 immediately.

- [ ] **Step 6: Commit**

```bash
git add lib/content/schema.ts lib/__tests__/schema.test.ts
git commit -m "feat(schema): make price optional, add partnerLogos/models/docs fields (§6)"
```

---

### Task 3: Update ProductHero + migrate `d-8000.mdx` partnerLogos

**Files:**
- Modify: `components/product/sections.tsx` — `ProductHero` function only
- Modify: `content/products/d-8000.mdx` — add `partnerLogos` frontmatter

**Interfaces:**
- Consumes: `ProductFrontmatter` from Task 2 (price optional, partnerLogos optional, models optional, docs optional)
- Produces: `ProductHero` renders correctly for all 4 price states; `SoftwareSection` renders `docs` buttons; build green

- [ ] **Step 1: Add `partnerLogos` to `d-8000.mdx` frontmatter**

In `content/products/d-8000.mdx`, add after `specChips:` (before `gallery:`):

```yaml
partnerLogos:
  - { src: "/products/d-8000/burr-brown-logo.png", alt: "Burr-Brown", width: 84, height: 24 }
  - { src: "/products/d-8000/wifi-usb-rj45-connectivity.png", alt: "Wi-Fi · USB · LAN", width: 96, height: 24 }
```

- [ ] **Step 2: Replace `ProductHero` in `components/product/sections.tsx`**

Replace the entire `ProductHero` function (lines 51–132) with:

```tsx
export function ProductHero({ product }: { product: ProductFrontmatter }) {
  const { price, models, partnerLogos, software, specGroups } = product;

  // Derived price display
  const minModelPrice =
    models && models.length > 0
      ? models.filter((m) => m.price != null).map((m) => m.price!)
      : [];
  const displayPrice =
    minModelPrice.length > 0
      ? `от ${formatPrice(Math.min(...minModelPrice))}`
      : price?.amount != null
        ? formatPrice(price.amount, price.currency ?? "₽")
        : null;

  return (
    <Container className="grid gap-10 py-10 lg:grid-cols-2 lg:gap-14">
      <Gallery images={product.gallery} />

      <div className="flex flex-col">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Eyebrow accent>{product.line}</Eyebrow>
          {product.badges.map((b) => (
            <Badge key={b}>{b}</Badge>
          ))}
        </div>

        <h1
          className="font-display uppercase text-text"
          style={{
            fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))",
            lineHeight: "var(--lh-tight)",
            letterSpacing: "var(--ls-tight)",
          }}
        >
          {product.name}
        </h1>
        {product.subtitle ? (
          <p className="mt-2 font-mono text-sm text-text-muted">{product.subtitle}</p>
        ) : null}

        <p
          className="mt-5 max-w-prose text-sm text-text-muted"
          style={{ lineHeight: "var(--lh-relaxed)" }}
        >
          {product.summary}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {product.specChips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>

        <Divider className="my-7" />

        {/* Price block */}
        {(displayPrice || price?.onRequest) && (
          <div>
            <Eyebrow className="block">
              {models && minModelPrice.length > 0 ? "Цена от" : "Розничная цена"}
            </Eyebrow>
            {displayPrice ? (
              <div
                className="mt-1 font-display text-text"
                style={{ fontSize: "var(--text-4xl)", lineHeight: "var(--lh-tight)" }}
              >
                {displayPrice}
              </div>
            ) : null}
            {price?.note ? (
              <p className="mt-1.5 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                {price.note}
              </p>
            ) : null}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap gap-3">
          {price?.onRequest ? (
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Запрос цены: ${product.name}`)}`}
              className={buttonVariants({ variant: "primary", size: "lg", className: "min-w-40" })}
            >
              Запросить расчёт
            </a>
          ) : (
            <>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Заказ: ${product.name}`)}`}
                className={buttonVariants({ variant: "primary", size: "lg", className: "min-w-40" })}
              >
                В корзину
              </a>
              <a
                href={`tel:${CONTACT_TEL}`}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Купить в 1 клик
              </a>
            </>
          )}
        </div>
        <p className="mt-3 font-mono text-2xs text-text-faint">
          Оформление — по телефону или почте. Онлайн-корзина скоро.
        </p>

        {/* Quick-links — shown only when the sections exist */}
        {(software || specGroups.length > 0) && (
          <div className="mt-6 flex flex-wrap gap-5 text-text-muted">
            {software && (
              <a
                href="#software"
                className="inline-flex items-center gap-2 text-sm transition-colors hover:text-accent"
              >
                <MonitorSmartphone className="size-4" aria-hidden /> Программа
              </a>
            )}
            {specGroups.length > 0 && (
              <a
                href="#specs"
                className="inline-flex items-center gap-2 text-sm transition-colors hover:text-accent"
              >
                <FileText className="size-4" aria-hidden /> Характеристики
              </a>
            )}
          </div>
        )}

        {/* Partner logo strip — frontmatter-driven */}
        {partnerLogos && partnerLogos.length > 0 && (
          <div className="mt-6 flex items-center gap-4 opacity-80">
            {partnerLogos.map((logo) => (
              <Image
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-5 w-auto"
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}
```

- [ ] **Step 3: Update `SoftwareSection` to render `docs` buttons**

In `SoftwareSection`, add a `docs` prop and render download buttons. Find the current `SoftwareSection` signature and replace:

```tsx
export function SoftwareSection({
  software,
  docs,
}: {
  software: NonNullable<ProductFrontmatter["software"]>;
  docs?: ProductFrontmatter["docs"];
}) {
```

Inside, after the `Figure` for `software.hero`, add before the screenshots grid:

```tsx
{docs && docs.length > 0 && (
  <div className="mt-6 flex flex-wrap gap-3">
    {docs.map((doc) => (
      <a
        key={doc.href}
        href={doc.href}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "outline", size: "md" })}
      >
        {doc.label}
      </a>
    ))}
  </div>
)}
```

- [ ] **Step 4: Update `app/catalog/[slug]/page.tsx` to pass `docs` to `SoftwareSection`**

Change:
```tsx
{p.software ? <SoftwareSection software={p.software} /> : null}
```
To:
```tsx
{p.software ? <SoftwareSection software={p.software} docs={p.docs} /> : null}
```

- [ ] **Step 5: Run build**

```bash
npm run build
```

Expected: green. The `d-8000` product page now reads `partnerLogos` from frontmatter.

- [ ] **Step 6: Commit**

```bash
git add components/product/sections.tsx content/products/d-8000.mdx app/catalog/[slug]/page.tsx
git commit -m "feat(product): optional price/models/onRequest, frontmatter partnerLogos, guarded quick-links, docs CTAs"
```

---

### Task 4: `Breadcrumb` DS primitive

**Files:**
- Create: `components/ds/breadcrumb.tsx`
- Modify: `components/product/sections.tsx` — remove local `Breadcrumb`, import DS one
- Modify: `app/catalog/[slug]/page.tsx` — update import, prepend "Главная" item
- Modify: `components/ds/index.ts`

**Interfaces:**
- Produces: `export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string })` where `BreadcrumbItem = { label: string; href?: string }`

- [ ] **Step 1: Create `components/ds/breadcrumb.tsx`**

```tsx
import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = { label: string; href?: string };

/** Breadcrumb navigation — last item is current page (no href). */
export function Breadcrumb({
  items,
  className,
}: {
  items: BreadcrumbItem[];
  className?: string;
}) {
  return (
    <nav
      aria-label="Хлебные крошки"
      className={cn(
        "flex flex-wrap items-center gap-1.5 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint",
        className,
      )}
    >
      <ol role="list" className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span aria-hidden className="select-none">
                ›
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:rounded-[var(--radius-xs)]"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-text-muted">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 2: Add export to `components/ds/index.ts`**

Add to the end of `components/ds/index.ts`:
```ts
export { Breadcrumb, type BreadcrumbItem } from "./breadcrumb";
```

- [ ] **Step 3: Remove local `Breadcrumb` from `components/product/sections.tsx`**

Delete the entire `Breadcrumb` function (lines 24–49 in the original file). Remove the `ChevronRight` import from lucide-react at the top. Add to the DS imports:

```tsx
import {
  Container,
  Eyebrow,
  Badge,
  Chip,
  Divider,
  Surface,
  SpecTable,
  AccordionItem,
  Figure,
  Gallery,
  Breadcrumb,
  buttonVariants,
} from "@/components/ds";
```

- [ ] **Step 4: Update `app/catalog/[slug]/page.tsx`**

Remove `Breadcrumb` from the import of `@/components/product/sections` and import it from DS:

```tsx
import { Breadcrumb } from "@/components/ds";
import {
  ProductHero,
  FeatureBand,
  TechBand,
  SoftwareSection,
  SpecsSection,
} from "@/components/product/sections";
```

Update the render call — prepend "Главная":

```tsx
<div className="pt-6">
  <Container>
    <Breadcrumb
      items={[{ label: "Главная", href: "/" }, ...p.breadcrumb]}
    />
  </Container>
</div>
```

- [ ] **Step 5: Run build**

```bash
npm run build
```

Expected: green.

- [ ] **Step 6: Commit**

```bash
git add components/ds/breadcrumb.tsx components/ds/index.ts components/product/sections.tsx app/catalog/[slug]/page.tsx
git commit -m "feat(ds): Breadcrumb primitive — promoted from product page"
```

---

### Task 5: `Prose` DS primitive

**Files:**
- Create: `components/ds/prose.tsx`
- Modify: `components/ds/index.ts`
- Modify: `app/catalog/[slug]/page.tsx` — wrap MDX body in `Prose`

**Interfaces:**
- Produces: `export function Prose({ className, ...props }: React.HTMLAttributes<HTMLDivElement>)`

- [ ] **Step 1: Create `components/ds/prose.tsx`**

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Prose wrapper — styles MDX body output with DS type scale.
 * Wrap any rendered <Mdx /> output in this component.
 */
export function Prose({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "max-w-prose",
        // Headings
        "[&_h2]:mt-8 [&_h2]:font-display [&_h2]:uppercase [&_h2]:text-text [&_h2]:text-xl [&_h2]:tracking-[var(--ls-tight)] [&_h2]:leading-[var(--lh-tight)]",
        "[&_h3]:mt-6 [&_h3]:font-display [&_h3]:uppercase [&_h3]:text-text [&_h3]:text-lg [&_h3]:tracking-[var(--ls-tight)]",
        // Body
        "[&_p]:mt-4 [&_p]:text-base [&_p]:text-text",
        // Lists
        "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mt-1.5 [&_ul_li]:text-base [&_ul_li]:text-text",
        "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:mt-1.5 [&_ol_li]:text-base [&_ol_li]:text-text",
        // Blockquote
        "[&_blockquote]:mt-6 [&_blockquote]:border-l-[3px] [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:text-text-muted [&_blockquote]:italic",
        // Inline
        "[&_strong]:font-semibold [&_strong]:text-text",
        "[&_a]:text-accent [&_a]:underline-offset-2 hover:[&_a]:underline",
        "[&_code]:font-mono [&_code]:text-sm [&_code]:text-text-muted [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-[var(--radius-xs)]",
        className,
      )}
      style={{ lineHeight: "var(--lh-relaxed)" }}
      {...props}
    />
  );
}
```

- [ ] **Step 2: Add export to `components/ds/index.ts`**

```ts
export { Prose } from "./prose";
```

- [ ] **Step 3: Update `app/catalog/[slug]/page.tsx`**

Add `Prose` to the DS import. Replace the MDX body section:

```tsx
{body.trim() ? (
  <section className="py-8">
    <Container>
      <Prose>
        <Mdx source={body} />
      </Prose>
    </Container>
  </section>
) : null}
```

- [ ] **Step 4: Run build**

```bash
npm run build
```

Expected: green.

- [ ] **Step 5: Commit**

```bash
git add components/ds/prose.tsx components/ds/index.ts app/catalog/[slug]/page.tsx
git commit -m "feat(ds): Prose primitive for MDX body styling"
```

---

### Task 6: `SpecMatrixTable` DS primitive

**Files:**
- Create: `components/ds/spec-matrix-table.tsx`
- Create: `components/ds/__tests__/spec-matrix-table.test.tsx`
- Modify: `components/ds/index.ts`

**Interfaces:**
- Produces:
  ```ts
  export function SpecMatrixTable(props: SpecMatrixProps): JSX.Element
  type SpecMatrixProps = {
    columns: string[]
    rows: { label: string; values: (string | null)[] }[]
    caption?: string
  }
  ```

- [ ] **Step 1: Write failing test**

Create `components/ds/__tests__/spec-matrix-table.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpecMatrixTable } from "../spec-matrix-table";

const COLUMNS = ["TD-2000", "TD-1000"];
const ROWS = [
  { label: "Мощность", values: ["2×1000 Вт", "2×500 Вт"] },
  { label: "Частота", values: ["20–20000 Гц", null] },
  { label: "КНИ", values: [null, null] },
];

describe("SpecMatrixTable", () => {
  it("renders column headers", () => {
    render(<SpecMatrixTable columns={COLUMNS} rows={ROWS} />);
    expect(screen.getByText("TD-2000")).toBeInTheDocument();
    expect(screen.getByText("TD-1000")).toBeInTheDocument();
  });

  it("renders null values as em dash", () => {
    render(<SpecMatrixTable columns={COLUMNS} rows={ROWS} />);
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBe(3); // two null values + two in КНИ row = 3 total
  });

  it("renders row labels", () => {
    render(<SpecMatrixTable columns={COLUMNS} rows={ROWS} />);
    expect(screen.getByText("Мощность")).toBeInTheDocument();
    expect(screen.getByText("Частота")).toBeInTheDocument();
  });

  it("renders caption when provided", () => {
    render(<SpecMatrixTable columns={COLUMNS} rows={ROWS} caption="Сравнение моделей" />);
    expect(screen.getByText("Сравнение моделей")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — expect failures**

```bash
npm test components/ds/__tests__/spec-matrix-table.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `components/ds/spec-matrix-table.tsx`**

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export type SpecMatrixProps = {
  columns: string[];
  rows: { label: string; values: (string | null)[] }[];
  caption?: string;
};

/** N-column spec comparison table — for series pages and category comparisons. */
export function SpecMatrixTable({ columns, rows, caption }: SpecMatrixProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-collapse text-left">
        {caption && (
          <caption className="sr-only">{caption}</caption>
        )}
        <thead>
          <tr className="border-b border-border">
            <th className="w-40 py-3 pr-4 font-mono text-xs uppercase tracking-[var(--ls-label)] text-text-faint">
              {/* spec label column — no header text */}
            </th>
            {columns.map((col) => (
              <th
                key={col}
                className="py-3 px-4 font-mono text-xs uppercase tracking-[var(--ls-label)] text-text text-center"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={row.label}
              className={cn(
                "border-b border-border",
                i % 2 === 1 && "bg-surface-2",
              )}
            >
              <td className="py-3 pr-4 font-mono text-xs text-text-muted">
                {row.label}
              </td>
              {columns.map((col, j) => (
                <td
                  key={col}
                  className="py-3 px-4 text-sm text-text text-center tabular"
                >
                  {row.values[j] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test components/ds/__tests__/spec-matrix-table.test.tsx
```

Expected: `4 passed`.

- [ ] **Step 5: Add export to `components/ds/index.ts`**

```ts
export { SpecMatrixTable, type SpecMatrixProps } from "./spec-matrix-table";
```

- [ ] **Step 6: Run build**

```bash
npm run build
```

Expected: green.

- [ ] **Step 7: Commit**

```bash
git add components/ds/spec-matrix-table.tsx components/ds/__tests__/spec-matrix-table.test.tsx components/ds/index.ts
git commit -m "feat(ds): SpecMatrixTable — N-column spec comparison for series pages"
```

---

### Task 7: `ProductCard` DS primitive

**Files:**
- Create: `components/ds/product-card.tsx`
- Modify: `components/ds/index.ts`

**Interfaces:**
- Produces:
  ```ts
  export function ProductCard(props: ProductCardProps): JSX.Element
  type ProductCardProps = {
    slug: string
    name: string
    eyebrow: string
    image: { src: string; alt: string; width: number; height: number }
    price?: { amount?: number; onRequest?: boolean }
    badge?: string
  }
  ```

- [ ] **Step 1: Create `components/ds/product-card.tsx`**

```tsx
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Eyebrow, Badge } from "./primitives";
import { formatPrice } from "@/lib/format";

export type ProductCardProps = {
  slug: string;
  name: string;
  eyebrow: string;
  image: { src: string; alt: string; width: number; height: number };
  price?: { amount?: number; onRequest?: boolean };
  badge?: string;
  className?: string;
};

/** Catalog grid card — links to /catalog/[slug]. */
export function ProductCard({
  slug,
  name,
  eyebrow,
  image,
  price,
  badge,
  className,
}: ProductCardProps) {
  const priceText =
    price?.onRequest
      ? "По запросу"
      : price?.amount != null
        ? formatPrice(price.amount)
        : null;

  return (
    <Link
      href={`/catalog/${slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg transition-[box-shadow,border-color] duration-[var(--dur-base)]",
        "hover:border-accent hover:shadow-[var(--shadow-2)]",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]",
        className,
      )}
    >
      {/* Badge overlay */}
      {badge && (
        <div className="absolute left-3 top-3 z-10">
          <Badge>{badge}</Badge>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-[4/3] w-full bg-surface-2">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-4"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <Eyebrow>{eyebrow}</Eyebrow>
        <p
          className="font-display uppercase text-text"
          style={{
            fontSize: "var(--text-lg)",
            lineHeight: "var(--lh-snug)",
            letterSpacing: "var(--ls-tight)",
          }}
        >
          {name}
        </p>
        {priceText && (
          <p className="mt-auto pt-3 font-mono text-sm text-text-muted tabular">
            {priceText}
          </p>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Add export to `components/ds/index.ts`**

```ts
export { ProductCard, type ProductCardProps } from "./product-card";
```

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: green.

- [ ] **Step 4: Commit (P1a complete)**

```bash
git add components/ds/product-card.tsx components/ds/index.ts
git commit -m "feat(ds): ProductCard primitive — catalog grid card with optional price/badge"
```

---

### Task 8: Motion utilities

**Files:**
- Modify: `app/globals.css`

**Interfaces:**
- Produces: Tailwind utility classes `transition-base`, `transition-slow`, `glow-red`, `glow-amber` available in all components

- [ ] **Step 1: Add utilities to `app/globals.css`**

After the existing base styles (after the `.tabular` rule, before the end of the file), add:

```css
/* ============================================================
   Motion utilities
   ============================================================ */
@utility transition-base {
  transition-property: color, background-color, border-color, box-shadow, opacity, transform;
  transition-duration: var(--dur-base);
  transition-timing-function: var(--ease-out);
}

@utility transition-slow {
  transition-property: color, background-color, border-color, box-shadow, opacity, transform;
  transition-duration: var(--dur-slow);
  transition-timing-function: var(--ease-out);
}

@utility glow-red {
  box-shadow: var(--glow-red);
}

@utility glow-amber {
  box-shadow: var(--glow-amber);
}
```

- [ ] **Step 2: Run build**

```bash
npm run build
```

Expected: green.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "feat(ds): motion utilities — transition-base/slow, glow-red/amber"
```

---

### Task 9: `PillGroup` DS primitive

**Files:**
- Create: `components/ds/pill-group.tsx`
- Create: `components/ds/__tests__/pill-group.test.tsx`
- Modify: `components/ds/index.ts`

**Interfaces:**
- Produces:
  ```ts
  export function PillGroup(props: PillGroupProps): JSX.Element
  type PillGroupProps = {
    options: { value: string; label: string }[]
    value: string
    onChange: (value: string) => void
    tabRole?: boolean
    className?: string
  }
  ```

- [ ] **Step 1: Write failing test**

Create `components/ds/__tests__/pill-group.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PillGroup } from "../pill-group";

const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

describe("PillGroup", () => {
  it("renders all options", () => {
    render(<PillGroup options={OPTIONS} value="a" onChange={() => {}} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("calls onChange with clicked value", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PillGroup options={OPTIONS} value="a" onChange={handleChange} />);
    await user.click(screen.getByText("Beta"));
    expect(handleChange).toHaveBeenCalledWith("b");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("does not call onChange when clicking already-selected option", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PillGroup options={OPTIONS} value="a" onChange={handleChange} />);
    await user.click(screen.getByText("Alpha"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("uses tablist role when tabRole=true", () => {
    render(<PillGroup options={OPTIONS} value="a" onChange={() => {}} tabRole />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(2);
  });

  it("uses group role by default", () => {
    render(<PillGroup options={OPTIONS} value="a" onChange={() => {}} />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test — expect failures**

```bash
npm test components/ds/__tests__/pill-group.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `components/ds/pill-group.tsx`**

```tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type PillGroupOption = { value: string; label: string };

export type PillGroupProps = {
  options: PillGroupOption[];
  value: string;
  onChange: (value: string) => void;
  tabRole?: boolean;
  className?: string;
};

/** Controlled pill selector. Use tabRole for Tabs; default for standalone filters. */
export function PillGroup({
  options,
  value,
  onChange,
  tabRole = false,
  className,
}: PillGroupProps) {
  return (
    <div
      role={tabRole ? "tablist" : "group"}
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((opt) => {
        const isSelected = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role={tabRole ? "tab" : undefined}
            aria-selected={tabRole ? isSelected : undefined}
            onClick={() => {
              if (!isSelected) onChange(opt.value);
            }}
            className={cn(
              "inline-flex items-center rounded-[var(--radius-pill)] border px-3.5 py-1.5 font-mono text-xs uppercase tracking-[var(--ls-label)] transition-colors duration-[var(--dur-base)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]",
              isSelected
                ? "border-accent bg-accent text-on-accent"
                : "border-border text-text-muted hover:border-accent hover:text-accent",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test components/ds/__tests__/pill-group.test.tsx
```

Expected: `5 passed`.

- [ ] **Step 5: Add export to `components/ds/index.ts`**

```ts
export { PillGroup, type PillGroupProps, type PillGroupOption } from "./pill-group";
```

- [ ] **Step 6: Commit**

```bash
git add components/ds/pill-group.tsx components/ds/__tests__/pill-group.test.tsx components/ds/index.ts
git commit -m "feat(ds): PillGroup — controlled pill selector with tabRole support"
```

---

### Task 10: `Tabs` DS primitive

**Files:**
- Create: `components/ds/tabs.tsx`
- Create: `components/ds/__tests__/tabs.test.tsx`
- Modify: `components/ds/index.ts`

**Interfaces:**
- Consumes: `PillGroup` from Task 9
- Produces:
  ```ts
  export function Tabs(props: TabsProps): JSX.Element
  type TabsProps = {
    items: { value: string; label: string; content: React.ReactNode }[]
    defaultValue?: string
    value?: string
    onChange?: (value: string) => void
  }
  ```

- [ ] **Step 1: Write failing test**

Create `components/ds/__tests__/tabs.test.tsx`:
```tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "../tabs";

const ITEMS = [
  { value: "x", label: "Вкладка X", content: <p>Панель X</p> },
  { value: "y", label: "Вкладка Y", content: <p>Панель Y</p> },
];

describe("Tabs", () => {
  it("shows panel for defaultValue on mount", () => {
    render(<Tabs items={ITEMS} defaultValue="x" />);
    expect(screen.getByText("Панель X")).toBeInTheDocument();
    const panelY = screen.getByRole("tabpanel", { name: "Вкладка Y" });
    expect(panelY).toHaveAttribute("hidden");
  });

  it("switches panel on pill click", async () => {
    const user = userEvent.setup();
    render(<Tabs items={ITEMS} defaultValue="x" />);
    await user.click(screen.getByRole("tab", { name: "Вкладка Y" }));
    const panelX = screen.getByRole("tabpanel", { name: "Вкладка X" });
    const panelY = screen.getByRole("tabpanel", { name: "Вкладка Y" });
    expect(panelX).toHaveAttribute("hidden");
    expect(panelY).not.toHaveAttribute("hidden");
  });

  it("calls onChange when controlled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Tabs items={ITEMS} value="x" onChange={handleChange} />);
    await user.click(screen.getByRole("tab", { name: "Вкладка Y" }));
    expect(handleChange).toHaveBeenCalledWith("y");
  });

  it("first item is default when no defaultValue", () => {
    render(<Tabs items={ITEMS} />);
    const panelX = screen.getByRole("tabpanel", { name: "Вкладка X" });
    expect(panelX).not.toHaveAttribute("hidden");
  });
});
```

- [ ] **Step 2: Run test — expect failures**

```bash
npm test components/ds/__tests__/tabs.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `components/ds/tabs.tsx`**

```tsx
"use client";

import * as React from "react";
import { PillGroup } from "./pill-group";

export type TabItem = {
  value: string;
  label: string;
  content: React.ReactNode;
};

export type TabsProps = {
  items: TabItem[];
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
};

/** Tabbed panel — uncontrolled (defaultValue) or controlled (value + onChange). */
export function Tabs({ items, defaultValue, value, onChange }: TabsProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(
    defaultValue ?? items[0]?.value ?? "",
  );
  const active = isControlled ? value : internalValue;

  function handleChange(v: string) {
    if (!isControlled) setInternalValue(v);
    onChange?.(v);
  }

  const tabOptions = items.map((item) => ({
    value: item.value,
    label: item.label,
  }));

  return (
    <div>
      <PillGroup
        options={tabOptions}
        value={active}
        onChange={handleChange}
        tabRole
        className="mb-6"
      />
      {items.map((item) => {
        const panelId = `tabpanel-${item.value}`;
        const tabId = `tab-${item.value}`;
        const isActive = item.value === active;
        return (
          <div
            key={item.value}
            id={panelId}
            role="tabpanel"
            aria-labelledby={tabId}
            hidden={!isActive || undefined}
          >
            {item.content}
          </div>
        );
      })}
    </div>
  );
}
```

Note: `aria-labelledby` points to the pill button's id. Update `PillGroup` to set `id={tabRole ? \`tab-${opt.value}\` : undefined}` on each button.

- [ ] **Step 4: Update `PillGroup` to set `id` on tab buttons**

In `components/ds/pill-group.tsx`, inside the `.map()`, add `id` to the `<button>`:

```tsx
id={tabRole ? `tab-${opt.value}` : undefined}
```

- [ ] **Step 5: Run tests — expect pass**

```bash
npm test components/ds/__tests__/tabs.test.tsx components/ds/__tests__/pill-group.test.tsx
```

Expected: `9 passed` (5 pill + 4 tabs).

- [ ] **Step 6: Add export to `components/ds/index.ts`**

```ts
export { Tabs, type TabsProps, type TabItem } from "./tabs";
```

- [ ] **Step 7: Run build**

```bash
npm run build
```

Expected: green.

- [ ] **Step 8: Commit**

```bash
git add components/ds/tabs.tsx components/ds/__tests__/tabs.test.tsx components/ds/pill-group.tsx components/ds/index.ts
git commit -m "feat(ds): Tabs + PillGroup tab ids — controlled/uncontrolled tabbed panel"
```

---

### Task 11: `MobileNav` + wire into `SiteHeader`

**Files:**
- Create: `components/layout/mobile-nav.tsx`
- Create: `components/layout/__tests__/mobile-nav.test.tsx`
- Modify: `components/layout/site-header.tsx`

**Interfaces:**
- Produces:
  ```ts
  export function MobileNav({ nav }: { nav: NavItem[] }): JSX.Element
  type NavItem = { label: string; href: string }
  ```

- [ ] **Step 1: Write failing test**

Create `components/layout/__tests__/mobile-nav.test.tsx`:
```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileNav } from "../mobile-nav";

const NAV = [
  { label: "Каталог", href: "/catalog" },
  { label: "О компании", href: "/istoriya" },
];

describe("MobileNav", () => {
  it("renders hamburger button initially", () => {
    render(<MobileNav nav={NAV} />);
    expect(screen.getByRole("button", { name: /открыть меню/i })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens overlay on hamburger click", async () => {
    const user = userEvent.setup();
    render(<MobileNav nav={NAV} />);
    await user.click(screen.getByRole("button", { name: /открыть меню/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Каталог")).toBeInTheDocument();
  });

  it("closes overlay on close button click", async () => {
    const user = userEvent.setup();
    render(<MobileNav nav={NAV} />);
    await user.click(screen.getByRole("button", { name: /открыть меню/i }));
    await user.click(screen.getByRole("button", { name: /закрыть меню/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes overlay on Escape key", async () => {
    const user = userEvent.setup();
    render(<MobileNav nav={NAV} />);
    await user.click(screen.getByRole("button", { name: /открыть меню/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("hamburger has aria-expanded=true when open", async () => {
    const user = userEvent.setup();
    render(<MobileNav nav={NAV} />);
    const btn = screen.getByRole("button", { name: /открыть меню/i });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });
});
```

- [ ] **Step 2: Run test — expect failures**

```bash
npm test components/layout/__tests__/mobile-nav.test.tsx
```

Expected: FAIL — module not found.

- [ ] **Step 3: Create `components/layout/mobile-nav.tsx`**

```tsx
"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Container, Surface, Rule } from "@/components/ds";

export type NavItem = { label: string; href: string };

function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
) {
  React.useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const focusable = Array.from(
      el.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [active, ref]);
}

/** Full-screen mobile nav overlay — visible at < lg. */
export function MobileNav({ nav }: { nav: NavItem[] }) {
  const [open, setOpen] = React.useState(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const overlayId = "mobile-nav-overlay";

  useFocusTrap(overlayRef, open);

  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Открыть меню"
        aria-expanded={open}
        aria-controls={overlayId}
        onClick={() => setOpen(true)}
        className="inline-flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-border text-text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)] lg:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      {open && (
        {/* Surface doesn't forwardRef — use raw div with data-surface="dark" */}
        <div
          ref={overlayRef}
          data-surface="dark"
          id={overlayId}
          role="dialog"
          aria-modal="true"
          aria-label="Навигация"
          className="fixed inset-0 z-50 flex flex-col bg-bg text-text"
          style={{
            animation: "mobileNavIn var(--dur-slow) var(--ease-out) both",
          }}
        >
          {/* Header row */}
          <Container className="flex h-[58px] shrink-0 items-center justify-between">
            <Link href="/" onClick={() => setOpen(false)} aria-label="NAG — на главную">
              <Image
                src="/brand/nag-logo-ondark.png"
                alt="NAG"
                width={96}
                height={20}
                className="h-5 w-auto"
              />
            </Link>
            <button
              type="button"
              aria-label="Закрыть меню"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              className="inline-flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-border text-text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]"
            >
              <X className="size-5" aria-hidden />
            </button>
          </Container>

          {/* Nav links */}
          <nav aria-label="Основная навигация" className="flex-1 overflow-y-auto">
            <Container className="py-8">
              {nav.map((item, i) => (
                <React.Fragment key={item.href}>
                  {i > 0 && <Rule className="my-4 w-full" />}
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-2 font-display uppercase text-text transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:rounded-[var(--radius-xs)]"
                    style={{
                      fontSize: "clamp(var(--text-2xl), 7vw, var(--text-4xl))",
                      lineHeight: "var(--lh-tight)",
                      letterSpacing: "var(--ls-tight)",
                    }}
                  >
                    {item.label}
                  </Link>
                </React.Fragment>
              ))}
            </Container>
          </nav>
        </div>
      )}
    </>
  );
}
```

Note: `nag-logo-ondark.png` may not exist yet — use `nag-logo-onlight.png` as a fallback for now, or copy the asset. See Step 4.

- [ ] **Step 4: Check if dark logo exists, use fallback if not**

```bash
ls /Users/viktor/Code/NAG-SITE/public/brand/
```

If `nag-logo-ondark.png` does NOT exist, replace it in `mobile-nav.tsx` with `nag-logo-onlight.png` for now (TODO: replace with dark variant in P4).

- [ ] **Step 5: Add keyframe to `app/globals.css`**

Add after the motion utilities block:

```css
@keyframes mobileNavIn {
  from { opacity: 0; transform: translateY(-8px); }
  to   { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  @keyframes mobileNavIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
}
```

- [ ] **Step 6: Wire `MobileNav` into `SiteHeader`**

Replace all of `components/layout/site-header.tsx`:

```tsx
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Container } from "@/components/ds";
import { MobileNav } from "./mobile-nav";

const NAV = [
  { label: "Каталог", href: "/catalog" },
  { label: "Процессоры", href: "/catalog/processors" },
  { label: "Усилители", href: "/catalog/amplifiers" },
  { label: "Лампы", href: "/catalog/tubes" },
  { label: "О компании", href: "/istoriya" },
  { label: "Контакты", href: "/kontakty" },
];

/** Global sticky navigation header. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/86 backdrop-blur-md supports-[backdrop-filter]:bg-bg/72">
      <Container className="flex h-[58px] items-center gap-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="NAG — на главную">
          <Image
            src="/brand/nag-logo-onlight.png"
            alt="NAG"
            width={96}
            height={20}
            priority
            className="h-5 w-auto"
          />
        </Link>

        <nav className="hidden flex-1 items-center gap-6 lg:flex" aria-label="Основная навигация">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:rounded-[var(--radius-xs)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 lg:flex-none">
          <button
            type="button"
            aria-label="Корзина"
            className="inline-flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-border text-text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]"
          >
            <ShoppingCart className="size-4" aria-hidden />
          </button>
          <MobileNav nav={NAV} />
        </div>
      </Container>
    </header>
  );
}
```

- [ ] **Step 7: Run tests — expect pass**

```bash
npm test components/layout/__tests__/mobile-nav.test.tsx
```

Expected: `5 passed`.

- [ ] **Step 8: Run build**

```bash
npm run build
```

Expected: green.

- [ ] **Step 9: Commit**

```bash
git add components/layout/mobile-nav.tsx components/layout/__tests__/mobile-nav.test.tsx components/layout/site-header.tsx app/globals.css
git commit -m "feat(layout): MobileNav — full-screen dark overlay, Escape/focus-trap, wire into SiteHeader"
```

---

### Task 12: A11y pass on existing primitives

**Files:**
- Modify: `components/ds/gallery.tsx`
- Modify: `components/ds/toc.tsx`
- Modify: `components/ds/scroll-progress.tsx`

**Interfaces:**
- No new exports; changes are purely additive ARIA attributes and CSS

- [ ] **Step 1: Update `components/ds/gallery.tsx`**

Replace the outer wrapper `<div>` with a `<section>` that has `role="region"` and `aria-label`:

```tsx
// Change:
<div className={cn("flex flex-col gap-3", className)}>
// To:
<section
  role="region"
  aria-label="Галерея изображений"
  className={cn("flex flex-col gap-3", className)}
>
```

Close tag changes accordingly (`</section>` instead of `</div>`).

Also fix `scrollTo` to use instant scroll under `prefers-reduced-motion`. Replace the `scrollTo` function:

```tsx
const scrollTo = (i: number) => {
  const jump = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  embla?.scrollTo(i, jump); // second arg = jump (instant, no animation)
};
```

Also verify thumbnail buttons have `focus-visible` ring — the thumbnail `<button>` currently uses `transition-colors` but lacks a focus ring. Add:
```tsx
className={cn(
  "relative aspect-square w-16 shrink-0 overflow-hidden rounded-[var(--radius-sm)] border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]",
  ...
)}
```

- [ ] **Step 2: Update `components/ds/toc.tsx`**

Add `aria-current="location"` to the active link. In the `<a>` tag, add:

```tsx
aria-current={isActive ? "location" : undefined}
```

- [ ] **Step 3: Update `components/ds/scroll-progress.tsx`**

Add `prefers-reduced-motion` hiding. Wrap the returned JSX with a CSS class and add a rule in `globals.css`:

In `scroll-progress.tsx`, add `className` to the outer div:

```tsx
return (
  <div
    className="h-[var(--border-w-rule)] w-full bg-[color-mix(in_srgb,var(--text)_7%,transparent)] motion-reduce:hidden"
    aria-hidden
  >
    <div
      className="h-full bg-accent transition-[width] duration-75 ease-linear"
      style={{ width: `${pct}%` }}
    />
  </div>
);
```

Notes:
- `motion-reduce:hidden` is a Tailwind v4 variant for `@media (prefers-reduced-motion: reduce)` → `display: none`
- Replace the hardcoded `rgba(11,11,13,0.07)` background with `color-mix(in_srgb,var(--text)_7%,transparent)` to use a token-relative value
- Add `aria-hidden` — the progress bar is purely decorative

- [ ] **Step 4: Run build**

```bash
npm run build
```

Expected: green.

- [ ] **Step 5: Verify no hardcoded hex in components**

```bash
grep -rE '#[0-9a-fA-F]{3,6}' components/
```

Expected: zero matches (all primitives use CSS vars / Tailwind tokens).

- [ ] **Step 6: Commit**

```bash
git add components/ds/gallery.tsx components/ds/toc.tsx components/ds/scroll-progress.tsx
git commit -m "a11y: Gallery region/aria-label, Toc aria-current, ScrollProgress motion-reduce"
```

---

### Task 13: `/_ds` dev-only reference route

**Files:**
- Create: `app/_ds/page.tsx`

**Interfaces:**
- No exports. Route returns `notFound()` in production; renders a full DS catalog in dev.

- [ ] **Step 1: Create `app/_ds/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import {
  Container,
  Eyebrow,
  Badge,
  Chip,
  Divider,
  Rule,
  Surface,
  Button,
  Breadcrumb,
  Prose,
  SpecTable,
  SpecMatrixTable,
  ProductCard,
  AccordionItem,
} from "@/components/ds";
import { TabsDemo } from "./_tabs-demo";
import { PillDemo } from "./_pill-demo";

export default function DsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="py-10">
      <Container>
        <h1
          className="mb-2 font-display uppercase text-text"
          style={{ fontSize: "var(--text-4xl)", letterSpacing: "var(--ls-tight)" }}
        >
          DS Reference
        </h1>
        <p className="mb-12 font-mono text-xs text-text-faint">dev only · не индексируется</p>

        {/* ── PALETTE ── */}
        <Section title="Palette">
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {[
              ["bg", "bg-bg"],
              ["surface", "bg-surface"],
              ["surface-2", "bg-surface-2"],
              ["border", "bg-border"],
              ["text", "bg-text"],
              ["text-muted", "bg-text-muted"],
              ["accent", "bg-accent"],
              ["accent-wash", "bg-accent-wash"],
            ].map(([name, cls]) => (
              <div key={name}>
                <div className={`h-10 rounded-[var(--radius-sm)] border border-border ${cls}`} />
                <p className="mt-1 font-mono text-2xs text-text-faint">{name}</p>
              </div>
            ))}
          </div>
          <Surface mode="dark" className="mt-4 rounded-[var(--radius-lg)] p-4">
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
              {[
                ["bg", "bg-bg"],
                ["surface", "bg-surface"],
                ["surface-2", "bg-surface-2"],
                ["border", "bg-border"],
                ["text", "bg-text"],
                ["text-muted", "bg-text-muted"],
                ["accent", "bg-accent"],
                ["accent-wash", "bg-accent-wash"],
              ].map(([name, cls]) => (
                <div key={name}>
                  <div className={`h-10 rounded-[var(--radius-sm)] border border-border ${cls}`} />
                  <p className="mt-1 font-mono text-2xs text-text-faint">{name}</p>
                </div>
              ))}
            </div>
          </Surface>
        </Section>

        {/* ── TYPOGRAPHY ── */}
        <Section title="Typography">
          {(["2xs","xs","sm","base","md","lg","xl","2xl","3xl","4xl"] as const).map((size) => (
            <div key={size} className="flex items-baseline gap-4 border-b border-border py-2">
              <span className="w-10 font-mono text-2xs text-text-faint">{size}</span>
              <span className={`font-text text-${size} text-text`}>
                Качество звука NAG · NOVIK
              </span>
            </div>
          ))}
          <div className="mt-6 space-y-2">
            <p className="font-display uppercase text-2xl tracking-[var(--ls-tight)] text-text">Display — Oswald</p>
            <p className="font-text text-base text-text">Body — Golos Text</p>
            <p className="font-mono text-sm tracking-[var(--ls-mono)] text-text">Mono — JetBrains Mono</p>
            <Eyebrow>Eyebrow label</Eyebrow>
          </div>
        </Section>

        {/* ── BUTTONS ── */}
        <Section title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>
          <Surface mode="dark" className="mt-4 rounded-[var(--radius-lg)] p-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </Surface>
        </Section>

        {/* ── ATOMS ── */}
        <Section title="Atoms">
          <div className="flex flex-wrap items-center gap-4">
            <Badge>BEST SELLER</Badge>
            <Badge>NEW</Badge>
            <Chip>32 bit DSP</Chip>
            <Chip>192 kHz</Chip>
            <Eyebrow>Eyebrow</Eyebrow>
            <Eyebrow accent>Accent eyebrow</Eyebrow>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Rule />
            <Divider className="flex-1" />
          </div>
        </Section>

        {/* ── BREADCRUMB ── */}
        <Section title="Breadcrumb">
          <Breadcrumb
            items={[
              { label: "Главная", href: "/" },
              { label: "Каталог", href: "/catalog" },
              { label: "D-8000 WI-FI" },
            ]}
          />
        </Section>

        {/* ── PROSE ── */}
        <Section title="Prose">
          <Prose>
            <h2>Заголовок второго уровня</h2>
            <p>Обычный абзац с <strong>жирным текстом</strong> и <a href="#">ссылкой</a>.</p>
            <h3>Заголовок третьего уровня</h3>
            <ul>
              <li>Первый элемент списка</li>
              <li>Второй элемент</li>
            </ul>
            <blockquote>Цитата из документации.</blockquote>
          </Prose>
        </Section>

        {/* ── SPEC TABLE ── */}
        <Section title="SpecTable">
          <SpecTable
            rows={[
              { label: "Входы", value: "4 × XLR" },
              { label: "Выходы", value: "8 × XLR" },
              { label: "АЦП/ЦАП", value: "192 кГц / 32 бит" },
            ]}
          />
        </Section>

        {/* ── SPEC MATRIX ── */}
        <Section title="SpecMatrixTable">
          <SpecMatrixTable
            caption="Сравнение моделей TD"
            columns={["TD-2000", "TD-1500", "TD-1000"]}
            rows={[
              { label: "Мощность", values: ["2×1000 Вт", "2×750 Вт", "2×500 Вт"] },
              { label: "Импеданс", values: ["4 / 8 Ом", "4 / 8 Ом", null] },
              { label: "КНИ", values: ["<0.05%", "<0.05%", "<0.1%"] },
            ]}
          />
        </Section>

        {/* ── PRODUCT CARD ── */}
        <Section title="ProductCard">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <ProductCard
              slug="d-8000"
              name="NAG D-8000 WI-FI"
              eyebrow="DSP Processor"
              image={{ src: "/products/d-8000/nag-d8000-front-panel.jpg", alt: "D-8000", width: 600, height: 450 }}
              price={{ amount: 122900 }}
              badge="BEST SELLER"
            />
            <ProductCard
              slug="e12"
              name="NOVIK E12"
              eyebrow="Ламповый усилитель"
              image={{ src: "/products/d-8000/nag-d8000-front-panel.jpg", alt: "E12", width: 600, height: 450 }}
              price={{ onRequest: true }}
            />
          </div>
        </Section>

        {/* ── ACCORDION ── */}
        <Section title="AccordionItem">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg">
            <AccordionItem summary="Открытый аккордеон" defaultOpen>
              <p className="text-sm text-text-muted">Содержимое первого раздела.</p>
            </AccordionItem>
            <AccordionItem summary="Закрытый аккордеон" className="border-t border-border">
              <p className="text-sm text-text-muted">Содержимое второго раздела.</p>
            </AccordionItem>
          </div>
        </Section>

        {/* ── TABS / PILL ── */}
        <Section title="Tabs + PillGroup">
          <TabsDemo />
          <div className="mt-6">
            <p className="mb-3 font-mono text-xs text-text-faint">PillGroup (standalone filter)</p>
            <PillDemo />
          </div>
        </Section>

        {/* ── MOTION ── */}
        <Section title="Motion tokens">
          <div className="flex flex-wrap gap-4">
            {(["transition-base", "transition-slow"] as const).map((cls) => (
              <div
                key={cls}
                className={`h-16 w-32 cursor-pointer rounded-[var(--radius-md)] bg-accent text-on-accent flex items-center justify-center font-mono text-xs text-center p-2 ${cls} hover:scale-110 hover:bg-accent-hover`}
              >
                {cls}
              </div>
            ))}
            <div className="h-16 w-32 rounded-[var(--radius-md)] bg-surface border border-border flex items-center justify-center font-mono text-xs text-center p-2 glow-red">
              glow-red
            </div>
            <div className="h-16 w-32 rounded-[var(--radius-md)] bg-surface border border-border flex items-center justify-center font-mono text-xs text-center p-2 glow-amber">
              glow-amber
            </div>
          </div>
        </Section>
      </Container>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2
        className="mb-6 font-display uppercase text-text border-b border-border pb-3"
        style={{ fontSize: "var(--text-xl)", letterSpacing: "var(--ls-tight)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
```

- [ ] **Step 2: Create client demo components for `/_ds`**

Create `app/_ds/_tabs-demo.tsx`:
```tsx
"use client";
import { useState } from "react";
import { Tabs } from "@/components/ds";

export function TabsDemo() {
  return (
    <Tabs
      defaultValue="a"
      items={[
        { value: "a", label: "Модель A", content: <p className="text-sm text-text-muted">Панель A — TD-2000</p> },
        { value: "b", label: "Модель B", content: <p className="text-sm text-text-muted">Панель B — TD-1000</p> },
        { value: "c", label: "Модель C", content: <p className="text-sm text-text-muted">Панель C — TD-500</p> },
      ]}
    />
  );
}
```

Create `app/_ds/_pill-demo.tsx`:
```tsx
"use client";
import { useState } from "react";
import { PillGroup } from "@/components/ds";

export function PillDemo() {
  const [v, setV] = useState("all");
  return (
    <PillGroup
      options={[
        { value: "all", label: "Все" },
        { value: "dsp", label: "Процессоры" },
        { value: "amps", label: "Усилители" },
        { value: "tubes", label: "Лампы" },
      ]}
      value={v}
      onChange={setV}
    />
  );
}
```

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: green. The `/_ds` route builds but returns 404 in production.

- [ ] **Step 4: Verify dev access**

```bash
npm run dev &
# open http://localhost:3000/_ds in a browser — should render the reference page
# kill the dev server
```

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: all tests pass.

- [ ] **Step 6: Verify no hardcoded hex**

```bash
grep -rE '#[0-9a-fA-F]{3,6}' components/
```

Expected: zero matches.

- [ ] **Step 7: Commit (P1b complete)**

```bash
git add app/_ds/ components/ds/index.ts
git commit -m "feat: /_ds dev-only DS reference route — palette, typography, all primitives"
```

---

### Task 14: Final verification + P1 master-plan status update

**Files:**
- Modify: `docs/MASTER-PLAN.md` — update P1 status to ✅ Done

- [ ] **Step 1: Full test run**

```bash
npm test
```

Expected: all tests pass (schema ×7, SpecMatrixTable ×4, PillGroup ×5, Tabs ×4, MobileNav ×5 = 25 tests).

- [ ] **Step 2: Production build**

```bash
npm run build
```

Expected: green; all pages pre-render.

- [ ] **Step 3: Hex grep check**

```bash
grep -rE '#[0-9a-fA-F]{3,6}' components/
```

Expected: zero matches.

- [ ] **Step 4: Confirm `/_ds` returns 404 in production build**

```bash
npm start &
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/_ds
# kill server
```

Expected: `404`.

- [ ] **Step 5: Update `docs/MASTER-PLAN.md` status table**

Change:
```markdown
| P1–P7 | ⏳ Planned — see roadmap + slices. |
```
To:
```markdown
| **P1 — Design-system completion** | ✅ Done — schema §6 fixes, 6 DS primitives (Breadcrumb, Prose, SpecMatrixTable, ProductCard, PillGroup/Tabs), MobileNav, a11y pass, motion utilities, `/_ds` dev route. |
| P2–P7 | ⏳ Planned — see roadmap + slices. |
```

- [ ] **Step 6: Final commit**

```bash
git add docs/MASTER-PLAN.md
git commit -m "docs: mark P1 complete in master plan"
```
