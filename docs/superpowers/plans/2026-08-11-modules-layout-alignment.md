# Modules Layout Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Render `/catalog/modules` with the approved three-block engineering layout rather than the generic product layout.

**Architecture:** A new `ModulesProductPage` server component reads the existing modules frontmatter and composes the existing design-system primitives and product data. The generic dynamic product route delegates to this component only when the slug equals `modules`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Vitest.

## Global Constraints

- Preserve the generic product route for every slug other than `modules`.
- Render 2400 Вт and every price from product frontmatter, not hard-coded values.
- Use site semantic tokens and `next/image` through `Figure`.

---

### Task 1: Add a failing render test

**Files:**
- Create: `components/product/__tests__/modules-product-page.test.tsx`

- [ ] **Step 1: Assert the dedicated page renders the three visible sections and both new photos**

```ts
expect(screen.getByRole("heading", { name: /TDS \/ TDH/i })).toBeInTheDocument();
expect(screen.getByText(/Запас, который слышно/i)).toBeInTheDocument();
expect(screen.getByText(/Рассчитан на реальную работу/i)).toBeInTheDocument();
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `vitest run components/product/__tests__/modules-product-page.test.tsx`
Expected: FAIL because the dedicated component does not exist.

### Task 2: Implement the dedicated page

**Files:**
- Create: `components/product/modules-product-page.tsx`
- Modify: `app/catalog/[slug]/page.tsx`

- [ ] **Step 1: Implement the server component with hero, two image/text sections, model cards, and technical table**
- [ ] **Step 2: Delegate to it for the `modules` slug only**
- [ ] **Step 3: Run the focused test and verify it passes**

### Task 3: Verify production behavior

**Files:**
- Verify: `components/product/modules-product-page.tsx`
- Verify: `app/catalog/[slug]/page.tsx`

- [ ] **Step 1: Run the full test suite**
- [ ] **Step 2: Run `next build` and verify `/catalog/modules` prerenders**
- [ ] **Step 3: Commit and push `agent/modules-layout`, then open a draft PR against `main`**
