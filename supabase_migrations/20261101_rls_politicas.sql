-- Reglas de acceso por tabla. Internos: todo. Externos: solo su alcance. Borrar: solo Administrador.
do $$ declare t text; begin
  foreach t in array array['actividad','agentes','cargo_releases','clientes','configuracion','consol_fotos','consolidaciones',
    'delivery_notes','facturas','facturas_propias','oficinas','pagos','pickup','prealertas','scan_log','tarifas','wr','wr_fotos'] loop
    execute format('drop policy if exists cuentas_enex on public.%I', t);
    execute format('drop policy if exists p_ver on public.%I', t);
    execute format('drop policy if exists p_crear on public.%I', t);
    execute format('drop policy if exists p_editar on public.%I', t);
    execute format('drop policy if exists p_borrar on public.%I', t);
    execute format('create policy p_borrar on public.%I for delete to authenticated using (public.rls_admin())', t);
  end loop;
end $$;

-- Mi cuenta: id, agente y oficina
create or replace function public.rls_mios() returns text[] language sql stable security definer set search_path to 'public' as $$
  select array_remove(array[(public.rls_yo()).id, nullif((public.rls_yo()).agente_id,''), nullif((public.rls_yo()).oficina_id,'')], null);
$$;
grant execute on function public.rls_mios() to authenticated;

-- CLIENTES: usuarios del sistema visibles (nombres para chat y listas); clientes solo los de su alcance
create policy p_ver on public.clientes for select to authenticated using (
  public.rls_interno() or tipo='usuario' or public.rls_cliente_ok(clientes)
  or ((public.rls_yo()).rol='G' and exists(select 1 from public.wr w where (w.cliente_id=clientes.id or (coalesce(clientes.casillero,'')<>'' and w.casillero=clientes.casillero)) and public.rls_wr_ok(w))));
create policy p_crear on public.clientes for insert to authenticated with check (public.rls_interno() or public.rls_cliente_ok(clientes));
create policy p_editar on public.clientes for update to authenticated using (public.rls_interno() or public.rls_cliente_ok(clientes)) with check (public.rls_interno() or public.rls_cliente_ok(clientes));

-- WR y sus fotos
create policy p_ver on public.wr for select to authenticated using (public.rls_wr_ok(wr));
create policy p_crear on public.wr for insert to authenticated with check (public.rls_wr_ok(wr));
create policy p_editar on public.wr for update to authenticated using (public.rls_wr_ok(wr)) with check (public.rls_wr_ok(wr));
create policy p_ver on public.wr_fotos for select to authenticated using (public.rls_interno() or public.rls_wr_id_ok(wr_id));
create policy p_crear on public.wr_fotos for insert to authenticated with check (public.rls_interno() or public.rls_wr_id_ok(wr_id));
create policy p_editar on public.wr_fotos for update to authenticated using (public.rls_interno() or public.rls_wr_id_ok(wr_id));

-- Guías: las que llevan alguno de mis WR; las oficinas pueden crear
create policy p_ver on public.consolidaciones for select to authenticated using (public.rls_guia_ok(consolidaciones));
create policy p_crear on public.consolidaciones for insert to authenticated with check (public.rls_interno() or (public.rls_yo()).rol='G');
create policy p_editar on public.consolidaciones for update to authenticated using (public.rls_interno() or ((public.rls_yo()).rol='G' and public.rls_guia_ok(consolidaciones)));
create policy p_ver on public.consol_fotos for select to authenticated using (public.rls_interno() or exists(select 1 from public.consolidaciones g where g.id=consol_id and public.rls_guia_ok(g)));
create policy p_crear on public.consol_fotos for insert to authenticated with check (public.rls_interno() or (public.rls_yo()).rol='G');
create policy p_editar on public.consol_fotos for update to authenticated using (public.rls_interno());

-- Facturas y pagos
create policy p_ver on public.facturas for select to authenticated using (public.rls_interno() or receptor_id = any(public.rls_mios()) or public.rls_wr_ids_ok(wr_ids));
create policy p_crear on public.facturas for insert to authenticated with check (public.rls_interno() or receptor_id = any(public.rls_mios()) or public.rls_wr_ids_ok(wr_ids));
create policy p_editar on public.facturas for update to authenticated using (public.rls_interno() or receptor_id = any(public.rls_mios()) or public.rls_wr_ids_ok(wr_ids));
create policy p_ver on public.pagos for select to authenticated using (public.rls_interno() or pagador_id = any(public.rls_mios()) or public.rls_factura_ok(factura_id));
create policy p_crear on public.pagos for insert to authenticated with check (public.rls_interno() or pagador_id = any(public.rls_mios()) or public.rls_factura_ok(factura_id));
create policy p_editar on public.pagos for update to authenticated using (public.rls_interno() or pagador_id = any(public.rls_mios()) or public.rls_factura_ok(factura_id));

