-- Pick-up: solicitudes guardadas con solicitante, paquetes, seguimiento y cargo (ya aplicada en producción)
alter table public.pickup add column if not exists solicitante_tipo text default '';
alter table public.pickup add column if not exists solicitante_id text default '';
alter table public.pickup add column if not exists solicitante_nombre text default '';
alter table public.pickup add column if not exists cliente_nombre text default '';
alter table public.pickup add column if not exists casillero text default '';
alter table public.pickup add column if not exists contacto text default '';
alter table public.pickup add column if not exists telefono text default '';
alter table public.pickup add column if not exists fecha_deseada date;
alter table public.pickup add column if not exists franja text default '';
alter table public.pickup add column if not exists paquetes jsonb default '[]'::jsonb;
alter table public.pickup add column if not exists fecha_programada date;
alter table public.pickup add column if not exists chofer text default '';
alter table public.pickup add column if not exists monto numeric default 0;
alter table public.pickup add column if not exists moneda text default 'USD';
alter table public.pickup add column if not exists wr_id text default '';
alter table public.pickup add column if not exists historial jsonb default '[]'::jsonb;
alter table public.pickup add column if not exists motivo_cancelacion text default '';
