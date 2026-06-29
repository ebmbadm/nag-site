# P2a — DSP processors: design spec

**Date:** 2026-06-29
**Phase:** P2 (first catalog family slice)
**Slice source:** `docs/slices/dsp-processors.md`
**Depends on:** P0 (product template), P1 (schema §6, `ProductCard`, `Breadcrumb`, `docs[]`)

---

## 1. Goal

Ship the NAG DSP-processor family: **5 new product pages** as pure-data MDX clones of the
D-8000 template, plus **1 new category landing** at `/catalog/processors`. No product-page
render code changes — the template already renders every section conditionally. Net-new code is
the category page, a catalog loader helper, an `icon-map` extension, and one small `Breadcrumb`
a11y fix.

## 2. Scope

| # | Route | File | Kind | Source `.md` | Price |
|---|---|---|---|---|---|
| 1 | `/catalog/f-8-pro` | `content/products/f-8-pro.mdx` | data | `f8000/f8000.md` | 139 900 ₽ |
| 2 | `/catalog/f-8` | `content/products/f-8.mdx` | data | `f8wifi/f8wifi.md` | 79 900 ₽ |
| 3 | `/catalog/d-4` | `content/products/d-4.mdx` | data | `dspd4/dspd4.md` | 34 900 ₽ |
| 4 | `/catalog/d-8` | `content/products/d-8.mdx` | data | `dspd8/dspd8.md` | 39 900 ₽ |
| 5 | `/catalog/the-rogue` | `content/products/the-rogue.mdx` | data | `therogue/therogue.md` | 24 900 ₽ |
| 6 | `/catalog/processors` | `app/catalog/processors/page.tsx` | new code | `dsp/dsp.md` | grid of 6 |

Sources live in `/Users/viktor/Documents/kimi/workspace/novikamps/<folder>/`. D-8000 is already
built and is the template; this slice does not touch it except to drop its breadcrumb "Каталог"
href (see §4 decision B).

## 3. No schema change

P1 already shipped everything this slice needs. `lib/content/schema.ts` stays untouched:

- `partnerLogos?` — present, `ProductHero` renders it only when non-empty (verified
  `sections.tsx:156`). New products simply omit it → no broken `/products/d-8000/*-logo.png`.
- `docs?` (`{label, href:url}[]`) — present, `SoftwareSection` renders outline buttons when
  non-empty (`sections.tsx:298`).
- `price` optional, quick-links guarded, `models[]` present (unused here — all processors are
  single-SKU).

`models[]` / `SpecMatrixTable` belong to the SERIES families (power amps), not this slice.

## 4. Decisions

### A. Category grid is DRY-derived, not hand-authored

Add a loader helper in `lib/content/products.ts`:

```ts
export function getProductsByCategory(category: string): ProductFrontmatter[]
// returns frontmatter of every product whose `category` === arg (no body parse needed)
```

The category page holds **only** an explicit slug-order array — it controls display order and
which card is flagged flagship — and pulls name / line / price / cover image from each product's
frontmatter. Add a product MDX → it appears in the grid, no duplicated data, no drift.

```ts
// app/catalog/processors/page.tsx
const ORDER = ["f-8-pro", "f-8", "d-8000", "the-rogue", "d-4", "d-8"];
const FLAGSHIP = "d-8000";
```

Card data mapping per product `p`:
- `slug` ← `p.slug`
- `name` ← `p.name`
- `eyebrow` ← `p.line`
- `image` ← `{ src: p.gallery[0].src, alt: p.gallery[0].alt }`
- `price` ← `{ amount: p.price?.amount, onRequest: p.price?.onRequest }`
- `badge` ← `slug === FLAGSHIP ? "Флагман" : (p.badges[0] ?? undefined)`

**`ProductCard` tweak:** its `image` type currently requires `width`/`height`, but the component
renders with `<Image fill>` and never reads them. Make `width?`/`height?` optional so gallery
media (`{src, alt, caption}`) maps cleanly without fabricated dimensions. Render is unchanged.

### B. Breadcrumb "Каталог" → unlinked text (+ small a11y fix)

Today every product breadcrumb starts `{label:"Каталог", href:"/catalog"}`, but no `/catalog`
index exists → live 404. A full catalog index is out of scope (likely P4). So "Каталог" becomes
plain text until then; "Процессоры" links to the now-real `/catalog/processors`.

