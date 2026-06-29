# P3a — Company & legal pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship `/garantiya`, `/kontakty`, `/o-kompanii` (company/service info pages) as typed-data-module server pages, and fix the header «О компании» mis-point + footer warranty copy.

**Architecture:** Mirror the history pattern — typed data in `content/company/*.ts` (interfaces in `lib/content/types.ts`, loaders in `lib/content/company.ts`), rendered by static server pages assembled from DS primitives. Reuse `components/history/blocks.tsx` `Block` for the guarantee longread. Three small new components in `components/company/`.

**Tech Stack:** Next.js 16 App Router (SSG), React 19, TS strict, Tailwind v4, Vitest + @testing-library/react.

## Global Constraints

- **Russian only** (`ru-RU`). Server components; no `"use client"` in this slice.
- **Tokens only, no hardcoded hex.** Dark bands via `<Surface mode="dark">`. Fonts: `font-display`/`font-text`/`font-mono`. Eyebrows = mono uppercase `tracking-[var(--ls-label)]`.
- **No product schema, no price, no gallery, no spec accordion.** These are informational pages.
- **humanizer-ru on visible prose:** no em-dash `—` (use `-`, comma, colon); no «является»/«данный»/«не просто X, а Y»/«от X до Y». Keep the founder's first-person voice in `/garantiya`.
- **Fact-lock:** warranty is **1 год / до 4 лет** (never «2 года»); email lowercase `novikamps@mail.ru`; phone href `tel:+79219372508`, display «+7 921 937 25 08»; hub stat sourced **«Более 40 лет»** — NEVER the invented «700+».
- **Form is a stub** (P5 owns submission): disabled inputs, disabled submit, `// TODO(P5)`, no network/Supabase/env.
- `npm run build` + `npx tsc --noEmit` + lint stay green.

## File Structure

| File | Responsibility | Task |
|---|---|---|
| `lib/content/types.ts` | + `ContactsContent`, `GuaranteeContent`, `CompanyHubCard`, `CompanyHubContent` | 1 |
| `content/company/{kontakty,garantiya,o-kompanii}.ts` | typed data modules | 1 |
| `lib/content/company.ts` | + `getContacts`/`getGuarantee`/`getCompanyHub` loaders | 1 |
| `lib/__tests__/company-content.test.ts` | loader shape + fact-locks | 1 |
| `app/garantiya/page.tsx` | warranty + service longread page | 2 |
| `components/company/contact-form.tsx` | stubbed inquiry form | 3 |
| `app/kontakty/page.tsx` | contact details + form | 3 |
| `components/company/{hub-card,milestone-strip}.tsx` | hub card + dark milestone strip | 4 |
| `app/o-kompanii/page.tsx` | hub page | 4 |
| `components/company/__tests__/*.test.tsx` | form + strip render | 3, 4 |
| `components/layout/site-header.tsx` | export `NAV`, «О компании» → `/o-kompanii` | 5 |
| `components/layout/site-footer.tsx` | warranty → «Гарантия 1 год» | 5 |
| `lib/__tests__/nav-consistency.test.ts` | header/footer nav asserts | 5 |
| `docs/MASTER-PLAN.md` | status update | 5 |

---

### Task 1: Types + data modules + loaders

**Files:** Modify `lib/content/types.ts`, `lib/content/company.ts`; Create `content/company/{kontakty,garantiya,o-kompanii}.ts`, `lib/__tests__/company-content.test.ts`.

**Interfaces produced:** `getContacts(): ContactsContent`, `getGuarantee(): GuaranteeContent`, `getCompanyHub(): CompanyHubContent`.

- [ ] **Step 1: Add interfaces to `lib/content/types.ts`** (append after `HistoryContent`):

