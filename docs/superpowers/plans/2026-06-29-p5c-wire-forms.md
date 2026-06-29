# P5c — Wire Forms Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire all inquiry touchpoints — `/kontakty` contact form, product CTAs, boutique custom-order — to the `submitInquiry` server action from P5b.

**Architecture:** Three client components own their own modal/pending state: `ContactForm` (converted from stub), `InquiryModal` (new, native `<dialog>`), `ProductCtaButtons` (new, wraps `InquiryModal`). `CustomOrderCta` is converted to a client component and self-hosts `InquiryModal kind="boutique"`. `sections.tsx` stays server — it imports `ProductCtaButtons` (client). Boutique pages stay server — they import the now-client `CustomOrderCta`.

**Tech Stack:** React 19 (`useTransition`, `useState`), Next.js 16 (`"use client"`), native `<dialog>` element, Lucide icons

## Global Constraints

- Branch: `p5c-wire-forms` off `main` (merge P5b first)
- Never hardcode hex/rgb — tokens only
- No `mailto:` or `tel:` links remain in product CTAs after this task
- `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN` must NOT appear in any client component import chain
- `npm run build` green; `npx tsc --noEmit` clean; vitest all pass
- Commit prefix: `feat(p5c):`

---

## File Map

| Action | File | Notes |
|--------|------|-------|
| Modify | `components/company/contact-form.tsx` | Replace stub; add `"use client"` |
| Create | `components/inquiry/inquiry-modal.tsx` | `"use client"`, native dialog |
| Create | `components/inquiry/index.ts` | Re-export |
| Create | `components/product/product-cta-buttons.tsx` | `"use client"`, replaces mailto CTAs |
| Modify | `components/product/sections.tsx` | Import `ProductCtaButtons`; add `slug` prop to `ProductHero`; remove `CONTACT_EMAIL`/`CONTACT_TEL` |
| Modify | `components/boutique/custom-order-cta.tsx` | Add `"use client"`, self-host `InquiryModal` |
| Modify | `docs/MASTER-PLAN.md` | Tick P5 routes |

---

### Task 1: Wire ContactForm

**Files:**
- Modify: `components/company/contact-form.tsx`

**Interfaces:**
- Consumes: `submitInquiry`, `InquiryResult` from `@/app/actions/submit-inquiry`
- Consumes: `Field`, `Input`, `Textarea`, `FormStatus`, `buttonVariants` from `@/components/ds`
- Consumes: `ContactsContent` from `@/lib/content/types` (prop shape unchanged)
- Produces: live contact form component

- [ ] **Step 1: Replace `components/company/contact-form.tsx`**

```tsx
"use client";
import { useState, useTransition } from "react";
import { buttonVariants, Field, Input, Textarea, FormStatus } from "@/components/ds";
import { submitInquiry, type InquiryResult } from "@/app/actions/submit-inquiry";
import type { ContactsContent } from "@/lib/content/types";

export function ContactForm({ form }: { form: ContactsContent["form"] }) {
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitInquiry({
        kind: "contact",
        name: fd.get("name") as string,
        contact: fd.get("contact") as string,
        message: (fd.get("message") as string) || undefined,
        source_url: window.location.href,
        website: fd.get("website") as string,
      });
      setResult(res);
      if (res.ok) (e.target as HTMLFormElement).reset();
    });
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8">
      <h2
        className="font-display text-lg uppercase text-text"
        style={{ letterSpacing: "var(--ls-tight)" }}
      >
        {form.title}
      </h2>
      <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
        {/* Honeypot — bots fill it, humans don't */}
        <input
          type="text"
          name="website"
          defaultValue=""
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
        />
        <Field label="Имя" htmlFor="name">
          <Input id="name" name="name" type="text" placeholder="Ваше имя" required />
        </Field>
        <Field label="Телефон или e-mail" htmlFor="contact">
          <Input
            id="contact"
            name="contact"
            type="text"
            placeholder="+7 900 000 00 00 или mail@example.com"
            required
          />
        </Field>
        <Field label="Сообщение" htmlFor="message">
          <Textarea id="message" name="message" rows={4} placeholder="Чем можем помочь?" />
        </Field>
        <button
          type="submit"
          disabled={isPending}
          className={buttonVariants({ variant: "primary", size: "lg", className: "w-full" })}
        >
          {isPending ? "Отправляем..." : "Отправить"}
        </button>
        <FormStatus state={result} />
      </form>
      <p className="mt-3 font-mono text-2xs text-text-faint">{form.note}</p>
    </div>
  );
}
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: green. `ContactForm` is now a client component; `/kontakty` page stays valid (it imports `ContactForm` as before).

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/company/contact-form.tsx
git commit -m "feat(p5c): wire ContactForm to submitInquiry server action"
```

