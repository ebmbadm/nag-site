# P5b — Supabase + Server Action + DS Form Primitives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the `inquiries` Supabase table, a `submitInquiry` server action (zod validation, honeypot, IP rate-limit), email + Telegram notifications, and four DS form primitives (`Input`, `Textarea`, `Field`, `FormStatus`).

**Architecture:** Pure server-side — the server action runs in the Next.js Node runtime (Vercel), reads the service_role key from env, and inserts into Supabase. Notifications fire after the insert via `Promise.allSettled`. No client-side Supabase client. Zod schema lives in `lib/inquiry/validate.ts` (no Next.js deps) so it can be unit-tested without mocking server internals.

**Tech Stack:** Next.js 16 server actions (`"use server"`), Supabase JS v2, Zod v4, Resend REST API (raw fetch), Telegram Bot API (raw fetch), Vitest

## Global Constraints

- Branch: `p5b-supabase-action-primitives` off `main` (merge P5a first)
- `SUPABASE_SERVICE_ROLE_KEY` and `RESEND_API_KEY` and `TELEGRAM_BOT_TOKEN` are server-only — never in `NEXT_PUBLIC_*` vars, never imported in client components
- `NEXT_PUBLIC_SUPABASE_URL` is the only public env var for Supabase
- Build must pass with all env vars unset (server action only runs at request time, not build time)
- Never hardcode hex/rgb — use DS tokens
- Existing 70+ vitest tests must still pass
- Commit prefix: `feat(p5b):`/`chore(p5b):`

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `supabase/migrations/0001_inquiries.sql` | DDL + RLS |
| Create | `lib/supabase/server.ts` | Service-role client singleton |
| Create | `lib/inquiry/validate.ts` | Pure zod schema + types |
| Create | `lib/__tests__/inquiry-schema.test.ts` | Schema unit tests |
| Create | `lib/notifications.ts` | notifyEmail, notifyTelegram, formatText, formatTelegram |
| Create | `lib/__tests__/notifications.test.ts` | Format function tests |
| Create | `app/actions/submit-inquiry.ts` | Server action orchestrator |
| Create | `components/ds/input.tsx` | Input primitive |
| Create | `components/ds/textarea.tsx` | Textarea primitive |
| Create | `components/ds/field.tsx` | Field (label + error slot) primitive |
| Create | `components/ds/form-status.tsx` | FormStatus client primitive |
| Modify | `components/ds/index.ts` | Export new primitives |

---

### Task 1: Supabase schema + server client

**Files:**
- Create: `supabase/migrations/0001_inquiries.sql`
- Create: `lib/supabase/server.ts`

**Interfaces:**
- Produces: `getSupabase(): SupabaseClient` — used by `submit-inquiry.ts` in Task 2

- [ ] **Step 1: Create branch**

```bash
git checkout -b p5b-supabase-action-primitives
```

- [ ] **Step 2: Create `supabase/migrations/0001_inquiries.sql`**

Create directory if needed: `mkdir -p supabase/migrations`

```sql
create table inquiries (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  kind         text not null check (kind in ('contact', 'product', 'boutique')),
  product_slug text,
  name         text not null,
  contact      text not null,
  message      text,
  source_url   text,
  source_ip    text,
  status       text not null default 'new'
);

alter table inquiries enable row level security;

-- anon: insert only, never read
create policy "anon insert"
  on inquiries for insert
  to anon
  with check (true);

-- service role: full access (notifications, admin)
create policy "service full"
  on inquiries for all
  to service_role
  using (true)
  with check (true);
```

Apply to remote Supabase project:

```bash
# If Supabase CLI installed:
supabase db push
# OR: paste the SQL directly into Supabase Studio SQL editor
```

Verify in Supabase Studio: table `inquiries` exists with 10 columns; RLS enabled; 2 policies listed.

- [ ] **Step 3: Create `lib/supabase/server.ts`**

```ts
import { createClient } from "@supabase/supabase-js";

let _client: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars missing");
  _client = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _client;
}
```

- [ ] **Step 4: Install `@supabase/supabase-js`**

```bash
npm install @supabase/supabase-js
```

- [ ] **Step 5: Verify build + tests**

```bash
npm run build && npx vitest run
```

Expected: build green (env vars missing → no error at build time, only at runtime); all existing tests pass.

- [ ] **Step 6: Commit**

```bash
git add supabase/migrations/0001_inquiries.sql lib/supabase/server.ts package.json package-lock.json
git commit -m "feat(p5b): Supabase inquiries table, RLS policies, server client"
```

---

### Task 2: Zod schema + submitInquiry server action (TDD)

