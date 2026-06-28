# Slice: Commerce — cart / checkout (Phase P6, optional)

## Overview
Optional, and **only if the business wants true online ordering**. Several products carry online
prices (D-8000 122 900 ₽, QM-400 199 900 ₽, etc.) and the design has cart affordances, but many
(tube amps, boutique) are custom/quote. P6 turns the catalog into a real shop; if not pursued, the
quote-request flow from P5 remains the conversion path.

Decide at brainstorming whether P6 happens at all — the user chose "phased, Supabase later", which
covers P5 inquiries; full commerce is a separate go/no-go.

## Scope / deliverables (if pursued)
- **Cart** — client cart store (persisted), add/remove/qty, mini-cart in `SiteHeader` (the cart
  icon is already there), `/korzina` page.
- **Checkout** — customer details, delivery, an order record in Supabase (`orders`, `order_items`).
- **Payments** — Russian PSP (ЮKassa / Тинькофф / СБП). Server-side order creation, webhook
  confirmation, idempotency. Mirror NB-site payment-route conventions (CORS, timeouts, error shape,
  webhook verification).
- **Accounts (optional)** — order history; or guest checkout only.
- **EAC/НДС/legal** — invoice, receipt (54-ФЗ), offer/privacy pages.

## Design reference
Cart/checkout use DS primitives + `ProductCard`. Keep the industrial aesthetic; price formatting
via `lib/format.ts`. Add cart/checkout components under `components/shop/`.

## Data model (Supabase)
`orders`(id, created_at, status, total_kop, customer, contact, delivery, payment_id, …),
`order_items`(order_id, product_slug, name, price_kop, qty). Store money in **kopecks** (house
convention). Product price source stays the MDX frontmatter (or a `products` table if a CMS lands).

## Components needed
Reuse DS + `ProductCard`. New: `CartProvider`, `MiniCart`, `CartPage`, `CheckoutForm`,
`PaymentResult`, `OrderSummary`.

## Dependencies
- P2 catalog complete (products to sell).
- P5 Supabase foundation (clients, server actions, env).
- A confirmed PSP + legal entity details.

## Acceptance criteria
- Add-to-cart → checkout → payment → order row → webhook marks paid (idempotent); no double-charge,
  no silent failure on webhook.
- Money in kopecks server-side; correct VAT/EAC handling; receipts issued.
- Security review passed (payment routes, webhook signature, RLS on orders).
- `npm run build` green.

## Run-recipe
1. `/brainstorming` — go/no-go; if go, choose PSP, accounts-vs-guest, delivery model.
2. Analyze NB-site payment/edge-function patterns; current CTA stubs.
3. `/writing-plans`.
4. Implement: cart (TDD store) → checkout → payment integration (TDD webhook) → order lifecycle.
5. `/requesting-code-review` + dedicated security review.
