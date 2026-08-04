# History Photo Restoration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restore the NOVIK history page and display prepared local photographs for the confirmed 1993–1998 entries.

**Architecture:** Keep history as typed content in `content/company/istoriya.ts`; use existing `figure` blocks and components. Copy source photographs to `public/history` under stable site names, then restore the history page's existing renderer.

**Tech Stack:** Next.js 16, React 19, TypeScript, Vitest.

## Global Constraints

- Do not modify content or image references before 1993 or after 2000.
- Copy, never move or rename, candidate and archive source photographs.
- Preserve the current source state in Git before implementation.

---

### Task 1: Verify the restored-page contract

**Files:**
- Create: `app/istoriya/__tests__/page.test.tsx`
- Modify: `app/istoriya/page.tsx`

- [ ] Add a rendering test that asserts the page has the history heading and references the 1993–1998 site image paths.
- [ ] Run the test through `.tools/node-v24.18.0-win-x64/npm.cmd` and confirm it fails while the page is a stub.
- [ ] Restore the existing `getHistory`, `HistoryHero`, `Chapter`, `ScrollProgress`, `Toc`, and `ExpandAllControl` page composition.
- [ ] Run the rendering test and confirm it passes.

### Task 2: Install selected local images and update chronology figures

**Files:**
- Create: `public/history/redbear-mk120-1993-dark-stack.jpg`
- Create: `public/history/redbear-mke120-1994-front-stack.jpg`
- Create: `public/history/redbear-mkx-cub-combo-1995-front.jpg`
- Create: `public/history/novik-n1202-n602-1995-front.jpg`
- Create: `public/history/novik-n1202c-n602c-1996-rear.jpg`
- Create: `public/history/novik-mk50-combo-1997-1998-front.jpg`
- Modify: `content/company/istoriya.ts`

- [ ] Copy the six selected candidate files under the stable names above, leaving their source files intact.
- [ ] Add or replace only figure blocks in the 1993, 1994, 1995, 1996, and 1997 chapters; captions identify Gibson, Pellarin, or the domestic market from the confirmed chronology.
- [ ] Verify each asset exists and every source photo outside the target folder remains present.

### Task 3: Validate the local site

**Files:**
- Modify: `docs/superpowers/specs/2026-08-03-history-photo-restoration-design.md`

- [ ] Run the full Vitest suite using the bundled Node runtime.
- [ ] Run `npm run build` using the bundled Node runtime.
- [ ] Inspect `/istoriya` locally and verify pre-1993 and post-2000 image paths are unchanged.
- [ ] Record the verified selected file paths in the design document and commit the implementation.
