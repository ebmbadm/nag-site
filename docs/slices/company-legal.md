# Slice: Компания и сервис (Company & Service pages)  (Phase P3)

## Overview

The "company & service" area covers the non‑product, non‑catalog informational pages of the NAG · NOVIK site — the pages a visitor reaches from the footer "Компания" column and the header "О компании / Контакты" links.

История (`/istoriya`) is **already built** (longread, `content/company/istoriya.ts` + `components/history/*`). This slice adds **three new pages**:

1. **`/kontakty`** — Контакты. Phone, email, SPb office address, map placeholder, and an inquiry-form card. The form **submission is a P5/Supabase dependency** — build the static page now and render a **non-functional stubbed form** (disabled submit, or a `noValidate` form that does nothing / shows "скоро") so the layout is final but no network call exists yet.
2. **`/garantiya`** — Гарантия и сервис. Warranty policy (1 year standard, up to 4 years on a manufacturer defect confirmed by NOVIK diagnostics) plus a long service-philosophy narrative (40+ years of tube amps, tube vs. transistor care, remote help, spare parts/tubes).
3. **`/o-kompanii`** — О компании hub. A short landing page that introduces the company and routes visitors to История, Гарантия, and Контакты. This is **new** (not in the source markdown) and is justified by the header nav: `site-header.tsx` already points "О компании" at `/istoriya`, which is wrong — it should point at a real hub. The hub also gives the 3-variant timeline exploration (`История - направления.dc.html`) a home (see Content notes).

All three are static (SSG), RU-only, server components. No `generateStaticParams` needed (these are fixed routes, not dynamic segments) — they are plain `app/<route>/page.tsx` files with an exported `metadata`.

## Pages

| Product/Page | Proposed route | Source .md | Images (dir · count) | One-liner | Key specs / price |
|---|---|---|---|---|---|
| Контакты | `/kontakty` | `/Users/viktor/Documents/kimi/workspace/novikamps/contacts/contacts.md` | `contacts/images/` · **0** (empty) | Phone, email, SPb office, map placeholder, stubbed inquiry form | tel `+7 921 937 25 08`; `novikamps@mail.ru`; СПб, Московское шоссе, 25 литера А, офис 216А. No price. |
| Гарантия и сервис | `/garantiya` | `/Users/viktor/Documents/kimi/workspace/novikamps/guarantee/guarantee.md` | `guarantee/images/` · **1** (`abstract-gradient-background.png`, 2.9 MB) | Warranty terms + service philosophy longread | 1 год стандарт; до 4 лет при заводском дефекте; 40+ лет ламповых усилителей; с 2005 — транзисторные NAG. No price. |
| О компании (hub) | `/o-kompanii` | — (new; assembled from existing copy + footer/header nav) | — | Short intro + cards linking to История / Гарантия / Контакты | "На рынке с 1992 года" — reuse footer tagline. No price. |

Notes on images:
- `contacts/images/` is **empty** → no hero photo for `/kontakty`. Use a token-built map/address placeholder block instead (see Design reference). Do **not** invent a photo.
- `guarantee/images/abstract-gradient-background.png` (2.9 MB) → copy to `public/company/guarantee/abstract-gradient-background.png` and use it ONLY as the dark hero band backdrop (optional; the dark `Surface` can also stand alone). At 2.9 MB it MUST be optimized (Next `<Image>`, or pre-resize) before shipping.
- All copied images land under `public/company/<page>/…` (mirrors the product convention `public/products/<slug>/…`).

## Design reference

**Clone the company/longread template, not the product template.** The closest existing reference is `/istoriya` (`app/istoriya/page.tsx` + `components/history/*`) and the DS primitives in `components/ds/`. These are content pages with **no price, no spec accordion, no gallery, no SpecTable** — so the `/catalog/[slug]` product template (`app/catalog/[slug]/page.tsx` + `components/product/sections.tsx`) is the wrong base.

Per-page direction:

