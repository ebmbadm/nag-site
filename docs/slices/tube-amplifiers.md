# Slice: Ламповые усилители (NOVIK) — boutique tube/valve amps  (Phase P2)

## Overview
NOVIK (the boutique/vintage-tube sister brand to NAG Pro Audio) ламповые усилители мощности —
hand-built valve amplifiers on Soviet tubes (6П3С-Е, 6П6С, 6Н2П-ЕВ, 12AX7, 5881/6L6).
Five pages total:

1. **`/catalog/tubes`** — category/aggregator landing ("Наши ламповые усилители"). Links to the 4 models below,
   plus a "по остальным моделям — свяжитесь с нами" CTA (the line-up is much larger; only 4 are shown).
2. **`/catalog/e12`** — NOVIK E12, самый мощный (2×200 W RMS / 2×480 W max).
3. **`/catalog/black-fire`** — NOVIK BLACK FIRE, Hi-End класс (2×60 W RMS / 2×150 W max).
4. **`/catalog/redbear`** — REDBEAR MKX50 / NOVIK MKX50+, гитарный комбо (Gibson-codesigned, 50 W).
5. **`/catalog/n1202`** — NOVIK N1202, 3-канальный гитарный ламповый "топ" (100 W).

These are **photo-led, prose-light, and have NO retail price** ("Цена по запросу / изготавливается под заказ").
They reuse the **product MDX template** at `/catalog/[slug]` but require **one schema change + one hero change**
to support price-less / "по запросу" products (see Design reference + Data model). The category page is a **new,
small route** (not the product template).

Branding note: copy says **NOVIK** (not NAG). Brand line eyebrow should read e.g. `"Ламповый усилитель · NOVIK"`,
not "NAG Pro Audio". Accent for these pages is the **amber tube-glow** (tokens already exist —
`--color-amber` / `--nag-amber-500` `#f59e2e`, `--nag-amber-300` `#f8c57a`, `--glow-amber`), not the NAG signal-red,
used sparingly on the dark hero/band (a warm glow behind the chassis photo), while DS structural accent stays as-is.

## Pages

| Product / Page | Proposed route | Source .md | Images (dir · count) | One-liner | Key specs / price |
|---|---|---|---|---|---|
| Категория «Ламповые усилители» | `/catalog/tubes` | `…/novikamps/tubes/tubes.md` | `…/novikamps/tubes/images/` · 1 (`novik-black-fire-head-front.png`) | Aggregator landing — 4 of many NOVIK tube amps + «свяжитесь с нами» | — (no price; category) |
| NOVIK E12 | `/catalog/e12` | `…/novikamps/e12/e12.md` | `…/novikamps/e12/images/` · 1 (`novik-e12-head-front.png`) | Самый мощный серийный ламповый усилитель мощности | **2×200 W RMS** (2×480 W max); 6× 6П3С-Е или 6×5881(6L6); преамп 6Н2П-ЕВ + 6Н1П-ЕВ/канал; вх. 6.3 мм 0.7 mV; вых. 4 Ом (×2) и 8 Ом/канал. **Цена по запросу** |
| NOVIK BLACK FIRE | `/catalog/black-fire` | `…/novikamps/black-fire/black-fire.md` | `…/novikamps/black-fire/images/` · 1 (`novik-black-fire-head-front.png`) | Усилитель Hi-End класса, разъёмы Hi-End типа, малая партия | **2×60 W RMS** (2×150 W max); 2×5881/канал (схемотехника 602, вых. 4× 6П6С/6V6); класс AB; 500×230×170 мм; 12 кг. **Цена по запросу** |
| REDBEAR MKX50 / NOVIK MKX50+ | `/catalog/redbear` | `…/novikamps/redbear/redbear.md` | `…/novikamps/redbear/images/` · 1 (`redbear-combo-amplifier.jpg`) | Первый серийный комбо NOVIK, дизайн от Gibson, переключатель режимов оконечника | **50 W RMS** комбо; 2× 6П3С-Е (5881/6L6 опц.); преамп 6Н2П-ЕВ (12AX7 опц.); 4/8/16 Ом; динамик Celestion G12T-75 (Vintage 30 опц.); 470×540×230 мм; 24 кг. **Цена по запросу** |
| NOVIK N1202 | `/catalog/n1202` | `…/novikamps/n1202/n1202.md` | `…/novikamps/n1202/images/` · 2 (`novik-n1202-head-front.jpg`, `novik-n1202-internal-speakers.jpg`) | Первый гитарный ламповый "топ" под брендом NOVIK, 3-канальный преамп, 100% навесной монтаж | **100 W RMS**; 2×/4× 6П3С-Е (5881/6L6 опц.); преамп 5× 12AX7; 3 канала (2+); 4/8/16 Ом; реле-коммутация; послед.-парал. петля эффектов; 700×220×230 мм; 20 кг. **Цена по запросу** |