---

### Task 2: InquiryModal + ProductCtaButtons + sections.tsx update

**Files:**
- Create: `components/inquiry/inquiry-modal.tsx`
- Create: `components/inquiry/index.ts`
- Create: `components/product/product-cta-buttons.tsx`
- Modify: `components/product/sections.tsx`

**Interfaces:**
- Consumes: `submitInquiry`, `InquiryResult` from `@/app/actions/submit-inquiry`
- Consumes: `Field`, `Input`, `Textarea`, `FormStatus`, `buttonVariants` from `@/components/ds`
- Consumes: `ProductFrontmatter` from `@/lib/content/schema`
- Produces: `InquiryModal` (props: `open`, `onClose`, `kind`, `productName?`, `productSlug?`) — used by `ProductCtaButtons` and boutique components
- Produces: `ProductCtaButtons` (props: `price`, `name`, `slug`) — replaces mailto CTAs in `sections.tsx`

- [ ] **Step 1: Create `components/inquiry/inquiry-modal.tsx`**

```tsx
"use client";
import { useRef, useEffect, useState, useTransition } from "react";
import { X } from "lucide-react";
import { buttonVariants, Field, Input, Textarea, FormStatus } from "@/components/ds";
import { submitInquiry, type InquiryResult } from "@/app/actions/submit-inquiry";

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
  kind: "product" | "boutique";
  productName?: string;
  productSlug?: string;
}

export function InquiryModal({
  open,
  onClose,
  kind,
  productName,
  productSlug,
}: InquiryModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [result, setResult] = useState<InquiryResult | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (open) {
      setResult(null);
      ref.current?.showModal();
    } else {
      ref.current?.close();
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await submitInquiry({
        kind,
        product_slug: productSlug,
        name: fd.get("name") as string,
        contact: fd.get("contact") as string,
        message: (fd.get("message") as string) || undefined,
        source_url: typeof window !== "undefined" ? window.location.href : undefined,
        website: fd.get("website") as string,
      });
      setResult(res);
      if (res.ok) {
        setTimeout(onClose, 2000);
      }
    });
  }

  const title =
    kind === "product"
      ? productName
        ? `Заявка: ${productName}`
        : "Отправить заявку"
      : "Индивидуальный заказ";

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto max-w-lg w-full rounded-[var(--radius-lg)] border border-border bg-bg p-6 shadow-[var(--shadow-3)] backdrop:bg-[rgb(0_0_0/0.5)]"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <h2
          className="font-display text-lg uppercase text-text"
          style={{ letterSpacing: "var(--ls-tight)" }}
        >
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Закрыть"
          className="shrink-0 text-text-faint hover:text-text"
        >
          <X size={20} />
        </button>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="website"
          defaultValue=""
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
        />
        <Field label="Имя" htmlFor="modal-name">
          <Input id="modal-name" name="name" type="text" placeholder="Ваше имя" required />
        </Field>
        <Field label="Телефон или e-mail" htmlFor="modal-contact">
          <Input
            id="modal-contact"
            name="contact"
            type="text"
            placeholder="+7 900 000 00 00 или mail@example.com"
            required
          />
        </Field>
        <Field label="Комментарий" htmlFor="modal-message">
          <Textarea
            id="modal-message"
            name="message"
            rows={3}
            placeholder="Дополнительная информация"
          />
        </Field>
        <button
          type="submit"
          disabled={isPending}
          className={buttonVariants({ variant: "primary", size: "lg", className: "w-full" })}
        >
          {isPending ? "Отправляем..." : "Отправить"}
        </button>
        <FormStatus state={result} />
      </form>
    </dialog>
  );
}
```

- [ ] **Step 2: Create `components/inquiry/index.ts`**

```ts
export { InquiryModal } from "./inquiry-modal";
```

- [ ] **Step 3: Create `components/product/product-cta-buttons.tsx`**