- **`/garantiya`** — the most editorial of the three. Structure:
  1. **Dark hero band** via `<Surface mode="dark">` (this is the one place that uses the `data-surface="dark"` token flip — see `primitives.tsx` `Surface` + `globals.css` `:root[data-surface="dark"]` / `.dark` block starting at line ~215). Eyebrow (mono, accent) "Гарантия и сервис", `font-display` H1, short lede. Optionally lay `guarantee/abstract-gradient-background.png` behind it at low opacity (the source page literally named the asset for this). The History `HistoryHero` is **light**, so this dark band is the main divergence from `/istoriya`.
  2. **Warranty terms block** — 2 stat/term cards on `bg-surface` with `border-border`, `--radius-lg`, `--shadow-1`: "1 год" (стандартная гарантия) and "до 4 лет" (при заводском дефекте по заключению диагностики NOVIK). Reuse the `stats` visual language from `components/history/blocks.tsx` (big `font-display` value + mono label) rather than inventing a new card.
  3. **Service philosophy longread** — prose section using `SectionHeader` + body paragraphs. This is the bulk of `guarantee.md` (lines 10–28): 40+ years of tube amps, "max облегчить жизнь клиентам", remote-repair letters, help to local masters, supplying matched tube sets / transformers / parts, the 2005 pivot to transistor NAG amps, and tube-vs-transistor maintenance specifics (active cooling collects dust → clean ≥ 1×/year; passive tube cooling → tubes need more attention).
  4. **CTA strip** → link to `/kontakty` ("Нужен сервис? Свяжитесь с нами") using `<Button>` (`components/ds/button.tsx`).
  Tokens: `bg-bg`, `bg-surface`, `bg-surface-2`, `text-text`, `text-text-muted`, `text-text-faint`, `text-accent`, `border-border`; type scale `text-md`..`text-4xl`; `font-display` / `font-text` / `font-mono`; `Rule` for the 3px accent rule; `Divider` for hairlines.

- **`/kontakty`** — utility/contact layout, **no dark band needed** (keep light). Structure:
  1. `Container` + `SectionHeader` (eyebrow "Контакты", title "Свяжитесь с нами", lede from `contacts.md` line 6 — "Напишите нам здесь и оставьте свои контакты, и мы обязательно свяжемся с вами").
  2. **Two-column layout** (`flex flex-wrap` like the History TOC/article split in `app/istoriya/page.tsx`): left = contact details list (phone link `tel:`, email link `mailto:`, address block) styled like the footer's contact block (`site-footer.tsx` lines 41–51) but larger; right = the **inquiry form card** (stubbed).
  3. **Map / address placeholder** — a `bg-surface-2` block with `border-border` and the address in mono, since `contacts/images/` is empty. No live map embed in P3.
  - Differences from D-8000 / `/istoriya`: no scroll progress, no TOC, no accordion. It is the simplest of the three.

- **`/o-kompanii`** — hub/landing. Structure:
  1. Short hero (`Container` + `SectionHeader`, eyebrow "О компании", title, lede = reuse footer tagline "Производство, продажа и сервис профессионального звукового оборудования. На рынке с 1992 года.").
  2. **3 navigation cards** (История / Гарантия и сервис / Контакты) — `bg-surface` cards with `border-border`, `--radius-lg`, hover `border-accent`, each a `next/link` to its route, with a one-line description and a mono kicker (e.g. "1976 — 2000", "1 год / до 4 лет", "СПб · с 1992"). Reuse the feature-card visual idiom from `components/product/sections.tsx` (features band) but as links.
  - This is essentially a card grid; no dark band required (optional accent on hover only).

**Dark bands:** only `/garantiya` hero. **Gallery / specs accordion / feature-tech-software bands:** none of these pages use them.

## Data model

These are **prose/structured-content pages, not products** — do **not** use `productFrontmatterSchema`. Two viable approaches; pick **typed data modules** to match the established History pattern (`content/company/istoriya.ts` typed by `lib/content/types.ts`, surfaced via `lib/content/company.ts`):

- Add `content/company/kontakty.ts`, `content/company/garantiya.ts`, `content/company/o-kompanii.ts`, each `export const <name>: <Type>` typed from new interfaces in `lib/content/types.ts`.
- Add loader fns to `lib/content/company.ts` (`getContacts()`, `getGuarantee()`, `getCompanyHub()`) mirroring `getHistory()`.

Proposed new types to add to `lib/content/types.ts` (reuse `HistoryBlock` for prose — it already supports `p`/`quote`/`stats`/`figure` with `**bold**` inline, which covers everything in `guarantee.md`):

