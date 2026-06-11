-- Inventory, recipes, suppliers
create table inventory_items (
  id                  uuid default gen_random_uuid() primary key,
  restaurant_id       uuid not null references restaurants(id) on delete cascade,
  name                text not null,
  unit                text not null,
  current_qty         numeric(12,3) not null default 0,
  reorder_level       numeric(12,3) not null default 0,
  expiry_date         date,
  cost_per_unit_paise bigint,
  deleted_at          timestamptz,
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);
grant select, insert, update, delete on inventory_items to authenticated;

create table recipes (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id),
  menu_item_id  uuid not null references menu_items(id) on delete cascade,
  created_at    timestamptz default now() not null,
  unique(menu_item_id)
);
grant select, insert, update, delete on recipes to authenticated;

create table recipe_ingredients (
  id                uuid default gen_random_uuid() primary key,
  recipe_id         uuid not null references recipes(id) on delete cascade,
  inventory_item_id uuid not null references inventory_items(id) on delete cascade,
  qty_per_serving   numeric(12,4) not null
);
grant select, insert, update, delete on recipe_ingredients to authenticated;

create table stock_movements (
  id                uuid default gen_random_uuid() primary key,
  restaurant_id     uuid not null references restaurants(id),
  inventory_item_id uuid not null references inventory_items(id),
  change_qty        numeric(12,3) not null,
  reason            text not null,
  ref_id            uuid,
  note              text,
  created_by        uuid references users(id),
  created_at        timestamptz default now() not null
);
grant select, insert on stock_movements to authenticated;

create table suppliers (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name          text not null,
  contact_name  text,
  phone         text,
  email         text,
  products      jsonb not null default '[]',
  deleted_at    timestamptz,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on suppliers to authenticated;

create table purchase_orders (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id),
  supplier_id   uuid not null references suppliers(id),
  status        po_status not null default 'draft',
  notes         text,
  total_paise   bigint not null default 0,
  ordered_at    timestamptz,
  received_at   timestamptz,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update on purchase_orders to authenticated;

create table purchase_order_items (
  id                uuid default gen_random_uuid() primary key,
  purchase_order_id uuid not null references purchase_orders(id) on delete cascade,
  inventory_item_id uuid not null references inventory_items(id),
  qty               numeric(12,3) not null,
  unit_price_paise  bigint not null,
  received_qty      numeric(12,3) not null default 0
);
grant select, insert, update on purchase_order_items to authenticated;

create index on inventory_items(restaurant_id) where deleted_at is null;
create index on stock_movements(restaurant_id, inventory_item_id, created_at desc);
