# P3a — Company & legal pages: design spec

**Date:** 2026-06-29
**Phase:** P3 (first slice; company/service informational pages)
**Slice source:** `docs/slices/company-legal.md`
**Depends on:** P0 (history longread pattern: `content/company/istoriya.ts`, `components/history/*`, `lib/content/{types,company}.ts`)

---

## 1. Goal

Ship the three non-catalog informational pages: **`/garantiya`** (warranty + service longread),
**`/kontakty`** (contact details + a non-functional stubbed inquiry form), and **`/o-kompanii`**
(a new "О компании" hub that routes to История / Гарантия / Контакты and shows a milestone strip
derived from existing history data). Fix the header «О компании» mis-point and the footer warranty
copy along the way.

## 2. Scope

| # | Route | File | Source | Notes |
|---|---|---|---|---|
| 1 | `/garantiya` | `app/garantiya/page.tsx` | `guarantee/guarantee.md` | dark hero + 2 term cards + service longread + CTA |
| 2 | `/kontakty` | `app/kontakty/page.tsx` | `contacts/contacts.md` | contact list + stubbed form (no submit) |
| 3 | `/o-kompanii` | `app/o-kompanii/page.tsx` | new (footer tagline + `istoriya.ts`) | hero + 3 hub cards + milestone strip |

All three: static (SSG), `ru-RU`, **server components**, each exports `metadata`. No
`generateStaticParams` (fixed routes). No price, no product schema, no gallery, no spec accordion.

## 3. Decisions (approved)

- **A. Hub = cards + milestone strip.** `/o-kompanii` gets the 3 nav cards **and** a compact dark
  milestone strip (Variant-B idiom: red spine / year nodes) derived from `istoriya.chapters[*]`
  (`{year, label}`), plus one **sourced** headline stat. The strip links into `/istoriya`. No new
  history data.
- **B. Footer warranty fix → «EAC · Гарантия 1 год».** Footer currently reads «EAC · Гарантия
  2 года» (`site-footer.tsx:76`), which contradicts the source (1 год / до 4 лет). Change to
  «EAC · Гарантия 1 год».
- **C. Skip the 2.9 MB gradient backdrop.** `guarantee/abstract-gradient-background.png` is 2.9 MB;
  the `/garantiya` dark hero uses `<Surface mode="dark">` **alone** (no backdrop image). No image
  copy in this slice (contacts has no images; guarantee backdrop skipped). Revisit as optional
  polish if ever wanted.
- **D. New components in `components/company/`** (not `components/ds/`) — they are page-specific.
- **E. Header fix → «О компании» points to `/o-kompanii`** (`site-header.tsx:12`, currently
  `/istoriya`). История stays reachable via the hub + footer.
- **F. Fact-lock on the hub stat — drop the slice's «700+».** The slice suggested a «700+
  усилителей» counter (from a `.dc.html` exploration). That number is **not in source** (`istoriya`
  has «200+ шт» for Custom Super 100 and «500+ шт.» for PS600 as separate facts; summing them is
  invention). Use a **sourced** stat instead: **«Более 40 лет»** (guarantee.md line 13) as the hub
  headline figure. Do not synthesize «700+».

## 4. Data model (typed modules, mirror `istoriya.ts`)

No zod (hand-authored modules, TS strict enforces shape). Add interfaces to `lib/content/types.ts`,
data to `content/company/*.ts`, loaders to `lib/content/company.ts` (mirror `getHistory()`).

```ts
// lib/content/types.ts (add)
export interface ContactsContent {
  eyebrow: string; title: string; lede: string;
  phone: { display: string; href: string };   // "+7 921 937 25 08" / "tel:+79219372508"
  email: { display: string; href: string };   // "novikamps@mail.ru" / "mailto:novikamps@mail.ru"
  address: { lines: string[] };
  form: { title: string; note: string; disabled: true };
}
export interface GuaranteeContent {
  hero: { eyebrow: string; title: string; lede: string };
  terms: { value: string; label: string }[];           // 1 год / до 4 лет
  service: { eyebrow: string; title: string; blocks: HistoryBlock[] }; // reuse HistoryBlock
  cta: { text: string; href: string; label: string };  // → /kontakty
}
export interface CompanyHubCard { kicker: string; title: string; text: string; href: string }
export interface CompanyHubContent {
  eyebrow: string; title: string; lede: string;
  cards: CompanyHubCard[];                              // exactly 3: История / Гарантия / Контакты
  stat: { value: string; label: string };              // sourced — «Более 40 лет» / «ручной сборки»
}
```

