-- 20260420_wr_sobrante_de_guia.sql
-- Agrega columna `sobrante_de_guia` a la tabla wr para enlazar los WR marcados
-- como sobrante (estado 19) a la guía consolidada donde se detectaron. Usado
-- por el módulo Recepción en Almacén (checklist con faltantes/sobrantes).

ALTER TABLE wr
  ADD COLUMN IF NOT EXISTS sobrante_de_guia text DEFAULT '';

-- Índice para lookup rápido cuando el módulo de recepción lista sobrantes por guía
CREATE INDEX IF NOT EXISTS wr_sobrante_de_guia_idx ON wr (sobrante_de_guia)
  WHERE sobrante_de_guia IS NOT NULL AND sobrante_de_guia <> '';
