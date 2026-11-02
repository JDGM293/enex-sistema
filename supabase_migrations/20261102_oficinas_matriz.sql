-- Oficinas: Matriz / Sucursal / Franquicia, matriz de la que depende, moneda y comisiones
alter table public.oficinas
  add column if not exists matriz_id text,
  add column if not exists moneda text,
  add column if not exists principal boolean not null default false,
  add column if not exists com_prepaid_pct numeric,
  add column if not exists com_entrega_monto numeric,
  add column if not exists com_entrega_por text;

-- Solo el Administrador crea matrices o cambia el tipo de una matriz
create or replace function public.oficinas_guarda() returns trigger language plpgsql security definer set search_path to 'public' as $$
begin
  if auth.uid() is null or public.rls_admin() then return new; end if;
  if tg_op = 'INSERT' and coalesce(new.tipo,'Matriz') = 'Matriz' then raise exception 'Solo el Administrador puede crear matrices'; end if;
  if tg_op = 'UPDATE' and (coalesce(new.tipo,'Matriz') = 'Matriz') is distinct from (coalesce(old.tipo,'Matriz') = 'Matriz') then
    raise exception 'Solo el Administrador puede cambiar el tipo de una matriz'; end if;
  return new;
end $$;
drop trigger if exists oficinas_guarda on public.oficinas;
create trigger oficinas_guarda before insert or update on public.oficinas for each row execute function public.oficinas_guarda();