`Breadcrumb` (`components/ds/breadcrumb.tsx`) currently puts `aria-current="page"` on **any**
href-less item (line 39). Fix: gate it on last position.

```tsx
{item.href ? (
  <Link …>{item.label}</Link>
) : (
  <span
    {...(i === items.length - 1 ? { "aria-current": "page" } : {})}
    className={i === items.length - 1 ? "text-text-muted" : undefined}
  >
    {item.label}
  </span>
)}
```

Then each product's frontmatter breadcrumb is:
```yaml
breadcrumb:
  - { label: "Каталог" }                       # no href → unlinked text
  - { label: "Процессоры", href: "/catalog/processors" }
  - { label: "<MODEL>" }                        # current page
```
Edit `d-8000.mdx` the same way (drop its `/catalog` href).

### C. Software downloads via `docs[]`

Use the P1 `docs[]` field, not MDX-body links:
- D-4, D-8 → `https://disk.yandex.ru/d/EDKxSOM4s-4yfg`
- THE ROGUE → `https://disk.yandex.ru/d/c553-lrsMrqrLA`

```yaml
docs:
  - { label: "Скачать ПО (Яндекс.Диск)", href: "https://disk.yandex.ru/d/EDKxSOM4s-4yfg" }
```
Renders as outline buttons under the software hero. F-8 PRO / F-8 sources carry no download link
→ omit `docs`.

## 5. New / changed files

| File | Change |
|---|---|
| `content/products/f-8-pro.mdx` | new (data) |
| `content/products/f-8.mdx` | new (data) |
| `content/products/d-4.mdx` | new (data) |
| `content/products/d-8.mdx` | new (data) |
| `content/products/the-rogue.mdx` | new (data) |
| `app/catalog/processors/page.tsx` | new — category landing |
| `lib/content/products.ts` | add `getProductsByCategory()` |
| `components/ds/product-card.tsx` | `width?`/`height?` optional |
| `components/ds/breadcrumb.tsx` | `aria-current` gated on last item |
| `components/product/icon-map.tsx` | add icons used by feature cards |
| `content/products/d-8000.mdx` | drop `/catalog` breadcrumb href |
| `public/products/<slug>/*` | copy images from each source `images/` dir |

**icon-map additions** (lucide), driven by the feature-card `icon` keys the 5 products use:
`git-branch` (routing), `plug` (transformer PSU), `usb` (USB plug-n-play), `gauge` (low
distortion), `monitor` (front-panel control), `audio-waveform` (FIR / pink-noise). Unmapped keys
already fall back to `Star`, but map the ones we reference.

## 6. Category page design (`/catalog/processors`)

Server component, static SSG. Sections top-to-bottom:

1. `Breadcrumb` — `Главная › Каталог › Процессоры` ("Каталог" unlinked, "Процессоры" current).
2. Page header — `Eyebrow accent` "NAG Pro Audio", `font-display uppercase` H1 "Процессоры",
   one-line lede. Draft copy (humanizer-ru applied):
   > Цифровые корректоры-контроллеры акустических систем NAG. Шесть моделей: процессоры серии F
   > с FIR и AES/EBU, флагман D-8000 Wi-Fi и доступная линейка DSP BY NAG с трансформаторным
   > блоком питания.
3. Grid — `grid gap-px sm:grid-cols-2 lg:grid-cols-3` of 6 `ProductCard`, ordered by `ORDER`,
   D-8000 badged "Флагман".

`generateMetadata`: title "Процессоры — NAG Pro Audio", description from the lede, OG image =
D-8000 cover. All tokens, no hex. Reuse `Container`, `Eyebrow`, `ProductCard`.

## 7. Per-product content fidelity (locked)

Transcribe specs **verbatim** from each source `.md` during the build (writing-plans reads them
in full). Locked facts that override or disambiguate the sources:

- **Prices** (all sell, EAC, 2-yr warranty): F-8 PRO 139 900 · F-8 79 900 · D-4 34 900 ·
  D-8 39 900 · THE ROGUE 24 900. `price.note`: "Без НДС · Гарантия 2 года · EAC" (for DSP BY NAG
  the note may foreground "Трансформаторный БП").
- **`line` eyebrow:** F-8 PRO / F-8 → "Серия NAG F"; D-4 / D-8 / THE ROGUE → "DSP BY NAG".
- **D-8 sampling = 96 кГц / 32 бит** (NOT 192). Source `dspd8.md` header says 192 but its spec
  table and callout say 96 — internally contradictory; the table wins.