-- Entregas y egresos
create policy p_ver on public.delivery_notes for select to authenticated using (public.rls_interno() or public.rls_wr_ids_ok(wr_ids) or receptor_entidad->>'id' = any(public.rls_mios()));
create policy p_crear on public.delivery_notes for insert to authenticated with check (public.rls_interno() or ((public.rls_yo()).rol='G' and (public.rls_wr_ids_ok(wr_ids) or receptor_entidad->>'id' = any(public.rls_mios()))));
create policy p_editar on public.delivery_notes for update to authenticated using (public.rls_interno() or ((public.rls_yo()).rol='G' and (public.rls_wr_ids_ok(wr_ids) or receptor_entidad->>'id' = any(public.rls_mios()))));
create policy p_ver on public.cargo_releases for select to authenticated using (public.rls_interno() or public.rls_wr_ids_ok(wr_ids));
create policy p_crear on public.cargo_releases for insert to authenticated with check (public.rls_interno());
create policy p_editar on public.cargo_releases for update to authenticated using (public.rls_interno());

-- Pick-ups y pre-alertas: las que pidió la cuenta o de sus clientes
create policy p_ver on public.pickup for select to authenticated using (public.rls_interno() or solicitante_id = (public.rls_yo()).id or public.rls_cliente_id_ok(cliente_id));
create policy p_crear on public.pickup for insert to authenticated with check (public.rls_interno() or solicitante_id = (public.rls_yo()).id or public.rls_cliente_id_ok(cliente_id));
create policy p_editar on public.pickup for update to authenticated using (public.rls_interno() or solicitante_id = (public.rls_yo()).id or public.rls_cliente_id_ok(cliente_id));
create policy p_ver on public.prealertas for select to authenticated using (public.rls_interno() or creado_por = (public.rls_yo()).id or public.rls_cliente_id_ok(cliente_id));
create policy p_crear on public.prealertas for insert to authenticated with check (public.rls_interno() or creado_por = (public.rls_yo()).id or public.rls_cliente_id_ok(cliente_id));
create policy p_editar on public.prealertas for update to authenticated using (public.rls_interno() or creado_por = (public.rls_yo()).id or public.rls_cliente_id_ok(cliente_id));

-- Facturas propias: solo las del emisor
create policy p_ver on public.facturas_propias for select to authenticated using (public.rls_fp_ok(emisor_tipo, emisor_id));
create policy p_crear on public.facturas_propias for insert to authenticated with check (public.rls_fp_ok(emisor_tipo, emisor_id));
create policy p_editar on public.facturas_propias for update to authenticated using (public.rls_fp_ok(emisor_tipo, emisor_id));

-- Agentes y oficinas: lectura para todas las cuentas; cambios solo internos
create policy p_ver on public.agentes for select to authenticated using ((public.rls_yo()).id is not null);
create policy p_crear on public.agentes for insert to authenticated with check (public.rls_interno());
create policy p_editar on public.agentes for update to authenticated using (public.rls_interno());
create policy p_ver on public.oficinas for select to authenticated using ((public.rls_yo()).id is not null);
create policy p_crear on public.oficinas for insert to authenticated with check (public.rls_interno());
create policy p_editar on public.oficinas for update to authenticated using (public.rls_interno());

-- Tarifas: internos todas; externos las generales y las suyas
create policy p_ver on public.tarifas for select to authenticated using (public.rls_interno() or (public.rls_yo()).id is not null and (coalesce(aplica_tipo,'')='' or aplica_id = any(public.rls_mios())));
create policy p_crear on public.tarifas for insert to authenticated with check (public.rls_interno());
create policy p_editar on public.tarifas for update to authenticated using (public.rls_interno());

-- Configuración: lectura para todas las cuentas; cambios internos (y los datos de facturación propios)
create policy p_ver on public.configuracion for select to authenticated using ((public.rls_yo()).id is not null);
create policy p_crear on public.configuracion for insert to authenticated with check (public.rls_interno() or (clave like 'fp_datos:%' and public.rls_fp_ok(split_part(clave,':',2), split_part(clave,':',3))));
create policy p_editar on public.configuracion for update to authenticated using (public.rls_interno() or (clave like 'fp_datos:%' and public.rls_fp_ok(split_part(clave,':',2), split_part(clave,':',3))));

-- Recepción en puerta: internos y oficinas
create policy p_ver on public.scan_log for select to authenticated using (public.rls_interno() or (public.rls_yo()).rol='G');
create policy p_crear on public.scan_log for insert to authenticated with check (public.rls_interno() or (public.rls_yo()).rol='G');
create policy p_editar on public.scan_log for update to authenticated using (public.rls_interno() or (public.rls_yo()).rol='G');

-- Actividad: todos anotan lo suyo; solo internos la leen
create policy p_ver on public.actividad for select to authenticated using (public.rls_interno());
create policy p_crear on public.actividad for insert to authenticated with check ((public.rls_yo()).id is not null);

-- Archivos de pre-alertas: los de pre-alertas visibles
drop policy if exists prealertas_ver on storage.objects;
drop policy if exists prealertas_subir on storage.objects;
create policy prealertas_ver on storage.objects for select to authenticated using (bucket_id='prealertas' and (public.rls_interno()
  or exists(select 1 from public.prealertas p where p.id = split_part(name,'/',1) and (p.creado_por=(public.rls_yo()).id or public.rls_cliente_id_ok(p.cliente_id)))));
create policy prealertas_subir on storage.objects for insert to authenticated with check (bucket_id='prealertas' and (public.rls_interno()
  or exists(select 1 from public.prealertas p where p.id = split_part(name,'/',1) and (p.creado_por=(public.rls_yo()).id or public.rls_cliente_id_ok(p.cliente_id)))));