```ts
/* ---- Contacts ---- */
export interface ContactsContent {
  eyebrow: string;          // "Контакты"
  title: string;            // "Свяжитесь с нами"
  lede: string;             // intro paragraph
  phone: { display: string; href: string };   // "+7 921 937 25 08" / "tel:+79219372508"
  email: { display: string; href: string };   // "novikamps@mail.ru" / "mailto:novikamps@mail.ru"
  address: { lines: string[] };                // ["Санкт-Петербург", "Московское шоссе, 25 литера А", "Офис 216А"]
  form: { title: string; note: string; disabled: true }; // stubbed in P3
}

/* ---- Guarantee / service ---- */
export interface GuaranteeContent {
  hero: { eyebrow: string; title: string; lede: string; bg?: string };
  terms: { value: string; label: string }[];   // [{value:"1 год",...},{value:"до 4 лет",...}]
  service: { eyebrow: string; title: string; blocks: HistoryBlock[] }; // longread body
  cta: { text: string; href: string; label: string }; // → /kontakty
}

/* ---- Company hub ---- */
export interface CompanyHubCard { kicker: string; title: string; text: string; href: string }
export interface CompanyHubContent {
  eyebrow: string; title: string; lede: string;
  cards: CompanyHubCard[]; // История, Гарантия, Контакты
}
```

Concrete example — `content/company/garantiya.ts` (faithful to `guarantee.md`):

```ts
import type { GuaranteeContent } from "@/lib/content/types";

export const garantiya: GuaranteeContent = {
  hero: {
    eyebrow: "Гарантия и сервис",
    title: "Гарантия и сервис",
    lede: "Цены и качество обслуживания отделом сервиса NOVIK всегда были и остаются вне конкуренции.",
    bg: "/company/guarantee/abstract-gradient-background.png", // optional dark-band backdrop
  },
  terms: [
    { value: "1 год", label: "Стандартная гарантия на каждый продукт" },
    { value: "до 4 лет", label: "При заводском дефекте по заключению диагностики NOVIK" },
  ],
  service: {
    eyebrow: "Сервис",
    title: "Текущее обслуживание и ремонт",
    blocks: [
      { type: "p", text: "Одно из направлений работы отдела сервиса NOVIK — текущее обслуживание и ремонт ламповых усилителей. **Более 40 лет** NOVIK производит ламповые усилители под своим брендом." },
      { type: "p", text: "Судьба разбросала их по всей России и далеко за её пределами. Как любая техника, несмотря на надёжность, аппаратура NOVIK требует внимания к текущему техническому состоянию. Мы стараемся максимально облегчить жизнь своим клиентам." },
      { type: "p", text: "Все клиенты, территориально находящиеся в Санкт-Петербурге или в пределах досягаемости логистических компаний, могут получить всё обслуживание у нас. Для тех, кто вне досягаемости транспортных компаний, написаны сотни писем с подробными рекомендациями по самостоятельному ремонту." },
      { type: "quote", text: "Оказывается любая помощь местным мастерам, которые берутся за ремонт усилителей NOVIK." },
      { type: "p", text: "И конечно, высылаются подобранные комплекты ламп, трансформаторы и любые другие комплектующие. **С 2005 года NOVIK продаёт транзисторные усилители NAG** — всё сказанное в полной мере относится и к этой продукции." },
      { type: "p", text: "В обслуживании транзисторных усилителей есть своя специфика. Система активного охлаждения значительно сильнее загрязняет внутреннее пространство — это основная причина поломок. При интенсивном использовании транзисторные усилители минимум раз в год надо очищать от пыли и грязи внутри корпуса. В ламповых усилителях NOVIK охлаждение пассивное, поэтому загрязнение не так влияет на ресурс, но сами лампы требуют более внимательного отношения, чем транзисторы." },
    ],
  },
  cta: { text: "Нужен сервис или подбор ламп?", href: "/kontakty", label: "Связаться с нами" },
};
```

`content/company/kontakty.ts` data is fully covered by `contacts.md` lines 9–14 (phone, email, 3-line address) plus the lede on line 6. `content/company/o-kompanii.ts` cards are assembled — no source md; copy must stay faithful to existing site copy (footer tagline, page kickers).

## Components needed

**Reuse from `components/ds/` (index `components/ds/index.ts`):**
- `Container` — page width wrapper (all 3 pages).
- `SectionHeader` — eyebrow + display title + lede (all 3 pages).
- `Eyebrow`, `Rule`, `Divider` — labels and rules.
- `Surface` (`mode="dark"`) — `/garantiya` hero band only.
- `Button` — CTAs on `/garantiya` and (disabled) form submit on `/kontakty`.
- `Chip` — optional mono tokens (e.g. "EAC", "Гарантия 2 года") if echoing the footer.

**Reuse from `components/history/`:**
- `Block` (`components/history/blocks.tsx`) + `RichText` (`components/history/rich-text.tsx`) — render `HistoryBlock[]` for the `/garantiya` service longread and `stats` for the warranty terms. This avoids a new prose renderer.