```tsx
"use client";
import { useState } from "react";
import { buttonVariants } from "@/components/ds";
import { InquiryModal } from "@/components/inquiry";
import type { ProductFrontmatter } from "@/lib/content/schema";

interface ProductCtaButtonsProps {
  price: ProductFrontmatter["price"];
  name: string;
  slug: string;
}

export function ProductCtaButtons({ price, name, slug }: ProductCtaButtonsProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        {price?.onRequest ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={buttonVariants({ variant: "primary", size: "lg", className: "min-w-40" })}
          >
            Запросить расчёт
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={buttonVariants({ variant: "primary", size: "lg", className: "min-w-40" })}
            >
              В корзину
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Купить в 1 клик
            </button>
          </>
        )}
      </div>
      <InquiryModal
        open={open}
        onClose={() => setOpen(false)}
        kind="product"
        productName={name}
        productSlug={slug}
      />
    </>
  );
}
```

- [ ] **Step 4: Update `components/product/sections.tsx`**

Modify `ProductHero` to accept a `slug` prop and render `ProductCtaButtons` instead of mailto links.

**4a — Add import at top of file (after existing imports):**

```tsx
import { ProductCtaButtons } from "./product-cta-buttons";
```

**4b — Change `ProductHero` signature** (line ~22):

From:
```tsx
export function ProductHero({ product }: { product: ProductFrontmatter }) {
```

To:
```tsx
export function ProductHero({ product, slug }: { product: ProductFrontmatter; slug: string }) {
```

**4c — Delete the two constants** (lines 23-24):

```tsx
const CONTACT_EMAIL = "novikamps@mail.ru";
const CONTACT_TEL = "+79219372508";
```

**4d — Replace the CTA block** (the entire `<div className="mt-6 flex flex-wrap gap-3">` block containing the mailto/tel `<a>` tags and the `<p>` note below it). Find:

```tsx
        {/* CTAs */}
        <div className="mt-6 flex flex-wrap gap-3">
          {price?.onRequest ? (
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Запрос цены: ${product.name}`)}`}
              className={buttonVariants({ variant: "primary", size: "lg", className: "min-w-40" })}
            >
              Запросить расчёт
            </a>
          ) : (
            <>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Заказ: ${product.name}`)}`}
                className={buttonVariants({ variant: "primary", size: "lg", className: "min-w-40" })}
              >
                В корзину
              </a>
              <a
                href={`tel:${CONTACT_TEL}`}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Купить в 1 клик
              </a>
            </>
          )}
        </div>
        <p className="mt-3 font-mono text-2xs text-text-faint">
          Оформление — по телефону или почте. Онлайн-корзина скоро.
        </p>
```

Replace with:

```tsx
        {/* CTAs */}
        <div className="mt-6">
          <ProductCtaButtons price={price} name={product.name} slug={slug} />
        </div>
```

**4e — Remove unused `Link` import** if `Link` is no longer used in the file after this change. Check: does any other part of `sections.tsx` use `Link`? If not, remove it from the import list at the top.

- [ ] **Step 5: Update `app/catalog/[slug]/page.tsx` — pass `slug` to `ProductHero`**

Find the `ProductHero` usage in `app/catalog/[slug]/page.tsx` and add `slug={slug}`:

```tsx
<ProductHero product={frontmatter} slug={slug} />
```

The `slug` variable comes from `params.slug` (already destructured in the page component). If the page has `const { slug } = await params;` at the top, `slug` is already in scope.

- [ ] **Step 6: Build + type check**

```bash
npm run build && npx tsc --noEmit
```

Expected: green. No TypeScript errors. Product pages still prerender.

- [ ] **Step 7: Verify no mailto/tel links in product output**

After build, run:

```bash
grep -rn 'mailto:\|tel:+' .next/server/app/catalog/ 2>/dev/null | grep -v "kontakty" | head -5
```

Expected: no output (all product mailto/tel links replaced by the modal).

- [ ] **Step 8: Commit**

```bash
git add components/inquiry/ components/product/product-cta-buttons.tsx \
        components/product/sections.tsx app/catalog/\[slug\]/page.tsx
git commit -m "feat(p5c): InquiryModal + ProductCtaButtons; replace product mailto CTAs"
```

---

### Task 3: Boutique CTA wiring + master-plan + final verify

**Files:**
- Modify: `components/boutique/custom-order-cta.tsx`
- Modify: `docs/MASTER-PLAN.md`

**Interfaces:**
- Consumes: `InquiryModal` from `@/components/inquiry`
- Boutique pages (`app/catalog/{boutique,savers,converters}/page.tsx`) remain **unchanged** (server components — `CustomOrderCta` is now self-contained)

- [ ] **Step 1: Rewrite `components/boutique/custom-order-cta.tsx`**

Convert to client component; self-host `InquiryModal kind="boutique"`:

