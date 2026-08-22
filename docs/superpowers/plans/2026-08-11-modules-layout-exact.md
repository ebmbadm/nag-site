# Exact Modules Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/catalog/modules` retain the approved `nag-modules-02` composition while using the site’s live product data and media.

**Architecture:** Keep the route-specific `ModulesProductPage` component. Replace its light presentation with the local mock’s dark technical canvas, two-column hero, paired photographic cards, four-column model row, and split technical block. The product frontmatter remains the only source for models, images, prices, and specifications.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Vitest.

## Global Constraints

- Preserve the global site header, breadcrumbs, and documents section.
- Do not alter `content/products/modules.mdx` data or the approved local mock.
- Use existing design tokens instead of hard-coded color values in React components.
- Keep Russian copy and test with Vitest plus `next build`.

---

### Task 1: Lock the approved structure in a component test

**Files:**
- Modify: `components/product/__tests__/modules-product-page.test.tsx`

**Interfaces:**
- Consumes: `ModulesProductPage({ product: ProductFrontmatter })`.
- Produces: a regression check for the title, both photography blocks, and all four module names.

- [ ] **Step 1: Extend the failing test**

```tsx
expect(screen.getByRole("heading", { name: "TDS / TDH" })).toBeInTheDocument();
expect(screen.getAllByText(/TDS-20/).length).toBeGreaterThan(0);
expect(screen.getByText("TDH-20")).toBeInTheDocument();
```

- [ ] **Step 2: Run the focused test**

Run: `node .\\node_modules\\vitest\\vitest.mjs run components/product/__tests__/modules-product-page.test.tsx`

Expected: failing assertion until the heading is aligned with the approved mock.

- [ ] **Step 3: Commit with the implementation task**

```bash
git add components/product/__tests__/modules-product-page.test.tsx components/product/modules-product-page.tsx
git commit -m "fix(modules): match approved dark layout"
```

### Task 2: Recreate the approved dark technical layout

**Files:**
- Modify: `components/product/modules-product-page.tsx`

**Interfaces:**
- Consumes: product badges, summary, gallery, models, and spec matrix.
- Produces: `ModulesProductPage` with the exact local composition.

- [ ] **Step 1: Make the focused test pass**

```tsx
<h1 className="...">TDS <span className="text-accent">/</span> TDH</h1>
```

- [ ] **Step 2: Replace layout sections**

```tsx
<section className="bg-ink text-white">...</section>
<div className="grid grid-cols-2 border-border lg:grid-cols-4">...</div>
<section className="grid lg:grid-cols-[0.75fr_1.25fr]">...</section>
```

- [ ] **Step 3: Run focused test and full validation**

Run: `node .\\node_modules\\vitest\\vitest.mjs run && node .\\node_modules\\next\\dist\\bin\\next build`

Expected: all tests pass and the production build completes.

- [ ] **Step 4: Amend and push the existing draft branch**

```bash
git add components/product/__tests__/modules-product-page.test.tsx components/product/modules-product-page.tsx docs/superpowers/plans/2026-08-11-modules-layout-exact.md
git commit -m "fix(modules): match approved dark layout"
git push
```