```ts
/* ---- Company & legal (P3) ---- */

export interface ContactsContent {
  eyebrow: string;
  title: string;
  lede: string;
  phone: { display: string; href: string };
  email: { display: string; href: string };
  address: { lines: string[] };
  form: { title: string; note: string; disabled: true };
}

export interface GuaranteeContent {
  hero: { eyebrow: string; title: string; lede: string };
  terms: { value: string; label: string }[];
  service: { eyebrow: string; title: string; blocks: HistoryBlock[] };
  cta: { text: string; href: string; label: string };
}

export interface CompanyHubCard {
  kicker: string;
  title: string;
  text: string;
  href: string;
}

export interface CompanyHubContent {
  eyebrow: string;
  title: string;
  lede: string;
  cards: CompanyHubCard[];
  stat: { value: string; label: string };
}
```

- [ ] **Step 2: Create `content/company/kontakty.ts`**

```ts
import type { ContactsContent } from "@/lib/content/types";

export const kontakty: ContactsContent = {
  eyebrow: "Контакты",
  title: "Свяжитесь с нами",
  lede: "Остались вопросы? Напишите нам и оставьте свои контакты, мы обязательно свяжемся с вами.",
  phone: { display: "+7 921 937 25 08", href: "tel:+79219372508" },
  email: { display: "novikamps@mail.ru", href: "mailto:novikamps@mail.ru" },
  address: { lines: ["Санкт-Петербург", "Московское шоссе, 25 литера А", "Офис 216А"] },
  form: {
    title: "Оставить заявку",
    note: "Форма скоро заработает. Пока пишите на почту или звоните.",
    disabled: true,
  },
};
```

- [ ] **Step 3: Create `content/company/garantiya.ts`**

```ts
import type { GuaranteeContent } from "@/lib/content/types";

export const garantiya: GuaranteeContent = {
  hero: {
    eyebrow: "Гарантия и сервис",
    title: "Гарантия и сервис",
    lede: "Цены и качество обслуживания отделом сервиса NOVIK всегда были и остаются вне конкуренции.",
  },
  terms: [
    { value: "1 год", label: "Стандартная гарантия на каждый продукт" },
    { value: "до 4 лет", label: "При заводском дефекте по заключению диагностики NOVIK" },
  ],
  service: {
    eyebrow: "Сервис",
    title: "Текущее обслуживание и ремонт",
    blocks: [
      { type: "p", text: "Одно из направлений отдела сервиса NOVIK - текущее обслуживание и ремонт ламповых усилителей. **Более 40 лет** NOVIK выпускает ламповые усилители под своим брендом." },
      { type: "p", text: "Судьба разбросала их по всей России и далеко за её пределами. Любая техника, несмотря на надёжность, требует внимания к текущему состоянию, и аппаратура NOVIK не исключение. Мы стараемся максимально облегчить жизнь клиентам." },
      { type: "p", text: "Клиенты в Санкт-Петербурге или в зоне досягаемости логистических компаний получают всё обслуживание у нас. Тем, кто вне досягаемости транспортных компаний, мы написали сотни писем с подробными рекомендациями по самостоятельному ремонту." },
      { type: "quote", text: "Оказываем любую помощь местным мастерам, которые берутся за ремонт усилителей NOVIK." },
      { type: "p", text: "И конечно, высылаем подобранные комплекты ламп, трансформаторы и любые другие комплектующие. **С 2005 года NOVIK продаёт транзисторные усилители NAG** - всё сказанное в полной мере относится и к ним." },
      { type: "p", text: "В обслуживании транзисторных усилителей есть своя специфика. Активное охлаждение сильнее загрязняет внутреннее пространство, и это главная причина поломок: при интенсивной работе такие усилители минимум раз в год чистят от пыли внутри корпуса. В ламповых NOVIK охлаждение пассивное, поэтому загрязнение слабее влияет на ресурс, зато сами лампы требуют больше внимания, чем транзисторы." },
    ],
  },
  cta: { text: "Нужен сервис или подбор ламп?", href: "/kontakty", label: "Связаться с нами" },
};
```

- [ ] **Step 4: Create `content/company/o-kompanii.ts`**

