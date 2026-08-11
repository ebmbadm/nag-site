# NAG Modules Public Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the approved TDS / TDH product-page content and images on `/catalog/modules`.

**Architecture:** The existing product route renders `content/products/modules.mdx` through its standard hero, gallery, feature, technical, and specifications sections. Only the product MDX and its catalog-content test change; no product component API changes are needed.

**Tech Stack:** Next.js 16, React 19, MDX frontmatter, Vitest.

## Global Constraints

- Work only on branch `agent/nag-modules`.
- Use `2400 Вт` for TDS-20 / TDH-20 at both 4 Ω and 2 Ω.
- Reuse the two committed image assets under `public/products/modules/`.
- Keep prices, dimensions, documents, and TDS-10 / TDH-10 values unchanged.

---

### Task 1: Cover the new product-page facts with a failing test

**Files:**
- Modify: `lib/__tests__/products-catalog.test.ts`

**Interfaces:**
- Consumes: `getProduct("modules").frontmatter`.
- Produces: regression coverage for the visible TDS-20 / TDH-20 power values and the new gallery resources.

- [ ] **Step 1: Add expectations for 2400 Вт and both new image paths**

```ts
expect(p.specChips).toContain("до 2400 Вт (4 Ω)");
expect(p.gallery.map((image) => image.src)).toContain("/products/modules/nag-tds-20-installed-in-subwoofer.jpg");
expect(p.gallery.map((image) => image.src)).toContain("/products/modules/nag-tds-20-interior-with-removed-pcb.jpg");
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run: `npm test -- lib/__tests__/products-catalog.test.ts`
Expected: FAIL because the current frontmatter still contains 2200 Вт and the new gallery entries are absent.

### Task 2: Update the product MDX

**Files:**
- Modify: `content/products/modules.mdx`

**Interfaces:**
- Consumes: the schema in `lib/content/schema.ts` and existing product route sections.
- Produces: updated hero data, gallery, product copy, feature cards, technical section, and spec matrix.

- [ ] **Step 1: Replace all TDS-20 / TDH-20 2200 Вт values with 2400 Вт**

Keep the 8 Ω and lower-model figures unchanged.

- [ ] **Step 2: Add the subwoofer and interior images to `gallery`**

Use absolute public paths and Russian alt/caption text.

- [ ] **Step 3: Add a `tech` section and expanded MDX prose**

Include the approved practical-use, headroom, safe-operation, and power-supply copy without claiming absolute speaker protection.

- [ ] **Step 4: Run the focused test and verify it passes**

Run: `npm test -- lib/__tests__/products-catalog.test.ts`
Expected: PASS.

### Task 3: Verify the publishable branch

**Files:**
- Verify: `content/products/modules.mdx`
- Verify: `lib/__tests__/products-catalog.test.ts`

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: PASS.

- [ ] **Step 2: Run the production build**

Run: `npm run build`
Expected: PASS with `/catalog/modules` prerendered.

- [ ] **Step 3: Commit and push the branch**

```bash
git add content/products/modules.mdx lib/__tests__/products-catalog.test.ts docs/superpowers/
git commit -m "feat(modules): publish TDS-20 content and photos"
git push origin agent/nag-modules
```
