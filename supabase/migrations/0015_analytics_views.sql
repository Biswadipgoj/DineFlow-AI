-- Analytics views and stored functions

create or replace view daily_revenue as
select
  restaurant_id,
  date_trunc('day', created_at at time zone 'Asia/Kolkata') as day,
  count(*) filter (where status = 'paid') as paid_orders,
  sum(total_paise) filter (where status = 'paid') as revenue_paise,
  avg(total_paise) filter (where status = 'paid') as avg_ticket_paise,
  count(*) filter (where status = 'cancelled') as cancelled_orders
from orders
group by 1, 2;

create or replace view top_menu_items as
select
  oi.menu_item_id, oi.name_snapshot, o.restaurant_id,
  count(*) as order_count,
  sum(oi.qty) as total_qty,
  sum(oi.item_total_paise) as total_revenue_paise
from order_items oi
join orders o on o.id = oi.order_id
where o.status = 'paid'
group by 1, 2, 3;

create or replace function get_restaurant_metrics(p_restaurant_id uuid, p_date date)
returns jsonb language plpgsql security definer as $$
declare result jsonb;
begin
  select jsonb_build_object(
    'today_revenue_paise',     coalesce((select sum(total_paise) from orders where restaurant_id=p_restaurant_id and status='paid' and placed_at::date=p_date), 0),
    'yesterday_revenue_paise', coalesce((select sum(total_paise) from orders where restaurant_id=p_restaurant_id and status='paid' and placed_at::date=p_date-1), 0),
    'week_revenue_paise',      coalesce((select sum(total_paise) from orders where restaurant_id=p_restaurant_id and status='paid' and placed_at::date>=p_date-7), 0),
    'today_orders',            coalesce((select count(*) from orders where restaurant_id=p_restaurant_id and status='paid' and placed_at::date=p_date), 0),
    'avg_ticket_paise',        coalesce((select avg(total_paise) from orders where restaurant_id=p_restaurant_id and status='paid' and placed_at::date=p_date), 0),
    'top_3_items',             coalesce((select jsonb_agg(jsonb_build_object('name',name_snapshot,'qty',total_qty)) from top_menu_items where restaurant_id=p_restaurant_id order by total_qty desc limit 3), '[]'::jsonb),
    'low_stock_count',         coalesce((select count(*) from inventory_items where restaurant_id=p_restaurant_id and current_qty <= reorder_level and deleted_at is null), 0),
    'open_orders',             coalesce((select count(*) from orders where restaurant_id=p_restaurant_id and status not in ('paid','cancelled')), 0)
  ) into result;
  return result;
end;
$$;

create or replace function deduct_inventory_for_order(p_order_id uuid)
returns void language plpgsql security definer as $$
declare
  item record;
  ingredient record;
begin
  for item in select oi.menu_item_id, oi.qty, o.restaurant_id
    from order_items oi join orders o on o.id = oi.order_id
    where oi.order_id = p_order_id
  loop
    for ingredient in
      select ri.inventory_item_id, ri.qty_per_serving * item.qty as total_qty
      from recipes r join recipe_ingredients ri on ri.recipe_id = r.id
      where r.menu_item_id = item.menu_item_id
    loop
      update inventory_items
        set current_qty = current_qty - ingredient.total_qty, updated_at = now()
        where id = ingredient.inventory_item_id;
      insert into stock_movements (restaurant_id, inventory_item_id, change_qty, reason, ref_id)
        values (item.restaurant_id, ingredient.inventory_item_id, -ingredient.total_qty, 'sale', p_order_id);
    end loop;
  end loop;
end;
$$;
