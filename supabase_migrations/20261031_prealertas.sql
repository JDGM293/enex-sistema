-- Pre-alertas: el cliente (o su agente, autónomo, oficina o vendedor) avisa un tracking
-- con su factura; aparece en Recepción en Puerta para reconocer el paquete al llegar.
create table if not exists public.prealertas (
  id text primary key,
  tracking text not null,
  carrier text,
  cliente_id text,
  cliente jsonb not null default '{}'::jsonb,
  tienda text,
  descripcion text,
  valor numeric,
  moneda text default 'USD',
  archivos jsonb not null default '[]'::jsonb,
  notas text,
  status text not null default 'pendiente',   -- pendiente · recibida · registrada · cancelada
  wr_id text,
  recibida timestamptz,
  creado timestamptz not null default now(),
  creado_por text,
  creado_por_nombre text
);
create index if not exists prealertas_tracking on public.prealertas (upper(tracking));
alter table public.prealertas enable row level security;
create policy cuentas_enex on public.prealertas for all to authenticated using (public.es_cuenta_enex()) with check (public.es_cuenta_enex());
insert into storage.buckets (id, name, public) values ('prealertas','prealertas', false) on conflict (id) do nothing;
create policy prealertas_ver on storage.objects for select to authenticated using (bucket_id = 'prealertas' and public.es_cuenta_enex());
create policy prealertas_subir on storage.objects for insert to authenticated with check (bucket_id = 'prealertas' and public.es_cuenta_enex());
