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

## Commands

```bash
npm run dev      # dev server → http://localhost:3000
npm run build    # production build (SSG) — also typechecks + lints
npm run start    # serve the production build
npm run lint     # ESLint
```

## Design system — non-negotiable rules

The design system (`nag-novik-design-system`) is ported into `app/globals.css`.
Aesthetic: warm paper `#FBFAF7` + signal red `#E11507`, industrial/rack feel; dark "chassis"
bands for technical sections. Fonts: **Oswald** (display/headings), **Golos Text** (body),
**JetBrains Mono** (specs, labels, part numbers).

- **Never hardcode hex/rgb in components.** Use the tokens: Tailwind utilities backed by
  `@theme` (`bg-bg`, `bg-surface`, `bg-surface-2`, `text-text`, `text-text-muted`,
  `text-text-faint`, `text-accent`, `bg-accent`, `text-on-accent`, `border-border`,
  `border-border-strong`, …) or raw CSS vars via arbitrary values
  (`tracking-[var(--ls-label)]`, `rounded-[var(--radius-md)]`, `shadow-[var(--shadow-2)]`).
- **Dark bands:** wrap in `<Surface mode="dark">` (sets `data-surface="dark"`, which flips every
  semantic token). Never build a dark section by hand-picking dark hex values.
- **Type scale** is on `--text-2xs … --text-7xl` (utilities `text-2xs`, `text-md`, `text-4xl`, …).
  Display headings: `font-display uppercase`, `letterSpacing: var(--ls-tight)`,
  `lineHeight: var(--lh-tight)`. Eyebrows/labels: `font-mono uppercase`,
  `tracking-[var(--ls-label)]`.
- **Reuse DS primitives** from `components/ds/` — don't re-implement buttons, chips, accordions,
  spec tables, galleries, etc. The primitive set is the contract; extend it there if something is
  missing. Public API is `components/ds/index.ts`.

### DS primitives (`components/ds/`)

`Button` (+`buttonVariants`) · `Container` · `Eyebrow` · `Badge` · `Chip` · `Divider` · `Rule` ·
`Surface` · `SectionHeader` · `SpecTable` · `AccordionItem` (native `<details>`) · `Figure` ·
`Gallery` (embla, client) · `Toc` (scroll-spy, client) · `ScrollProgress` (client) ·
`ExpandAllControl` (client).

Server components by default. Only the interactive ones are `"use client"`.

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