- **THE ROGUE:** maker D-Factory; per-channel pink-noise generator (feature card,
  `audio-waveform`); total delay 40 мс (20 мс/channel); band 20 Гц – 30 кГц; weight 1.3 кг;
  fixed 220 В mains; USB type B. (D-4/D-8 use USB type A, 90–245 В.)
- **F-8 PRO:** AES/EBU inputs, expert DAC/ADC, up to 512 taps FIR on every input AND output,
  15-band input PEQ; 481×268×45 mm, ~3.6 кг.
- **F-8:** optional Wi-Fi; chips `ADAU1452` + `ES9018K2M`; 8-band PEQ; 24 password-locked
  presets; delay step 21 µs; 485×200×45 (1U), 4 кг. FIR 3–512 taps/channel (IIR→FIR).
- **D-4 vs D-8** share a source: identical except I/O (2×6 vs 4×8) and price. Both 96 кГц/32 бит,
  GEQ 31 + PEQ 10, delay 1000 мс, 24-bit DAC/ADC, transformer PSU, front-panel control.
- **DSP BY NAG brand paragraph** (in dspd4/dspd8/therogue): use as MDX body or part of `summary`
  for the three budget models — the transformer-PSU "simple, reliable kit at a fair price" pitch.

Images: exact filenames are listed in `docs/slices/dsp-processors.md` §"Точный список
изображений". Copy each source `images/` dir into `public/products/<slug>/`. Spec-sheet PNGs
(`*-specifications-sheet.*`) and promo strips (`*-promo-*`) are optional gallery slides — their
data is transcribed into `specGroups`, not shipped as the primary content.

## 8. RU copy rules (humanizer-ru + project)

All user-facing copy is Russian. Apply humanizer-ru to summaries, MDX body prose, and category
copy:

- **No em-dash `—`** anywhere in copy — use `-`, comma, or colon. (Tokens/JSX punctuation
  unaffected; this is about prose.)
- No «является», «данный», no «не просто X, а Y» / «не только… но и», no «в современном мире».
- Verbs over nominalizations; keep it concrete.
- **Fact-lock:** never invent a spec, price, chip, or figure. Keep source units verbatim (dBu,
  dB/oct, кОм, Гц, мс, taps); keep technical abbreviations (FIR, PEQ, GEQ, AES/EBU, THD+N, SNR,
  HPF/LPF); use `×` for config (4 × 8).

## 9. Testing

Logic is thin. Tests in `lib/__tests__/`:

- `getProductSlugs()` returns exactly `["d-4","d-8","d-8000","f-8","f-8-pro","the-rogue"]`
  (sorted; assert as a set).
- `getProduct(slug)` for each of the 5 new slugs parses without throw (schema validates content).
- `getProductsByCategory("Процессоры")` returns all 6 processors; `getProductsByCategory("")`
  returns `[]`.

Content correctness (prices, configs, the 96-kHz call) is enforced by schema parse at build +
the final review against sources. Category page: smoke render + every card links to a real
`/catalog/<slug>`.

## 10. Acceptance criteria

- [ ] `npm run build` green; `generateStaticParams` emits 6 product slugs.
- [ ] `/catalog/processors` builds statically, no `[slug]` conflict, links to real routes (not
      legacy `/f-series`, `/d8000`, …).
- [ ] Each new `.mdx` passes `productFrontmatterSchema` (build fails otherwise — by design).
- [ ] All images copied to `public/products/<slug>/`; no broken images (esp. no D-8000
      partner-logo bleed onto other products).
- [ ] Tokens only — zero hardcoded hex in new/changed components; dark bands via
      `<Surface mode="dark">`.
- [ ] Content true to source: prices, configs (2×6 / 4×8 / 2×4), D-8 = 96 кГц, THE ROGUE =
      D-Factory + pink noise + 40 мс.
- [ ] Breadcrumb: `Каталог`(text) › `Процессоры`(link) › `<model>`(current); only the last item
      carries `aria-current="page"`.
- [ ] `generateMetadata` returns title/description/OG for every product and the category.
- [ ] All `Image`/`Figure` have meaningful Russian `alt`.

## 11. Out of scope

`/catalog` index (P4-ish); other P2 families (power amps, tube, КОНТУР); cart/checkout/forms
(P5/P6); any `models[]` / `SpecMatrixTable` use; rewriting D-8000 content.