```tsx
"use client";
import { useState } from "react";
import { Container, buttonVariants } from "@/components/ds";
import { InquiryModal } from "@/components/inquiry";
import type { BoutiqueCustom } from "@/lib/content/types";

export function CustomOrderCta({ custom }: { custom: BoutiqueCustom }) {
  const [open, setOpen] = useState(false);

  return (
    <section id="custom" className="scroll-mt-20 border-t border-border bg-surface-2 py-16">
      <Container>
        <div className="max-w-prose">
          <h2
            className="font-display uppercase text-text"
            style={{
              fontSize: "clamp(var(--text-2xl), 4vw, var(--text-3xl))",
              lineHeight: "var(--lh-tight)",
              letterSpacing: "var(--ls-tight)",
            }}
          >
            {custom.title}
          </h2>
          {custom.body.map((p, i) => (
            <p key={i} className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              {p}
            </p>
          ))}
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={buttonVariants({ variant: "primary", size: "lg" })}
            >
              {custom.cta.label}
            </button>
          </div>
        </div>
      </Container>
      <InquiryModal open={open} onClose={() => setOpen(false)} kind="boutique" />
    </section>
  );
}
```

Note: the three boutique pages stay **as-is** — no changes needed. `CustomOrderCta` is now a client component, but it is imported by server pages (Next.js allows this — server pages can render client components).

- [ ] **Step 2: Build + type check**

```bash
npm run build && npx tsc --noEmit
```

Expected: green. All three boutique routes still prerender (`○` in build output).

- [ ] **Step 3: Full vitest suite**

```bash
npx vitest run
```

Expected: all tests pass. Verify specifically that `area-cards.test.tsx` and `boutique-content.test.ts` still pass.

- [ ] **Step 4: Hex color grep (no hardcoded colors)**

```bash
grep -rEn '#[0-9a-fA-F]{3,6}' \
  components/inquiry components/product/product-cta-buttons.tsx \
  components/boutique/custom-order-cta.tsx \
  2>/dev/null || echo "NO HEX"
```

Expected: `NO HEX` (or only matches inside comments, not in JSX).

- [ ] **Step 5: Verify no secret in client bundle**

```bash
grep -rn "SUPABASE_SERVICE_ROLE_KEY\|RESEND_API_KEY\|TELEGRAM_BOT_TOKEN" \
  components/ app/catalog/ 2>/dev/null | head
```

Expected: no output. The secret env var names must not appear in any client component file.

- [ ] **Step 6: Update `docs/MASTER-PLAN.md`**

In §2 (Status table), update P5 row to mark sub-slices complete:

```markdown
| **P5 — Forms & Inquiries** | ✅ Vercel migration (P5a) + Supabase + server action + DS primitives (P5b) + ContactForm + InquiryModal + ProductCtaButtons + boutique wiring (P5c). |
```

In §3 (Sitemap), tick `/kontakty` form from `P5` to `✅ P5`.

- [ ] **Step 7: Commit master-plan + boutique**

```bash
git add components/boutique/custom-order-cta.tsx docs/MASTER-PLAN.md
git commit -m "feat(p5c): wire boutique CTAs to InquiryModal; update master plan"
```

---

## Self-Review

**Spec coverage:**
- §6.1 ContactForm live (useTransition + useState, honeypot, kind: 'contact') → Task 1 ✓
- §6.2 InquiryModal (native dialog, showModal/close, auto-close 2s on success) → Task 2 ✓
- §6.3 ProductCtaButtons (client, sections.tsx stays server) → Task 2 ✓
- §6.4 Boutique CTA wiring (CustomOrderCta self-contained, pages unchanged) → Task 3 ✓
- §6.5 acceptance: honeypot ✓; no mailto in product CTAs ✓; build green ✓; no secret in client bundle ✓; FormStatus in Russian ✓; modal closes after success ✓

**Placeholder scan:** none.

**Type consistency:**
- `InquiryResult` imported from `@/app/actions/submit-inquiry` in `ContactForm`, `InquiryModal`, and `FormStatus` ✓
- `InquiryModal` props (`open`, `onClose`, `kind`, `productName?`, `productSlug?`) consistent between definition in `inquiry-modal.tsx` and usage in `ProductCtaButtons` and `CustomOrderCta` ✓
- `ProductCtaButtons` props (`price: ProductFrontmatter["price"]`, `name: string`, `slug: string`) match usage in `sections.tsx` ✓
- `ProductHero` new `slug: string` prop added to both signature and call site in `app/catalog/[slug]/page.tsx` ✓
- `BoutiqueCustom` type from `@/lib/content/types` — `CustomOrderCta` prop unchanged ✓
