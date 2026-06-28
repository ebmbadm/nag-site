# Slice: Автозвук КОНТУР (car-audio DSP)  (Phase P2)

## Overview

КОНТУР is a distinct **car-audio** sub-line of DSP processors (separate from the pro-audio
D-8000 corrector-controllers). The line currently ships **two SKUs with identical I/O and
feature set** — they differ only in the quality of the output (DAC + op-amp) stage:

- **КОНТУР A8** — 34 990 ₽, SNR < −104 dB, THD+N (analog) < 0.006 % — the base model.
- **КОНТУР C8** — 42 990 ₽, SNR < −113 dB, THD+N (analog) < 0.002 % — premium DAC/op-amp.

This slice delivers **two pages**:

1. A **series/landing page** at `/catalog/kontur` introducing the line and comparing A8 vs C8
   (a NEW, non-MDX template — there is no category-page pattern in the repo yet).
2. The **A8 product page** at `/catalog/kontur-a8`, which **clones the D-8000 MDX product
   template** (`content/products/<slug>.mdx` → `app/catalog/[slug]/page.tsx`).

The C8 product page is **out of scope for this slice** (no source `.md` exists for C8 — only the
comparison row on the series page). The series page should still link to a future
`/catalog/kontur-c8`; that link can point to `#` or be omitted until C8 source arrives. Do NOT
invent C8 specs beyond the four comparison values present in the source.

Source data:
- Series intro + A8/C8 comparison: `/Users/viktor/Documents/kimi/workspace/novikamps/page47571769.html/page47571769.html.md`
- A8 full product page: `/Users/viktor/Documents/kimi/workspace/novikamps/page48424917.html/page48424917.html.md`

## Pages

| Product/Page | Proposed route | Source .md | Images (dir · count) | One-liner | Key specs / price |
|---|---|---|---|---|---|
| КОНТУР (серия) | `/catalog/kontur` | `…/page47571769.html/page47571769.html.md` | `…/page47571769.html/images/` · 6 | Серия автопроцессоров КОНТУР: A8 и C8, единая конфигурация, разная выходная часть | A8 34 990 ₽ · C8 42 990 ₽; SNR −104/−113 dB; THD+N analog 0.006 %/0.002 % |
| КОНТУР A8 | `/catalog/kontur-a8` | `…/page48424917.html/page48424917.html.md` | `…/page48424917.html/images/` · 5 | Автомобильный DSP-процессор 4→8: RCA/высокоуровневые + S/PDIF входы, ПО Windows/macOS | 34 990 ₽ · 4 вх / 8 вых RCA · 96 кГц/32 бит · ADAU1452 · PEQ 10 полос · SNR < −104 dB |

### Image inventory (copy into `public/products/kontur-a8/`)

Both source folders carry A8 photography — **dedup by filename and prefer the higher-resolution
`.png` rear/front from the A8 page**. Recommended final set for the A8 product folder:

From `…/page48424917.html/images/` (A8 page — preferred):
- `kontur-audio-a8-front-panel.png` (359 K) — hero, передняя панель
- `kontur-audio-a8-rear-panel.png` (596 K) — задняя панель / коммутация
- `kontur-audio-a8-car-installation.png` (583 K) — установка в авто (lifestyle)
- `kontur-audio-a8-promo-features.png` (446 K) — промо-композиция возможностей
- `kontur-audio-a8-remote-control.png` (799 K) — выносное управление / RJ-45

From `…/page47571769.html/images/` (series page — supplements A8 + branding):
- `kontur-audio-a8-3d-view.png` (362 K) — 3D-рендер устройства (good gallery shot)
- `kontur-audio-a8-dac-cs4382.jpg` (75 K) — чип ЦАП (tech band)
- `kontur-audio-a8-dac-pcm1681.jpg` (82 K) — чип ЦАП (tech band)
- `kontur-audio-logo.png` (11 K) — логотип серии → `public/products/kontur/kontur-audio-logo.png` (series page)

