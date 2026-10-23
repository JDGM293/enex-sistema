-- Vendedor de agente que captó al cliente (ya aplicada en producción)
alter table public.clientes add column if not exists vendedor_id text;
