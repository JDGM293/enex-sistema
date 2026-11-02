-- WR: oficina de origen, matriz de destino y oficina donde está ahora
alter table public.wr add column if not exists ofi_origen_id text, add column if not exists ofi_destino_id text, add column if not exists ofi_actual_id text;
