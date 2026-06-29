# P5 — Forms & Inquiries on Supabase: design spec

**Date:** 2026-06-29
**Phase:** P5 (first backend phase; replaces all CTA stubs)
**Slice source:** `docs/slices/forms-supabase.md`
**Depends on:** P3a (`/kontakty` stub form exists), P3b (boutique CTAs exist), P2 (product CTAs exist)

---

## 1. Goal

Wire every inquiry touchpoint — contact form, product CTAs ("В корзину", "Купить в 1 клик", "Запросить расчёт"), and boutique custom-order — to a real Supabase `inquiries` table with email + Telegram notifications. Migrate hosting from GitHub Pages (static export) to Vercel to enable Next.js server actions.

---

## 2. Decomposition

Three independent sub-slices, delivered in order:

| Sub-slice | Scope | Prerequisite |
|-----------|-------|--------------|
| **P5a** | GitHub Pages → Vercel migration | None |
| **P5b** | Supabase schema + server action + DS form primitives | P5a merged |
| **P5c** | Wire ContactForm + InquiryModal + all CTAs | P5b merged |

Each sub-slice is a separate branch, plan, and merge.

---

## 3. Decisions

- **A. Vercel hosting.** `output: "export"` blocks server actions. Remove static export; deploy to Vercel via GitHub integration. DNS: `novikamps.com` → Vercel.
- **B. New Supabase project.** Separate from NB-site. Never reuse NB-site credentials.
- **C. Notifications: email + Telegram.** Resend for email (transactional, free tier); Telegram Bot API for instant push.
- **D. All product CTAs → InquiryModal.** Priced products ("В корзину") and on-request products ("Запросить расчёт") both open the same modal. No cart in P5.
- **E. Boutique CTAs → same InquiryModal** (`kind: "boutique"`). No separate form page.
- **F. Rate limiting via Supabase.** Count recent inserts from same IP in `inquiries` table (last 60 s, max 3). No Redis.
- **G. Honeypot anti-spam.** Hidden `website` field; reject if non-empty.

---

## 4. P5a — Vercel migration

### 4.1 `next.config.ts` changes (remove)

```ts
// REMOVE these lines:
output: "export",
basePath: process.env.PAGES_BASE_PATH ?? "",
trailingSlash: true,
images: { loader: "custom", loaderFile: "./image-loader.ts" },
```

After: `next.config.ts` has only `reactStrictMode: true` (and any other non-deploy config).

### 4.2 Files to delete

- `image-loader.ts` — basePath image workaround, no longer needed
- `public/.nojekyll` — GitHub Pages artifact

### 4.3 `.github/workflows/deploy.yml` — replace with CI-only

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm install --no-audit --no-fund
      - run: npm run build
```

Vercel deploys via its own GitHub App integration (no deploy step in Actions).

### 4.4 `app/layout.tsx`

`metadataBase: new URL("https://novikamps.com")` — already correct, no change.

### 4.5 Vercel setup (manual, one-time)

1. Connect repo in Vercel dashboard (Import Project → GitHub → ebmbadm/nag-site).
2. Framework preset: Next.js (auto-detected).
3. No env vars needed for P5a (Supabase comes in P5b).
4. Domain: add `novikamps.com` in Vercel dashboard; update DNS A/CNAME per Vercel instructions.

### 4.6 Acceptance criteria (P5a)

- `npm run build` green locally (no `output: "export"`, no `PAGES_BASE_PATH`).
- Vercel preview URL renders the site correctly (all 28 routes).
- No `image-loader.ts` or `.nojekyll` in repo.
- `novikamps.com` resolves to Vercel (after DNS propagation).

---

## 5. P5b — Supabase + server action + DS primitives

### 5.1 Supabase schema

Migration file: `supabase/migrations/0001_inquiries.sql`

```sql
create table inquiries (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  kind        text not null check (kind in ('contact', 'product', 'boutique')),
  product_slug text,
  name        text not null,
  contact     text not null,   -- phone or email, user's choice
  message     text,
  source_url  text,
  source_ip   text,
  status      text not null default 'new'
);