```ts
import type { CompanyHubContent } from "@/lib/content/types";

export const oKompanii: CompanyHubContent = {
  eyebrow: "О компании",
  title: "О компании NAG · NOVIK",
  lede: "Производство, продажа и сервис профессионального звукового оборудования. На рынке с 1992 года.",
  cards: [
    { kicker: "1976 - 2000", title: "История", text: "Путь компании: от первых ламповых усилителей до серийного производства.", href: "/istoriya" },
    { kicker: "1 год / до 4 лет", title: "Гарантия и сервис", text: "Гарантийные условия и обслуживание ламповой и транзисторной техники.", href: "/garantiya" },
    { kicker: "СПб · с 1992", title: "Контакты", text: "Телефон, почта и адрес офиса в Санкт-Петербурге.", href: "/kontakty" },
  ],
  stat: { value: "Более 40 лет", label: "ручной сборки усилителей" },
};
```

- [ ] **Step 5: Add loaders to `lib/content/company.ts`**

Replace the file contents with:
```ts
import { istoriya } from "@/content/company/istoriya";
import { kontakty } from "@/content/company/kontakty";
import { garantiya } from "@/content/company/garantiya";
import { oKompanii } from "@/content/company/o-kompanii";
import type {
  HistoryContent,
  ContactsContent,
  GuaranteeContent,
  CompanyHubContent,
} from "./types";

/** Company history content (typed data module pattern). */
export function getHistory(): HistoryContent {
  return istoriya;
}

/** Контакты page content. */
export function getContacts(): ContactsContent {
  return kontakty;
}

/** Гарантия и сервис page content. */
export function getGuarantee(): GuaranteeContent {
  return garantiya;
}

/** О компании hub content. */
export function getCompanyHub(): CompanyHubContent {
  return oKompanii;
}
```

- [ ] **Step 6: Write `lib/__tests__/company-content.test.ts`**

```ts
import { describe, expect, test } from "vitest";
import { getContacts, getGuarantee, getCompanyHub } from "@/lib/content/company";

describe("company content loaders", () => {
  test("contacts: phone/email hrefs + stubbed form", () => {
    const c = getContacts();
    expect(c.phone.href).toBe("tel:+79219372508");
    expect(c.email.href).toBe("mailto:novikamps@mail.ru");
    expect(c.email.display).toBe("novikamps@mail.ru");
    expect(c.form.disabled).toBe(true);
  });

  test("guarantee: terms 1 год / до 4 лет, CTA → /kontakty", () => {
    const g = getGuarantee();
    expect(g.terms).toHaveLength(2);
    expect(g.terms[0].value).toBe("1 год");
    expect(g.terms[1].value).toBe("до 4 лет");
    expect(g.cta.href).toBe("/kontakty");
    expect(g.service.blocks.length).toBeGreaterThan(0);
  });

  test("hub: 3 cards to real routes, sourced stat (not 700+)", () => {
    const h = getCompanyHub();
    expect(h.cards.map((c) => c.href)).toEqual(["/istoriya", "/garantiya", "/kontakty"]);
    expect(h.stat.value).toBe("Более 40 лет");
    expect(JSON.stringify(h)).not.toContain("700+");
  });
});
```

- [ ] **Step 7: Run + commit**

