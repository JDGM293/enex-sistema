-- ENEX — Migración 2026-04-18
-- Añade columnas faltantes a la tabla `wr` que la capa JS ya leía/escribía
-- pero que no existían en el esquema de Supabase.
--
-- Seguro ejecutar varias veces: usa IF NOT EXISTS en cada ADD COLUMN.
--
-- Campos:
--   factura       TEXT      — N° de factura asociado al WR
--   tipo_pago     TEXT      — "Prepago" / "Collect" / etc.
--   branch        TEXT      — sucursal/oficina emisora
--   usuario       TEXT      — usuario que creó/editó
--   cargos        JSONB     — arreglo de cargos/servicios aplicados
--   foto          BOOLEAN   — flag si tiene foto adjunta
--   prealerta     BOOLEAN   — flag de pre-alerta recibida
--   reempaque_de  JSONB     — IDs de WR padres (solo en WR de reempaque)
--   reempacado_en TEXT      — ID del WR nuevo donde se reempacó (solo en padres)

ALTER TABLE public.wr ADD COLUMN IF NOT EXISTS factura       TEXT;
ALTER TABLE public.wr ADD COLUMN IF NOT EXISTS tipo_pago     TEXT;
ALTER TABLE public.wr ADD COLUMN IF NOT EXISTS branch        TEXT;
ALTER TABLE public.wr ADD COLUMN IF NOT EXISTS usuario       TEXT;
ALTER TABLE public.wr ADD COLUMN IF NOT EXISTS cargos        JSONB   DEFAULT '[]'::jsonb;
ALTER TABLE public.wr ADD COLUMN IF NOT EXISTS foto          BOOLEAN DEFAULT false;
ALTER TABLE public.wr ADD COLUMN IF NOT EXISTS prealerta     BOOLEAN DEFAULT false;
ALTER TABLE public.wr ADD COLUMN IF NOT EXISTS reempaque_de  JSONB;
ALTER TABLE public.wr ADD COLUMN IF NOT EXISTS reempacado_en TEXT;

-- Índice opcional para buscar rápido por WR padre reempacado
CREATE INDEX IF NOT EXISTS wr_reempacado_en_idx
  ON public.wr (reempacado_en)
  WHERE reempacado_en IS NOT NULL;

-- Índice opcional para filtrar por factura (Estado de Cuenta, Contabilidad)
CREATE INDEX IF NOT EXISTS wr_factura_idx
  ON public.wr (factura)
  WHERE factura IS NOT NULL AND factura <> '';
