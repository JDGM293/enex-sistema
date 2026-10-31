-- Facturas que emiten agentes, autónomos y oficinas a sus propios clientes.
-- Se guardan aparte: no forman parte de la contabilidad de la casa matriz.
create table if not exists public.facturas_propias (
  id text primary key,
  emisor_tipo text not null,
  emisor_id text not null,
  numero integer not null,
  emisor jsonb not null default '{}'::jsonb,
  cliente_id text,
  cliente jsonb not null default '{}'::jsonb,
  guia_id text,
  wr_ids jsonb not null default '[]'::jsonb,
  lineas jsonb not null default '[]'::jsonb,
  moneda text not null default 'USD',
  total numeric not null default 0,
  pagado numeric not null default 0,
  saldo numeric not null default 0,
  status text not null default 'emitida',
  pagos jsonb not null default '[]'::jsonb,
  notas text,
  fecha timestamptz not null default now(),
  usuario text,
  motivo_anulacion text,
  unique (emisor_tipo, emisor_id, numero)
);
create index if not exists facturas_propias_emisor on public.facturas_propias (emisor_tipo, emisor_id, fecha desc);
alter table public.facturas_propias enable row level security;
create policy cuentas_enex on public.facturas_propias for all to authenticated using (public.es_cuenta_enex()) with check (public.es_cuenta_enex());
