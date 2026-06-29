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
