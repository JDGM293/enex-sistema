-- Matriz de trabajo: el Administrador (y los internos sin oficina) eligen una matriz y todo el sistema
-- funciona como si fueran de ella. Vacío = todas.
alter table public.clientes add column if not exists matriz_trabajo text;

-- Oficina efectiva: la propia; si es Administrador o no tiene oficina, la matriz de trabajo elegida
create or replace function public.rls_ofi_efectiva() returns text language sql stable security definer set search_path to 'public' as $$
  select case when (public.rls_yo()).rol <> 'A' and coalesce((public.rls_yo()).oficina_id,'') <> '' then (public.rls_yo()).oficina_id
              else nullif((public.rls_yo()).matriz_trabajo,'') end;
$$;

create or replace function public.rls_total() returns boolean language sql stable security definer set search_path to 'public' as $$
  select public.rls_interno() and public.rls_ofi_efectiva() is null;
$$;

create or replace function public.rls_mis_oficinas() returns text[] language sql stable security definer set search_path to 'public' as $$
  with yo as (select o.* from public.oficinas o where o.id = public.rls_ofi_efectiva()),
       mat as (select case when coalesce(tipo,'Matriz') = 'Matriz' then id else matriz_id end as id from yo)
  select coalesce(array_agg(distinct x), array[]::text[]) from (
    select id as x from mat where id is not null
    union select o.id from public.oficinas o, mat where o.matriz_id = mat.id
    union select id from yo) t where x is not null;
$$;

