# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Project Overview

**NAG · NOVIK** — marketing/catalog site for a professional audio-equipment manufacturer
(St. Petersburg, founded 1976, company since 1992; `novikamps.com`). Russian-only (`ru-RU`).
Brands: **NAG** (transistor amps, DSP processors) and **NOVIK** (tube amps, boutique).

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · Lucide.
Static SSG. **No backend yet** — forms, cart, payments and CMS are deferred to later phases
on Supabase (see `docs/MASTER-PLAN.md`, phases P5–P6).

The full roadmap for everything not yet built lives in **`docs/MASTER-PLAN.md`** — it is the
source of truth for remaining work. The original design spec is in
`docs/superpowers/specs/2026-06-28-nag-site-foundation-design.md`.

## Mandatory editorial review: site passport

The current site (except the model and power-amplifier block revisions) was made by a previous
developer and has been audited. The audit document is the **site passport**:
`docs/pasport-sayta-novikamps.html`.

- Before planning, implementing, reviewing, or publishing **any** site change, open and check
  the relevant findings and requirements in the site passport.
- The passport is a mandatory constraint alongside `docs/MASTER-PLAN.md`; do not silently
  reintroduce risks, unsupported claims, inconsistent product data, or design/content problems
  identified by the audit.
- In the task handoff, PR/commit description, or final work report, record which passport
  requirements were checked and how the change complies with them. If a requested change conflicts
  with the passport, stop and obtain the owner's explicit decision before implementing it.

### History is a separately governed editorial project

The existing `История` section is intentionally preserved as-is. Findings in the site passport
about its historical claims, and the continuation of the narrative to the present day, belong to a
separate future project: **«История, часть II»**. Do not revise, expand, shorten, or otherwise
change factual/editorial history content while delivering unrelated site work. A narrowly scoped
technical repair that does not alter content requires the owner's explicit approval.

## Commands

```bash
npm run dev      # dev server → http://localhost:3000
npm run build    # production build (SSG) — also typechecks + lints
npm run start    # serve the production build
npm run lint     # ESLint
```

## Design system — non-negotiable rules

