-- Customers and marketing
create table customers (
  id                uuid default gen_random_uuid() primary key,
  restaurant_id     uuid not null references restaurants(id) on delete cascade,
  name              text,
  phone_encrypted   text,
  phone_hash        text,
  email             text,
  total_orders      int not null default 0,
  total_spent_paise bigint not null default 0,
  last_order_at     timestamptz,
  consent_marketing boolean not null default false,
  consent_given_at  timestamptz,
  deleted_at        timestamptz,
  created_at        timestamptz default now() not null,
  updated_at        timestamptz default now() not null
);
grant select, insert, update on customers to authenticated;

create table loyalty_points (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id),
  customer_id   uuid not null references customers(id) on delete cascade,
  balance       int not null default 0,
  ledger        jsonb not null default '[]',
  updated_at    timestamptz default now() not null,
  unique(restaurant_id, customer_id)
);
grant select, insert, update on loyalty_points to authenticated;

create table coupons (
  id              uuid default gen_random_uuid() primary key,
  restaurant_id   uuid not null references restaurants(id),
  code            text not null,
  type            text not null,
  value_paise     bigint,
  value_percent   numeric(5,2),
  min_order_paise bigint not null default 0,
  max_uses        int,
  used_count      int not null default 0,
  valid_from      timestamptz,
  valid_to        timestamptz,
  is_active       boolean not null default true,
  created_at      timestamptz default now() not null,
  unique(restaurant_id, code)
);
grant select, insert, update on coupons to authenticated;
grant select on coupons to anon;

create table marketing_campaigns (
  id               uuid default gen_random_uuid() primary key,
  restaurant_id    uuid not null references restaurants(id),
  name             text not null,
  channel          text not null default 'whatsapp',
  template_name    text not null,
  template_params  jsonb,
  audience_filter  jsonb,
  scheduled_at     timestamptz,
  sent_at          timestamptz,
  status           text not null default 'draft',
  sent_count       int not null default 0,
  total_cost_paise bigint not null default 0,
  created_at       timestamptz default now() not null,
  updated_at       timestamptz default now() not null
);
grant select, insert, update on marketing_campaigns to authenticated;

create table message_logs (
  id              uuid default gen_random_uuid() primary key,
  restaurant_id   uuid not null references restaurants(id),
  customer_id     uuid references customers(id),
  campaign_id     uuid references marketing_campaigns(id),
  channel         text not null,
  template_name   text,
  status          text not null,
  provider_msg_id text,
  cost_paise      bigint not null default 0,
  created_at      timestamptz default now() not null
);
grant select, insert on message_logs to authenticated;

create index on customers(restaurant_id, phone_hash);
create index on customers(restaurant_id, consent_marketing) where deleted_at is null;