Source paths are under `/Users/viktor/Documents/kimi/workspace/novikamps/` (abbreviated `…/novikamps/` in the table).
Images for each product are copied to `public/products/<slug>/` (e.g. `public/products/e12/novik-e12-head-front.png`);
category-page hero image goes to `public/catalog/tubes/` or reuse a product image.

## Design reference
**Clone the product template** (`content/products/<slug>.mdx` → `app/catalog/[slug]/page.tsx` +
`components/product/sections.tsx`) for the 4 amp pages. **Hand-build the category page** (`/catalog/tubes`) as a small
new route — it is NOT a product (closer to a category/landing grid; there is no category template yet, so build a simple
one in `app/catalog/tubes/page.tsx`).

Tokens / DS primitives to reuse (tokens-only, no hex): `bg-bg`, `bg-surface`, `bg-surface-2`, `text-text`,
`text-text-muted`, `text-text-faint`, `border-border`; type scale `text-2xs … text-5xl`; `font-display` / `font-text` /
`font-mono`; radii `--radius-sm/md/lg`. Dark technical band: `<Surface mode="dark">` (as in `FeatureBand` / `TechBand`).

**Amber tube-glow accent (the one visual signature vs D-8000):** the D-8000 hero/bands use the red signal accent and a
red radial glow (`rgba(245,158,46,0.10)` is already amber in `FeatureBand`, interestingly). For NOVIK, lean into amber:
- Dark hero/feature band glow: `radial-gradient(... rgba(245,158,46,0.14), transparent)` using `--nag-amber-500`.
- Optional soft glow on the chassis figure via `box-shadow: var(--glow-amber)` (already defined).
- Eyebrows / chips may use amber (`text-[var(--nag-amber-500)]`) instead of red on these pages — but do this via a small
  prop/variant, do NOT hardcode. Keep DS structural red where it is hard-wired unless a token swap is trivial.

**Differences from D-8000 (important):**
- **NO PRICE / NO CART.** D-8000 `ProductHero` always renders «Розничная цена», «В корзину», «Купить в 1 клик».
  Tube amps have no price. The hero must instead show a **«Цена по запросу · изготавливается под заказ»** block and a
  single **«Запросить расчёт»** CTA (mailto `novikamps@mail.ru` with subject = product name) + **«Позвонить»**
  (tel `+79219372508`). Reuse the existing `CONTACT_EMAIL` / `CONTACT_TEL` constants in `sections.tsx`.
- **Photo-led, sparse data.** Usually 1 gallery image (N1202 has 2). `features` / `tech` / `software` bands are mostly
  absent — the template already renders these conditionally, so just omit those frontmatter keys. Expect a hero +
  short MDX prose + a single specs accordion group per page.
- **No software band** at all (these are analog amps). **No EAC / Wi-Fi/USB logos** in the hero (those are D-8000-specific
  hardcoded `<Image>` tags — see below, must be removed/guarded).
- Specs are a single short list, not 5 groups — one `specGroups` entry with `defaultOpen: true` is enough.

## Data model
Reuse `productFrontmatterSchema` (`lib/content/schema.ts`) with **two required schema changes**:

