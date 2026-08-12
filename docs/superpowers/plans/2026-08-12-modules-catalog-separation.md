# Modules Catalog Separation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make TDS/TDH an independent current «Модули» catalog direction, move TDX entirely to the archive and replace the two duplicate accessory cards with one «Сейверы и конвертеры» card.

**Architecture:** `/catalog/modules` becomes a category landing with a single TDS/TDH card; the current series content moves to `/catalog/tds-tdh`. The category field on the product changes from «Усилители мощности» to «Встраиваемые модули», so the existing product loader builds the correct grids. TDX is removed from current content and listed only in the archive. The catalog keeps «Ламповый бутик» and replaces its two duplicate top-level accessory cards with one card linking back to the boutique.

**Tech Stack:** Next.js App Router, React 19, TypeScript, MDX frontmatter, Vitest, Tailwind CSS.

## Global Constraints

- Use design-system primitives from `components/ds/`; use semantic tokens, not hard-coded colours.
- All visitor-facing copy remains Russian.
- Do not publish private mail content or unverified source material.
- TDX is archival only; current models are TDS-10, TDH-10, TDS-20 and TDH-20.
- Keep legacy redirects explicit and preserve the current sitemap/build contract.

---

### Task 1: Establish the new catalog contract with failing tests

**Files:**
- Modify: `lib/__tests__/catalog-coverage.test.ts`
- Modify: `components/layout/__tests__/mobile-nav.test.tsx`

**Interfaces:**
- Consumes: `getProductSlugs()`, `getProductsByCategory(category)` from `lib/content/products.ts`.
- Produces: regression checks for 14 current product files, three current amplifiers, one current module series and the presence of the Modules navigation item.

- [ ] **Step 1: Write the failing catalog test**

Replace the expected product slugs and category assertions with:

```ts
expect(new Set(getProductSlugs())).toEqual(
  new Set([
    "d-4", "d-8", "d-8000", "f-8", "f-8-pro", "the-rogue",
    "qm-400", "td-series", "cx-series", "tds-tdh",
    "e12", "black-fire", "redbear", "n1202",
  ]),
);
expect(getProductsByCategory("Усилители мощности")).toHaveLength(3);
expect(getProductsByCategory("Встраиваемые модули")).toHaveLength(1);
```

- [ ] **Step 2: Write the failing navigation assertion**

Import `NAV` from `components/layout/site-header.tsx` and add:

```ts
it("includes a Modules link in the global navigation", () => {
  expect(NAV).toContainEqual({ label: "Модули", href: "/catalog/modules" });
});
```

- [ ] **Step 3: Run tests to verify RED**

Run: `npm test -- lib/__tests__/catalog-coverage.test.ts components/layout/__tests__/mobile-nav.test.tsx`

Expected: failures because `modules.mdx` and `tdx.mdx` still exist, `tds-tdh.mdx` does not, amplifier count is five, the module category is empty and `NAV` lacks «Модули».

- [ ] **Step 4: Commit the failing tests**

```bash
git add lib/__tests__/catalog-coverage.test.ts components/layout/__tests__/mobile-nav.test.tsx
git commit -m "test: define modules catalog separation"
```

### Task 2: Move the active TDS/TDH series and archive TDX

**Files:**
- Rename: `content/products/modules.mdx` → `content/products/tds-tdh.mdx`
- Delete: `content/products/tdx.mdx`
- Modify: `app/catalog/arhiv/page.tsx`
- Modify: `lib/redirects.ts`

**Interfaces:**
- Consumes: product slug determined by each MDX filename and archive `GROUPS` entries.
- Produces: current `tds-tdh` product with `category: "Встраиваемые модули"`; archive list containing `NAG TDX`; redirects to the new series and archive routes.

- [ ] **Step 1: Rename and update the active series frontmatter**

Rename `modules.mdx` to `tds-tdh.mdx`. Change only these frontmatter values:

```yaml
name: "NAG TDS / TDH SERIES"
category: "Встраиваемые модули"
breadcrumb:
  - { label: "Каталог", href: "/catalog" }
  - { label: "Модули", href: "/catalog/modules" }
  - { label: "TDS / TDH" }
```

- [ ] **Step 2: Remove TDX as a current product**

Delete `content/products/tdx.mdx` so it is not returned by `getProductSlugs()` or `generateStaticParams()`.

- [ ] **Step 3: Update archive data**

In the existing `Встраиваемые модули` archive group, set:

```ts
models: ["NAG MQ-10", "NAG MQ-20", "NAG MQ-30", "NAG TDX"],
replacements: [{ label: "Модули TDS / TDH", href: "/catalog/modules" }],
```

In `Архивные TD-усилители`, remove the TDX replacement and change its note to `TD-40 / TD-80 / TD-100 заменены актуальной серией TD.`

- [ ] **Step 4: Update redirect targets**

In `lib/redirects.ts`:

```ts
{ source: "/tdx", destination: "/catalog/arhiv", statusCode: 301 },
{ source: "/catalog/tdx", destination: "/catalog/arhiv", statusCode: 301 },
{ source: "/usilitel/usiliteli/tranzistornye-usiliteli/nagtdhtds.html", destination: "/catalog/tds-tdh", statusCode: 301 },
```