Run: `npx vitest run lib/__tests__/company-content.test.ts` → PASS. Then:
```bash
git add lib/content/types.ts lib/content/company.ts content/company/kontakty.ts content/company/garantiya.ts content/company/o-kompanii.ts lib/__tests__/company-content.test.ts
git commit -m "feat(p3a): company/legal content types, data modules + loaders"
```
(End every commit with a blank line then `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.)

---

### Task 2: `/garantiya` page

**Files:** Create `app/garantiya/page.tsx`. **Consumes:** `getGuarantee()` (Task 1), `Block` from `components/history/blocks.tsx`, DS primitives.

- [ ] **Step 1: Write the page**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, Surface, SectionHeader, Breadcrumb, buttonVariants } from "@/components/ds";
import { Block } from "@/components/history/blocks";
import { getGuarantee } from "@/lib/content/company";

const g = getGuarantee();

export const metadata: Metadata = {
  title: "Гарантия и сервис · NAG · NOVIK",
  description:
    "Гарантия 1 год на каждый продукт, до 4 лет при заводском дефекте. Сервис и обслуживание ламповых и транзисторных усилителей NOVIK · NAG.",
};

export default function GuaranteePage() {
  return (
    <div>
      <Surface mode="dark" className="py-16">
        <Container>
          <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Гарантия и сервис" }]} />
          <div className="mt-6 max-w-prose">
            <Eyebrow accent>{g.hero.eyebrow}</Eyebrow>
            <h1
              className="mt-3 font-display uppercase text-text"
              style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
            >
              {g.hero.title}
            </h1>
            <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              {g.hero.lede}
            </p>
          </div>
        </Container>
      </Surface>

      <Container className="py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {g.terms.map((t) => (
            <div key={t.value} className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-[var(--shadow-1)]">
              <div className="font-display text-4xl uppercase text-accent" style={{ letterSpacing: "var(--ls-tight)" }}>
                {t.value}
              </div>
              <div className="mt-2 text-sm text-text-muted">{t.label}</div>
            </div>
          ))}
        </div>
      </Container>

      <section className="border-t border-border bg-surface-2 py-16">
        <Container>
          <SectionHeader eyebrow={g.service.eyebrow} title={g.service.title} className="mb-8" />
          <div className="max-w-[760px]">
            {g.service.blocks.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </div>
          <div className="mt-10">
            <p className="mb-4 font-display text-xl uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>
              {g.cta.text}
            </p>
            <Link href={g.cta.href} className={buttonVariants({ variant: "primary", size: "lg" })}>
              {g.cta.label}
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Build + commit**

Run: `npm run build` → green; `/garantiya` prerendered static (`○`). Then:
```bash
git add app/garantiya/page.tsx
git commit -m "feat(p3a): /garantiya warranty + service page"
```

---

### Task 3: `/kontakty` page + stubbed form

**Files:** Create `components/company/contact-form.tsx`, `app/kontakty/page.tsx`, `components/company/__tests__/contact-form.test.tsx`. **Consumes:** `getContacts()` (Task 1).

- [ ] **Step 1: Write the failing test** `components/company/__tests__/contact-form.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ContactForm } from "../contact-form";

const form = { title: "Оставить заявку", note: "Форма скоро заработает. Пока пишите на почту или звоните.", disabled: true } as const;

