-- SaaS billing tables
create table plans (
  id          uuid default gen_random_uuid() primary key,
  code        text not null unique,
  name        text not null,
  price_paise bigint not null,
  interval    text not null default 'monthly',
  features    jsonb not null default '{}',
  limits      jsonb not null default '{}',
  is_active   boolean not null default true,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);
grant select on plans to authenticated, anon;
grant insert, update, delete on plans to authenticated;

insert into plans (code, name, price_paise, features, limits) values
('mvp','Starter',99900,
  '{"qr_ordering":true,"kitchen_display":true,"digital_bill":true,"inventory":false,"ai_assistant":false,"whatsapp_marketing":false,"multi_branch":false}',
  '{"max_branches":1,"max_staff":10,"max_menu_items":100}'),
('operations','Operations',299900,
  '{"qr_ordering":true,"kitchen_display":true,"digital_bill":true,"inventory":true,"suppliers":true,"staff_management":true,"expenses":true,"ai_assistant":false,"whatsapp_marketing":false,"multi_branch":false}',
  '{"max_branches":2,"max_staff":50,"max_menu_items":500}'),
('ai','AI Pro',599900,
  '{"qr_ordering":true,"kitchen_display":true,"digital_bill":true,"inventory":true,"suppliers":true,"staff_management":true,"expenses":true,"ai_assistant":true,"ai_forecast":true,"menu_engineering":true,"anomaly_detection":true,"whatsapp_marketing":true,"loyalty":true,"multi_branch":false}',
  '{"max_branches":3,"max_staff":200,"max_menu_items":2000}'),
('enterprise','Enterprise',0,
  '{"qr_ordering":true,"kitchen_display":true,"digital_bill":true,"inventory":true,"suppliers":true,"staff_management":true,"expenses":true,"ai_assistant":true,"ai_forecast":true,"menu_engineering":true,"anomaly_detection":true,"whatsapp_marketing":true,"loyalty":true,"multi_branch":true,"franchise":true,"aggregator_integration":true}',
  '{"max_branches":-1,"max_staff":-1,"max_menu_items":-1}');

create table subscriptions (
  id                       uuid default gen_random_uuid() primary key,
  restaurant_id            uuid not null references restaurants(id) on delete cascade,
  plan_id                  uuid not null references plans(id),
  status                   sub_status not null default 'trialing',
  razorpay_subscription_id text unique,
  trial_end                timestamptz,
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  cancelled_at             timestamptz,
  created_at               timestamptz default now() not null,
  updated_at               timestamptz default now() not null
);
grant select, insert, update on subscriptions to authenticated;
create unique index on subscriptions(restaurant_id) where status not in ('cancelled');
create index on subscriptions(restaurant_id);

create table invoices (
  id                  uuid default gen_random_uuid() primary key,
  restaurant_id       uuid not null references restaurants(id),
  subscription_id     uuid references subscriptions(id),
  amount_paise        bigint not null,
  status              text not null default 'pending',
  razorpay_invoice_id text unique,
  issued_at           timestamptz default now() not null,
  paid_at             timestamptz,
  pdf_url             text,
  created_at          timestamptz default now() not null
);
grant select, insert, update on invoices to authenticated;
