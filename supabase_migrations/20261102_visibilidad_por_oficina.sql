-- Visibilidad por oficina.
-- Alcance total: Administrador y cualquier cuenta interna sin oficina (p. ej. Gerente general).
-- Internos con oficina: su matriz y las oficinas que dependen de ella.
create or replace function public.rls_total() returns boolean language sql stable security definer set search_path to 'public' as $$
  select public.rls_interno() and ((public.rls_yo()).rol = 'A' or coalesce((public.rls_yo()).oficina_id,'') = '');
$$;

-- Oficinas de mi alcance: mi matriz + las oficinas que dependen de ella (o solo mi oficina si soy de sucursal)
create or replace function public.rls_mis_oficinas() returns text[] language sql stable security definer set search_path to 'public' as $$
  with yo as (select o.* from public.oficinas o where o.id = (public.rls_yo()).oficina_id),
       mat as (select case when coalesce(tipo,'Matriz') = 'Matriz' then id else matriz_id end as id from yo)
  select coalesce(array_agg(distinct x), array[]::text[]) from (
    select id as x from mat where id is not null
    union select o.id from public.oficinas o, mat where o.matriz_id = mat.id
    union select id from yo) t where x is not null;
$$;

create or replace function public.rls_wr_ok(w public.wr) returns boolean language plpgsql stable security definer set search_path to 'public' as $$
declare u public.clientes := public.rls_yo(); cli public.clientes; ofi public.oficinas; suc text; mis text[];
begin
  if u.id is null then return false; end if;
  if public.rls_total() then return true; end if;
  if public.rls_interno() then
    if w.ofi_origen_id is null then return true; end if; -- WR anteriores a las oficinas
    mis := public.rls_mis_oficinas();
    return w.ofi_origen_id = any(mis) or w.ofi_destino_id = any(mis) or w.ofi_actual_id = any(mis) or coalesce(w.sucursal_entrega,'') = any(mis);
  end if;
  select * into cli from public.clientes c where coalesce(w.cliente_id,'')<>'' and c.id = w.cliente_id limit 1;
  if cli.id is null then select * into cli from public.clientes c where coalesce(w.casillero,'')<>'' and c.casillero = w.casillero limit 1; end if;
  if u.rol = 'G' then
    if coalesce(u.oficina_id,'') = '' then return false; end if;
    if u.oficina_id in (coalesce(w.ofi_origen_id,''), coalesce(w.ofi_actual_id,''), coalesce(w.sucursal_entrega,'')) then return true; end if;
    suc := case when w.sucursal_entrega is not null then w.sucursal_entrega
                when cli.id is not null and cli.tipo <> 'usuario' then coalesce(cli.oficina_id,'') else '' end;
    if suc = u.oficina_id then return true; end if;
    if exists(select 1 from public.delivery_notes n where not coalesce(n.anulado,false)
              and n.receptor_entidad->>'tipo'='oficina' and n.receptor_entidad->>'id'=u.oficina_id
              and coalesce(n.wr_ids,'[]'::jsonb) ? w.id) then return true; end if;
    if w.ofi_origen_id is not null then return false; end if;
    select * into ofi from public.oficinas o where o.id = u.oficina_id;
    return ofi.id is not null and public.rls_norm(ofi.ciudad) <> '' and public.rls_ciudad(w.orig_city) = public.rls_norm(ofi.ciudad);
  end if;
  return cli.id is not null and public.rls_cliente_ok(cli);
end $$;

create or replace function public.rls_guia_ok(g public.consolidaciones) returns boolean language sql stable security definer set search_path to 'public' as $$
  select public.rls_total()
    or (public.rls_interno() and (g.ofi_origen_id is null or g.ofi_origen_id = any(public.rls_mis_oficinas()) or g.ofi_destino_id = any(public.rls_mis_oficinas())))
    or public.rls_wr_ids_ok(g.wr_ids)
    or exists(select 1 from jsonb_array_elements(case when jsonb_typeof(g.containers)='array' then g.containers else '[]'::jsonb end) ct,
                     jsonb_array_elements(case when jsonb_typeof(ct->'wr')='array' then ct->'wr' else '[]'::jsonb end) x
              where public.rls_wr_id_ok(x->>'id'));
$$;

-- Fotos, notas de entrega/despacho y cargo release: según los WR que se ven
drop policy if exists p_ver on public.wr_fotos;
create policy p_ver on public.wr_fotos for select to authenticated using (public.rls_total() or public.rls_wr_id_ok(wr_id));
drop policy if exists p_ver on public.delivery_notes;
create policy p_ver on public.delivery_notes for select to authenticated using (public.rls_total() or public.rls_wr_ids_ok(wr_ids) or receptor_entidad->>'id' = any(public.rls_mios()));
drop policy if exists p_ver on public.cargo_releases;
create policy p_ver on public.cargo_releases for select to authenticated using (public.rls_total() or public.rls_wr_ids_ok(wr_ids));

revoke execute on function public.rls_total(), public.rls_mis_oficinas() from anon, public;
grant execute on function public.rls_total(), public.rls_mis_oficinas() to authenticated;