1. **Make `price` optional + support "on request".** Currently `price` is a required object with required
   `amount: number`. Change to:
   ```ts
   price: z
     .object({
       amount: z.number().optional(),     // omit for «по запросу»
       currency: z.string().default("₽"),
       note: z.string().optional(),
       onRequest: z.boolean().optional(), // true → render «Цена по запросу»
     })
     .optional(),
   ```
   (Keep D-8000 working: it still passes `{ amount, currency, note }`.)
2. **`ProductHero` price/CTA block must branch** on `price?.onRequest` / missing `amount`: render the
   «Цена по запросу · изготавливается под заказ» label + «Запросить расчёт» mailto CTA instead of the formatted price +
   «В корзину». Also **guard the hardcoded D-8000 logos** (`burr-brown-logo.png`, `wifi-usb-rj45-connectivity.png`) and
   the `#software` / `#specs` quick-links — either gate behind an optional `heroLogos`/`tech`/`software` presence check
   or drop them when absent. These are currently unconditional in `ProductHero` and will 404 on tube pages.

Optional (nice-to-have, not blocking): add `brand?: "NAG" | "NOVIK"` to drive accent color (amber vs red) and contact
endpoints; default `"NAG"`. If skipped, just set `line` to a NOVIK eyebrow and accept red structural accent.

**Concrete example — `content/products/black-fire.mdx`** (most "complete" small amp; faithful to `black-fire.md`):
```mdx
---
name: "NOVIK BLACK FIRE"
line: "Ламповый усилитель · NOVIK"
subtitle: "Hi-End класс · малая партия"
badges: ["HI-END"]
category: "Ламповые усилители"
breadcrumb:
  - { label: "Каталог", href: "/catalog" }
  - { label: "Ламповые усилители", href: "/catalog/tubes" }
  - { label: "BLACK FIRE" }
price:
  onRequest: true
  note: "Изготавливается под заказ"
summary: "По просьбе клиентов NOVIK выпустил небольшую партию усилителей в дизайне и с входными и выходными разъёмами Hi-End типа. Схемотехника от модели 602, но с выходными лампами 4× 6П6С (6V6) в каждом канале."
specChips:
  - "2×60 W RMS"
  - "2×150 W max"
  - "класс AB"
  - "6П6С / 6V6"
  - "12 кг"
gallery:
  - { src: "/products/black-fire/novik-black-fire-head-front.png", alt: "NOVIK BLACK FIRE — передняя панель", caption: "BLACK FIRE · Hi-End" }
specGroups:
  - title: "Характеристики"
    defaultOpen: true
    rows:
      - { label: "Мощность Max", value: "2×150 Вт" }
      - { label: "Мощность RMS", value: "2×60 Вт" }
      - { label: "Выходные лампы на канал", value: "2×5881 (вых. каскад 4× 6П6С / 6V6)" }
      - { label: "Режим работы", value: "класс AB" }
      - { label: "Габариты", value: "500×230×170 мм" }
      - { label: "Вес", value: "12 кг" }
---

NOVIK **BLACK FIRE** — усилитель Hi-End класса. По просьбе многих клиентов NOVIK сделал небольшую партию
усилителей в дизайне и с входными и выходными разъёмами Hi-End типа. Схемотехника — от модели 602, с выходными
лампами 4× 6П6С (6V6) в каждом канале.
```

For **E12** add a richer `specGroups` (output tubes 6× 6П3С-Е / 6×5881, преамп tubes, вх./вых. impedance, чувствительность
0.7 mV, "без принудительной вентиляции", "нет ограничения по ресурсу кроме ламп"). For **REDBEAR** include the режим-switch
note (REDBEAR CAB COMBO vs классический NOVIK), динамик Celestion, "1+ канал". For **N1202** include 3-канальный преамп
(2+), 5× 12AX7, реле-коммутация, петля эффектов, "глубокий моддинг базовой модели", 2 gallery images.

