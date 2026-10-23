-- Sucursal de entrega elegida en el WR (ya aplicada en producción)
alter table public.wr add column if not exists sucursal_entrega text;
