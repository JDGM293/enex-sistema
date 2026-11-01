-- Solicitudes de reempaque: el agente (u otro externo) pide reempacar WR de sus clientes;
-- las atienden los internos con permiso de reempaque.
create table if not exists public.solicitudes_reempaque (
  id text primary key,
  fecha timestamptz not null default now(),
  cliente_id text,
  cliente jsonb not null default '{}'::jsonb,
  wr_ids jsonb not null default '[]'::jsonb,
  notas text,
  status text not null default 'pendiente', -- pendiente | hecha | rechazada | cancelada
  solicitado_por text,
  solicitado_por_nombre text,
  wr_resultado text,
  atendido_por text,
  atendido timestamptz,
  motivo text
);
alter table public.solicitudes_reempaque enable row level security;
create policy p_ver on public.solicitudes_reempaque for select to authenticated using (
  public.rls_interno() or solicitado_por = (public.rls_yo()).id or public.rls_cliente_id_ok(cliente_id) or public.rls_wr_ids_ok(wr_ids));
create policy p_crear on public.solicitudes_reempaque for insert to authenticated with check (
  public.rls_interno() or (solicitado_por = (public.rls_yo()).id and public.rls_wr_ids_ok(wr_ids)));
create policy p_editar on public.solicitudes_reempaque for update to authenticated using (
  public.rls_interno() or (solicitado_por = (public.rls_yo()).id and status = 'pendiente'));
create policy p_borrar on public.solicitudes_reempaque for delete to authenticated using (public.rls_admin());

create or replace function public.secuencias() returns jsonb language sql stable security definer set search_path to 'public' as $$
  select case when (public.rls_yo()).id is null then '{}'::jsonb else jsonb_build_object(
    'wr',  (select coalesce(max((substring(id from '(\d+)$'))::bigint),0) from public.wr),
    'cli', (select coalesce(max((substring(id from '^C-(\d+)$'))::bigint),0) from public.clientes),
    'usr', (select coalesce(max((substring(id from '^U-(\d+)$'))::bigint),0) from public.clientes),
    'cas', (select coalesce(max(nullif(regexp_replace(casillero,'\D','','g'),'')::bigint),0) from public.clientes),
    'pu',  (select coalesce(max(nullif(regexp_replace(id,'\D','','g'),'')::bigint),0) from public.pickup),
    'pa',  (select coalesce(max(nullif(regexp_replace(id,'\D','','g'),'')::bigint),0) from public.prealertas),
    'sr',  (select coalesce(max(nullif(regexp_replace(id,'\D','','g'),'')::bigint),0) from public.solicitudes_reempaque)
  ) end;
$$;
