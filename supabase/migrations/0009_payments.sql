-- Payments, bills, refunds
create table payments (
  id                  uuid default gen_random_uuid() primary key,
  restaurant_id       uuid not null references restaurants(id) on delete cascade,
  order_id            uuid references orders(id),
  session_id          uuid references table_sessions(id),
  method              payment_method not null,
  amount_paise        bigint not null,
  tip_paise           bigint not null default 0,
  status              payment_status not null default 'created',
  razorpay_order_id   text unique,
  razorpay_payment_id text unique,
  signature_verified  boolean not null default false,
  failure_reason      text,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);
grant select on payments to authenticated;

create table refunds (
  id                 uuid default gen_random_uuid() primary key,
  payment_id         uuid not null references payments(id),
  amount_paise       bigint not null,
  reason             text,
  status             text not null default 'pending',
  razorpay_refund_id text unique,
  created_by         uuid references users(id),
  created_at         timestamptz default now() not null,
  updated_at         timestamptz default now() not null
);
grant select on refunds to authenticated;

create table bills (
  id                   uuid default gen_random_uuid() primary key,
  restaurant_id        uuid not null references restaurants(id),
  session_id           uuid references table_sessions(id),
  order_id             uuid references orders(id),
  invoice_number       text not null,
  subtotal_paise       bigint not null,
  discount_paise       bigint not null default 0,
  cgst_paise           bigint not null default 0,
  sgst_paise           bigint not null default 0,
  igst_paise           bigint not null default 0,
  service_charge_paise bigint not null default 0,
  total_paise          bigint not null,
  pdf_url              text,
  issued_at            timestamptz default now() not null,
  created_at           timestamptz default now() not null
);
grant select on bills to authenticated;
grant insert on bills to authenticated;

create table bill_splits (
  id           uuid default gen_random_uuid() primary key,
  bill_id      uuid not null references bills(id) on delete cascade,
  label        text not null,
  amount_paise bigint not null,
  paid         boolean not null default false,
  payment_id   uuid references payments(id)
);
grant select, insert, update on bill_splits to authenticated;

create index on payments(restaurant_id, created_at desc);
create index on payments(order_id);
create index on payments(razorpay_order_id);
create index on bills(restaurant_id, issued_at desc);