**New components (justified):**
- `components/company/contact-form.tsx` — **stubbed inquiry form** card (name / phone / email / message fields, disabled submit labelled "Скоро" or a `noValidate` form that prevents default). Justification: no existing form primitive; submission is a deliberate P5/Supabase dependency, so it must be a clearly-isolated component that P5 can wire to a server action without touching page layout. Mark with a `// TODO(P5): wire to Supabase` comment.
- `components/company/hub-card.tsx` — link card for `/o-kompanii` (kicker + title + text, hover `border-accent`). Justification: the product "features" cards in `components/product/sections.tsx` are not links and are coupled to product data; a small dedicated link-card is cleaner than overloading them. (If a generic `LinkCard` is preferred, it could live in `components/ds/` instead — propose during `/brainstorming`.)
- `components/company/contact-details.tsx` (optional) — the phone/email/address list, if shared between `/kontakty` and the footer. Low priority; the footer block can stay as-is and `/kontakty` can inline its own larger version.

No new DS token is required — all colors/spacing/type come from existing tokens.

## Content notes

- **Aggregator/hub page:** `/o-kompanii` is a navigation hub, not in the source markdown. It must route to the three real pages and should be reachable from the header. **Fix the header**: `components/layout/site-header.tsx` line 11 currently maps "О компании" → `/istoriya`; change it to `/o-kompanii` (or add `/o-kompanii` and keep "История" separate). Footer (`site-footer.tsx`) "Компания" column already lists История `/istoriya`, Гарантия `/garantiya`, Контакты `/kontakty` — consider adding "О компании" `/o-kompanii`.
- **Shared menus:** header NAV and footer COLUMNS are the single source of truth for nav — keep routes in this slice consistent with them (`/garantiya`, `/kontakty`, `/istoriya` are already referenced there; `/o-kompanii` is new).
- **Pricing:** **absent** on all three pages — these are informational. Do not add a `price` field or product schema.
- **EAC / warranty:** footer already prints "EAC · Гарантия 2 года" (`site-footer.tsx` line 76). Note the **discrepancy**: footer says "Гарантия 2 года" but `guarantee.md` says **1 год стандарт / до 4 лет при дефекте**. The `/garantiya` page MUST follow the source (1 год / до 4 года). Flag the footer "2 года" as likely wrong — recommend updating the footer to "Гарантия 1 год" (or "EAC · Гарантия") for consistency during this slice (confirm with stakeholder; do not silently invent "2 года").
- **Form is stubbed:** `/kontakty` form does NOT submit in P3. No Supabase client, no server action, no env vars yet. Render disabled inputs + disabled submit, or a form that `preventDefault`s and shows an inline "Форма скоро заработает — пока пишите на почту/телефон" note. The P5 slice owns wiring.
- **RU copy specifics:** keep the founder's editorial voice in `/garantiya` (it is first-person service philosophy). Fix obvious source typos when transcribing ("обслуживание" not "обслуживание отделом" run-on; add missing commas) but do not rewrite meaning. Email casing: source shows `Novikamps@mail.ru` (line 10) and footer uses lowercase `novikamps@mail.ru` — use **lowercase** to match the footer and the working `mailto:`. Phone `tel:` href is `tel:+79219372508` (no spaces), display `+7 921 937 25 08`.

### Using `История - направления.dc.html` (the 3-variant timeline exploration)
Source: `/Users/viktor/Downloads/NAC история компании/История - направления.dc.html`. It is a **canvas with three side-by-side layout explorations** of the История page — NOT a separate page to ship:
- **Variant A — «Журнал / editorial»**: large editorial longread (84px display H1, drop-cap lead, founder portrait disc + script signature, milestone with red year column, pull quote). → This is essentially what `/istoriya` already ships (`HistoryHero` + `Chapter`). Treat as the **reference for the existing История**, not new work.
- **Variant B — «Архивный таймлайн / spine»**: a left red spine with year nodes and per-year cards (image + text), opening with a **dark hero band** (`data-surface="dark"`, radial amber glow). → This is the most reusable idea for **`/o-kompanii`**: a compact, scannable timeline-of-milestones teaser ("1976 → 1992 → 2000 …") that links into `/istoriya`. Recommend implementing it as an **optional milestone strip on the `/o-kompanii` hub** (derived from `istoriya.chapters[*].year/label/title`), so the hub gets a visual "company at a glance" without duplicating the longread.
- **Variant C — «Каталог-досье / ledger»**: a left content-rail (содержание + counter "700+") with a dark header and data cards with mono spec rows. → Mineable for the hub's "company at a glance" stat ("700+ усилителей вручную") and as an alternate TOC styling; not a full page.