`HistoryBlock` already supports `p`/`quote`/`stats`/`figure` with `**bold**` inline → covers the
guarantee longread. Loaders: `getContacts()`, `getGuarantee()`, `getCompanyHub()`.

## 5. Content (faithful to source; humanizer-ru applied to prose)

### `/garantiya` (from `guarantee.md`)
- **hero:** eyebrow «Гарантия и сервис»; title «Гарантия и сервис»; lede «Цены и качество
  обслуживания отделом сервиса NOVIK всегда были и остаются вне конкуренции.» (fixes source run-on
  «обслуживание отделом»).
- **terms:** `{ "1 год", "Стандартная гарантия на каждый продукт" }`,
  `{ "до 4 лет", "При заводском дефекте по заключению диагностики NOVIK" }`.
- **service blocks** (`HistoryBlock[]`, faithful, light humanizer — drop «является», fix run-ons,
  no em-dash, keep every fact: 40 лет, СПб + логистика, сотни писем, помощь мастерам, комплекты
  ламп/трансформаторы, с 2005 транзисторные NAG, активное охлаждение → чистить ≥ 1×/год, ламповое
  пассивное → лампы внимательнее):
  - p: «Одно из направлений отдела сервиса NOVIK - текущее обслуживание и ремонт ламповых
    усилителей. **Более 40 лет** NOVIK выпускает ламповые усилители под своим брендом.»
  - p: «Судьба разбросала их по всей России и далеко за её пределами. Любая техника, несмотря на
    надёжность, требует внимания к текущему состоянию, и аппаратура NOVIK не исключение. Мы стараемся
    максимально облегчить жизнь клиентам.»
  - p: «Клиенты в Санкт-Петербурге или в зоне досягаемости логистических компаний получают всё
    обслуживание у нас. Тем, кто вне досягаемости транспортных компаний, мы написали сотни писем с
    подробными рекомендациями по самостоятельному ремонту.»
  - quote: «Оказываем любую помощь местным мастерам, которые берутся за ремонт усилителей NOVIK.»
  - p: «И конечно, высылаем подобранные комплекты ламп, трансформаторы и любые другие комплектующие.
    **С 2005 года NOVIK продаёт транзисторные усилители NAG** - всё сказанное в полной мере относится
    и к ним.»
  - p: «В обслуживании транзисторных усилителей есть своя специфика. Активное охлаждение сильнее
    загрязняет внутреннее пространство, и это главная причина поломок: при интенсивной работе такие
    усилители минимум раз в год чистят от пыли внутри корпуса. В ламповых NOVIK охлаждение пассивное,
    поэтому загрязнение слабее влияет на ресурс, зато сами лампы требуют больше внимания, чем
    транзисторы.»
- **cta:** text «Нужен сервис или подбор ламп?»; href `/kontakty`; label «Связаться с нами».

### `/kontakty` (from `contacts.md`)
- eyebrow «Контакты»; title «Свяжитесь с нами»; lede «Остались вопросы? Напишите нам и оставьте свои
  контакты, мы обязательно свяжемся с вами.»
- phone display «+7 921 937 25 08» / href `tel:+79219372508`; email «novikamps@mail.ru» (lowercase)
  / `mailto:novikamps@mail.ru`; address lines «Санкт-Петербург» / «Московское шоссе, 25 литера А» /
  «Офис 216А».
- form (stub): title «Оставить заявку»; note «Форма скоро заработает. Пока пишите на почту или
  звоните.»; `disabled: true`.

### `/o-kompanii` (assembled — footer tagline + istoriya)
- eyebrow «О компании»; title «О компании NAG · NOVIK»; lede «Производство, продажа и сервис
  профессионального звукового оборудования. На рынке с 1992 года.» (footer tagline, sourced).
- cards (3): История `{kicker:"1976 - 2000", href:"/istoriya"}`; Гарантия и сервис
  `{kicker:"1 год / до 4 лет", href:"/garantiya"}`; Контакты `{kicker:"СПб · с 1992",
  href:"/kontakty"}` — each with a one-line text.
- stat: `{ value:"Более 40 лет", label:"ручной сборки усилителей" }` (sourced; NOT «700+»).
- milestone strip: derived in-page from `getHistory().chapters` → year + label nodes, dark Surface,
  whole strip links to `/istoriya`.

## 6. Components

