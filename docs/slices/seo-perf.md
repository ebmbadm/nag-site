# Slice: SEO · performance · analytics (Phase P7, cross-cutting)

## Overview
Cross-cutting hardening, runnable incrementally and again before launch. Makes the catalog
discoverable and fast. Most is additive and low-risk.

## Scope / deliverables
- **Metadata** — per-route `generateMetadata` (titles, descriptions, canonical) is partly done;
  complete it for every page. Add OpenGraph + Twitter cards; `opengraph-image.tsx` (dynamic OG with
  product name + price) for products, like NB-site's blog OG route.
- **Structured data (JSON-LD)** — `Product` (name, image, offers/price, brand NAG/NOVIK,
  EAC), `Organization` (St. Petersburg, contact, founded 1992), `BreadcrumbList`. The
  `marketing-skills:schema` skill can help.
- **Sitemap & robots** — `app/sitemap.ts` (from `getProductSlugs()` + static routes),
  `app/robots.ts`. Submit via Yandex Webmaster (MCP available) + Google.
- **Performance** — audit `next/image` usage (sizes/priority), font loading (already `next/font`),
  bundle (the big software screenshots are 500 KB+ PNGs → compress/convert to webp/avif), lazy-load
  below-fold galleries; target green Core Web Vitals (Lighthouse via chrome-devtools MCP).
- **Analytics** — Yandex.Metrika (RU-first; MCP available) + optional Vercel Analytics. Cookie/consent
  per RU norms.
- **i18n** — out of scope unless requested (site is RU-only); leave `lang="ru"`.

## Design reference
No visual surface — infra. Reuse `lib/format.ts`, existing metadata in `app/layout.tsx`.

## Components needed
None visual. New: `lib/seo/` (jsonld builders), `app/sitemap.ts`, `app/robots.ts`,
`app/catalog/[slug]/opengraph-image.tsx`, analytics provider.

## Acceptance criteria
- Every route has title/description/canonical/OG; product pages emit valid `Product` JSON-LD
  (validate via Rich Results / Yandex).
- `sitemap.xml` + `robots.txt` correct; submitted to Yandex/Google.
- Lighthouse: Performance ≥ 90 mobile, no CLS from images/fonts; large PNGs optimized.
- Metrika firing; `npm run build` green.

## Run-recipe
1. `/brainstorming` (light) — confirm analytics/consent + OG style.
2. Analyze: routes lacking metadata, heavy assets (`public/products/*`), `app/layout.tsx`.
3. `/writing-plans`.
4. Implement: metadata/JSON-LD → sitemap/robots → image optimization → analytics. Use
   `marketing-skills:seo-audit`, `:schema`, `yandex-webmaster`/`yandex-metrika` MCP.
5. `/requesting-code-review`.