describe("ContactForm (stub)", () => {
  test("renders labelled fields, a disabled submit, and the note", () => {
    render(<ContactForm form={form} />);
    expect(screen.getByLabelText("Имя")).toBeInTheDocument();
    expect(screen.getByLabelText("Сообщение")).toBeInTheDocument();
    const submit = screen.getByRole("button", { name: "Отправить" });
    expect(submit).toBeDisabled();
    expect(screen.getByText(form.note)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run → FAIL** (`Cannot find module '../contact-form'`).

Run: `npx vitest run components/company/__tests__/contact-form.test.tsx`

- [ ] **Step 3: Write `components/company/contact-form.tsx`**

```tsx
import { buttonVariants } from "@/components/ds";
import type { ContactsContent } from "@/lib/content/types";

const FIELDS = [
  { id: "name", label: "Имя", type: "text" },
  { id: "phone", label: "Телефон", type: "tel" },
  { id: "email", label: "E-mail", type: "email" },
] as const;

/** Stubbed inquiry form — non-submitting in P3. */
export function ContactForm({ form }: { form: ContactsContent["form"] }) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8">
      <h2 className="font-display text-lg uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>
        {form.title}
      </h2>
      {/* TODO(P5): wire to Supabase server action */}
      <form className="mt-5 space-y-4" aria-disabled="true">
        {FIELDS.map((f) => (
          <div key={f.id} className="flex flex-col gap-1.5">
            <label htmlFor={f.id} className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
              {f.label}
            </label>
            <input
              id={f.id}
              name={f.id}
              type={f.type}
              disabled
              className="h-11 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 text-sm text-text disabled:opacity-60"
            />
          </div>
        ))}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
            Сообщение
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            disabled
            className="rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm text-text disabled:opacity-60"
          />
        </div>
        <button type="submit" disabled className={buttonVariants({ variant: "primary", size: "lg", className: "w-full" })}>
          Отправить
        </button>
      </form>
      <p className="mt-3 font-mono text-2xs text-text-faint">{form.note}</p>
    </div>
  );
}
```

- [ ] **Step 4: Run → PASS.** `npx vitest run components/company/__tests__/contact-form.test.tsx`

- [ ] **Step 5: Write `app/kontakty/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb } from "@/components/ds";
import { ContactForm } from "@/components/company/contact-form";
import { getContacts } from "@/lib/content/company";

const c = getContacts();

export const metadata: Metadata = {
  title: "Контакты · NAG · NOVIK",
  description: "Телефон +7 921 937 25 08, почта novikamps@mail.ru, офис в Санкт-Петербурге. Свяжитесь с нами.",
};

export default function ContactsPage() {
  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]} />
      <header className="mt-6 max-w-prose">
        <Eyebrow accent>{c.eyebrow}</Eyebrow>
        <h1
          className="mt-3 font-display uppercase text-text"
          style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
        >
          {c.title}
        </h1>
        <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{c.lede}</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <Eyebrow>Телефон</Eyebrow>
            <a href={c.phone.href} className="mt-1 block font-display text-2xl text-text hover:text-accent">{c.phone.display}</a>
          </div>
          <div>
            <Eyebrow>E-mail</Eyebrow>
            <a href={c.email.href} className="mt-1 block font-display text-2xl text-text hover:text-accent">{c.email.display}</a>
          </div>
          <div>
            <Eyebrow>Офис</Eyebrow>
            <address className="mt-1 not-italic text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              {c.address.lines.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
          </div>
          <div className="rounded-[var(--radius-md)] border border-border bg-surface-2 p-4 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
            Карта появится позже. Адрес указан выше.
          </div>
        </div>

        <ContactForm form={c.form} />
      </div>
    </Container>
  );
}
```

- [ ] **Step 6: Build + commit**

Run: `npm run build` → green; `/kontakty` prerendered. Then:
```bash
git add components/company/contact-form.tsx components/company/__tests__/contact-form.test.tsx app/kontakty/page.tsx
git commit -m "feat(p3a): /kontakty contact page + stubbed inquiry form"
```

---

### Task 4: `/o-kompanii` hub + hub-card + milestone-strip

**Files:** Create `components/company/hub-card.tsx`, `components/company/milestone-strip.tsx`, `app/o-kompanii/page.tsx`, `components/company/__tests__/milestone-strip.test.tsx`. **Consumes:** `getCompanyHub()` + `getHistory()` (existing).

- [ ] **Step 1: Write `components/company/hub-card.tsx`**

```tsx
import Link from "next/link";
import type { CompanyHubCard } from "@/lib/content/types";

export function HubCard({ card }: { card: CompanyHubCard }) {
  return (
    <Link
      href={card.href}
      className="group flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-6 transition-colors duration-[var(--dur-base)] hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]"
    >
      <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">{card.kicker}</span>
      <span className="mt-3 font-display text-xl uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>
        {card.title}
      </span>
      <span className="mt-2 text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{card.text}</span>
      <span className="mt-4 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">Открыть →</span>
    </Link>
  );
}
```

- [ ] **Step 2: Write the failing test** `components/company/__tests__/milestone-strip.test.tsx`

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MilestoneStrip } from "../milestone-strip";
import type { HistoryChapter } from "@/lib/content/types";

const chapters: HistoryChapter[] = [
  { id: "a", year: "1976", label: "Начало", title: "Начало деятельности", blocks: [] },
  { id: "b", year: "1992", label: "Бренд", title: "NOVIK", blocks: [] },
];

describe("MilestoneStrip", () => {
  test("renders one node per chapter + a link to /istoriya + the stat", () => {
    render(<MilestoneStrip chapters={chapters} stat={{ value: "Более 40 лет", label: "ручной сборки" }} />);
    expect(screen.getByText("1976")).toBeInTheDocument();
    expect(screen.getByText("1992")).toBeInTheDocument();
    expect(screen.getByText("Более 40 лет")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /историю/i });
    expect(link).toHaveAttribute("href", "/istoriya");
  });
});
```

- [ ] **Step 3: Run → FAIL** (`Cannot find module '../milestone-strip'`).

Run: `npx vitest run components/company/__tests__/milestone-strip.test.tsx`

- [ ] **Step 4: Write `components/company/milestone-strip.tsx`**

```tsx
import Link from "next/link";
import { Container, Eyebrow, Surface } from "@/components/ds";
import type { HistoryChapter } from "@/lib/content/types";

/** Compact dark milestone strip derived from history chapters; links to /istoriya. */
export function MilestoneStrip({
  chapters,
  stat,
}: {
  chapters: HistoryChapter[];
  stat: { value: string; label: string };
}) {
  return (
    <Surface mode="dark" className="py-14">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Eyebrow accent>Компания в датах</Eyebrow>
          <span className="flex flex-col text-right">
            <b className="font-display text-2xl uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>{stat.value}</b>
            <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">{stat.label}</span>
          </span>
        </div>

        <ol className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {chapters.map((c) => (
            <li key={c.id} className="bg-bg p-5" style={{ borderTop: "var(--border-w-rule) solid var(--accent)" }}>
              <div className="font-display text-xl text-text tabular" style={{ letterSpacing: "var(--ls-tight)" }}>{c.year}</div>
              <div className="mt-1 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">{c.label}</div>
            </li>
          ))}
        </ol>

        <div className="mt-6">
          <Link href="/istoriya" className="font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent hover:underline">
            Читать историю целиком →
          </Link>
        </div>
      </Container>
    </Surface>
  );
}
```

- [ ] **Step 5: Run → PASS.** `npx vitest run components/company/__tests__/milestone-strip.test.tsx`

- [ ] **Step 6: Write `app/o-kompanii/page.tsx`**

```tsx
import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb } from "@/components/ds";
import { HubCard } from "@/components/company/hub-card";
import { MilestoneStrip } from "@/components/company/milestone-strip";
import { getCompanyHub, getHistory } from "@/lib/content/company";

const hub = getCompanyHub();

export const metadata: Metadata = {
  title: "О компании · NAG · NOVIK",
  description: hub.lede,
};

export default function CompanyHubPage() {
  const { chapters } = getHistory();
  return (
    <div>
      <Container className="py-10">
        <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "О компании" }]} />
        <header className="mt-6 max-w-prose">
          <Eyebrow accent>{hub.eyebrow}</Eyebrow>
          <h1
            className="mt-3 font-display uppercase text-text"
            style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
          >
            {hub.title}
          </h1>
          <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{hub.lede}</p>
        </header>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {hub.cards.map((card) => (
            <HubCard key={card.href} card={card} />
          ))}
        </div>
      </Container>
      <MilestoneStrip chapters={chapters} stat={hub.stat} />
    </div>
  );
}
```

- [ ] **Step 7: Build + commit**

Run: `npm run build` → green; `/o-kompanii` prerendered. Then:
```bash
git add components/company/hub-card.tsx components/company/milestone-strip.tsx components/company/__tests__/milestone-strip.test.tsx app/o-kompanii/page.tsx
git commit -m "feat(p3a): /o-kompanii hub + hub-card + milestone-strip"
```

---

### Task 5: Nav reconciliation + final verification

**Files:** Modify `components/layout/site-header.tsx`, `components/layout/site-footer.tsx`, `docs/MASTER-PLAN.md`; Create `lib/__tests__/nav-consistency.test.ts`.

- [ ] **Step 1: Fix the header nav** (`components/layout/site-header.tsx`)

Change line 7 `const NAV = [` to `export const NAV = [` AND change the «О компании» entry's href from `/istoriya` to `/o-kompanii`:
```tsx
  { label: "О компании", href: "/o-kompanii" },
```
(Leave the rest of the array and `MobileNav nav={NAV}` untouched.)

- [ ] **Step 2: Fix the footer warranty** (`components/layout/site-footer.tsx`, line 76)

```tsx
          <span>EAC · Гарантия 1 год</span>
```

- [ ] **Step 3: Write `lib/__tests__/nav-consistency.test.ts`**

```ts
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { NAV } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

describe("nav consistency", () => {
  test("header «О компании» points to /o-kompanii", () => {
    expect(NAV.find((i) => i.label === "О компании")?.href).toBe("/o-kompanii");
  });

  test("footer warranty reads «1 год», not «2 года»", () => {
    render(<SiteFooter />);
    expect(screen.getByText("EAC · Гарантия 1 год")).toBeInTheDocument();
    expect(screen.queryByText("EAC · Гарантия 2 года")).toBeNull();
  });
});
```

- [ ] **Step 4: Run the whole suite**

Run: `npx vitest run`
Expected: PASS — all prior suites + company-content, contact-form, milestone-strip, nav-consistency.

- [ ] **Step 5: Full gate + hex grep**

Run:
```bash
npm run build
grep -rEn '#[0-9a-fA-F]{3,6}' app/garantiya app/kontakty app/o-kompanii components/company content/company/kontakty.ts content/company/garantiya.ts content/company/o-kompanii.ts 2>/dev/null || echo "NO HEX"
```
Expected: green build with `/garantiya`, `/kontakty`, `/o-kompanii` prerendered static (`○`); hex grep prints `NO HEX`. If real hex appears in new surfaces, STOP and report.

- [ ] **Step 6: Update master plan** (`docs/MASTER-PLAN.md`)

- §2 status table: add a P3 row (or update the `P3–P7` row) reflecting company/legal shipped:
```markdown
| **P3 — Company/legal + boutique** | 🚧 Company & legal done (`/o-kompanii`, `/garantiya`, `/kontakty`); boutique pending. |
```
- §3 sitemap: tick `/o-kompanii`, `/kontakty`, `/garantiya` from `P3` to `✅ P3`.

- [ ] **Step 7: Commit**

```bash
git add components/layout/site-header.tsx components/layout/site-footer.tsx lib/__tests__/nav-consistency.test.ts docs/MASTER-PLAN.md
git commit -m "feat(p3a): nav reconciliation (header hub link, footer warranty) + master-plan"
```

---

## Self-Review

**Spec coverage:** types/data/loaders → Task 1 ✓; `/garantiya` (dark hero + terms + Block longread + CTA) → Task 2 ✓; `/kontakty` + stub form → Task 3 ✓; `/o-kompanii` hub + cards + milestone strip → Task 4 ✓; header «О компании»→`/o-kompanii` + footer «1 год» → Task 5 ✓; decision F (no «700+», sourced «Более 40 лет») locked by the loader test ✓; decision C (no gradient image, dark Surface alone) — no image-copy task ✓.

**Placeholder scan:** none. Every file is complete; prose is the humanized, faithful copy from the spec.

**Type consistency:** `ContactsContent`/`GuaranteeContent`/`CompanyHubContent`/`CompanyHubCard` defined in Task 1 are consumed with matching field names in Tasks 2-4. `getContacts`/`getGuarantee`/`getCompanyHub` names match across loader, tests, and pages. `Block` consumes `HistoryBlock` (existing). `MilestoneStrip` takes `HistoryChapter[]` (existing type) + `stat`. `NAV` export name matches the nav-consistency test import. Page titles use explicit `<h1>` (SectionHeader renders `<h2>`, used only for the guarantee service sub-section — heading order stays sane).
