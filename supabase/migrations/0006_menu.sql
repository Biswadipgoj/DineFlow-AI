-- Menu tables
create table menu_categories (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name          text not null,
  image_url     text,
  sort_order    int not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on menu_categories to authenticated;
grant select on menu_categories to anon;

create table menu_items (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  category_id   uuid not null references menu_categories(id) on delete cascade,
  name          text not null,
  description   text,
  price_paise   bigint not null,
  image_url     text,
  is_veg        boolean,
  hsn_sac       text,
  gst_rate      numeric(5,2) not null default 5,
  is_available  boolean not null default true,
  sort_order    int not null default 0,
  deleted_at    timestamptz,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on menu_items to authenticated;
grant select on menu_items to anon;

create table menu_item_translations (
  id           uuid default gen_random_uuid() primary key,
  menu_item_id uuid not null references menu_items(id) on delete cascade,
  lang         text not null,
  name         text not null,
  description  text,
  unique(menu_item_id, lang)
);
grant select, insert, update, delete on menu_item_translations to authenticated;
grant select on menu_item_translations to anon;

create table modifier_groups (
  id            uuid default gen_random_uuid() primary key,
  restaurant_id uuid not null references restaurants(id) on delete cascade,
  name          text not null,
  is_required   boolean not null default false,
  min_select    int not null default 0,
  max_select    int not null default 1,
  created_at    timestamptz default now() not null,
  updated_at    timestamptz default now() not null
);
grant select, insert, update, delete on modifier_groups to authenticated;
grant select on modifier_groups to anon;

create table modifier_options (
  id                uuid default gen_random_uuid() primary key,
  modifier_group_id uuid not null references modifier_groups(id) on delete cascade,
  name              text not null,
  price_delta_paise bigint not null default 0,
  is_available      boolean not null default true
);
grant select, insert, update, delete on modifier_options to authenticated;
grant select on modifier_options to anon;

create table menu_item_modifier_groups (
  menu_item_id      uuid not null references menu_items(id) on delete cascade,
  modifier_group_id uuid not null references modifier_groups(id) on delete cascade,
  primary key (menu_item_id, modifier_group_id)
);
grant select, insert, delete on menu_item_modifier_groups to authenticated;
grant select on menu_item_modifier_groups to anon;

create index on menu_items(restaurant_id, category_id) where deleted_at is null;
create index on menu_items(restaurant_id, is_available);
