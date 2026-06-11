-- RLS helper functions
create or replace function auth.restaurant_id() returns uuid language sql stable as $$
  select nullif(auth.jwt()->'app_metadata'->>'restaurant_id','')::uuid;
$$;

create or replace function auth.user_role() returns text language sql stable as $$
  select coalesce(auth.jwt()->'app_metadata'->>'role', 'customer');
$$;

create or replace function auth.is_super_admin() returns boolean language sql stable as $$
  select auth.user_role() = 'super_admin';
$$;
