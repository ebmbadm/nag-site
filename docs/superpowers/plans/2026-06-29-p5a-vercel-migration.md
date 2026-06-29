# P5a — Vercel Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strip GitHub Pages static-export config so Vercel can host the site with a real Node.js runtime (prerequisite for P5b server actions).

**Architecture:** Remove four `next.config.ts` keys (`output`, `basePath`, `trailingSlash`, `images`), delete two GitHub Pages artifacts (`image-loader.ts`, `public/.nojekyll`), and replace the Pages deploy workflow with a CI-only build job. No route or component changes.

**Tech Stack:** Next.js 16 App Router, GitHub Actions, Vercel (manual dashboard step)

## Global Constraints

- Branch: `p5a-vercel-migration` off `main`
- `npm run build` must pass locally with no `PAGES_BASE_PATH` env var
- `turbopack.root` stays — it is unrelated to Pages
- `metadataBase: new URL("https://novikamps.com")` already set in `app/layout.tsx` — do not change it
- Do NOT add Supabase, form, or any P5b/c code
- Commit prefix: `chore(p5a):`

---

## File Map

| Action | File |
|--------|------|
| Modify | `next.config.ts` |
| Delete | `image-loader.ts` |
| Delete | `public/.nojekyll` |
| Replace | `.github/workflows/deploy.yml` |

---

### Task 1: Strip static-export config + delete artifacts

**Files:**
- Modify: `next.config.ts`
- Delete: `image-loader.ts`
- Delete: `public/.nojekyll`

**Interfaces:**
- Produces: clean `next.config.ts` with no Pages-specific keys; no `image-loader.ts` in repo

- [ ] **Step 1: Create branch**

```bash
git checkout -b p5a-vercel-migration
```

- [ ] **Step 2: Rewrite `next.config.ts`**

Replace the entire file with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
```

- [ ] **Step 3: Delete GitHub Pages artifacts**

```bash
rm image-loader.ts public/.nojekyll
```

- [ ] **Step 4: Verify no remaining references to removed things**

```bash
grep -rn "PAGES_BASE_PATH\|image-loader\|output.*export\|trailingSlash" \
  --include="*.ts" --include="*.tsx" --include="*.json" . \
  --exclude-dir=node_modules --exclude-dir=.next
```

Expected: no output (zero matches).

- [ ] **Step 5: Run build**

```bash
npm run build
```

Expected: green build. Output goes to `.next/` (not `out/`). All static routes still prerender (Next.js defaults to SSG for pages with no dynamic data).

- [ ] **Step 6: Commit**

```bash
git add next.config.ts
git rm image-loader.ts public/.nojekyll
git commit -m "chore(p5a): remove static-export config + GitHub Pages artifacts"
```

---

### Task 2: Replace CI workflow + verify + push

**Files:**
- Replace: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: clean `next.config.ts` from Task 1 (no `PAGES_BASE_PATH` needed)
- Produces: CI workflow that builds but does not deploy (Vercel deploys via its own GitHub App)

- [ ] **Step 1: Replace `.github/workflows/deploy.yml`**

Replace the entire file with:

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm install --no-audit --no-fund
      - run: npm run build
```

- [ ] **Step 2: Verify build still green locally**

```bash
npm run build
```

Expected: exits 0, no TypeScript errors, no lint errors.

- [ ] **Step 3: Run vitest to confirm no regressions**

```bash
npx vitest run
```

Expected: all existing tests pass (same count as before this task).

- [ ] **Step 4: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "chore(p5a): replace Pages deploy workflow with CI-only build"
```

- [ ] **Step 5: Push branch**

```bash
git push -u origin p5a-vercel-migration
```

- [ ] **Step 6: Vercel setup (manual, one-time — do in Vercel dashboard)**

1. Go to vercel.com → Add New Project → Import Git Repository → select `ebmbadm/nag-site`
2. Framework: Next.js (auto-detected)
3. Root directory: `.` (repo root)
4. No env vars yet (Supabase comes in P5b)
5. Deploy — Vercel will build from `main`
6. After deploy, verify the Vercel preview URL loads the site correctly

Note for DNS (after merge to main): in the Vercel dashboard, add domain `novikamps.com` → follow Vercel's DNS instructions (A record `76.76.21.21` or CNAME to `cname.vercel-dns.com`).

---

## Self-Review

**Spec coverage:**
- §4.1 remove output/basePath/trailingSlash/images → Task 1 Step 2 ✓
- §4.2 delete image-loader.ts + .nojekyll → Task 1 Step 3 ✓
- §4.3 CI-only workflow → Task 2 Step 1 ✓
- §4.4 metadataBase unchanged → not in plan (already correct, explicitly checked in Task 1 Step 4) ✓
- §4.5 Vercel manual setup → Task 2 Step 6 ✓
- §4.6 acceptance criteria: build green ✓; Vercel preview ✓ (manual); no artifacts ✓

**Placeholder scan:** none.

**Type consistency:** no types introduced.