Recommendation: ship `/istoriya` as-is (Variant A). Use **Variant B's dark-hero + spine** as the visual template for the **`/o-kompanii` milestone strip**, and borrow **Variant C's "700+" counter** as a stat on the hub. All three pull data from the existing `content/company/istoriya.ts` — no new history data needed. Colors in the HTML are hardcoded hex (`#0B0B0D`, `#E11507`, `#F59E2E`, `#FBFAF7`) → **map them to tokens** (`bg-bg`/ink, `text-accent`/red, amber → `--color-amber`, paper → `bg-bg`). Do NOT copy the inline hex.

## Acceptance criteria

- `npm run build` (or `next build`) is **green**; `npx tsc --noEmit` passes (TS strict); ESLint clean (`eslint.config.mjs`).
- Three new routes exist and render: `app/kontakty/page.tsx`, `app/garantiya/page.tsx`, `app/o-kompanii/page.tsx`, each a server component exporting `metadata` (RU title + description). No `generateStaticParams` (fixed routes) — pages are statically prerendered.
- **Tokens only** — no hardcoded hex anywhere; the `.dc.html` exploration's inline hex is mapped to tokens. Dark band uses `<Surface mode="dark">`, not literal dark colors.
- **Content fidelity** — all copy traces to `contacts.md` / `guarantee.md` (or, for the hub, to existing site copy). No invented products, prices, photos, or warranty terms. Warranty page states **1 год / до 4 лет** (matches source), not the footer's "2 года".
- **Data validated** — content lives in `content/company/*.ts` typed by new interfaces in `lib/content/types.ts`, loaded via `lib/content/company.ts`; TS compilation enforces shape (no zod needed for hand-authored modules).
- **Form stubbed** — `/kontakty` form is visibly present but non-submitting, with a `// TODO(P5)` marker and an inline note; no Supabase/network code introduced.
- **Nav consistency** — `/o-kompanii`, `/garantiya`, `/kontakty` reachable from header and/or footer; header "О компании" no longer mis-points at `/istoriya`. Footer EAC/warranty line reconciled with the source (or flagged).
- **Images** — `guarantee/abstract-gradient-background.png` copied to `public/company/guarantee/` and optimized (served via `next/image`); empty `contacts/images/` handled with a token placeholder, not a broken `<img>`.
- Accessibility: real `<a href="tel:">` / `mailto:` links; form inputs have `<label>`s; headings in order.

## Run-recipe

A future agent builds this area as follows:

1. **`/brainstorming`** (`superpowers:brainstorming`) — confirm: hub scope (`/o-kompanii` cards vs. full milestone strip from Variant B), whether the guarantee hero uses the 2.9 MB gradient bg, and the footer "2 года" reconciliation. Decide whether `hub-card` / `contact-details` go in `components/ds` or `components/company`.
2. **Analyze sources** — read exactly:
   - `/Users/viktor/Documents/kimi/workspace/novikamps/contacts/contacts.md`
   - `/Users/viktor/Documents/kimi/workspace/novikamps/guarantee/guarantee.md`
   - `/Users/viktor/Downloads/NAC история компании/История - направления.dc.html` (for the hub milestone-strip styling only)
   - Existing reference: `app/istoriya/page.tsx`, `components/history/{hero,chapter,blocks,rich-text}.tsx`, `content/company/istoriya.ts`, `lib/content/{types,company}.ts`, `components/ds/{primitives,button,index}.tsx`, `components/layout/{site-header,site-footer}.tsx`, `app/globals.css` (tokens).
   - Verify image counts: `contacts/images/` empty, `guarantee/images/` = 1 file.
3. **`/writing-plans`** (`superpowers:writing-plans`) — write the plan: new types in `lib/content/types.ts`; data modules `content/company/{kontakty,garantiya,o-kompanii}.ts`; loaders in `lib/content/company.ts`; new components `components/company/{contact-form,hub-card}.tsx`; pages `app/{kontakty,garantiya,o-kompanii}/page.tsx`; image copy + optimization; header/footer nav fix.
4. **Implement (TDD where logic exists)** — most of this is static markup (little to unit-test). Apply `superpowers:test-driven-development` to any logic: e.g. a `tel:`-href normalizer (`+7 921 937 25 08` → `tel:+79219372508`) and the loader functions in `lib/content/company.ts` (assert returned shape). Render `HistoryBlock[]` via the existing `Block` component. Keep the form a pure presentational stub.
5. **`/requesting-code-review`** (`superpowers:requesting-code-review`) — verify tokens-only, content fidelity (1 год/4 года), build green, nav consistency, stubbed form, image optimization. Then `superpowers:verification-before-completion` (build + tsc + lint + visual check of all three routes).
