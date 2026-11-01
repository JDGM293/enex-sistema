-- Externos ya no leen los contactos de toda la red: solo empleados internos, a sí mismos,
-- sus vendedores (agente) o los usuarios de su oficina, y su propia ficha de agente.
drop policy if exists p_ver on public.clientes;
create policy p_ver on public.clientes for select to authenticated using (
  public.rls_interno()
  or id = (public.rls_yo()).id
  or (tipo='usuario' and (
        rol in ('A','B','C','D','D1','D2')
     or ((public.rls_yo()).rol in ('E','E1') and coalesce(agente_id,'')<>'' and agente_id = (public.rls_yo()).agente_id)
     or ((public.rls_yo()).rol = 'G' and coalesce(oficina_id,'')<>'' and oficina_id = (public.rls_yo()).oficina_id)
     or id in (coalesce((public.rls_yo()).autonomo_id,''), coalesce((public.rls_yo()).vendedor_id,''))))
  or public.rls_cliente_ok(clientes)
  or ((public.rls_yo()).rol='G' and exists(select 1 from public.wr w where (w.cliente_id=clientes.id or (coalesce(clientes.casillero,'')<>'' and w.casillero=clientes.casillero)) and public.rls_wr_ok(w))));
drop policy if exists p_ver on public.agentes;
create policy p_ver on public.agentes for select to authenticated using (
  public.rls_interno() or (public.rls_yo()).rol = 'G' or id = (public.rls_yo()).agente_id);