The NAG · NOVIK design system (approved by the owner 2026-11-08, issue #81) is ported into
`app/globals.css`. Source of truth: `docs/design-system/system/` (brand book `README.md`, site rules
`1-site.md`, `tokens.json`, component specs). Character: calm engineering catalog — plain white,
one font, equipment on photos, numbers in tables. Red `#D41406` only for the one main action per
screen and for alarms/errors.

- **Tokens only — no hex/rgb, no `clamp()`, no arbitrary `[NNpx]` in components.** Colour roles:
  `bg`, `surface`, `surface-raised`, `photo`, `line`, `line-strong`, `line-control`, `ink`,
  `ink-2`, `ink-3`, `accent`, `accent-hover`, `on-accent`, `danger(-soft)`, `warn(-soft)`, `ok`,
  `novik`, `focus` → utilities `bg-bg`, `text-ink-2`, `border-line-strong`, … Spacing is the
  Tailwind numeric scale on a 4px grid. Radii `rounded-sm` 4 / `rounded-md` 6 / `rounded-lg` 8.
  Width `max-w-page` (1200). One shadow, `shadow-raised` (active segment only).
- **One font, Golos Text 400/500/600, sentence case.** Type scale `text-site-display`,
  `-section`, `-title`, `-lead`, `-body`, `-small`, `-caption`. No Oswald, no monospace, no caps
  eyebrows/kickers, no section numbers 01/02, no hero metric rows, no grids of identical cards, no
  grey photo wells, no gradients, no red-filled blocks or icons.
- **Dark:** `<Theme dark>` (sets `data-theme="dark"`, flips every role) — one dark band per page at
  most, only where it carries meaning (home: «Подбор под задачу проекта»).
- **Motion — light (owner, 2026-11-08):** hover/press feedback in 120 ms (`transition-quick`;
  underlines fade via `decoration-transparent` → `decoration-current`), dialogs and accordions
  open in 240 ms, first screen uses `.enter` (`[--delay:80ms]` to stagger), content below fades in
  on scroll via `.reveal` / `.reveal-children` (CSS scroll timeline, opacity + max 8px). `Section`
  already applies them. Nothing loops; all of it is off under `prefers-reduced-motion`.
- **Catalog = rows** (`ProductRow`): clean front-panel photo on white, rack units at one width
  (`photo-rack`, 400px), name, essence, 1–2 key numbers, price on the right. Clean cut-outs live in
  `lib/content/catalog.ts` (`FRONT_PHOTO`); no marketing badges on photos.
- **Reuse DS primitives** from `components/ds/` (public API `components/ds/index.ts`); extend
  there if something is missing.

### DS primitives (`components/ds/`)

`Button` (+`buttonVariants`: primary · secondary · quiet · link) · `Container` · `Theme` · `Icon` ·
`Section` · `PageHeader` · `Breadcrumb` · `Tabs` (in-page links) · `ProductRow` · `SpecTable` /
`SpecGroups` · `SpecMatrixTable` · `Status` · `Tag` · `Notice` · `Field` / `Input` / `Textarea` ·
`Select` · `Checkbox` · `Switch` · `Segmented` · `FormStatus` · `AccordionItem` (native
`<details>`) · `Figure` · `Lightbox` · `Prose` · `DownloadList`. Showcase: `/_ds`.

Server components by default. Only the interactive ones are `"use client"`.

### Frozen: «История»

`/istoriya` keeps its pre-redesign look by the owner's decision (2026-11-08) until «История,
часть II». Its old tokens, Oswald/JetBrains Mono and animations live only in `app/legacy.css`
(scoped to `.legacy`, set by `app/istoriya/layout.tsx`) and `components/history/legacy/`. Nothing
else may use them.

## Content pipeline

Two complementary patterns — pick by page shape:

1. **MDX + frontmatter** (default, for product & marketing pages) — `content/products/*.mdx`.
   Frontmatter holds structured data (specs, price, gallery, feature/tech/software blocks),
   validated by zod (`lib/content/schema.ts`); the MDX body holds prose. Loaders:
   `lib/content/products.ts` (gray-matter + zod, throws on invalid → fails the build) and
   `lib/content/mdx.tsx` (renders the body with `remark-gfm` + `rehype-slug`). Routes use
   `generateStaticParams` + `dynamicParams = false` + `generateMetadata`.
2. **Typed data module** (for complex editorial longreads) — e.g.
   `content/company/istoriya.ts` exports a typed object (`lib/content/types.ts`). Used for the
   history page because its chapters mix prose, quotes, stat rows and figures. Loaded via
   `lib/content/company.ts`.

**Images:** copied into `public/<area>/…` (`public/brand`, `public/history`,
`public/products/<slug>`). Frontmatter / data references absolute public paths. Use `next/image`.
Source content lives outside the repo in `novikamps/` and the design exports — see the master plan
content map.

## Routing & conventions

- **Russian translit slugs:** `/istoriya`, `/catalog/d-8000`, `/kontakty`, `/garantiya`, …
- Products live under `/catalog/[slug]`. Category pages (`/catalog/processors`, …) are not built
  yet (P2/P3) — nav links to them currently 404 by design.
- All user-facing copy is Russian. Prices are integers in roubles, formatted with
  `lib/format.ts` (`formatPrice`).
- Path alias `@/*` → repo root.

## Deferred (do NOT build without a phase ticket)

Cart/checkout/payments, accounts, request/contact form submission, admin/CMS, any Supabase
wiring. Product CTAs ("В корзину" / "Купить в 1 клик") are intentionally stubbed to
`mailto:`/`tel:` until P5/P6. If a task needs one of these, check `docs/MASTER-PLAN.md` for the
phase and scope first.

## Working in this repo

- Match the existing component style: tokens over hex, DS primitives over bespoke markup,
  server components unless interactivity is required.
- When adding a product/page, follow the master-plan slice for it (source content, design ref,
  components, acceptance criteria) and run its recipe: brainstorm → analyze → plan → build → review.
- `npm run build` must stay green (it typechecks + lints + prerenders).