**Reuse:** `Container`, `SectionHeader`, `Eyebrow`, `Rule`, `Divider`, `Surface` (dark hero/strip),
`Button`/`buttonVariants`, `Chip` from `components/ds`; `Block` (`components/history/blocks.tsx`) +
`RichText` for the guarantee `HistoryBlock[]` longread and the term `stats` idiom.

**New (in `components/company/`, server components):**
1. `contact-form.tsx` — presentational stub: labelled name/phone/email/message inputs + a disabled
   submit; renders the «скоро» note. `// TODO(P5): wire to Supabase`. No client JS, no network.
2. `hub-card.tsx` — `next/link` card (kicker + title + text, hover `border-accent`).
3. `milestone-strip.tsx` — dark `Surface` strip; takes `HistoryChapter[]`, renders year/label nodes
   with a red accent spine/rule; the strip links to `/istoriya`. Tokens only (map the Variant-B hex
   `#0B0B0D`/`#E11507`/`#FBFAF7` → `Surface mode="dark"` + `text-accent` + tokens).

Terms (1 год / до 4 лет) render as a 2-card grid (`font-display` value + mono label) — inline in the
garantiya page or via the history `stats` Block; no new primitive.

## 7. Nav reconciliation

- `components/layout/site-header.tsx:12` — «О компании» href `/istoriya` → `/o-kompanii`.
- `components/layout/site-footer.tsx:76` — «EAC · Гарантия 2 года» → «EAC · Гарантия 1 год».
- Footer «Компания» column already lists История/Гарантия/Контакты (correct). Optionally add «О
  компании» → `/o-kompanii` (nice-to-have, not required).

## 8. RU copy rules (humanizer-ru + project)

All copy Russian. No em-dash `—` in visible prose (use `-`, comma, colon). No «является» (rephrase
the guarantee line to «это главная причина»), «данный», «не просто X, а Y», «от X до Y». Keep the
founder's first-person service voice in `/garantiya`; fix obvious source typos, do not change
meaning or facts. **Fact-lock:** warranty is **1 год / до 4 лет** (never the footer's «2 года»);
email lowercase `novikamps@mail.ru`; phone href `tel:+79219372508`; hub stat sourced («Более 40
лет»), never the invented «700+».

## 9. Testing

- `lib/content/company.ts` loaders (`getContacts`/`getGuarantee`/`getCompanyHub`) return the modules
  with the right shape: contacts phone href `tel:+79219372508` + email href starts `mailto:`;
  guarantee `terms` length 2 with values «1 год» / «до 4 лет»; hub `cards` length 3 with hrefs
  `/istoriya`, `/garantiya`, `/kontakty`; hub `stat.value` === «Более 40 лет».
- `contact-form` renders labelled inputs + a **disabled** submit and performs no submit.
- `milestone-strip` renders one node per `istoriya.chapters` entry and links to `/istoriya`.
- Nav consistency: header nav includes `{ "О компании", "/o-kompanii" }` (not `/istoriya`); footer
  warranty string is «EAC · Гарантия 1 год».
- `npm run build` green; `/garantiya`, `/kontakty`, `/o-kompanii` prerendered static; `npx tsc
  --noEmit` + lint clean.

## 10. Acceptance criteria

- [ ] Three routes render as static server components, each with `metadata` (RU title + description).
- [ ] Content faithful to `contacts.md` / `guarantee.md` / footer tagline. Warranty states **1 год /
      до 4 лет**. Hub stat sourced (no «700+»). No invented products/prices/photos.
- [ ] Tokens only — no hardcoded hex (incl. the Variant-B exploration's hex mapped to tokens). Dark
      bands via `<Surface mode="dark">`.
- [ ] `/kontakty` form is visibly present but non-submitting (disabled), `// TODO(P5)` marker, inline
      note. No Supabase/network/env code.
- [ ] Header «О компании» → `/o-kompanii`; footer reads «EAC · Гарантия 1 год».
- [ ] Hub links to История/Гарантия/Контакты; milestone strip derives from `istoriya.chapters` and
      links to `/istoriya`. Breadcrumb/back-nav present where it fits.
- [ ] Accessibility: real `tel:`/`mailto:` links; form inputs have `<label>`s; heading order sane.
- [ ] Data in `content/company/*.ts` typed by `lib/content/types.ts`, loaded via
      `lib/content/company.ts`. `npm run build` + tsc + lint green.

## 11. Out of scope

The contact **form submission** (P5/Supabase); a live map embed (token placeholder only); the 2.9 MB
gradient backdrop (decision C); a dedicated boutique-style sub-nav; the boutique slice (separate P3
slice); any commerce. `/rqst-tubes` is not referenced here.