**Category page `/catalog/tubes`** is NOT frontmatter — hardcode a typed array of the 4 cards
(`{ name, slug, tagline }`) inline in `app/catalog/tubes/page.tsx` (or a tiny `content/catalog/tubes.ts`):
`E12 — «Самый мощный ламповый усилитель»`, `MKX50/RedBear — «История REDBEAR»`,
`BLACK FIRE — «Усилитель Hi-End класса»`, `N1202 — «Гитарный оконечник»`. Plus intro copy:
«Компания НОВИК за свою историю создала десятки ламповых усилителей мощности. Здесь — лишь 4 модели. По остальным —
свяжитесь с нами.»

## Components needed
**Reuse from `components/ds`:** `Container`, `Eyebrow`, `Badge`, `Chip`, `Divider`, `Rule`, `Surface`, `SectionHeader`,
`Gallery`, `Figure`, `AccordionItem`, `SpecTable`, `buttonVariants`.
**Reuse from `components/product/sections.tsx`:** `Breadcrumb`, `ProductHero` (after the no-price branch is added),
`SpecsSection`. `FeatureBand` / `TechBand` / `SoftwareSection` are rendered conditionally already — omit the frontmatter
keys and they won't appear.

**New components / changes (justified):**
1. **Edit `ProductHero`** (in `sections.tsx`) — add the «Цена по запросу»/«Запросить расчёт» branch and guard the
   hardcoded D-8000 logos + quick-links. *Justification:* the hero unconditionally renders price, cart CTAs, and
   D-8000-specific brand logos; tube amps break all three. Smallest correct change is a branch, not a new hero.
2. **Edit `schema.ts`** — make `price` optional / add `onRequest`. *Justification:* schema currently forbids price-less
   products; `getProduct` would throw and fail the build.
3. **NEW `app/catalog/tubes/page.tsx`** — small category/landing page (card grid of 4 amps + intro + contact CTA).
   *Justification:* `/catalog/tubes` is not a product; there is no category template yet. Keep it a thin server component
   reusing DS primitives (a card = `Surface`/bordered div + `Figure` + `Eyebrow` + link). If a generic
   `CategoryGrid`/`ProductCard` is wanted for reuse across future category pages, propose it during /brainstorming, but a
   one-off page is acceptable for P2.
4. **(Optional) `brand`-aware accent** — a tiny `amber` flag/variant on `Eyebrow`/glow, OR a per-page wrapper that sets
   `--accent` to amber via inline style on these routes. Prefer a token swap over new components. Only build if the amber
   signature is in scope for P2; otherwise document as a follow-up.

No new primitive is strictly required beyond the category page; everything else is edits to existing files.

## Content notes
- **NOVIK, not NAG.** All copy/branding is NOVIK. Contacts are `novikamps@mail.ru` / `+79219372508` (already the
  constants in `sections.tsx`). Do not surface NAG/Burr-Brown/Wi-Fi assets on these pages.
- **No pricing anywhere.** Every amp is «Цена по запросу / изготавливается только под заказ» (explicit in `n1202.md`,
  applies to all). Hero CTA = request a quote, not buy.
- **Category/aggregator page** (`tubes.md`) deliberately shows only 4 of "десятки" models and routes the rest to a
  contact CTA — keep that "lишь 4 модели" framing; do not invent other models.
- **Source-link mapping:** `tubes.md` links use bare slugs (`/e12`, `/redbear`, `/black-fire`, `/n1202`); on the NAG site
  these become `/catalog/e12`, `/catalog/redbear`, `/catalog/black-fire`, `/catalog/n1202`. Note REDBEAR's source slug is
  **`/redbear`** even though the product is "MKX50".
- **Tube/spec terminology** must stay verbatim Russian/Cyrillic tube names: 6П3С-Е, 6П6С (6V6), 6Н2П-ЕВ, 6Н1П-ЕВ, 5881,
  6L6, 12AX7, ЕСС81, класс AB. Keep "Вт RMC" wording from sources or normalize to "Вт RMS" — pick one and be consistent
  (recommend RMS).
