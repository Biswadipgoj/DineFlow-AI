-- Custom JWT claims hook
create or replace function public.custom_jwt_claims(event jsonb)
returns jsonb language plpgsql as $$
declare
  uid uuid := (event->>'user_id')::uuid;
  mem record;
begin
  select m.role, m.restaurant_id, m.branch_id, r.org_id
  into mem
  from memberships m
  join restaurants r on r.id = m.restaurant_id
  where m.user_id = uid and m.is_active = true
  order by m.created_at asc limit 1;

  if not found then
    select default_role as role, null as restaurant_id, null as branch_id, null as org_id
    into mem from users where id = uid;
  end if;

  return jsonb_set(event, '{claims,app_metadata}', jsonb_build_object(
    'role',          coalesce(mem.role::text, 'customer'),
    'restaurant_id', mem.restaurant_id,
    'branch_id',     mem.branch_id,
    'org_id',        mem.org_id
  ));
end;
$$;