alter table inquiries enable row level security;

-- anon can submit, never read
create policy "anon insert"
  on inquiries for insert
  to anon
  with check (true);

-- service role full access (admin/notifications)
create policy "service full"
  on inquiries for all
  to service_role
  using (true)
  with check (true);
```

### 5.2 Supabase clients

**`lib/supabase/server.ts`** — service_role singleton, server-only:

```ts
import { createClient } from "@supabase/supabase-js";

let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !key) throw new Error("Supabase env vars missing");
  _client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _client;
}
```

No browser client needed in P5 (all form submission goes through server action).

### 5.3 Server action

**`app/actions/submit-inquiry.ts`**:

```ts
"use server";
import { z } from "zod";
import { headers } from "next/headers";
import { getSupabase } from "@/lib/supabase/server";

const schema = z.object({
  kind: z.enum(["contact", "product", "boutique"]),
  product_slug: z.string().optional(),
  name: z.string().min(1).max(100),
  contact: z.string().min(1).max(200),
  message: z.string().max(2000).optional(),
  source_url: z.string().optional(),
  website: z.literal(""),   // honeypot — must be empty
});

export type InquiryResult = { ok: true } | { ok: false; error: string };

export async function submitInquiry(data: unknown): Promise<InquiryResult> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Проверьте заполненные поля." };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  // Rate limit: max 3 submissions per IP per 60 s
  if (ip) {
    const db = getSupabase();
    const { count } = await db
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("source_ip", ip)
      .gte("created_at", new Date(Date.now() - 60_000).toISOString());
    if ((count ?? 0) >= 3) return { ok: false, error: "Слишком много заявок. Подождите минуту." };
  }

  const { kind, product_slug, name, contact, message, source_url } = parsed.data;
  const db = getSupabase();
  const { error } = await db.from("inquiries").insert({
    kind, product_slug, name, contact, message, source_url, source_ip: ip,
  });
  if (error) return { ok: false, error: "Не удалось отправить. Попробуйте ещё раз." };

  await Promise.allSettled([
    notifyEmail({ kind, product_slug, name, contact, message }),
    notifyTelegram({ kind, product_slug, name, contact, message }),
  ]);

  return { ok: true };
}
```

Notifications fire after successful insert; failures are swallowed (non-critical; row is already saved).

### 5.4 Notifications

**`lib/notifications.ts`**:

```ts
// Email via Resend
export async function notifyEmail(data: NotifyPayload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "NAG·NOVIK сайт <noreply@novikamps.com>",
      to: "novikamps@mail.ru",
      subject: `Новая заявка: ${kindLabel(data.kind)}${data.product_slug ? ` — ${data.product_slug}` : ""}`,
      text: formatText(data),
    }),
  });
}

// Telegram Bot API
export async function notifyTelegram(data: NotifyPayload) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatTelegram(data),
      parse_mode: "HTML",
    }),
  });
}
```

`from:` domain `novikamps.com` must be verified in Resend dashboard (add DNS TXT record).

### 5.5 DS form primitives (add to `components/ds/`)

All server components except `FormStatus`.

**`Input`** — `<input>` styled with tokens; props: `id`, `name`, `type`, `placeholder?`, `required?`, `error?` (boolean).

**`Textarea`** — same for `<textarea>`; additional `rows?` prop.

**`Field`** — wrapper: `<label>` (mono uppercase, `--ls-label`) + slot for input/textarea + optional `<p>` error message (text-accent, `text-2xs`).

**`FormStatus`** — client component (`"use client"`); receives `state: InquiryResult | null`; renders success banner (`bg-surface-2` + border-border, «Заявка отправлена») or error message (`text-accent`, error text). Hidden when `state === null`. No green color token — keep brand palette.

Export all four from `components/ds/index.ts`.

### 5.6 Env vars (Vercel dashboard + `.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