> NOTE: there are **no software-UI screenshots** in either source folder. The КОНТУР DSP program
> is described in prose but no screenshots exist. See "Content notes" for how to handle the
> `software` band.

## Design reference

**A8 product page (`/catalog/kontur-a8`)** — clone the **D-8000 product template** verbatim:
- Data: `content/products/kontur-a8.mdx` with frontmatter validated by
  `lib/content/schema.ts` (`productFrontmatterSchema`), loaded by `lib/content/products.ts`.
- Render: `app/catalog/[slug]/page.tsx` (already supports any slug via `generateStaticParams`)
  composing `components/product/sections.tsx`: `Breadcrumb → ProductHero → (MDX body) →
  FeatureBand → TechBand → SoftwareSection → SpecsSection`.
- Tokens only: `bg-bg / bg-surface / bg-surface-2`, `text-text / text-text-muted / text-text-faint`,
  `text-accent / bg-accent / text-on-accent`, `border-border`, type scale `text-2xs…text-5xl`,
  `font-display / font-text / font-mono`, radii `var(--radius-md|lg)`, line-heights/letter-spacing
  vars. No hardcoded hex.
- Dark bands: `FeatureBand` and `TechBand` already use `<Surface mode="dark">` (TechBand on
  `var(--nag-black-980)`). Reuse as-is.
- Gallery: yes (`Gallery` in `ProductHero`). Specs accordion: yes (`SpecsSection` →
  `AccordionItem` + `SpecTable`). Feature band: yes. Tech band: yes (ЦАП chips). Software band:
  yes-but-text-only (no screenshots → see Content notes).

**Differences from D-8000:**
- Domain is **car audio**, not pro PA: inputs are **RCA line + high-level (4.5–18 V RMS) with
  “обманки” (load-emulation)**, not XLR. Digital input is **S/PDIF optical+coaxial** (not AES/EBU).
- **Hero connectivity logos**: `ProductHero` currently hardcodes
  `/products/d-8000/burr-brown-logo.png` and `/products/d-8000/wifi-usb-rj45-connectivity.png`
  (lines 126–127 of `components/product/sections.tsx`). For КОНТУР these are wrong. **Make these
  logos data-driven** (see Components needed) — do NOT ship D-8000 logos on a КОНТУР page.
- The DSP chip is **Analog Devices ADAU1452 (96 кГц / 32 бит)**; DAC chips appear as **CS4382**
  and **PCM1681** (filenames). Use these in the `tech` band instead of Burr-Brown PCM1798.
- **CTA / contact**: `ProductHero` hardcodes `novikamps@mail.ru` / `+79219372508`. КОНТУР is a
  novikamps.com product, so the same contacts are correct — no change needed.

**Series page (`/catalog/kontur`)** — this is a **NEW page type** (no category template exists).
Build it as a bespoke `app/catalog/kontur/page.tsx` (static route, not `[slug]`). Recommended
composition, all from DS primitives:
- Hero/intro band: `<Surface mode="dark">` with `Eyebrow` ("DSP · ДЛЯ АВТОЗВУКА"), `h1` "КОНТУР",
  the "О СЕРИИ" lede paragraph, КОНТУР logo (`Figure` or `next/image`).
- A8 vs C8 **comparison table**: render with `SpecTable` (two columns of values) or a small bespoke
  2-column card grid using `Surface`/`Chip`/`Divider`. Rows from source:
  `SNR (сигнал/шум)` −104 dB / −113 dB; `THD+N (TOSLINK)` 0.0015 % / 0.0015 %;
  `THD+N (ANALOG)` 0.006 % / 0.002 %; price 34 990 ₽ / 42 990 ₽.
- Two product cards (A8, C8) each with name, price, "подробнее" → `buttonVariants({variant:"outline"})`
  linking to `/catalog/kontur-a8` (A8) and `/catalog/kontur-c8` (C8, may be `#` until built).

## Data model

