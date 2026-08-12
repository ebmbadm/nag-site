# QM-400 Detail Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make `/catalog/qm-400` visually continuous with the redesigned Amplifiers category while retaining its product URL and metadata.

**Architecture:** Add a QM-400-specific presentation component, following the existing `ModulesProductPage` routing pattern. The dynamic product route will select it only for the `qm-400` slug; all schema, breadcrumb and metadata generation stays in the route.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, Next Image, Vitest.

## Global Constraints

- Preserve the existing `/catalog/qm-400` URL, JSON-LD and metadata.
- Reuse the QM-400 front-panel and open-chassis photos already used by the Amplifiers category.
- Keep the latest validated rating of 4 × 2400 W at 4 Ω.
- Do not publish while the user is reviewing the local result.

---

### Task 1: Guard the special QM-400 route

**Files:**
- Modify: `components/product/__tests__/qm400-product-page.test.tsx`
- Create: `components/product/qm400-product-page.tsx`
- Modify: `app/catalog/[slug]/page.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
render(<Qm400ProductPage product={getProduct("qm-400").frontmatter} />);
expect(screen.getByRole("heading", { name: "QM-400" })).toBeInTheDocument();
expect(screen.getByAltText("QM-400 со снятой верхней крышкой")).toBeInTheDocument();
expect(screen.getByText("4 × 2400 Вт")).toBeInTheDocument();
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm test -- components/product/__tests__/qm400-product-page.test.tsx`

- [ ] **Step 3: Implement the detail component and route it for `qm-400`**

```tsx
if (slug === "qm-400") {
  return <Qm400ProductPage product={p} />;
}
```

The component must render the same dark surface, front-panel hero, open-chassis construction panel and 4 × 2400 W product evidence used by the category layout.

- [ ] **Step 4: Run focused test**

Run: `npm test -- components/product/__tests__/qm400-product-page.test.tsx`

- [ ] **Step 5: Verify the entire site locally**

Run: `npm test && npm run build`