**Files:**
- Create: `lib/inquiry/validate.ts`
- Create: `lib/__tests__/inquiry-schema.test.ts`
- Create: `app/actions/submit-inquiry.ts`

**Interfaces:**
- Consumes: `getSupabase()` from `lib/supabase/server.ts` (Task 1)
- Produces: `submitInquiry(data: unknown): Promise<InquiryResult>` and `type InquiryResult` — used by P5c form components

- [ ] **Step 1: Write the failing test** `lib/__tests__/inquiry-schema.test.ts`

```ts
import { describe, expect, test } from "vitest";
import { inquirySchema } from "@/lib/inquiry/validate";

describe("inquirySchema", () => {
  const valid = {
    kind: "contact" as const,
    name: "Иван",
    contact: "+79001234567",
    website: "",
  };

  test("valid contact payload passes", () => {
    const result = inquirySchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  test("valid product payload passes", () => {
    const result = inquirySchema.safeParse({
      ...valid,
      kind: "product",
      product_slug: "d-8000",
    });
    expect(result.success).toBe(true);
  });

  test("honeypot non-empty → fails", () => {
    const result = inquirySchema.safeParse({ ...valid, website: "spam" });
    expect(result.success).toBe(false);
  });

  test("empty name → fails", () => {
    const result = inquirySchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
  });

  test("empty contact → fails", () => {
    const result = inquirySchema.safeParse({ ...valid, contact: "" });
    expect(result.success).toBe(false);
  });

  test("unknown kind → fails", () => {
    const result = inquirySchema.safeParse({ ...valid, kind: "cart" });
    expect(result.success).toBe(false);
  });

  test("message over 2000 chars → fails", () => {
    const result = inquirySchema.safeParse({ ...valid, message: "x".repeat(2001) });
    expect(result.success).toBe(false);
  });

  test("optional fields absent → passes", () => {
    // product_slug, message, source_url all optional
    const result = inquirySchema.safeParse({ kind: "boutique", name: "A", contact: "B", website: "" });
    expect(result.success).toBe(true);
  });
});
```

- [ ] **Step 2: Run → FAIL** (`Cannot find module '@/lib/inquiry/validate'`)

```bash
npx vitest run lib/__tests__/inquiry-schema.test.ts
```

Expected: 8 tests FAIL with "Cannot find module".

- [ ] **Step 3: Create `lib/inquiry/validate.ts`**

```ts
import { z } from "zod";

export const inquirySchema = z.object({
  kind: z.enum(["contact", "product", "boutique"]),
  product_slug: z.string().optional(),
  name: z.string().min(1).max(100),
  contact: z.string().min(1).max(200),
  message: z.string().max(2000).optional(),
  source_url: z.string().optional(),
  website: z.literal(""),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
```

- [ ] **Step 4: Run → PASS**

```bash
npx vitest run lib/__tests__/inquiry-schema.test.ts
```

Expected: 8 tests PASS.

- [ ] **Step 5: Create `app/actions/submit-inquiry.ts`**

```ts
"use server";
import { headers } from "next/headers";
import { inquirySchema } from "@/lib/inquiry/validate";
import { getSupabase } from "@/lib/supabase/server";
import { notifyEmail, notifyTelegram } from "@/lib/notifications";

export type InquiryResult = { ok: true } | { ok: false; error: string };

export async function submitInquiry(data: unknown): Promise<InquiryResult> {
  const parsed = inquirySchema.safeParse(data);
  if (!parsed.success) return { ok: false, error: "Проверьте заполненные поля." };

  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;

  if (ip) {
    const db = getSupabase();
    const { count } = await db
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("source_ip", ip)
      .gte("created_at", new Date(Date.now() - 60_000).toISOString());
    if ((count ?? 0) >= 3)
      return { ok: false, error: "Слишком много заявок. Подождите минуту." };
  }

  const { kind, product_slug, name, contact, message, source_url } = parsed.data;
  const db = getSupabase();
  const { error } = await db
    .from("inquiries")
    .insert({ kind, product_slug, name, contact, message, source_url, source_ip: ip });
  if (error) return { ok: false, error: "Не удалось отправить. Попробуйте ещё раз." };

  await Promise.allSettled([
    notifyEmail({ kind, product_slug, name, contact, message }),
    notifyTelegram({ kind, product_slug, name, contact, message }),
  ]);

  return { ok: true };
}
```

Note: `notifyEmail`/`notifyTelegram` are imported from Task 3. If Task 3 is not yet done, create `lib/notifications.ts` as a stub first:

```ts
// Temporary stub — replace in Task 3
export async function notifyEmail(_: unknown) {}
export async function notifyTelegram(_: unknown) {}
```

