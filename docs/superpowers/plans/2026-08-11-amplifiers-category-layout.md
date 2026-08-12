# Amplifiers Category Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic amplifier grid with the approved technical landing page for QM-400 and the TD series.

**Architecture:** `app/catalog/amplifiers/page.tsx` loads the existing QM-400 and TD-series frontmatter, then renders a focused `AmplifiersCategoryPage` component. The component owns presentation only; prices, models, and specifications remain in MDX. Provided local photos are copied into `public/products/amplifiers` and referenced by the component.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, Vitest.

## Global Constraints

- Preserve the site header, breadcrumbs, and `/catalog/amplifiers` URL.
- Do not show TDS/TDH modules in the amplifier section.
- Use light photo backdrops for black hardware and the existing dark surface tokens for the technical page.
- Russian copy only; run Vitest and `next build` before creating a draft PR.

---

### Task 1: Establish image and rendering contract

**Files:**
- Create: `components/product/__tests__/amplifiers-category-page.test.tsx`
- Create: `components/product/amplifiers-category-page.tsx`
- Create: `public/products/amplifiers/qm-400-top-open.jpg`
- Create: `public/products/amplifiers/td-100-80.jpg`
- Create: `public/products/amplifiers/td-40-30.jpg`

**Interfaces:**
- Consumes: `AmplifiersCategoryPage({ qm400, tdSeries }: { qm400: ProductFrontmatter; tdSeries: ProductFrontmatter })`.
- Produces: dark landing-page sections with QM-400, open-chassis image, TD pairs and a comparison table.

- [ ] **Step 1: Write a failing rendering test**

```tsx
render(<AmplifiersCategoryPage qm400={getProduct("qm-400").frontmatter} tdSeries={getProduct("td-series").frontmatter} />);
expect(screen.getByRole("heading", { name: "QM-400" })).toBeInTheDocument();
expect(screen.getByText("TD-100 / TD-80")).toBeInTheDocument();
expect(screen.getByText("TD-40 / TD-30")).toBeInTheDocument();
expect(screen.getByRole("table", { name: "Характеристики и цены" })).toBeInTheDocument();
```

- [ ] **Step 2: Run the focused test**

Run: `node .\\node_modules\\vitest\\vitest.mjs run components/product/__tests__/amplifiers-category-page.test.tsx`

Expected: FAIL because the component does not exist.

- [ ] **Step 3: Copy approved photos into public assets**

```powershell
Copy-Item '...\\outputs\\nag-amplifiers-01\\assets\\qm-400-top-open.jpg' 'public\\products\\amplifiers\\qm-400-top-open.jpg'
Copy-Item '...\\outputs\\nag-amplifiers-01\\assets\\td-100-80.jpg' 'public\\products\\amplifiers\\td-100-80.jpg'
Copy-Item '...\\outputs\\nag-amplifiers-01\\assets\\td-40-30.jpg' 'public\\products\\amplifiers\\td-40-30.jpg'
```

### Task 2: Render the technical category page

**Files:**
- Create: `components/product/amplifiers-category-page.tsx`
- Modify: `app/catalog/amplifiers/page.tsx`
- Test: `components/product/__tests__/amplifiers-category-page.test.tsx`

**Interfaces:**
- Consumes: QM-400 gallery/spec data and TD-series model/spec data.
- Produces: `AmplifiersCategoryPage` and a category route that uses it.

- [ ] **Step 1: Implement the page with data-backed models**

```tsx
export function AmplifiersCategoryPage({ qm400, tdSeries }: AmplifiersCategoryPageProps) {
  return <Surface mode="dark">{/* hero, construction, TD cards, comparison */}</Surface>;
}
```

- [ ] **Step 2: Replace the generic product-grid route body**

```tsx
const qm400 = getProduct("qm-400").frontmatter;
const tdSeries = getProduct("td-series").frontmatter;
return <AmplifiersCategoryPage qm400={qm400} tdSeries={tdSeries} />;
```

- [ ] **Step 3: Run focused test**

Run: `node .\\node_modules\\vitest\\vitest.mjs run components/product/__tests__/amplifiers-category-page.test.tsx`

Expected: PASS.

### Task 3: Verify and publish a review branch

**Files:**
- Modify: all files from Tasks 1–2

- [ ] **Step 1: Run full validation**

Run: `node .\\node_modules\\vitest\\vitest.mjs run && node .\\node_modules\\next\\dist\\bin\\next build`

Expected: all tests pass and build exits with code 0.

- [ ] **Step 2: Commit and push review branch**

```bash
git add app/catalog/amplifiers/page.tsx components/product public/products/amplifiers docs/superpowers
git commit -m "feat(amplifiers): add technical category layout"
git push -u origin agent/amplifiers-layout
```

- [ ] **Step 3: Create a draft PR to `main`**

```bash
gh pr create --draft --base main --head agent/amplifiers-layout --title "Добавить технический макет раздела усилителей"
```
