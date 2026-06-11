-- Row Level Security policies for all tables

-- organizations
alter table organizations enable row level security;
create policy "super_admin_all" on organizations for all using (auth.is_super_admin());
create policy "member_read_own" on organizations for select
  using (id in (select org_id from restaurants where id = auth.restaurant_id()));

-- restaurants
alter table restaurants enable row level security;
create policy "tenant_read_own" on restaurants for select
  using (id = auth.restaurant_id() or auth.is_super_admin());
create policy "super_admin_write" on restaurants for insert
  with check (auth.is_super_admin());
create policy "super_admin_update" on restaurants for update
  using (auth.is_super_admin());
create policy "super_admin_delete" on restaurants for delete
  using (auth.is_super_admin());

-- branches
alter table branches enable row level security;
create policy "tenant_all" on branches for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id() or auth.is_super_admin());

-- settings
alter table settings enable row level security;
create policy "tenant_all" on settings for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- users
alter table users enable row level security;
create policy "read_own" on users for select using (id = auth.uid() or auth.is_super_admin());
create policy "update_own" on users for update using (id = auth.uid());
create policy "insert_own" on users for insert with check (id = auth.uid());

-- memberships
alter table memberships enable row level security;
create policy "tenant_read" on memberships for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());
create policy "owner_write" on memberships for insert
  with check (restaurant_id = auth.restaurant_id() and auth.user_role() in ('owner','manager') or auth.is_super_admin());
create policy "owner_update" on memberships for update
  using (restaurant_id = auth.restaurant_id() and auth.user_role() in ('owner','manager') or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());
create policy "owner_delete" on memberships for delete
  using (restaurant_id = auth.restaurant_id() and auth.user_role() in ('owner','manager') or auth.is_super_admin());

-- plans
alter table plans enable row level security;
create policy "anyone_read_active" on plans for select using (is_active = true or auth.is_super_admin());
create policy "super_admin_insert" on plans for insert with check (auth.is_super_admin());
create policy "super_admin_update" on plans for update using (auth.is_super_admin());
create policy "super_admin_delete" on plans for delete using (auth.is_super_admin());

-- subscriptions
alter table subscriptions enable row level security;
create policy "owner_read_own" on subscriptions for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());
create policy "super_admin_insert" on subscriptions for insert with check (auth.is_super_admin());
create policy "super_admin_update" on subscriptions for update using (auth.is_super_admin());
create policy "super_admin_delete" on subscriptions for delete using (auth.is_super_admin());

-- invoices
alter table invoices enable row level security;
create policy "owner_read_own" on invoices for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());

-- menu_categories
alter table menu_categories enable row level security;
create policy "tenant_staff_all" on menu_categories for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());
create policy "anon_read" on menu_categories for select using (is_active = true);

-- menu_items
alter table menu_items enable row level security;
create policy "tenant_staff_all" on menu_items for all
  using (restaurant_id = auth.restaurant_id() and auth.user_role() <> 'customer' or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());
create policy "customer_read_available" on menu_items for select
  using (is_available = true and deleted_at is null);

-- menu_item_translations
alter table menu_item_translations enable row level security;
create policy "tenant_via_item" on menu_item_translations for all
  using (exists (select 1 from menu_items mi where mi.id = menu_item_translations.menu_item_id
    and (mi.restaurant_id = auth.restaurant_id() or auth.is_super_admin())));
create policy "anon_read_translations" on menu_item_translations for select using (true);

-- modifier_groups
alter table modifier_groups enable row level security;
create policy "tenant_all" on modifier_groups for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());
create policy "anon_read_modifiers" on modifier_groups for select using (true);

-- modifier_options
alter table modifier_options enable row level security;
create policy "tenant_via_group" on modifier_options for all
  using (exists (select 1 from modifier_groups mg where mg.id = modifier_options.modifier_group_id
    and (mg.restaurant_id = auth.restaurant_id() or auth.is_super_admin())));
create policy "anon_read_options" on modifier_options for select using (true);

-- menu_item_modifier_groups
alter table menu_item_modifier_groups enable row level security;
create policy "tenant_via_item2" on menu_item_modifier_groups for all
  using (exists (select 1 from menu_items mi where mi.id = menu_item_modifier_groups.menu_item_id
    and (mi.restaurant_id = auth.restaurant_id() or auth.is_super_admin())));
create policy "anon_read_mimg" on menu_item_modifier_groups for select using (true);

-- dining_tables
alter table dining_tables enable row level security;
create policy "tenant_all" on dining_tables for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());
create policy "anon_read" on dining_tables for select using (is_active = true);

-- table_sessions
alter table table_sessions enable row level security;
create policy "tenant_all" on table_sessions for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- orders
alter table orders enable row level security;
create policy "staff_all" on orders for all
  using (restaurant_id = auth.restaurant_id() and auth.user_role() <> 'customer' or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id() and auth.user_role() <> 'customer');
