-- Dining tables and sessions
create table dining_tables (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id     uuid not null references branches(id) on delete cascade,
  label         text not null,
  capacity      int,
  area          text,
  qr_code       text unique,
  is_active     boolean not null default true,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on dining_tables to authenticated;
grant select on dining_tables to anon;

create table table_sessions (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  branch_id     uuid not null references branches(id),
  table_id      uuid not null references dining_tables(id),
  status        session_status not null default 'open',
  guest_count   int,
  opened_by     uuid references users(id),
  opened_at     timestamptz default now() not null,
  closed_at     timestamptz,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update on table_sessions to authenticated;

create unique index one_open_session_per_table on table_sessions(table_id)
  where status = 'open';
create index on table_sessions(restaurant_id, status);
create index on dining_tables(restaurant_id, branch_id);