-- Registro sin matriz (anterior a esto) o de una de mis oficinas
create or replace function public.rls_matriz_ok(m text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select public.rls_total() or (public.rls_interno() and (coalesce(m,'') = '' or m = any(public.rls_mis_oficinas())));
$$;

create or replace function public.set_matriz_trabajo(p text) returns void language plpgsql security definer set search_path to 'public' as $$
declare u public.clientes := public.rls_yo();
begin
  if u.id is null or not public.rls_interno() then raise exception 'No permitido'; end if;
  if u.rol <> 'A' and coalesce(u.oficina_id,'') <> '' then raise exception 'Tu usuario ya pertenece a una oficina'; end if;
  if coalesce(p,'') <> '' and not exists(select 1 from public.oficinas o where o.id = p and coalesce(o.tipo,'Matriz') = 'Matriz') then raise exception 'Matriz inválida'; end if;
  update public.clientes set matriz_trabajo = nullif(p,'') where id = u.id;
end $$;
revoke execute on function public.set_matriz_trabajo(text), public.rls_matriz_ok(text), public.rls_ofi_efectiva() from anon, public;
grant execute on function public.set_matriz_trabajo(text), public.rls_matriz_ok(text), public.rls_ofi_efectiva() to authenticated;

-- ── Recepción en puerta: cada escaneo queda en la oficina de quien escanea ──
alter table public.scan_log add column if not exists oficina_id text;
alter table public.oficinas add column if not exists recibe_puerta boolean not null default false;
create or replace function public.rls_puerta_ok(p_ofi text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select public.rls_matriz_ok(p_ofi)
    or ((public.rls_yo()).rol = 'G' and coalesce((public.rls_yo()).oficina_id,'') <> '' and (public.rls_yo()).oficina_id = p_ofi
        and exists(select 1 from public.oficinas o where o.id = p_ofi and o.recibe_puerta));
$$;
revoke execute on function public.rls_puerta_ok(text) from anon, public;
grant execute on function public.rls_puerta_ok(text) to authenticated;
drop policy if exists p_ver on public.scan_log;
drop policy if exists p_crear on public.scan_log;
drop policy if exists p_editar on public.scan_log;
create policy p_ver on public.scan_log for select to authenticated using (public.rls_puerta_ok(oficina_id));
create policy p_crear on public.scan_log for insert to authenticated with check (public.rls_puerta_ok(oficina_id));
create policy p_editar on public.scan_log for update to authenticated using (public.rls_puerta_ok(oficina_id));

-- ── Pre-alertas: van a la matriz del cliente ──
-- Los almacenes que reciben en puerta las ven todas para poder casar el tracking al llegar el paquete.
alter table public.prealertas add column if not exists matriz_id text;

-- ── Pick-up: lo atiende la matriz de la zona de la ciudad de recogida ──
alter table public.pickup add column if not exists pais text, add column if not exists ciudad text, add column if not exists matriz_id text;
drop policy if exists p_ver on public.pickup;
drop policy if exists p_crear on public.pickup;
drop policy if exists p_editar on public.pickup;
create policy p_ver on public.pickup for select to authenticated using (public.rls_matriz_ok(matriz_id) or (solicitante_id = (public.rls_yo()).id) or public.rls_cliente_id_ok(cliente_id));
create policy p_crear on public.pickup for insert to authenticated with check (public.rls_interno() or (solicitante_id = (public.rls_yo()).id) or public.rls_cliente_id_ok(cliente_id));
create policy p_editar on public.pickup for update to authenticated using (public.rls_matriz_ok(matriz_id) or (solicitante_id = (public.rls_yo()).id) or public.rls_cliente_id_ok(cliente_id));

-- ── Reempaque: el de los WR que veo ──
drop policy if exists p_ver on public.solicitudes_reempaque;
drop policy if exists p_editar on public.solicitudes_reempaque;
create policy p_ver on public.solicitudes_reempaque for select to authenticated using (public.rls_total() or public.rls_wr_ids_ok(wr_ids) or (solicitado_por = (public.rls_yo()).id) or public.rls_cliente_id_ok(cliente_id));
create policy p_editar on public.solicitudes_reempaque for update to authenticated using ((public.rls_interno() and (public.rls_total() or public.rls_wr_ids_ok(wr_ids))) or ((solicitado_por = (public.rls_yo()).id) and (status = 'pendiente')));

-- ── Tarifas: por matriz de salida ──
alter table public.tarifas add column if not exists matriz_id text;
drop policy if exists p_ver on public.tarifas;
drop policy if exists p_crear on public.tarifas;
drop policy if exists p_editar on public.tarifas;
create policy p_ver on public.tarifas for select to authenticated using ((public.rls_interno() and public.rls_matriz_ok(matriz_id)) or (not public.rls_interno() and (public.rls_yo()).id is not null and ((coalesce(aplica_tipo,'') = '') or (aplica_id = any (public.rls_mios())))));
create policy p_crear on public.tarifas for insert to authenticated with check (public.rls_interno() and public.rls_matriz_ok(matriz_id));
create policy p_editar on public.tarifas for update to authenticated using (public.rls_interno() and public.rls_matriz_ok(matriz_id));

-- ── Datos ──
-- Tarifas existentes: matriz de salida según su origen
update public.tarifas set matriz_id = (select id from public.oficinas where codigo = 'US-01') where matriz_id is null and pais_orig in ('USA','01');
update public.tarifas set matriz_id = (select id from public.oficinas where codigo = 'ES-01') where matriz_id is null and pais_orig in ('ESPAÑA','ESPANA','34');
-- Clientes directos de prueba repartidos en matrices y sucursales (sucursal de entrega)
with m(cid, mat, ofi) as (values
  ('C-001','US-01','US-01'),('C-005','US-01','US-06'),('C-006','ES-01','ES-01'),('C-009','ES-01','ES-06'),
  ('C-010','VE-01','VE-01'),('C-012','VE-01','VE-06'),('C-013','US-01','US-01'),('C-014','US-01','US-06'),
  ('C-015','ES-01','ES-01'),('C-016','ES-01','ES-06'),('C-019','VE-01','VE-01'))
update public.clientes c set cliente_tipo = 'matriz',
  matriz_id = (select id from public.oficinas where codigo = m.mat),
  oficina_id = (select id from public.oficinas where codigo = m.ofi)
from m where c.id = m.cid;
-- Pre-alertas existentes: la matriz de su cliente
update public.prealertas p set matriz_id = c.matriz_id from public.clientes c where p.cliente_id = c.id and p.matriz_id is null;
