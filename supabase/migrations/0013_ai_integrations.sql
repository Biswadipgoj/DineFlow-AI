-- AI reports, forecasts, integrations
create table ai_reports (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  type          text not null,
  period_start  date,
  period_end    date,
  payload       jsonb not null,
  model_used    text,
  created_at    timestamptz default now() not null
);
grant select, insert on ai_reports to authenticated;

create table forecasts (
  id              uuid default gen_random_uuid() primary key,
  restaurant_id   uuid not null references restaurants(id) on delete cascade,
  target          text not null,
  forecast_date   date not null,
  predicted_value numeric(14,2) not null,
  confidence_low  numeric(14,2),
  confidence_high numeric(14,2),
  method          text,
  created_at      timestamptz default now() not null,
  unique(restaurant_id, target, forecast_date)
);
grant select, insert on forecasts to authenticated;

create table integrations (
  id             uuid default gen_random_uuid() primary key,
  restaurant_id  uuid not null references restaurants(id) on delete cascade,
  provider       text not null,
  status         text not null default 'disconnected',
  credentials    text,
  config         jsonb,
  last_synced_at timestamptz,
  created_at     timestamptz default now() not null,
  updated_at     timestamptz default now() not null,
  unique(restaurant_id, provider)
);
grant select, insert, update on integrations to authenticated;

create table external_orders (
  id              uuid default gen_random_uuid() primary key,
  restaurant_id   uuid not null references restaurants(id),
  provider        text not null,
  external_id     text not null,
  raw_payload     jsonb not null,
  mapped_order_id uuid references orders(id),
  status          text not null default 'pending',
  received_at     timestamptz default now() not null,
  unique(provider, external_id)
);
grant select, insert, update on external_orders to authenticated;

create table menu_item_mappings (
  id               uuid default gen_random_uuid() primary key,
  restaurant_id    uuid not null references restaurants(id),
  provider         text not null,
  external_item_id text not null,
  menu_item_id     uuid not null references menu_items(id),
  created_at       timestamptz default now() not null,
  unique(restaurant_id, provider, external_item_id)
);
grant select, insert, update, delete on menu_item_mappings to authenticated;

create table webhook_events (
  id              uuid default gen_random_uuid() primary key,
  source          text not null,
  event_type      text not null,
  idempotency_key text not null unique,
  payload         jsonb not null,
  processed       boolean not null default false,
  processed_at    timestamptz,
  error           text,
  created_at      timestamptz default now() not null
);

create table devices (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id),
  branch_id     uuid references branches(id),
  type          text not null,
  name          text not null,
  config        jsonb,
  is_active     boolean not null default true,
  created_at    timestamptz default now() not null
);
grant select, insert, update on devices to authenticated;

create index on ai_reports(restaurant_id, type, created_at desc);
create index on webhook_events(idempotency_key);
create index on webhook_events(processed, created_at) where processed = false;
create index on external_orders(restaurant_id, status);