Reuse the **product frontmatter schema unchanged** for A8 (`lib/content/schema.ts`). No schema
fields need adding for the spec data itself. **One optional schema enhancement is recommended**
(see Components needed): add an optional `connectivityLogos?: media[]` (or reuse `tech.image`-style)
so `ProductHero` stops hardcoding D-8000 logos — but if you prefer zero schema churn, instead make
the two hero logos a prop on `ProductHero` / conditionally render them only for D-8000.

Concrete A8 frontmatter example (`content/products/kontur-a8.mdx`) — faithful to source:

```yaml
---
name: "КОНТУР A8"
line: "Автозвук · DSP-процессор · NAG"
subtitle: "Автомобильный процессор 4 → 8"
badges: ["CAR AUDIO"]
category: "Автозвук"
breadcrumb:
  - { label: "Каталог", href: "/catalog" }
  - { label: "Автозвук КОНТУР", href: "/catalog/kontur" }
  - { label: "КОНТУР A8" }
price:
  amount: 34990
  currency: "₽"
  note: "Гарантия · EAC · Декларация соответствия"
summary: "Автомобильный DSP-процессор с конфигурацией 4 входа → 8 выходов: 4 линейных (RCA) и высокоуровневых (до 18 В RMS) входа с «обманками», цифровой вход S/PDIF optical/coaxial до 96 кГц, свободное микширование и маршрутизация, управление по RJ-45 и ПО для Windows/macOS."
specChips:
  - "4 вх. RCA / Hi-Level"
  - "8 вых. RCA"
  - "S/PDIF до 96 кГц"
  - "32 bit DSP"
  - "ADAU1452"
  - "SNR < −104 dB"
gallery:
  - { src: "/products/kontur-a8/kontur-audio-a8-front-panel.png", alt: "КОНТУР A8 — передняя панель", caption: "Передняя панель" }
  - { src: "/products/kontur-a8/kontur-audio-a8-rear-panel.png", alt: "КОНТУР A8 — задняя панель и коммутация", caption: "Задняя панель · коммутация" }
  - { src: "/products/kontur-a8/kontur-audio-a8-3d-view.png", alt: "КОНТУР A8 — 3D-вид", caption: "Внешний вид" }
  - { src: "/products/kontur-a8/kontur-audio-a8-car-installation.png", alt: "КОНТУР A8 — установка в автомобиле", caption: "Установка в авто" }
  - { src: "/products/kontur-a8/kontur-audio-a8-remote-control.png", alt: "КОНТУР A8 — выносное управление", caption: "Выносное управление · RJ-45" }
features:
  eyebrow: "Возможности"
  title: "Почему КОНТУР A8"
  cards:
    - { icon: "sliders", title: "4 входа RCA / Hi-Level", text: "4 аналоговых входа: линейные RCA и высокоуровневые до 18 В RMS с «обманками» для систем с самодиагностикой. Попарное подключение, свободное микширование." }
    - { icon: "cpu", title: "S/PDIF до 96 кГц", text: "Цифровой вход S/PDIF optical/coaxial, частота дискретизации до 96 кГц. Автовключение по высокоуровневым и цифровым входам." }
    - { icon: "activity", title: "DSP ADAU1452", text: "Обработка сигнала 96 кГц / 32 бит. PEQ 10 полос, кроссоверы 6/12/18/24/36/48, задержки до 30 мс с шагом 0,01 мс." }
    - { icon: "layers", title: "Управление и каскад", text: "Внешнее управление по RJ-45 (в т. ч. переключение треков), Remote IN/OUT для каскада усилителей, последовательное подключение процессоров." }
tech:
  eyebrow: "Используемые чипы"
  title: "Компоненты обработки сигнала"
  lede: "В основе A8 — DSP Analog Devices ADAU1452 и качественный ЦА-преобразователь выходной части."
  cards:
    - { label: "Analog Devices", chip: "ADAU1452", text: "DSP-ядро · 96 кГц / 32 бит обработки" }
    - { label: "ЦАП", chip: "CS4382 / PCM1681", text: "Цифро-аналоговый преобразователь выходной части" }
    - { label: "Цифровой вход", chip: "S/PDIF 18–96 кГц", text: "Optical + coaxial, до 96 кГц" }
  image: { src: "/products/kontur-a8/kontur-audio-a8-dac-cs4382.jpg", alt: "ЦАП КОНТУР A8", caption: "ЦА-преобразователь выходной части" }
software:
  eyebrow: "Программное обеспечение"
  title: "КОНТУР DSP — на русском языке"
  lede: "Программа КОНТУР DSP позволяет быстро и интуитивно выполнять все коррекции сигнала. Все параметры на русском, отображение уровней входных и выходных каналов в реальном времени, графическая интерпретация фильтров и эквализации. Поддержка Windows и macOS."
  hero: { src: "/products/kontur-a8/kontur-audio-a8-promo-features.png", alt: "Возможности коррекции КОНТУР A8", caption: "Возможности коррекции сигнала" }
  items: []   # ⚠️ no software screenshots in source — see Content notes
specGroups:
  - title: "Технические характеристики"
    defaultOpen: true
    rows:
      - { label: "Линейные входы", value: "4 (RCA)" }
      - { label: "Высокоуровневые входы", value: "4.5–18 Вольт (RMS)" }
      - { label: "Автовключение по высокоуровневым входам", value: "есть" }
      - { label: "Оптический вход", value: "1 (S/PDIF, 18–96 кГц)" }
      - { label: "Порт сигналов управления", value: "1 (RJ-45)" }
      - { label: "Порт управления включением усилителей", value: "1 (EUROBLOCK)" }
      - { label: "Микширование входных каналов", value: "свободное" }
      - { label: "Входная чувствительность линейных входов", value: "1–4 Вольта (RMS)" }
      - { label: "Линейные выходы", value: "8 (RCA)" }
      - { label: "Макс. напряжение линейных выходов", value: "4 Вольта (RMS)" }
      - { label: "Диапазон рабочих частот (−6 дБ)", value: "7 Гц – 44 000 Гц" }
      - { label: "Неравномерность АЧХ (20 Гц – 20 кГц)", value: "не более ±0,3 дБ" }
      - { label: "Частота дискретизации", value: "96 кГц" }
      - { label: "Время задержки", value: "0–30 мс" }
      - { label: "Шаг задержки", value: "0,01 мс" }
      - { label: "Диапазон рабочих напряжений", value: "8–18 Вольт" }
      - { label: "Потребляемый ток (не более)", value: "500 мА" }
      - { label: "Ground lift джампер", value: "открытый / 100 Ом / земля" }
      - { label: "Внешние габариты (В×Ш×Г)", value: "38 × 163 × 127 мм" }
  - title: "Шумы и искажения"
    rows:
      - { label: "Уровень шума, оптический вход", value: "< −104 дБ (А)" }
      - { label: "Уровень шума, линейный вход", value: "< −100 дБ (А)" }
      - { label: "Динамический диапазон, оптический вход", value: "> 104 дБ (А)" }
      - { label: "Динамический диапазон, линейный вход", value: "> 100 дБ (А)" }
      - { label: "THD+N, оптический вход", value: "< 0.0015 %" }
      - { label: "THD+N, линейный вход", value: "< 0.006 %" }
      - { label: "IMD, оптический вход", value: "< 0.003 %" }
      - { label: "IMD, линейный вход", value: "< 0.006 %" }
      - { label: "Взаимопроникновение каналов, оптический вход", value: "−98 дБ" }
      - { label: "Взаимопроникновение каналов, линейный вход", value: "−82 дБ" }
  - title: "Коррекция сигнала"
    rows:
      - { label: "Эквалайзер", value: "PEQ, 10 полос (вход и выход)" }
      - { label: "Кроссовер", value: "ФВЧ/ФНЧ, 6/12/18/24/36/48 дБ/окт" }
      - { label: "Фильтры", value: "LO/HI Shelf, Allpass 1–2" }
      - { label: "Компрессор", value: "атака до 500 мс, затухание до 2000 мс" }
      - { label: "Усиление", value: "+15 дБ … −40 дБ, шаг 0,01" }
      - { label: "Задержка", value: "до 30 мс, шаг 0,01 мс" }
      - { label: "Изменение полярности", value: "вход и выход" }
      - { label: "Маршрутизация выходов", value: "свободная" }
      - { label: "DSP-обработка", value: "ADAU1452 · 96 кГц / 32 бит" }
---

Автомобильный DSP-процессор **КОНТУР A8** — корректор сигнала с конфигурацией 4 → 8 для
построения качественного автозвука. ...prose body here (2–4 short paragraphs, faithful to source)...
```

