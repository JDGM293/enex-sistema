-- Facturas por guía con detalle (ya aplicada en producción)
alter table public.facturas add column if not exists descuento_tipo text default 'monto';
alter table public.facturas add column if not exists descuento_valor numeric default 0;
alter table public.facturas add column if not exists tipo_envio text;
alter table public.facturas add column if not exists tarifa jsonb;