- [ ] **Step 6: Build check**

```bash
npm run build
```

Expected: green. The server action compiles without errors. Env vars missing is fine at build time.

- [ ] **Step 7: Commit**

```bash
git add lib/inquiry/validate.ts lib/__tests__/inquiry-schema.test.ts app/actions/submit-inquiry.ts
git commit -m "feat(p5b): zod inquiry schema + submitInquiry server action"
```

---

### Task 3: Notification helpers

**Files:**
- Create (or replace stub): `lib/notifications.ts`
- Create: `lib/__tests__/notifications.test.ts`

**Interfaces:**
- Consumes: nothing from prior tasks (pure functions + fetch)
- Produces: `notifyEmail(data: NotifyPayload): Promise<void>`, `notifyTelegram(data: NotifyPayload): Promise<void>`, `formatText(data: NotifyPayload): string`, `formatTelegram(data: NotifyPayload): string`

- [ ] **Step 1: Write the failing test** `lib/__tests__/notifications.test.ts`

```ts
import { describe, expect, test } from "vitest";
import { formatText, formatTelegram } from "@/lib/notifications";

const base = { kind: "contact" as const, name: "Иван", contact: "+79001234567" };

describe("formatText", () => {
  test("includes kind label, name, contact", () => {
    const text = formatText(base);
    expect(text).toContain("Контакт");
    expect(text).toContain("Иван");
    expect(text).toContain("+79001234567");
  });

  test("includes product slug when present", () => {
    const text = formatText({ ...base, kind: "product", product_slug: "d-8000" });
    expect(text).toContain("d-8000");
  });

  test("includes message when present", () => {
    const text = formatText({ ...base, message: "Нужна доставка" });
    expect(text).toContain("Нужна доставка");
  });

  test("omits message line when absent", () => {
    const text = formatText(base);
    expect(text).not.toContain("Сообщение");
  });
});

describe("formatTelegram", () => {
  test("wraps kind in bold HTML tag", () => {
    const html = formatTelegram(base);
    expect(html).toContain("<b>");
    expect(html).toContain("Контакт");
  });

  test("wraps product slug in code tag", () => {
    const html = formatTelegram({ ...base, kind: "product", product_slug: "f-8-pro" });
    expect(html).toContain("<code>f-8-pro</code>");
  });
});
```

- [ ] **Step 2: Run → FAIL**

```bash
npx vitest run lib/__tests__/notifications.test.ts
```

Expected: FAIL — `formatText` not exported.

- [ ] **Step 3: Create `lib/notifications.ts`**

```ts
export interface NotifyPayload {
  kind: "contact" | "product" | "boutique";
  product_slug?: string;
  name: string;
  contact: string;
  message?: string;
}

function kindLabel(kind: string): string {
  if (kind === "contact") return "Контакт";
  if (kind === "product") return "Товар";
  if (kind === "boutique") return "Бутик";
  return kind;
}

export function formatText(data: NotifyPayload): string {
  return [
    `Тип: ${kindLabel(data.kind)}`,
    data.product_slug ? `Товар: ${data.product_slug}` : null,
    `Имя: ${data.name}`,
    `Контакт: ${data.contact}`,
    data.message ? `Сообщение: ${data.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatTelegram(data: NotifyPayload): string {
  return [
    `<b>Новая заявка: ${kindLabel(data.kind)}</b>`,
    data.product_slug ? `Товар: <code>${data.product_slug}</code>` : null,
    `Имя: ${data.name}`,
    `Контакт: ${data.contact}`,
    data.message ? `Сообщение: ${data.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function notifyEmail(data: NotifyPayload): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const subject = `Новая заявка: ${kindLabel(data.kind)}${data.product_slug ? ` — ${data.product_slug}` : ""}`;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "NAG·NOVIK сайт <noreply@novikamps.com>",
      to: "novikamps@mail.ru",
      subject,
      text: formatText(data),
    }),
  });
}

export async function notifyTelegram(data: NotifyPayload): Promise<void> {
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

- [ ] **Step 4: Run → PASS**

```bash
npx vitest run lib/__tests__/notifications.test.ts
```

Expected: 6 tests PASS.

- [ ] **Step 5: Run full suite**

```bash
npx vitest run
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add lib/notifications.ts lib/__tests__/notifications.test.ts
git commit -m "feat(p5b): notification helpers (Resend email + Telegram)"
```

---

### Task 4: DS form primitives

**Files:**
- Create: `components/ds/input.tsx`
- Create: `components/ds/textarea.tsx`
- Create: `components/ds/field.tsx`
- Create: `components/ds/form-status.tsx`
- Modify: `components/ds/index.ts`

**Interfaces:**
- Consumes: `InquiryResult` from `app/actions/submit-inquiry.ts` (Task 2) — `FormStatus` receives it as prop
- Produces: `Input`, `Textarea`, `Field`, `FormStatus` — used by P5c form components

- [ ] **Step 1: Create `components/ds/input.tsx`**

```tsx
interface InputProps {
  id: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
}

export function Input({ id, name, type = "text", placeholder, required, error }: InputProps) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      aria-invalid={error ? true : undefined}
      className="h-11 w-full rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 text-sm text-text placeholder:text-text-faint focus:border-border-strong focus:outline-none aria-invalid:border-accent"
    />
  );
}
```

- [ ] **Step 2: Create `components/ds/textarea.tsx`**

```tsx
interface TextareaProps {
  id: string;
  name: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  error?: boolean;
}

export function Textarea({ id, name, rows = 4, placeholder, required, error }: TextareaProps) {
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      placeholder={placeholder}
      required={required}
      aria-invalid={error ? true : undefined}
      className="w-full rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-border-strong focus:outline-none aria-invalid:border-accent"
    />
  );
}
```

- [ ] **Step 3: Create `components/ds/field.tsx`**

```tsx
import type { ReactNode } from "react";

