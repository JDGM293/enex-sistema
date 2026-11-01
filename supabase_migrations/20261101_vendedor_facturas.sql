-- Vendedor (E1): no emite facturas propias y solo ve las de sus clientes;
-- de la empresa ve solo las de sus clientes (no las facturadas a su agente).
create or replace function public.rls_receptor_ok(rid text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select case when (public.rls_yo()).rol = 'E1' then rid = (public.rls_yo()).id else rid = any(public.rls_mios()) end;
$$;
grant execute on function public.rls_receptor_ok(text) to authenticated;

drop policy if exists p_ver on public.facturas;
drop policy if exists p_crear on public.facturas;
drop policy if exists p_editar on public.facturas;
create policy p_ver on public.facturas for select to authenticated using (public.rls_interno() or public.rls_receptor_ok(receptor_id) or public.rls_wr_ids_ok(wr_ids));
create policy p_crear on public.facturas for insert to authenticated with check (public.rls_interno() or public.rls_receptor_ok(receptor_id) or public.rls_wr_ids_ok(wr_ids));
create policy p_editar on public.facturas for update to authenticated using (public.rls_interno() or public.rls_receptor_ok(receptor_id) or public.rls_wr_ids_ok(wr_ids));

drop policy if exists p_ver on public.pagos;
drop policy if exists p_crear on public.pagos;
drop policy if exists p_editar on public.pagos;
create policy p_ver on public.pagos for select to authenticated using (public.rls_interno() or public.rls_receptor_ok(pagador_id) or public.rls_factura_ok(factura_id));
create policy p_crear on public.pagos for insert to authenticated with check (public.rls_interno() or public.rls_receptor_ok(pagador_id) or public.rls_factura_ok(factura_id));
create policy p_editar on public.pagos for update to authenticated using (public.rls_interno() or public.rls_receptor_ok(pagador_id) or public.rls_factura_ok(factura_id));

create or replace function public.rls_factura_ok(fid text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select coalesce((select public.rls_interno() or public.rls_receptor_ok(f.receptor_id) or public.rls_wr_ids_ok(f.wr_ids)
    from public.facturas f where f.id = fid limit 1), false);
$$;

drop policy if exists p_ver on public.facturas_propias;
drop policy if exists p_crear on public.facturas_propias;
drop policy if exists p_editar on public.facturas_propias;
create policy p_ver on public.facturas_propias for select to authenticated using (
  public.rls_fp_ok(emisor_tipo, emisor_id) and ((public.rls_yo()).rol <> 'E1' or public.rls_cliente_id_ok(cliente_id)));
create policy p_crear on public.facturas_propias for insert to authenticated with check (public.rls_fp_ok(emisor_tipo, emisor_id) and (public.rls_yo()).rol <> 'E1');
create policy p_editar on public.facturas_propias for update to authenticated using (public.rls_fp_ok(emisor_tipo, emisor_id) and (public.rls_yo()).rol <> 'E1');
