# Slice: Forms & inquiries — Supabase (Phase P5)

## Overview
The first backend phase. Until now the site is fully static; P5 introduces Supabase to capture
**inquiries/requests** (the real conversion path for a manufacturer whose products are quoted, not
all carted). This replaces the deferred `mailto:`/`tel:` stubs on product CTAs and powers the
contact form and the boutique custom-order requests.

This is the user's stated plan: *"заявки и бэкенд будем делать на supabase чуть позже."*

## Scope / deliverables
- **Supabase project** — table `inquiries` (id, created_at, kind, product_slug?, name, contact
  (phone/email), message, source_url, status, utm fields). RLS: insert-only from anon, read for
  service role / admin.
- **Server actions / route handlers** — a typed `submitInquiry` action (Next 16 server action)
  with zod validation, rate-limiting, honeypot/anti-spam, and an email/Telegram notification to
  the company (`novikamps@mail.ru` / phone owner).
- **Forms (client components)** built on `react-hook-form` + zod:
  - Contact form on `/kontakty`.
  - "Запросить" / quote form modal triggered from product CTAs (replaces cart stub where a product
    has no fixed online-buy path).
  - Boutique custom-order request (`/catalog/boutique`, `rqst-tubes`).
- **Replace stubs** — product `В корзину` / `Купить в 1 клик` either (a) open the quote modal, or
  (b) stay as cart if P6 commerce is chosen first. Decide per the commerce decision.
- **Success/error UX** — inline confirmation, RU copy, accessible.

## Design reference
Forms use DS primitives (`Button`, inputs to be added in P1/here), token styling, paper surface.
No new visual language — keep it on-brand (mono labels, red accent, square inputs).

## Data model (Supabase)
`inquiries`: see scope. Add `lib/supabase/` (server + browser clients) mirroring the house pattern
from NB-site (`lib/api.ts`, `lib/supabase-server.ts`). Keep secrets in env; `NEXT_PUBLIC_*` only
for the anon client.

## Components needed
Reuse DS. New: `Input`, `Textarea`, `Field`, `FormStatus` (DS form primitives — coordinate with
P1), `InquiryModal`, `ContactForm`, `QuoteForm`.

## Dependencies / sequencing
- Requires P1 form primitives (or build them here).
- `/kontakty` and `/catalog/boutique` static pages (P3) should exist first; P5 wires their forms.
- Infra mirrors NB-site conventions (self-hosted or managed Supabase — confirm with user at
  brainstorming; do NOT reuse NB-site's Supabase project).

## Acceptance criteria
- Inquiry submits → row in `inquiries` → notification fires; validation + spam protection work.
- No secret leakage to the client bundle; RLS verified (anon can only insert).
- Forms accessible, RU copy, error states covered; `npm run build` green.
- Product CTA stubs replaced or consciously deferred to P6.

## Run-recipe
1. `/brainstorming` — confirm Supabase hosting choice, notification channel, which CTAs become
   quote-requests vs cart (depends on P6 decision).
2. Analyze: NB-site `lib/` + edge-function patterns; current stub CTAs in
   `components/product/sections.tsx`.
3. `/writing-plans`.
4. Implement: schema migration → server action (TDD validation) → forms → wire CTAs.
5. `/requesting-code-review` + security review of the action (no silent failures, RLS).
