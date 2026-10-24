-- Tarifas especiales por cliente / agente / autónomo (ya aplicada en producción)
alter table public.tarifas add column if not exists aplica_tipo text;  -- null = predeterminada
alter table public.tarifas add column if not exists aplica_id text;
