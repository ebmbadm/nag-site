# NAG Site — Foundation + Master Plan (Design Spec)

**Date:** 2026-06-28
**Status:** Approved (brainstorming)
**Scope of this spec:** Phase 0 — scaffold the Next.js project, port the design system, build the first two pages (History + D-8000), write `CLAUDE.md`, and author the big `MASTER-PLAN.md` that future agents execute slice-by-slice.

---

## 1. Context

**Brand:** NAG / NOVIK — professional audio-equipment manufacturer. St. Petersburg. Founder Sergey Novikov (first amps 1976); company since 1992. Site `novikamps.com`. Russian-only (`ru-RU`).

**Product universe (≈25 pages):**
- **Transistor amps (NAG):** QM-400, TD-series (TD-30/40/80/100), CX-series (DSP), modules (TDS/TDH), TDX.
- **DSP processors:** D-8000 Wi-Fi, F-8 PRO, F-8, D-4, D-8, THE ROGUE, КОНТУР A8/C8 (car audio).
- **Tube amps (NOVIK):** E12, Black Fire, MKX50/RedBear, N1202.
- **Boutique:** tube savers, converters, custom tube matching.
- **Company:** history, contacts, guarantee/warranty, homepage.

**Inputs on disk:**
- `/Users/viktor/Downloads/NAC история компании/` — 3 design files (`.dc.html`) on a custom `nag-novik-design-system`, plus extracted token CSS, fonts list, and product/history images.
- `/Users/viktor/Documents/kimi/workspace/novikamps/` — content dump: 29 markdown files + images for the whole site.
- `/Users/viktor/Code/NB-site-main/` — the author's reference Next.js project (house-style stack & conventions).

**Target:** `/Users/viktor/Code/NAG-SITE/` (empty; not yet a git repo).

---

## 2. Decisions (from brainstorming)

| Decision | Choice |
|---|---|
| First two pages | **История** (company history longread) + **NAG D-8000** (product page). The 3rd `.dc.html` ("История — направления") is a layout-exploration artifact, not a page. |
| Site model | **Phased.** Static catalog/showcase now (SSG). Inquiry forms + backend on **Supabase later**. Architecture anticipates Supabase; does not build it in P0. |
| Content pipeline | **Structured MDX + frontmatter data** → page templates. Frontmatter carries structured data (specs, price, gallery, chapters); body carries prose. zod-validated. |
| Commerce CTAs | D-8000 "В корзину" / "Купить в 1 клик" render full-fidelity but wire to a **deferred inquiry stub** in P0 (Supabase later). |
| App location | App at **repo root** of `NAG-SITE` (dedicated repo, no `my-app/` nesting). |
| Slugs | **Russian translit** — `/istoriya`, `/catalog/d-8000`. |

---

## 3. Stack

Mirrors NB-site house style:

- Next.js 16 (App Router, RSC), React 19, TypeScript strict.
- Tailwind CSS v4 — `@tailwindcss/postcss`, tokens in `app/globals.css` via `@theme inline`, **no `tailwind.config.ts`**.
- Shadcn UI (new-york) as needed; Lucide React icons only.
- `class-variance-authority` + `clsx` + `tailwind-merge` (`cn()` helper).
- Content: `gray-matter` + `@mdx-js/mdx` + `remark-gfm` + `rehype-slug`; `zod` for frontmatter validation.
- `embla-carousel-react` for the product gallery.
- `next/font/google` for Oswald / Golos Text / JetBrains Mono.
- Path alias `@/*` → repo root.
- Static export-friendly SSG (`generateStaticParams`, no runtime backend in P0).

---

## 4. Design-system port

**Source:** `_ds/nag-novik-design-system-*/tokens/*.css` + `styles.css`. All token names/values already extracted (see Appendix A).

**Strategy:**
1. Port every token into `app/globals.css`:
   - `:root` → light semantic aliases + full palette + type scale + spacing + radius + elevation + motion.
   - `[data-surface="dark"]` → dark-mode overrides (the D-8000 features/tech bands are dark).
   - `@theme inline { … }` → map CSS vars to Tailwind tokens (`--color-accent`, `--font-display`, etc.) so utilities work (`text-accent`, `font-display`, `bg-surface`).
