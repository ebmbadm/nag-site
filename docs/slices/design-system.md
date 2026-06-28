# Slice: Design-system completion (Phase P1)

## Overview
P0 ported the full token layer (`app/globals.css`) and the primitives needed for the first two
pages. P1 hardens the DS into a complete, documented library so every later slice composes
instead of inventing. No new pages — this is infrastructure that de-risks P2–P4.

## Scope / deliverables
- **Primitive gaps** — add the primitives later slices will need but P0 didn't:
  - `Meter` (VU-style segmented meter — the original `_ds_bundle.js` had one; rebuild clean as
    SVG, light/dark aware). Optional/feature pages only.
  - `Tabs` / `PillGroup` (model/variant switchers for SERIES pages like TD-series, КОНТУР).
  - `Table` variants beyond `SpecTable` (comparison table for category pages, e.g. F-8 PRO vs F-8 vs D-8000).
  - `Breadcrumb` — promote the product-local breadcrumb (`components/product/sections.tsx`) into
    a shared `components/ds` primitive (reused by every catalog page).
  - `ProductCard` — catalog/grid card (category pages, homepage, related products).
  - `Prose` wrapper — standard editorial column styling for MDX bodies.
  - `MobileNav` — the `SiteHeader` nav is `lg:`-only; add a real mobile drawer/disclosure.
- **Surface/dark polish** — audit every token under `[data-surface="dark"]`; verify focus rings,
  shadows, accent-wash, amber glow render on the chassis palette.
- **Motion** — centralize the easing/duration tokens into reusable transition utilities; add the
  signal-red/amber glow helpers as utilities.
- **Accessibility pass** — focus-visible rings on all interactive primitives, `aria` on
  accordions/galleries/toc, reduced-motion handling for `ScrollProgress`/scroll-spy.
- **DS reference page** (dev-only, e.g. `/_ds` or a Storybook-lite route) showing every primitive
  in light + dark — the living contract.

## Design reference
Tokens already in `app/globals.css`. Original component behaviors documented in the scout report
of `_ds/nag-novik-design-system-*/_ds_bundle.js` (Meter color zones green/amber/red, segment
geometry). Match the existing primitive code style in `components/ds/`.

## Components needed
Reuse: everything in `components/ds`. New (this slice): `Meter`, `Tabs`/`PillGroup`,
`ComparisonTable`, `Breadcrumb` (promoted), `ProductCard`, `Prose`, `MobileNav`.

## Acceptance criteria
- `npm run build` green; no hardcoded hex in any primitive (grep `#[0-9a-fA-F]{3,6}` in
  `components/` returns only token definitions, not usage).
- Every primitive renders correctly in both `data-surface` modes.
- DS reference route shows all primitives; keyboard-navigable; passes basic axe checks.
- `components/ds/index.ts` exports the full public API.

## Run-recipe
1. `/brainstorming` — confirm the primitive list against P2–P4 needs (don't build YAGNI primitives).
2. Analyze: read `components/ds/*`, `app/globals.css`, the `_ds_bundle.js` scout notes.
3. `/writing-plans`.
4. Implement primitive-by-primitive; TDD the logic-bearing ones (`Meter` value→segments, `Tabs` state).
5. `/requesting-code-review`.
