# History NOVIK 2.0 Publication Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publish the owner-approved “История NOVIK 2.0” at a stable route on novikamps.com through the repository’s existing PR-to-main CI/CD path.

**Architecture:** Keep the approved HTML immutable and use its paired approved Markdown plus the 14 approved image assets as the editable site source. A Next.js route handler renders the same headings, paragraph order, image order, disclosure, typography, spacing, background, and image viewer as the approved HTML; the existing `/istoriya` page gets one continuation link to the new route.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Vitest, existing GitHub Actions + PoliteShark Docker deploy.

**Spec:** `C:/Users/User/Documents/Codex/2026-09-06/v/outputs/История_2_0_maximum.html`

## Global Constraints

- Do not modify the approved HTML, its text, structure, styling, or content.
- Do not create or change the deployment workflow.
- Preserve the first history page; add only a narrow continuation link.
- Use `origin/main` as the base and publish only through branch → PR → checks → merge → existing CI/CD.
- Verify the live route against the approved HTML after deployment.

---

### Task 1: Approved source and route contract

**Files:**
- Create: `content/company/istoriya-2.md`
- Create: `public/history-2/*`
- Create: `app/istoriya-2/__tests__/route.test.ts`
- Create: `lib/content/history-2.ts`
- Create: `app/istoriya-2/route.ts`

**Interfaces:**
- Consumes: approved Markdown and 14 approved images from the 2026-09-06 output directory.
- Produces: `parseHistory2(source: string)` and `GET(): Response` for `/istoriya-2`.

- [ ] **Step 1: Write the failing route test**

Assert that the response is HTML, contains the approved title and terminal sentence, has twelve chapter headings and fourteen images, keeps the editor disclosure, and includes the approved layout values (`max-width:960px`, `background:#eeece6`, Georgia typography).

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npx vitest run app/istoriya-2/__tests__/route.test.ts --reporter=verbose`

Expected: FAIL because `/istoriya-2` is not implemented.

- [ ] **Step 3: Import the approved source assets**

Copy the paired approved Markdown verbatim to `content/company/istoriya-2.md`. Copy the fourteen referenced image files to `public/history-2/`, preserving image bytes and recording their SHA-256 values before and after.

- [ ] **Step 4: Implement the parser and route**

Parse only the approved document grammar (`#`, `##`, `###`, paragraphs, images, `---`). Render the approved DOM order and CSS, use public image URLs, keep the disclosure and zoom dialog, and return UTF-8 HTML with route metadata headers.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `npx vitest run app/istoriya-2/__tests__/route.test.ts --reporter=verbose`

Expected: PASS.

### Task 2: Connect the existing history page

**Files:**
- Modify: `app/istoriya/page.tsx`
- Modify: `app/istoriya/__tests__/page.test.tsx`

**Interfaces:**
- Consumes: live route `/istoriya-2`.
- Produces: a visible continuation link after the existing 1976–2000 article.

- [ ] **Step 1: Add a failing navigation test**

Assert that the first history page exposes a link named `Продолжение: 2000–2019` with `href="/istoriya-2"`.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `npx vitest run app/istoriya/__tests__/page.test.tsx --reporter=verbose`

Expected: FAIL because the continuation link is absent.

- [ ] **Step 3: Add the minimal continuation link**

Place one design-system-styled link after the existing chapter list without changing the existing history copy or chapter data.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run the same focused test and expect PASS.

### Task 3: Validate, publish, and verify production

**Files:**
- No deployment configuration changes.

**Interfaces:**
- Consumes: verified feature commit.
- Produces: merged `main`, successful existing CI/CD run, and verified live URL.

- [ ] **Step 1: Run local gates**

Run `npm test`, `npm run lint`, and `npm run build`; require successful exit codes.

- [ ] **Step 2: Compare local route output with the approved HTML**

Compare normalized headings, paragraph text, image count/order, disclosure text, and the approved CSS values; render both pages for a visual check.

- [ ] **Step 3: Commit and push the feature branch**

Commit only the approved source, assets, route, test, continuation link, and this plan. Push `codex/history-novik-2-approved`.

- [ ] **Step 4: Open PR and merge after checks**

Create the PR, wait for the existing CI/CD PR checks, merge to `main`, then wait for the existing `main` push CI/CD run.

- [ ] **Step 5: Verify production**

Open `https://novikamps.com/istoriya-2`, confirm a 200 response, compare it to the approved HTML, and report the published commit, deploy mechanism, URL, and match result.
