-- Rendimiento de la seguridad por filas: lo que depende solo del usuario conectado
-- se calcula una vez por petición (caché de la transacción) y no una vez por fila.
create index if not exists clientes_auth_id_idx on public.clientes(auth_id);

create or replace function public.rls_cache_get(k text) returns text
language sql stable set search_path to 'public' as $$
  select case when split_part(coalesce(current_setting('enex.'||k, true),''),'|',1) = coalesce(auth.uid()::text,'-')
              then substr(current_setting('enex.'||k, true), length(coalesce(auth.uid()::text,'-'))+2) end;
$$;
create or replace function public.rls_cache_set(k text, v text) returns text
language sql volatile set search_path to 'public' as $$
  select set_config('enex.'||k, coalesce(auth.uid()::text,'-')||'|'||coalesce(v,''), true);
$$;

create or replace function public.rls_yo() returns public.clientes
language plpgsql stable security definer set search_path to 'public' as $$
declare c text := public.rls_cache_get('yo'); r public.clientes;
begin
  if c is not null then
    if c = '' then return r; end if;
    return jsonb_populate_record(null::public.clientes, c::jsonb);
  end if;
  select * into r from public.clientes where auth_id = auth.uid() and coalesce(activo,true) limit 1;
  perform public.rls_cache_set('yo', case when r.id is null then '' else to_jsonb(r)::text end);
  return r;
end $$;

create or replace function public.rls_interno() returns boolean
language plpgsql stable security definer set search_path to 'public' as $$
declare c text := public.rls_cache_get('int'); u public.clientes; v boolean;
begin
  if c is not null then return c = 't'; end if;
  u := public.rls_yo();
  v := u.id is not null and (u.rol not in ('E','E1','F','G','I') or public.rls_tiene('todas_sucursales'));
  perform public.rls_cache_set('int', case when v then 't' else 'f' end);
  return v;
end $$;

create or replace function public.rls_ofi_efectiva() returns text
language plpgsql stable security definer set search_path to 'public' as $$
declare c text := public.rls_cache_get('ofi'); u public.clientes; v text;
begin
  if c is not null then return nullif(c,''); end if;
  u := public.rls_yo();
  v := case when u.rol <> 'A' and coalesce(u.oficina_id,'') <> '' then u.oficina_id else nullif(u.matriz_trabajo,'') end;
  perform public.rls_cache_set('ofi', coalesce(v,''));
  return v;
end $$;

create or replace function public.rls_mis_oficinas() returns text[]
language plpgsql stable security definer set search_path to 'public' as $$
declare c text := public.rls_cache_get('mis'); v text[];
begin
  if c is not null then return c::text[]; end if;
  with yo as (select o.* from public.oficinas o where o.id = public.rls_ofi_efectiva()),
       mat as (select case when coalesce(tipo,'Matriz') = 'Matriz' then id else matriz_id end as id from yo)
  select coalesce(array_agg(distinct x), array[]::text[]) into v from (
    select id as x from mat where id is not null
    union select o.id from public.oficinas o, mat where o.matriz_id = mat.id
    union select id from yo) t where x is not null;
  perform public.rls_cache_set('mis', v::text);
  return v;
end $$;

create or replace function public.rls_mios() returns text[]
language plpgsql stable security definer set search_path to 'public' as $$
declare c text := public.rls_cache_get('mios'); u public.clientes; v text[];
begin
  if c is not null then return c::text[]; end if;
  u := public.rls_yo();
  v := array_remove(array[u.id, nullif(u.agente_id,''), nullif(u.oficina_id,'')], null);
  perform public.rls_cache_set('mios', v::text);
  return v;
end $$;

create or replace function public.rls_total() returns boolean
language sql stable security definer set search_path to 'public' as $$
  select public.rls_interno() and public.rls_ofi_efectiva() is null;
$$;
