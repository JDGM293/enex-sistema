-- Fase 2 (ya aplicada en producción): sin sesión no se lee ni escribe nada.
-- Solo las cuentas enlazadas a un registro activo de ENEX (public.es_cuenta_enex()).
do $$
declare t text; p record;
begin
  foreach t in array array['actividad','agentes','cargo_releases','clientes','configuracion','consol_fotos','consolidaciones','delivery_notes','facturas','oficinas','pagos','pickup','scan_log','tarifas','wr','wr_fotos']
  loop
    for p in select policyname from pg_policies where schemaname='public' and tablename=t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy cuentas_enex on public.%I for all to authenticated using (public.es_cuenta_enex()) with check (public.es_cuenta_enex())', t);
  end loop;
end $$;
update public.clientes set password = '' where coalesce(password,'') <> '';

-- Fotos: lectura pública (enlaces), subir y borrar solo cuentas de ENEX
drop policy if exists "wr-fotos-anon-insert" on storage.objects;
drop policy if exists "wr-fotos-anon-delete" on storage.objects;
drop policy if exists "consol-fotos-anon-insert" on storage.objects;
drop policy if exists "consol-fotos-anon-delete" on storage.objects;
create policy "fotos-cuentas-enex-insert" on storage.objects for insert to authenticated
  with check (bucket_id in ('wr-fotos','consol-fotos') and public.es_cuenta_enex());
create policy "fotos-cuentas-enex-delete" on storage.objects for delete to authenticated
  using (bucket_id in ('wr-fotos','consol-fotos') and public.es_cuenta_enex());
