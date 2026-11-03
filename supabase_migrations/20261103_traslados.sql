-- Parte E: traslados de carga entre oficinas (sucursal → matriz en origen, matriz → sucursal en destino)
create table if not exists public.traslados (
  id text primary key,                    -- US-T-0000001
  fecha timestamptz not null default now(),
  ofi_desde_id text not null,
  ofi_hasta_id text not null,
  wr_ids jsonb not null default '[]'::jsonb,
  recibidos jsonb not null default '[]'::jsonb,   -- WR escaneados al recibir
  estado text not null default 'en_camino',       -- en_camino | parcial | recibido | anulado
  modo text not null default 'chofer',            -- chofer | carrier
  chofer text, vehiculo text, carrier text, tracking text,
  despacha text,
  recibe text, fecha_recibido timestamptz, usuario_recibe text,
  notas text,
  usuario text,
  motivo_anulacion text,
  created_at timestamptz not null default now()
);
alter table public.traslados enable row level security;

-- WR: traslado en el que va ahora (vacío si no va en camino)
alter table public.wr add column if not exists traslado_id text;

-- Numeración por país: T = traslado
create or replace function public.sig_documento(p_pais text, p_tipo text) returns bigint language plpgsql security definer set search_path to 'public' as $$
declare n bigint;
begin
  if (public.rls_yo()).id is null then raise exception 'No permitido'; end if;
  if coalesce(p_pais,'') !~ '^[A-Z]{2,3}$' or p_tipo not in ('F','NC','L','CM','RC','PF','T') then raise exception 'Documento inválido'; end if;
  insert into public.doc_secuencias(pais, tipo, ultimo) values (p_pais, p_tipo, 1)
    on conflict (pais, tipo) do update set ultimo = public.doc_secuencias.ultimo + 1
    returning ultimo into n;
  return n;
end $$;

-- Quién ve un traslado: alcance total, internos de las oficinas de su matriz, o la sucursal que envía o recibe
create or replace function public.rls_traslado_ok(p_desde text, p_hasta text) returns boolean language sql stable security definer set search_path to 'public' as $$
  select public.rls_total()
    or (public.rls_interno() and (p_desde = any(public.rls_mis_oficinas()) or p_hasta = any(public.rls_mis_oficinas())))
    or ((public.rls_yo()).rol = 'G' and coalesce((public.rls_yo()).oficina_id,'') <> '' and (public.rls_yo()).oficina_id in (p_desde, p_hasta));
$$;
revoke execute on function public.rls_traslado_ok(text,text) from anon, public;
grant execute on function public.rls_traslado_ok(text,text) to authenticated;

drop policy if exists p_ver on public.traslados;
drop policy if exists p_crear on public.traslados;
drop policy if exists p_editar on public.traslados;
drop policy if exists p_borrar on public.traslados;
create policy p_ver on public.traslados for select to authenticated using (public.rls_traslado_ok(ofi_desde_id, ofi_hasta_id));
create policy p_crear on public.traslados for insert to authenticated with check (public.rls_traslado_ok(ofi_desde_id, ofi_hasta_id));
create policy p_editar on public.traslados for update to authenticated using (public.rls_traslado_ok(ofi_desde_id, ofi_hasta_id)) with check (public.rls_traslado_ok(ofi_desde_id, ofi_hasta_id));
create policy p_borrar on public.traslados for delete to authenticated using (public.rls_admin());
