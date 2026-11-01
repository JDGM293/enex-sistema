-- El autónomo no emite facturas propias: trabaja con las de la matriz (solo ver e imprimir).
drop policy if exists p_crear on public.facturas_propias;
drop policy if exists p_editar on public.facturas_propias;
create policy p_crear on public.facturas_propias for insert to authenticated with check (public.rls_fp_ok(emisor_tipo, emisor_id) and (public.rls_yo()).rol not in ('E1','F'));
create policy p_editar on public.facturas_propias for update to authenticated using (public.rls_fp_ok(emisor_tipo, emisor_id) and (public.rls_yo()).rol not in ('E1','F'));