Keep broad legacy module URLs pointing to `/catalog/modules`.

- [ ] **Step 5: Run catalog coverage test to verify GREEN**

Run: `npm test -- lib/__tests__/catalog-coverage.test.ts`

Expected: all catalog coverage assertions pass.

- [ ] **Step 6: Commit the product and archive migration**

```bash
git add content/products/modules.mdx content/products/tds-tdh.mdx content/products/tdx.mdx app/catalog/arhiv/page.tsx lib/redirects.ts lib/__tests__/catalog-coverage.test.ts
git commit -m "feat: archive TDX and separate TDS TDH"
```

### Task 3: Build the Modules landing and update navigation

**Files:**
- Create: `app/catalog/modules/page.tsx`
- Modify: `components/layout/site-header.tsx`
- Modify: `app/catalog/amplifiers/page.tsx`
- Modify: `app/catalog/page.tsx`

**Interfaces:**
- Consumes: `getProductsByCategory("Встраиваемые модули")`, `ProductCard`, `Container`, `Eyebrow`, `Breadcrumb`.
- Produces: `/catalog/modules` category page, global Modules link, a three-product current amplifier grid and a separate Modules card in the catalog index.

- [ ] **Step 1: Create the Modules landing**

Create `app/catalog/modules/page.tsx` following `app/catalog/amplifiers/page.tsx`, with this category contract:

```ts
const CATEGORY = "Встраиваемые модули";
const ORDER = ["tds-tdh"];
const CRUMBS = [
  { label: "Главная", href: "/" },
  { label: "Каталог", href: "/catalog" },
  { label: "Модули" },
];
```

Use title `Модули NAG для активной акустики`, a description naming TDS-10, TDH-10, TDS-20 and TDH-20, and one `ProductCard` that links to `/catalog/tds-tdh` through its slug.

- [ ] **Step 2: Add the Modules navigation item**

In `components/layout/site-header.tsx`, insert:

```ts
{ label: "Модули", href: "/catalog/modules" },
```

immediately after «Усилители». `MobileNav` receives the same list through the existing `NAV` prop.

- [ ] **Step 3: Restrict current amplifiers to amplifier products**

In `app/catalog/amplifiers/page.tsx`, set:

```ts
const ORDER = ["qm-400", "td-series", "cx-series"];
```

Remove TDS/TDH and TDX from the lede, metadata title/description and comment so the page represents only the three current amplifier products.

- [ ] **Step 4: Update the seven-card catalog index**

In `app/catalog/page.tsx`, remove modules from the `Усилители мощности` card. Add after it:

```ts
{
  kicker: "TDS / TDH · Class-TD",
  title: "Модули",
  text: "Встраиваемые модули для активной акустики: TDS-10, TDH-10, TDS-20 и TDH-20.",
  href: "/catalog/modules",
},
```

Replace the separate «Конвертеры» and «Сейверы» cards with one:

```ts
{
  kicker: "NOVIK Tubes Boutique",
  title: "Сейверы и конвертеры",
  text: "Аксессуары для винтажных ламп: сохраняют оригинальные разъёмы и расширяют выбор совместимых ламп.",
  href: "/catalog/boutique",
},
```

Keep the existing «Ламповый бутик» card and the archive spanning the trailing row. Update the header comment to `Seven catalog cards`.

- [ ] **Step 5: Run targeted tests to verify GREEN**

Run: `npm test -- lib/__tests__/catalog-coverage.test.ts components/layout/__tests__/mobile-nav.test.tsx`

Expected: all tests pass, including the `NAV` assertion for «Модули».

- [ ] **Step 6: Commit the category UI**

```bash
git add app/catalog/modules/page.tsx components/layout/site-header.tsx app/catalog/amplifiers/page.tsx app/catalog/page.tsx components/layout/__tests__/mobile-nav.test.tsx
git commit -m "feat: add modules catalog direction"
```

### Task 4: Verify route generation and publish the implementation

**Files:**
- Modify: `docs/superpowers/plans/2026-08-12-modules-catalog-separation.md` to mark completed checklist items.

**Interfaces:**
- Consumes: all implementation changes from Tasks 1–3.
- Produces: a clean production build and a pushed branch with an Issue #8 progress comment.

- [ ] **Step 1: Run the complete test suite**

Run: `npm test`

Expected: zero failing tests.

- [ ] **Step 2: Run the production build**

Run: `npm run build`

Expected: successful type-check, lint, static generation for `/catalog/modules` and `/catalog/tds-tdh`, and no generated `/catalog/tdx` route.

- [ ] **Step 3: Inspect final route and archive references**

Run:

```bash
rg -n 'tdx|catalog/modules|catalog/tds-tdh|Встраиваемые модули' app content lib components
```

Expected: TDX appears only in archive/redirect contexts; `modules` is the category route; `tds-tdh` is the current series route.

- [ ] **Step 4: Commit plan completion and push**

```bash
git add docs/superpowers/plans/2026-08-12-modules-catalog-separation.md
git commit -m "docs: complete modules catalog migration plan"
git push -u origin agent/nag-modules
```

- [ ] **Step 5: Add the GitHub Issue #8 completion comment**

Comment with the final commit links, the two current routes, the archival status of TDX, and the exact verification commands and results.
