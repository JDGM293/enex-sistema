-- ENEX — Migración 2026-09-01
-- Añade la columna `remitente_dir` a la tabla `wr`, que la capa JS ya
-- lee/escribe (campo "Procedencia" en modal WR e impresión "Shipper
-- Information") pero que no existía en el esquema de Supabase.
--
-- Seguro ejecutar varias veces: usa IF NOT EXISTS.
--
-- Campos:
--   remitente_dir  TEXT  — dirección/procedencia del remitente

ALTER TABLE public.wr ADD COLUMN IF NOT EXISTS remitente_dir TEXT DEFAULT '';