2. Build a clean React primitive library in `components/ds/` (do **not** reuse minified `_ds_bundle.js` — rebuild for SSR + maintainability):
   - `Button` (variant: primary/outline/ghost; size sm/md/lg), `Chip`/`SpecChip`, `Eyebrow` (mono label), `Badge` (BEST SELLER etc.), `SectionHeader`, `SpecTable` (striped rows), `Accordion`/`Disclosure` (`<details>`-style with rotating chevron), `Figure` (image + mono caption), `Gallery` (embla + thumb strip), `Toc` (sticky, scroll-spy), `ScrollProgress` (red top bar), `Surface` (sets `data-surface`).
   - `Meter` (VU-style) — optional, only if a page needs it; deferred.
3. **Token contract:** components consume CSS vars / Tailwind tokens only. **Never hardcode hex.** Surface mode toggled by wrapping in `<Surface mode="dark">`.

**Fonts:** `next/font/google` → bind to `--font-display` (Oswald 400–700), `--font-text` (Golos Text 400–700), `--font-mono` (JetBrains Mono 400/500/700), `display: swap`, Cyrillic + Latin subsets.

---

## 5. The two pages

### 5.1 `/istoriya` — History longread
- **Layout:** sticky header (logo + "История · с 1992") with 3px red scroll-progress bar; hero (drop-cap initial + founder portrait, byline); two-column body — sticky TOC sidebar (chapters with years, scroll-spy + active highlight) + article.
- **Article:** chapter sections as `<details>` accordions (year in red → eyebrow → title → chevron). Rich body: blockquotes (red 3px left border), figures with mono captions, spec grids.
- **Interactivity (client):** expand-all / collapse-all, scroll-spy on TOC, scroll-progress. Portrait is a static `<Image>` (not the drag-drop `image-slot` — that's an authoring tool, not a runtime feature).
- **Content:** `content/company/istoriya.mdx` — frontmatter `chapters[]` (`id`, `year`, `eyebrow`, `title`), `hero`, `portrait`; body prose per chapter. Sourced from `novikamps/history/history.md` (185 lines, founder memoir 1976–2000+).
- **Images:** `novikamps/history/images/*` + `NAC.../images/*` → `public/history/`.

### 5.2 `/catalog/d-8000` — D-8000 product page
- **Layout:** sticky navbar (logo + breadcrumb nav: Каталог / Процессоры(active) / Усилители / Ремонт / О компании / Контакты + cart button); breadcrumb; hero (left = embla gallery + thumb strip; right = info panel).
- **Info panel:** eyebrow ("DSP Processor · NAG Pro Audio") + BEST SELLER badge; display title "NAG D-8000 WI-FI"; description; spec chips (4 вх. XLR / 8 вых. XLR / 32 bit DSP / 192 kHz / Wi-Fi·USB·LAN / >115 dB ДД); divider; price block ("122 900 ₽", "Без НДС · Гарантия 2 года · EAC"); CTAs (В корзину / Купить в 1 клик → **deferred inquiry stub**); anchor links (Программа / Характеристики); tech badges (Burr-Brown, Wi-Fi/USB/LAN).
- **Bands:** dark features grid (4 cards, amber-glow) → dark tech/components (3 spec cards + full-bleed PCB image) → light software section (routing screenshot + 3-up feature grid) → light specs accordion (striped spec tables, "Основные характеристики" open by default).
- **Content:** `content/products/d-8000.mdx` — frontmatter `name`, `line`, `price`, `badges`, `specChips[]`, `gallery[]`, `featureCards[]`, `techCards[]`, `software[]`, `specGroups[]`; body = description prose. Sourced from `novikamps/d8000/d8000.md` (+ images).
- **Images:** `novikamps/d8000/images/*` + `NAC.../uploads/nag-d8000-*` → `public/products/d-8000/`.

### 5.3 Shared shell
- `app/layout.tsx`: html lang="ru", font vars, `data-surface="light"` default, paper bg + noise texture, sticky `SiteHeader`, `SiteFooter` (contacts from `contacts.md`). Nav links stubbed to future routes (`/catalog`, `/usiliteli`, `/remont`, `/o-kompanii`, `/kontakty`) — present but may 404 / placeholder until their slices ship.

---

## 6. Content pipeline

- `content/` tree: `content/products/*.mdx`, `content/company/*.mdx`.
- `lib/content/`:
  - `schema.ts` — zod schemas for product + company frontmatter.
  - `products.ts`, `company.ts` — gray-matter parse + zod validate (hard-fail build on invalid) + typed accessors + `getAllSlugs()`.
  - `mdx.tsx` — `@mdx-js/mdx` evaluate with `remark-gfm` + `rehype-slug`; custom MDX components map (Figure, Quote, SpecTable, Callout).
- Routes use `generateStaticParams` + `dynamicParams = false` + `generateMetadata`.
- Image strategy: assets copied into `public/` under per-page folders; frontmatter references public paths; `next/image` with `sharp`.

---

## 7. Repo structure (P0)

```
NAG-SITE/
  app/
    layout.tsx
    page.tsx                 # temp homepage placeholder → links to the 2 pages
    globals.css              # tokens + @theme
    istoriya/page.tsx
    catalog/d-8000/page.tsx
  components/
    ds/                      # design-system primitives
    layout/                  # SiteHeader, SiteFooter
    history/                 # History-page sections (client bits)
    product/                 # Product-page sections (gallery, specs, etc.)
  lib/
    content/                 # loaders + schema + mdx
    utils.ts                 # cn()
  content/
    products/d-8000.mdx
    company/istoriya.mdx
  public/
    brand/ history/ products/d-8000/
  docs/
    superpowers/specs/2026-06-28-nag-site-foundation-design.md
    MASTER-PLAN.md
    slices/                  # per-slice spec stubs
  CLAUDE.md
  package.json … (configs)
```

---

## 8. CLAUDE.md (authored in P0)

Sections: project overview; stack & versions; dev commands; **design-system rules** (use tokens/`@theme` utilities, never hardcode hex, `data-surface` for dark bands, primitives live in `components/ds/`); folder map; **content pipeline rules** (MDX + zod frontmatter, where images go, `generateStaticParams`); routing/slug conventions (RU translit); ru-RU / Russian-only copy; **deferred Supabase** note (forms/cart/CMS are later phases — don't wire a backend yet); pointer to `docs/MASTER-PLAN.md` as the source of truth for remaining work.

---

## 9. MASTER-PLAN.md (the core deliverable)

Purpose: a future agent grabs **one slice**, and the doc gives it everything to run brainstorm → analyze → develop → review self-contained.

Top-level contents:
1. **Vision & principles** — brand, audience, RU-only, design-system contract, SSG-first, Supabase-later.
2. **Information architecture / sitemap** — every page → URL, grouped (Transistor / DSP / Tube / Boutique / Company / Homepage / Commerce). Includes nav structure + breadcrumb hierarchy.
3. **Phase roadmap:**
   - **P0** Foundation + 2 pages *(this spec)*.
   - **P1** Design-system completion (remaining primitives, dark-mode polish, Meter, motion).
   - **P2** Catalog + product templates — all transistor / DSP / tube / boutique product pages from `novikamps` content. Sub-sliced per family.
   - **P3** Company/legal — contacts, guarantee, history landing/"направления".
   - **P4** Homepage.
   - **P5** Supabase — inquiry/request forms (replace deferred CTA stubs), contact form, lead capture.
   - **P6** Commerce — cart, checkout, payments, accounts (if pursued).
   - **P7** SEO / performance / analytics / sitemap.xml / OG images.
4. **Per-slice template** (repeated for each slice):
   - Scope & deliverables · Source content (exact `novikamps/*.md` + images) · Design refs (which `.dc.html` / tokens) · Components needed (reuse from `components/ds/`) · Data model (frontmatter shape) · Acceptance criteria · **Run-recipe**: `/brainstorming` → analyze sources → `writing-plans` → TDD/implement → `requesting-code-review`.
5. **Design-system contract** — the canonical primitive list + token rules every agent must reuse (prevents drift).
6. **Content-mapping appendix** — table: every `novikamps` folder → target route → status.

**Authoring method (ultracode):** fan out per-product-family agents in parallel (Workflow) to draft each slice section with real content references, then synthesize into `MASTER-PLAN.md`.

---

## 10. Out of scope (P0)

- Supabase / any backend, forms submission, cart logic, payments, accounts, admin/CMS.
- Pages beyond История + D-8000 (covered by master plan, not built now).
- i18n / English locale.
- The `image-slot` drag-drop authoring tool (runtime uses static images).

---

## 11. Acceptance criteria (P0)

- `npm run dev` serves the app; `npm run build` succeeds (SSG).
- `/istoriya` and `/catalog/d-8000` render with high visual fidelity to the `.dc.html` designs (tokens, fonts, layout, dark bands, interactivity).
- All colors/spacing/type come from tokens; no hardcoded hex in components.
- Content for both pages lives in `content/*.mdx`, zod-validated, rendered via the loader.
- `CLAUDE.md` and `docs/MASTER-PLAN.md` exist and are coherent.
- Repo is a git repository with a sensible initial commit history.

---

## Appendix A — Design tokens (extracted, authoritative)

**Fonts:** Oswald (display, 400–700), Golos Text (body/text, 400–700), JetBrains Mono (mono, 400/500/700).

**Core semantic (light):** `--bg #FBFAF7`, `--bg-raised #FFFFFF`, `--surface #FFFFFF`, `--surface-2 #ECE9E2`, `--surface-inset #DED9CF`, `--border rgba(11,11,13,.12)`, `--border-strong rgba(11,11,13,.20)`, `--border-faint rgba(11,11,13,.06)`, `--text #0B0B0D`, `--text-muted #54545E`, `--text-faint #87878F`, `--text-inverse #F5F3EE`, `--accent #E11507`, `--accent-hover #C01206`, `--accent-press #9E0E04`, `--accent-wash #FBE1DC`, `--on-accent #FFFFFF`, `--heat #FF5A0C`, `--glow #F59E2E`.

**Core semantic (dark, `[data-surface="dark"]`):** `--bg #08080A`, `--bg-raised #111114`, `--surface #16161B`, `--surface-2 #1C1C22`, `--surface-inset #2E2E36`, `--border rgba(255,255,255,.09)`, `--text #F5F3EE`, `--text-muted #A2A2AD`, `--text-faint #7B7B86`, `--accent-hover #F4361F`, `--accent-wash rgba(225,21,7,.14)`, `--focus-ring #F4361F`.

**Palette:** blacks 980→750 (`#08080A,#0B0B0D,#111114,#16161B,#1C1C22,#232329`), grays 700→100 (`#2E2E36,#3C3C45,#565660,#7B7B86,#A2A2AD,#C9C9D1,#E4E4E8`), ivory 50/100/200 (`#F5F3EE,#ECE9E2,#DED9CF`), paper `#FBFAF7`, white `#FFFFFF`. Red 700→100 (`#9E0E04,#C01206,#E11507,#F4361F,#FF6A55,#FBE1DC`). Orange 500 `#FF5A0C`, amber 500/300/warn (`#F59E2E,#F8C57A,#E6A400`), green 500 `#34B36A`.

**Type scale (px):** 2xs 11, xs 12, sm 14, base 16, md 18, lg 21, xl 26, 2xl 33, 3xl 42, 4xl 54, 5xl 68, 6xl 88, 7xl 116. **LH:** tight 1.02, snug 1.14, normal 1.45, relaxed 1.65. **LS:** tight -0.02em, normal 0, wide 0.04em, label 0.14em, mono 0.02em. **Weights:** 400/500/600/700.

**Spacing (px):** 0,4,8,12,16,20,24,32,40,48,64,80,96,128,160. **Layout:** container 1240, container-wide 1440, gutter `clamp(16px,4vw,48px)`. **Border w:** 1 / 2 / 3(rule). **Radius:** 0,2,4,6,10,14,pill 999. **Control h:** 32/40/48/56.

**Elevation (light):** shadow-1 `0 1px 2px rgba(11,11,13,.06),0 1px 1px rgba(11,11,13,.04)`; shadow-2 `0 4px 14px rgba(11,11,13,.08),0 1px 3px rgba(11,11,13,.06)`; shadow-3 `0 14px 32px rgba(11,11,13,.12),0 4px 10px rgba(11,11,13,.07)`; shadow-4 `0 30px 64px rgba(11,11,13,.16),0 10px 24px rgba(11,11,13,.10)`; inset `inset 0 2px 6px rgba(0,0,0,.65),inset 0 0 0 1px rgba(0,0,0,.5)`. **Glows:** red `0 0 0 1px rgba(225,21,7,.5),0 0 18px rgba(225,21,7,.35)`, amber `0 0 22px rgba(245,158,46,.4)`. **Motion:** ease-out `cubic-bezier(.2,.7,.2,1)`, ease-in-out `cubic-bezier(.6,0,.2,1)`, ease-snap `cubic-bezier(.5,0,.1,1.2)`; dur fast 120 / base 200 / slow 360 ms. **Focus ring:** `0 0 0 2px var(--bg),0 0 0 4px var(--focus-ring)`.

**Texture:** SVG fractalNoise overlay at ~0.035 opacity on paper bg (from the designs).

---

## Appendix B — Content source map (P0)

| Target | Source markdown | Source images |
|---|---|---|
| `/istoriya` | `novikamps/history/history.md` | `novikamps/history/images/*`, `NAC.../images/*.jpg` |
| `/catalog/d-8000` | `novikamps/d8000/d8000.md` | `novikamps/d8000/images/*`, `NAC.../uploads/nag-d8000-*` |
| footer/contacts | `novikamps/contacts/contacts.md` | — |