create policy "customer_read_own" on orders for select
  using (restaurant_id = auth.restaurant_id() and customer_id = auth.uid());
create policy "customer_insert" on orders for insert
  with check (restaurant_id = auth.restaurant_id() and auth.user_role() = 'customer');

-- order_items
alter table order_items enable row level security;
create policy "tenant_via_order" on order_items for all
  using (exists (
    select 1 from orders o where o.id = order_items.order_id
      and (o.restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  ));

-- order_status_history
alter table order_status_history enable row level security;
create policy "tenant_all" on order_status_history for all
  using (exists (select 1 from orders o where o.id = order_status_history.order_id
    and (o.restaurant_id = auth.restaurant_id() or auth.is_super_admin())));

-- kots
alter table kots enable row level security;
create policy "tenant_all" on kots for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- payments
alter table payments enable row level security;
create policy "staff_read" on payments for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());

-- refunds
alter table refunds enable row level security;
create policy "staff_read" on refunds for select
  using (exists (select 1 from payments p where p.id = refunds.payment_id
    and (p.restaurant_id = auth.restaurant_id() or auth.is_super_admin())));

-- bills
alter table bills enable row level security;
create policy "tenant_read" on bills for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());
create policy "tenant_insert" on bills for insert
  with check (restaurant_id = auth.restaurant_id());

-- bill_splits
alter table bill_splits enable row level security;
create policy "tenant_via_bill" on bill_splits for all
  using (exists (select 1 from bills b where b.id = bill_splits.bill_id
    and (b.restaurant_id = auth.restaurant_id() or auth.is_super_admin())));

-- inventory_items
alter table inventory_items enable row level security;
create policy "tenant_all" on inventory_items for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- recipes
alter table recipes enable row level security;
create policy "tenant_all" on recipes for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- recipe_ingredients
alter table recipe_ingredients enable row level security;
create policy "tenant_via_recipe" on recipe_ingredients for all
  using (exists (select 1 from recipes r where r.id = recipe_ingredients.recipe_id
    and (r.restaurant_id = auth.restaurant_id() or auth.is_super_admin())));

-- stock_movements
alter table stock_movements enable row level security;
create policy "tenant_all" on stock_movements for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- suppliers
alter table suppliers enable row level security;
create policy "tenant_all" on suppliers for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- purchase_orders
alter table purchase_orders enable row level security;
create policy "tenant_all" on purchase_orders for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- purchase_order_items
alter table purchase_order_items enable row level security;
create policy "tenant_via_po" on purchase_order_items for all
  using (exists (select 1 from purchase_orders po where po.id = purchase_order_items.purchase_order_id
    and (po.restaurant_id = auth.restaurant_id() or auth.is_super_admin())));

-- employees
alter table employees enable row level security;
create policy "tenant_all" on employees for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- shifts
alter table shifts enable row level security;
create policy "tenant_all" on shifts for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- attendance
alter table attendance enable row level security;
create policy "tenant_all" on attendance for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- expenses
alter table expenses enable row level security;
create policy "tenant_all" on expenses for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- customers
alter table customers enable row level security;
create policy "staff_only" on customers for all
  using (restaurant_id = auth.restaurant_id()
    and auth.user_role() in ('owner','manager','cashier')
    or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- loyalty_points
alter table loyalty_points enable row level security;
create policy "staff_only" on loyalty_points for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- coupons
alter table coupons enable row level security;
create policy "tenant_all" on coupons for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());
create policy "anon_read" on coupons for select using (is_active = true);

-- marketing_campaigns
alter table marketing_campaigns enable row level security;
create policy "tenant_all" on marketing_campaigns for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- message_logs
alter table message_logs enable row level security;
create policy "tenant_read" on message_logs for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());
create policy "tenant_insert" on message_logs for insert
  with check (restaurant_id = auth.restaurant_id());

-- ai_reports
alter table ai_reports enable row level security;
create policy "tenant_all" on ai_reports for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- forecasts
alter table forecasts enable row level security;
create policy "tenant_read" on forecasts for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());

-- integrations
alter table integrations enable row level security;
create policy "tenant_all" on integrations for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- external_orders
alter table external_orders enable row level security;
create policy "tenant_all" on external_orders for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- menu_item_mappings
alter table menu_item_mappings enable row level security;
create policy "tenant_all" on menu_item_mappings for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- webhook_events (service role only)
alter table webhook_events enable row level security;
create policy "super_admin_only" on webhook_events for all using (auth.is_super_admin());

-- devices
alter table devices enable row level security;
create policy "tenant_all" on devices for all
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin())
  with check (restaurant_id = auth.restaurant_id());

-- audit_logs
alter table audit_logs enable row level security;
create policy "tenant_read" on audit_logs for select
  using (restaurant_id = auth.restaurant_id() or auth.is_super_admin());
create policy "insert_always" on audit_logs for insert with check (true);
