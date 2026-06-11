-- Staff, attendance, expenses
create table employees (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  user_id       uuid references users(id),
  name          text not null,
  role          user_role not null,
  phone         text,
  salary_paise  bigint,
  salary_type   text not null default 'monthly',
  join_date     date,
  deleted_at    timestamptz,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on employees to authenticated;

create table shifts (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id),
  employee_id   uuid not null references employees(id) on delete cascade,
  start_at      timestamptz not null,
  end_at        timestamptz,
  role          user_role,
  notes         text,
  created_at    timestamptz default now() not null
);
grant select, insert, update on shifts to authenticated;

create table attendance (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id),
  employee_id   uuid not null references employees(id) on delete cascade,
  date          date not null,
  status        attendance_status not null,
  clock_in      timestamptz,
  clock_out     timestamptz,
  created_at    timestamptz default now() not null,
  unique(employee_id, date)
);
grant select, insert, update on attendance to authenticated;

create table expenses (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  category      expense_category not null,
  amount_paise  bigint not null,
  note          text,
  spent_on      date not null,
  receipt_url   text,
  created_by    uuid references users(id),
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on expenses to authenticated;