interface FieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  error?: string;
}

export function Field({ label, htmlFor, children, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={htmlFor}
        className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint"
      >
        {label}
      </label>
      {children}
      {error ? (
        <p className="font-mono text-2xs text-accent">{error}</p>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Create `components/ds/form-status.tsx`**

```tsx
"use client";
import type { InquiryResult } from "@/app/actions/submit-inquiry";

export function FormStatus({ state }: { state: InquiryResult | null }) {
  if (!state) return null;
  if (state.ok) {
    return (
      <div
        role="status"
        className="rounded-[var(--radius-md)] border border-border bg-surface-2 px-4 py-3 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text"
      >
        Заявка отправлена. Мы свяжемся с вами в ближайшее время.
      </div>
    );
  }
  return (
    <p role="alert" className="font-mono text-2xs text-accent">
      {state.error}
    </p>
  );
}
```

- [ ] **Step 5: Add exports to `components/ds/index.ts`**

Append to the end of the existing file:

```ts
export { Input } from "./input";
export { Textarea } from "./textarea";
export { Field } from "./field";
export { FormStatus } from "./form-status";
```

- [ ] **Step 6: Build + full test suite**

```bash
npm run build && npx vitest run
```

Expected: build green; all tests pass; no TypeScript errors.

- [ ] **Step 7: Commit**

```bash
git add components/ds/input.tsx components/ds/textarea.tsx \
        components/ds/field.tsx components/ds/form-status.tsx \
        components/ds/index.ts
git commit -m "feat(p5b): DS form primitives (Input, Textarea, Field, FormStatus)"
```

---

## Env Vars Reference

Add to `.env.local` for local dev (never commit):

```
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role_jwt>
RESEND_API_KEY=re_<key>
TELEGRAM_BOT_TOKEN=<bot_token>
TELEGRAM_CHAT_ID=<chat_id>
```

Add the same five vars to Vercel dashboard → Project Settings → Environment Variables.

Resend: verify `novikamps.com` as sender domain in Resend dashboard (DNS TXT record).

---

## Self-Review

**Spec coverage:**
- §5.1 schema DDL + RLS → Task 1 ✓
- §5.2 server client singleton → Task 1 ✓
- §5.3 server action (zod, honeypot, rate-limit, insert, notifications) → Task 2 ✓
- §5.4 notifyEmail + notifyTelegram → Task 3 ✓
- §5.5 Input, Textarea, Field, FormStatus → Task 4 ✓
- §5.6 env vars reference → Env Vars section ✓
- §5.7 schema tests → Task 2 (8 cases) ✓; notifications tests → Task 3 (6 cases) ✓; existing tests unbroken → checked in Tasks 1, 3, 4 ✓

**Placeholder scan:** none.

**Type consistency:**
- `InquiryResult` defined in `submit-inquiry.ts`, imported by `FormStatus` ✓
- `NotifyPayload` defined in `notifications.ts`, used by `notifyEmail`/`notifyTelegram`/`formatText`/`formatTelegram` ✓
- `getSupabase()` defined in `lib/supabase/server.ts`, imported in `submit-inquiry.ts` ✓
- `inquirySchema` defined in `lib/inquiry/validate.ts`, imported in `submit-inquiry.ts` and tests ✓
- `InquiryInput` (zod inferred type) available from `validate.ts` for P5c if needed ✓
