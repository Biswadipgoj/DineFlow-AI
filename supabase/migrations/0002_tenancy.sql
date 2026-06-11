-- Platform / tenancy tables
create table organizations (
  id         uuid default gen_random_uuid() primary key,
  name       text not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);
grant select, insert, update, delete on organizations to authenticated;

create table restaurants (
  id          uuid default gen_random_uuid() primary key,
  org_id      uuid not null references organizations(id) on delete cascade,
  name        text not null,
  slug        text not null unique,
  gstin       text,
  fssai_no    text,
  address     text,
  city        text,
  state       text,
  pincode     text,
  phone       text,
  email       text,
  logo_url    text,
  currency    text not null default 'INR',
  timezone    text not null default 'Asia/Kolkata',
  is_active   boolean not null default true,
  created_at  timestamptz default now() not null,
  updated_at  timestamptz default now() not null
);
grant select, insert, update, delete on restaurants to authenticated;

create table branches (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name          text not null,
  address       text,
  phone         text,
  is_active     boolean not null default true,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on branches to authenticated;

create table users (
  id           uuid primary key references auth.users(id) on delete cascade,
  full_name    text,
  phone        text,
  email        text,
  default_role user_role not null default 'customer',
  created_at   timestamptz default now() not null,
  updated_at   timestamptz default now() not null
);
grant select, insert, update on users to authenticated;

create table memberships (
  id            uuid default gen_random_uuid() primary key,
  user_id       uuid not null references users(id) on delete cascade,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id     uuid references branches(id) on delete set null,
  role          user_role not null,
  is_active     boolean not null default true,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null,
  unique(user_id, restaurant_id)
);
grant select, insert, update, delete on memberships to authenticated;

create table settings (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  key           text not null,
  value         jsonb not null,
  updated_at    timestamptz default now() not null,
  unique(restaurant_id, key)
);
grant select, insert, update, delete on settings to authenticated;

create table audit_logs (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid references restaurants(id) on delete set null,
  actor_user_id uuid references users(id) on delete set null,
  action        text not null,
  entity        text not null,
  entity_id     uuid,
  before_data   jsonb,
  after_data    jsonb,
  ip_address    text,
  created_at    timestamptz default now() not null
);
grant select, insert on audit_logs to authenticated;

create index on memberships(user_id);
create index on memberships(restaurant_id);
create index on audit_logs(restaurant_id, created_at desc);
