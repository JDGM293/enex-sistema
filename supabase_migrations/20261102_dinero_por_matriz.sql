-- Numeración de documentos por país (Factura F, Nota de crédito NC, Liquidación L, Nota de comisión CM, Recibo RC, Proforma PF)
create table if not exists public.doc_secuencias (pais text not null, tipo text not null, ultimo bigint not null default 0, primary key (pais, tipo));
alter table public.doc_secuencias enable row level security;

create or replace function public.sig_documento(p_pais text, p_tipo text) returns bigint language plpgsql security definer set search_path to 'public' as $$
declare n bigint;
begin
  if (public.rls_yo()).id is null then raise exception 'No permitido'; end if;
  if coalesce(p_pais,'') !~ '^[A-Z]{2,3}$' or p_tipo not in ('F','NC','L','CM','RC','PF') then raise exception 'Documento inválido'; end if;
  insert into public.doc_secuencias(pais, tipo, ultimo) values (p_pais, p_tipo, 1)
    on conflict (pais, tipo) do update set ultimo = public.doc_secuencias.ultimo + 1
    returning ultimo into n;
  return n;
end $$;
revoke execute on function public.sig_documento(text,text) from anon, public;
grant execute on function public.sig_documento(text,text) to authenticated;

-- Matriz que emite / oficina donde se cobra
alter table public.facturas add column if not exists matriz_id text;
alter table public.pagos add column if not exists matriz_id text, add column if not exists oficina_id text;

-- "Mis facturas" se activa por agente, oficina o autónomo (solo el Administrador)
alter table public.agentes add column if not exists fp_activo boolean not null default false;
alter table public.oficinas add column if not exists fp_activo boolean not null default false;
alter table public.clientes add column if not exists fp_activo boolean not null default false;

-- Dinero: cada interno ve lo de su matriz (y lo que no tiene matriz, de antes)
create or replace function public.rls_dinero_ok(p_matriz text, p_oficina text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select public.rls_total() or (public.rls_interno() and (p_matriz is null or p_matriz = any(public.rls_mis_oficinas()) or coalesce(p_oficina,'') = any(public.rls_mis_oficinas())));
$$;
revoke execute on function public.rls_dinero_ok(text,text) from anon, public;
grant execute on function public.rls_dinero_ok(text,text) to authenticated;

create or replace function public.rls_factura_ok(fid text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select coalesce((select public.rls_dinero_ok(f.matriz_id, null) or public.rls_receptor_ok(f.receptor_id) or public.rls_wr_ids_ok(f.wr_ids)
    from public.facturas f where f.id = fid limit 1), false);
$$;

drop policy if exists p_ver on public.facturas;
drop policy if exists p_crear on public.facturas;
drop policy if exists p_editar on public.facturas;
create policy p_ver on public.facturas for select to authenticated using (public.rls_dinero_ok(matriz_id, null) or public.rls_receptor_ok(receptor_id) or public.rls_wr_ids_ok(wr_ids));
create policy p_crear on public.facturas for insert to authenticated with check (public.rls_dinero_ok(matriz_id, null) or public.rls_receptor_ok(receptor_id) or public.rls_wr_ids_ok(wr_ids));
create policy p_editar on public.facturas for update to authenticated using (public.rls_dinero_ok(matriz_id, null) or public.rls_receptor_ok(receptor_id) or public.rls_wr_ids_ok(wr_ids));

drop policy if exists p_ver on public.pagos;
drop policy if exists p_crear on public.pagos;
drop policy if exists p_editar on public.pagos;
create policy p_ver on public.pagos for select to authenticated using (public.rls_dinero_ok(matriz_id, oficina_id) or public.rls_receptor_ok(pagador_id) or public.rls_factura_ok(factura_id));
create policy p_crear on public.pagos for insert to authenticated with check (public.rls_dinero_ok(matriz_id, oficina_id) or public.rls_receptor_ok(pagador_id) or public.rls_factura_ok(factura_id));
create policy p_editar on public.pagos for update to authenticated using (public.rls_dinero_ok(matriz_id, oficina_id) or public.rls_receptor_ok(pagador_id) or public.rls_factura_ok(factura_id));

-- Facturas propias: solo si el Administrador activó "Mis facturas" para ese emisor
create or replace function public.rls_fp_activo(et text, eid text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select case et
    when 'agente'   then exists(select 1 from public.agentes a where a.id = eid and a.fp_activo)
    when 'oficina'  then exists(select 1 from public.oficinas o where o.id = eid and o.fp_activo)
    when 'autonomo' then exists(select 1 from public.clientes c where c.id = eid and c.fp_activo)
    else false end;
$$;
revoke execute on function public.rls_fp_activo(text,text) from anon, public;
grant execute on function public.rls_fp_activo(text,text) to authenticated;
drop policy if exists p_crear on public.facturas_propias;
drop policy if exists p_editar on public.facturas_propias;
create policy p_crear on public.facturas_propias for insert to authenticated with check (public.rls_fp_ok(emisor_tipo, emisor_id) and (public.rls_interno() or public.rls_fp_activo(emisor_tipo, emisor_id)) and (public.rls_yo()).rol not in ('E1'));
create policy p_editar on public.facturas_propias for update to authenticated using (public.rls_fp_ok(emisor_tipo, emisor_id) and (public.rls_interno() or public.rls_fp_activo(emisor_tipo, emisor_id)) and (public.rls_yo()).rol not in ('E1'));

-- Solo el Administrador activa "Mis facturas"
create or replace function public.fp_activo_guarda() returns trigger language plpgsql security definer set search_path to 'public' as $$
begin
  if auth.uid() is null or public.rls_admin() then return new; end if;
  if tg_op = 'INSERT' and coalesce(new.fp_activo,false) then raise exception 'Solo el Administrador activa Mis facturas'; end if;
  if tg_op = 'UPDATE' and new.fp_activo is distinct from old.fp_activo then raise exception 'Solo el Administrador activa Mis facturas'; end if;
  return new;
end $$;
drop trigger if exists fp_activo_guarda on public.agentes;
create trigger fp_activo_guarda before insert or update on public.agentes for each row execute function public.fp_activo_guarda();
drop trigger if exists fp_activo_guarda on public.oficinas;
create trigger fp_activo_guarda before insert or update on public.oficinas for each row execute function public.fp_activo_guarda();
drop trigger if exists fp_activo_guarda on public.clientes;
create trigger fp_activo_guarda before insert or update on public.clientes for each row execute function public.fp_activo_guarda();
