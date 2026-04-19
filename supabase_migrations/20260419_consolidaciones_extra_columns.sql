-- ENEX Sistema — migración 2026-04-19
-- Agrega columnas faltantes a la tabla `consolidaciones` para soportar:
--  * fecha de registro visible en la lista (independiente de created_at)
--  * status global de la guía (código WR_STATUSES — "1","2","3","15","16","17","18"...)
--  * usuario que creó la guía
--  * totales agregados (total_wr, total_cajas, total_lb, total_ft3, total_m3, total_vol_lb)

ALTER TABLE public.consolidaciones
  ADD COLUMN IF NOT EXISTS fecha                     timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS status                    text        DEFAULT '1',
  ADD COLUMN IF NOT EXISTS usuario                   text,
  ADD COLUMN IF NOT EXISTS total_wr                  integer     DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_cajas               integer     DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_lb                  numeric     DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_ft3                 numeric     DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_m3                  numeric     DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_vol_lb              numeric     DEFAULT 0,
  ADD COLUMN IF NOT EXISTS archivada                 boolean     DEFAULT false,
  ADD COLUMN IF NOT EXISTS fecha_recibida_almacen    timestamptz;

-- Backfill: para registros existentes, copiar created_at a fecha si está null
UPDATE public.consolidaciones
   SET fecha = created_at
 WHERE fecha IS NULL;
