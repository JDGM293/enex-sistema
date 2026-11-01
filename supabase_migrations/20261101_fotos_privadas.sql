-- Fotos de WR, de guías y comprobantes de pago: privadas, solo para quien ve ese WR / guía / pago.
update storage.buckets set public = false where id in ('wr-fotos','consol-fotos');
drop policy if exists "wr-fotos-public-read" on storage.objects;
drop policy if exists "consol-fotos-public-read" on storage.objects;
drop policy if exists "fotos-cuentas-enex-insert" on storage.objects;
drop policy if exists "fotos-cuentas-enex-delete" on storage.objects;
drop policy if exists fotos_ver on storage.objects;
drop policy if exists fotos_subir on storage.objects;
drop policy if exists fotos_borrar on storage.objects;
create policy fotos_ver on storage.objects for select to authenticated using (
  (bucket_id = 'wr-fotos' and (public.rls_interno()
     or (split_part(name,'/',1) <> 'pagos' and public.rls_wr_id_ok(split_part(name,'/',1)))
     or (split_part(name,'/',1) = 'pagos' and exists(select 1 from public.pagos p where p.recibo_id = split_part(name,'/',2)
           and (p.pagador_id = any(public.rls_mios()) or public.rls_factura_ok(p.factura_id))))))
  or (bucket_id = 'consol-fotos' and (public.rls_interno()
     or exists(select 1 from public.consolidaciones g where g.id = split_part(name,'/',1) and public.rls_guia_ok(g)))));
create policy fotos_subir on storage.objects for insert to authenticated with check (
  (bucket_id = 'wr-fotos' and (public.rls_interno() or (public.rls_yo()).rol = 'G'
     or (split_part(name,'/',1) <> 'pagos' and public.rls_wr_id_ok(split_part(name,'/',1)))))
  or (bucket_id = 'consol-fotos' and (public.rls_interno() or (public.rls_yo()).rol = 'G')));
create policy fotos_borrar on storage.objects for delete to authenticated using (bucket_id in ('wr-fotos','consol-fotos') and public.rls_admin());
