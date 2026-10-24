-- Cuentas de acceso con Supabase Auth (ya aplicada en producción)
alter table public.clientes add column if not exists auth_id uuid unique;

create or replace function public.resolver_login(p text)
returns text language sql stable security definer set search_path = public, auth as $$
  select u.email from public.clientes c join auth.users u on u.id = c.auth_id
   where coalesce(c.activo, true)
     and (lower(nullif(c.email,'')) = lower(trim(p)) or lower(nullif(c.login,'')) = lower(trim(p)))
   limit 1;
$$;
revoke all on function public.resolver_login(text) from public;
grant execute on function public.resolver_login(text) to anon, authenticated;

create or replace function public.es_cuenta_enex()
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.clientes where auth_id = auth.uid() and coalesce(activo, true));
$$;
grant execute on function public.es_cuenta_enex() to anon, authenticated;
-- Las cuentas existentes se migraron a auth.users con su misma contraseña (cifrada con bcrypt).