> Source quirk to fix in copy: the A8 source page repeats the input description verbatim under
> "Выходная коммутация" (lines 16–17 — a copy/paste error in the original). **Do NOT mirror that
> error.** Write the output section from the spec table (8 RCA выходов, 4 В RMS, свободная
> маршрутизация).

## Components needed

**Reuse as-is** (`components/ds` + `components/product`):
- `Container, Eyebrow, Badge, Chip, Divider, Rule, Surface, SectionHeader`
- `SpecTable` (series comparison + product specs), `AccordionItem` (specs), `Figure`, `Gallery`
- `Button / buttonVariants` (CTA + "подробнее" links)
- Product sections: `Breadcrumb, ProductHero, FeatureBand, TechBand, SoftwareSection, SpecsSection`
- `FeatureIcon` map already has `sliders, cpu, activity, layers, star, wifi` — all needed icons
  (`sliders, cpu, activity, layers`) are present. **No new icons required.**

**Changes / new proposals:**
1. **De-hardcode hero connectivity logos (REQUIRED).** `ProductHero` (sections.tsx:125–128)
   renders D-8000-specific logos unconditionally. Pick one:
   - (a) Add optional `connectivityLogos?: { src; alt }[]` to `productFrontmatterSchema`, render
     the block only when present; D-8000 gets its two entries, КОНТУР gets `[]` (or a КОНТУР logo).
   - (b) Minimal: gate the existing block behind `if (product.slug === "d-8000")`. Less clean —
     prefer (a). Either keeps the change tokens-only and isolated.
