# Home Categories Order Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the modules category before the tube amplifiers category on the home page while preserving the shared light category-card style.

**Architecture:** `app/page.tsx` keeps the catalogue cards in a single `CATEGORIES` array. Rendering follows that array, so reordering the two complete entries changes the visual order without changing their routes or content. The shared card class is left light for every card.

**Tech Stack:** Next.js, React, TypeScript, Vitest, Testing Library.

## Global Constraints

- Change only the home catalogue-card order and its regression test.
- Keep every existing card route, text, price, image and accessibility text unchanged.
- Do not publish before local `Nevnag` review.

---

### Task 1: Reorder the home catalogue cards

**Files:**
- Modify: `app/__tests__/home-history.test.tsx`
- Modify: `app/page.tsx:23-65`

**Interfaces:**
- Consumes: `CATEGORIES`, rendered by `CATEGORIES.map` in `app/page.tsx`.
- Produces: DOM links in the order `/catalog/processors`, `/catalog/amplifiers`, `/catalog/modules`, `/catalog/tubes`.

- [ ] **Step 1: Write the failing test**

```tsx
const categoryLinks = screen.getAllByRole("link").filter((link) =>
  ["/catalog/processors", "/catalog/amplifiers", "/catalog/modules", "/catalog/tubes"].includes(
    link.getAttribute("href") ?? "",
  ),
);

expect(categoryLinks.map((link) => link.getAttribute("href"))).toEqual([
  "/catalog/processors",
  "/catalog/amplifiers",
  "/catalog/modules",
  "/catalog/tubes",
]);
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/__tests__/home-history.test.tsx`

Expected: the received order places `/catalog/tubes` before `/catalog/modules`.

- [ ] **Step 3: Write minimal implementation**

Move the complete `TDS / TDH · Class-TD` object in `CATEGORIES` directly above the `602 · E12 · RedBear` object. Retain the shared category-card class:

```tsx
className="group flex min-h-[226px] flex-col bg-bg p-[26px] transition-colors hover:bg-surface-2"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- app/__tests__/home-history.test.tsx`

Expected: PASS.

- [ ] **Step 5: Verify locally**

Open `Nevnag` and confirm the visual sequence reads «Процессоры», «Усилители», «Модули», «Лампа» and the modules card has the same light background as its neighbours.

- [ ] **Step 6: Commit after user approves local preview**

```bash
git add app/page.tsx app/__tests__/home-history.test.tsx
git commit -m "feat: reorder home catalogue cards"
```
