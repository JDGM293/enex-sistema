-- Guías: salen de una matriz y llegan a otra
alter table public.consolidaciones add column if not exists ofi_origen_id text, add column if not exists ofi_destino_id text;