### 5.7 Acceptance criteria (P5b)

- Migration applies cleanly via Supabase CLI (`supabase db push`).
- `submitInquiry` unit tests: valid payload → `{ ok: true }`; honeypot non-empty → `{ ok: false }`; invalid schema → `{ ok: false }`.
- Supabase insert verified in local/remote dashboard.
- No env vars hardcoded; build green with vars unset (server action only runs at request time).
- `productFrontmatterSchema` untouched; existing 70 tests still pass.

---

## 6. P5c — Wire forms

### 6.1 `ContactForm` (replace stub)

`components/company/contact-form.tsx` → real form:
- `"use client"` — needs `useTransition` + `useState` for result (React 19; no `useFormState`/`useActionState` complexity needed)
- Fields: name, contact (phone/email), message (optional), honeypot `website` hidden
- Calls `submitInquiry({ kind: "contact", ... })` via `startTransition`
- `FormStatus` below the button shows result
- Remove `disabled`, `aria-disabled`; keep DS token styling

### 6.2 `InquiryModal`

**`components/inquiry/inquiry-modal.tsx`** (`"use client"`):
- Native `<dialog ref>` with `showModal()` / `close()`; backdrop via CSS
- Props: `open: boolean`, `onClose: () => void`, `kind: "product" | "boutique"`, `productName?: string`, `productSlug?: string`
- Form fields: name, contact, message (optional), honeypot hidden, `kind` + `product_slug` hidden
- `source_url`: `window.location.href` (captured on open)
- On submit: `startTransition(() => submitInquiry(...))`; show `FormStatus`; auto-close after 2 s on success

**`components/inquiry/index.ts`** — re-exports `InquiryModal`.

### 6.3 `ProductCtaButtons`

**`components/product/product-cta-buttons.tsx`** (`"use client"`):
- Extracted from `sections.tsx` (which stays server)
- Props: `price: ProductFrontmatter["price"]`, `name: string`, `slug: string`
- Owns `modalOpen: boolean` state
- Renders: "Запросить расчёт" / "В корзину" / "Купить в 1 клик" as `<button>` elements (same visual style via `buttonVariants`)
- Opens `<InquiryModal kind="product" productName={name} productSlug={slug} />`

`sections.tsx`: replace the CTA `<Link href="mailto:...">` block with `<ProductCtaButtons ... />`.

### 6.4 Boutique CTA wiring

`components/boutique/custom-order-cta.tsx` — add optional `onInquiry?: () => void` prop. If provided, button calls `onInquiry()` instead of navigating to `/kontakty`.

Boutique pages (`app/catalog/{boutique,savers,converters}/page.tsx`) — wrap in a thin client component `BoutiquePageClient` that owns `modalOpen` state and passes `onInquiry` + `<InquiryModal kind="boutique" />`.

### 6.5 Acceptance criteria (P5c)

- Contact form on `/kontakty` submits → row in `inquiries` (`kind: "contact"`) → email + Telegram fire.
- "В корзину" on any product page opens modal → submit → row (`kind: "product"`, `product_slug` set).
- Boutique CTA opens modal → row (`kind: "boutique"`).
- Honeypot filled → rejected, no DB insert.
- Rate limit: 4th submit within 60 s → error message, no insert.
- `FormStatus` shows success/error in Russian; modal closes after success.
- No `mailto:` or `tel:` links remain in product CTAs.
- `npm run build` green; `npx tsc --noEmit` clean; vitest all pass.
- No secret in client bundle (`SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN` — server-only).

---

## 7. Out of scope

- P6 commerce (cart, checkout, payments)
- Admin dashboard for viewing/managing inquiries (service role + Supabase Studio is sufficient)
- UTM parameter tracking (fields reserved in schema, not populated in P5)
- КОНТУР car-audio pages (P2 leftover)
- P4 homepage (separate slice)
- Supabase Auth / user accounts