- **No EAC / warranty / Wi-Fi badges** for these analog amps (EAC and the Wi-Fi/USB note are D-8000-specific).
- **REDBEAR quirk:** dual product name (REDBEAR MKX50 CAB COMBO \ NOVIK MKX50+) and a режим-переключатель (1 = REDBEAR
  CAB COMBO sound, 2 = классический NOVIK). Put both names in `name`/`subtitle` and explain the switch in MDX prose.
- **Images:** mostly single front-of-chassis photos; N1202 also has an internal/speakers shot (2-image gallery → thumbs
  appear automatically). Category page can reuse a product hero image (the only image in `tubes/images/` is the
  black-fire front shot — reuse, or pull the E12 shot for visual punch).

## Acceptance criteria
- `next build` is green; `getProduct` validates all 4 MDX files against the (updated) schema without throwing.
- `generateStaticParams` emits all 4 product slugs (`e12`, `black-fire`, `redbear`, `n1202`); `/catalog/tubes` builds as
  a static route. `dynamicParams = false` still holds.
- Tokens-only: no hardcoded hex anywhere; amber accent comes from `--nag-amber-500` / `--color-amber` / `--glow-amber`;
  dark bands use `<Surface mode="dark">`.
- **No price/cart leakage:** product heroes render «Цена по запросу · изготавливается под заказ» + «Запросить расчёт»
  (mailto) / «Позвонить» (tel) — never «В корзину» / formatted price for these slugs. D-8000 still renders its real price
  (no regression).
- No 404s: D-8000-specific hero logos (`burr-brown-logo.png`, `wifi-usb-rj45-connectivity.png`) and `#software`/`#specs`
  quick-links are NOT rendered when the corresponding data is absent.
- Images present under `public/products/<slug>/` and referenced correctly; gallery + specs accordion render; N1202 shows
  a 2-thumb gallery.
- `generateMetadata` produces RU title + summary + OG image per product; `/catalog/tubes` has its own metadata.
- Content faithful to sources — no invented models, specs, or prices.

## Run-recipe
1. **`/brainstorming`** — settle two design decisions: (a) the no-price hero variant (branch in `ProductHero` vs a new
   `TubeHero`) and the `price` schema change; (b) whether to ship the amber accent + a `brand` flag now or defer. Decide
   whether `/catalog/tubes` is a one-off page or a reusable `CategoryGrid`.
2. **Analyze sources (exact files):**
   - `/Users/viktor/Documents/kimi/workspace/novikamps/tubes/tubes.md`
   - `/Users/viktor/Documents/kimi/workspace/novikamps/e12/e12.md`
   - `/Users/viktor/Documents/kimi/workspace/novikamps/black-fire/black-fire.md`
   - `/Users/viktor/Documents/kimi/workspace/novikamps/redbear/redbear.md`
   - `/Users/viktor/Documents/kimi/workspace/novikamps/n1202/n1202.md`
   - images under each `…/<dir>/images/` (copy to `public/products/<slug>/`; `e12`→`novik-e12-head-front.png`,
     `black-fire`→`novik-black-fire-head-front.png`, `redbear`→`redbear-combo-amplifier.jpg`,
     `n1202`→`novik-n1202-head-front.jpg` + `novik-n1202-internal-speakers.jpg`).
   - reference templates: `content/products/d-8000.mdx`, `lib/content/schema.ts`, `lib/content/products.ts`,
     `app/catalog/[slug]/page.tsx`, `components/product/sections.tsx`, `components/ds/*`, `app/globals.css` (amber tokens).
3. **`/writing-plans`** — write the plan: schema edit → `ProductHero` no-price branch + logo/quick-link guards →
   4 MDX files → image copy → `/catalog/tubes` page → metadata → (optional) amber accent.
4. **Implement (TDD where logic exists):** the only real logic is schema + hero branching — add/extend a test that
   `getProduct` accepts a price-less product and rejects a malformed one, and a render assertion that a price-less hero
   shows «Цена по запросу» and no «В корзину». Author the 4 MDX files and the category page. `npm run build` green.
5. **`/requesting-code-review`** — verify tokens-only, no price/cart/logo leakage, faithful content, static params,
   metadata, and that D-8000 is unregressed.