2. **NEW page `app/catalog/kontur/page.tsx` (series/landing).** No category template exists yet, so
   this is bespoke. Build it from DS primitives only (no new primitive needed). If a second
   car-audio series or another category lands later, consider extracting a `CategoryHero` /
   `ComparisonTable` primitive then — **do not** over-build it now for a single series.
3. **NEW `app/catalog/page.tsx` (catalog index) — out of scope but noted:** breadcrumbs link to
   `/catalog`, which does not exist yet. The breadcrumb link will 404 until a future slice builds
   the catalog index. Acceptable for this slice; flag it. Do not build it here.

No new DS primitive is strictly required for КОНТУР.

## Content notes

- **Two SKUs, one config.** A8 and C8 are identical except output stage (DAC + op-amp). Only A8
  has a full source page. Build A8 fully; build the series page with the A8/C8 comparison; leave
  C8's product page for a future slice (no data to build it faithfully).
- **No pricing absence** — both prices are explicit (34 990 ₽ / 42 990 ₽). Currency `₽`.
- **No software screenshots.** The КОНТУР DSP program is described only in prose. Options for the
  `software` band: (a) keep `software` with `items: []` and use `promo-features.png` as the hero
  Figure (recommended), or (b) omit the `software` field entirely and fold the program description
  into a `features` card / MDX body. `SoftwareSection` renders an empty items grid gracefully when
  `items: []`. Pick (a) for parity with D-8000 layout.
