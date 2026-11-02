-- Clientes, autónomos y agentes pertenecen a una matriz; se anota la oficina que registró al cliente
alter table public.clientes add column if not exists matriz_id text, add column if not exists ofi_registro_id text;
alter table public.agentes add column if not exists matriz_id text;
