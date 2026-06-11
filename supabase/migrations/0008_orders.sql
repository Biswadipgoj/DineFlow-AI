-- Orders and KOTs
create table orders (
  id                   uuid default gen_random_uuid() primary key,
  restaurant_id        uuid not null references restaurants(id) on delete cascade,
  branch_id            uuid not null references branches(id),
  session_id           uuid references table_sessions(id),
  order_number         text not null,
  channel              channel_type not null default 'dine_in',
  order_type           order_type not null default 'dine_in',
  status               order_status not null default 'open',
  customer_id          uuid references users(id),
  waiter_id            uuid references users(id),
  subtotal_paise       bigint not null default 0,
  discount_paise       bigint not null default 0,
  tax_paise            bigint not null default 0,
  service_charge_paise bigint not null default 0,
  total_paise          bigint not null default 0,
  notes                text,
  external_ref         text,
  placed_at            timestamptz,
  created_at           timestamptz default now() not null,
  updated_at           timestamptz default now() not null
);
grant select, insert, update on orders to authenticated;

create table order_items (
  id               uuid default gen_random_uuid() primary key,
  order_id         uuid not null references orders(id) on delete cascade,
  menu_item_id     uuid references menu_items(id) on delete set null,
  name_snapshot    text not null,
  unit_price_paise bigint not null,
  qty              int not null default 1,
  modifiers        jsonb not null default '[]',
  item_total_paise bigint not null,
  gst_rate         numeric(5,2) not null default 5,
  notes            text,
  status           item_status not null default 'queued',
  created_at       timestamptz default now() not null,
  updated_at       timestamptz default now() not null
);
grant select, insert, update on order_items to authenticated;

create table order_status_history (
  id          uuid default gen_random_uuid() primary key,
  order_id    uuid not null references orders(id) on delete cascade,
  from_status order_status,
  to_status   order_status not null,
  changed_by  uuid references users(id),
  note        text,
  changed_at  timestamptz default now() not null
);
grant select, insert on order_status_history to authenticated;

create table kots (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  order_id      uuid not null references orders(id) on delete cascade,
  kot_number    int not null,
  station       text,
  status        kot_status not null default 'pending',
  printed_at    timestamptz,
  created_at    timestamptz default now() not null
);
grant select, insert, update on kots to authenticated;

create index on orders(restaurant_id, status, created_at desc);
create index on orders(session_id);
create index on orders(restaurant_id, channel);
create index on order_items(order_id);
create index on order_items(order_id, status);
create index on kots(order_id);
create index on kots(restaurant_id, created_at desc);