- **Car-audio terminology (keep RU faithful):** «высокоуровневые входы», «обманки»
  (load-emulation for self-diagnosing head units), «свободное микширование», «свободная
  маршрутизация выходов», «каскадное / последовательное подключение процессоров», Remote IN/OUT,
  EUROBLOCK, Ground lift джампер, S/PDIF optical/coaxial. Do not anglicize.
- **EAC / warranty / documents.** Source lists documents: Технические характеристики, Декларация
  соответствия, Паспорт устройства, Замеры; and a "Награды\Обзоры" section. Reflect EAC + warranty
  in `price.note`. A downloadable-documents UI is NOT in the D-8000 template — out of scope; mention
  documents in MDX body prose only.
- **Series page copy** comes verbatim from the "О СЕРИИ" paragraph (lines 8–9 of the series md).
  Keep the engineering nuance: A8/C8 differ by ЦАП + операционный усилитель.
- **Image dedup:** both folders contain `kontur-audio-a8-front-panel` / `-rear-panel`; the A8-page
  `.png` versions are larger/better. Use those; ignore the series-page `.jpg`/lower-res duplicates.

## Acceptance criteria

- `npm run build` (or `next build`) is **green**; `productFrontmatterSchema` validates
  `content/products/kontur-a8.mdx` (build throws on invalid frontmatter — see `products.ts`).
- `/catalog/kontur-a8` renders via `app/catalog/[slug]/page.tsx`; `generateStaticParams` now emits
  both `d-8000` and `kontur-a8`. `dynamicParams = false` still holds.
- `/catalog/kontur` renders as a static route with the A8/C8 comparison and links to
  `/catalog/kontur-a8` (and `/catalog/kontur-c8` placeholder).
- **Tokens only** — no hardcoded hex anywhere; all colors/typography via design tokens & DS
  primitives. Dark bands via `<Surface mode="dark">`.
- **Hero logos are NOT D-8000 logos** on the КОНТУР page (logo de-hardcoding done).
- Content is **faithful to source** — no invented C8 specs, output section not mirroring the
  source copy/paste error, prices exactly 34 990 / 42 990 ₽.
- Images copied to `public/products/kontur-a8/` (and `public/products/kontur/` for the series logo);
  all `gallery`/`tech`/`software` `src` paths resolve.
- `generateMetadata` produces title/description/OG image for the A8 page; the series page exports
  its own `metadata` (title + description).
- Every image has meaningful RU `alt` text; gallery has ≥1 image (schema `min(1)`).

## Run-recipe

1. **`/brainstorming`** — confirm scope: A8 product + КОНТУР series page; C8 product deferred;
   decide logo de-hardcoding approach (schema field vs slug-gate).
2. **Analyze sources** (read exactly these):
   - `/Users/viktor/Documents/kimi/workspace/novikamps/page47571769.html/page47571769.html.md`
   - `/Users/viktor/Documents/kimi/workspace/novikamps/page48424917.html/page48424917.html.md`
   - Reference templates: `content/products/d-8000.mdx`, `app/catalog/[slug]/page.tsx`,
     `components/product/sections.tsx`, `components/product/icon-map.tsx`,
     `lib/content/schema.ts`, `lib/content/products.ts`, `components/ds/index.ts`.
   - List images: `…/page47571769.html/images/` (6), `…/page48424917.html/images/` (5).
3. **`/writing-plans`** — sequence: (a) copy + dedup images → `public/products/kontur-a8/` and
   `public/products/kontur/`; (b) optional schema change for hero logos (+ test); (c) author
   `content/products/kontur-a8.mdx`; (d) build `app/catalog/kontur/page.tsx`; (e) metadata; (f) build.
4. **Implement (TDD where logic exists):** the only real logic is the schema change + loader —
   add/extend a zod-validation test (e.g. against `productFrontmatterSchema`) before editing
   `lib/content/schema.ts`. MDX content + the static series page are content/markup — verify via
   `next build` + visual check, not unit tests.
5. **`/requesting-code-review`** — verify tokens-only, no D-8000 logo bleed, faithful specs/prices,
   `generateStaticParams` covers both slugs, build green.
