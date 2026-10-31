-- Dirección del agente (sale en el encabezado del WR de sus clientes)
alter table public.agentes add column if not exists dir text, add column if not exists estado text, add column if not exists cp text;
