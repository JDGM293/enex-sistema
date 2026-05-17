-- 20260517_delivery_notes_tipo_y_guia.sql
-- Agrega tres columnas a `delivery_notes` para soportar el flujo dual
-- Entrega (cliente directo) vs Despacho (a agente / oficina / autónomo),
-- y la trazabilidad de la guía consolidada de origen de los WRs.
--
-- Cambios:
--   • tipo               : "entrega" (cliente directo) | "despacho" (grupal).
--                          Notas previas a esta migración se interpretan
--                          implícitamente como "entrega" (default).
--   • guia_id            : ID de la guía consolidada de la que provienen
--                          los WRs entregados. Permite saber a qué embarque
--                          pertenece la entrega y reimprimir trazabilidad
--                          correcta. Notas previas → null/'' (legacy).
--   • receptor_entidad   : Descripción estructurada de a quién se le entregó:
--                          { tipo: "cliente"|"agente"|"oficina"|"autonomo",
--                            id: <id de la entidad>, nombre: <denominación> }.
--                          Se guarda en jsonb para mantener flexibilidad ante
--                          cambios futuros.
--
-- Backward compatible: las columnas se agregan con DEFAULT para que las
-- filas existentes queden con tipo='entrega' y guia_id/'' / receptor_entidad=null
-- sin necesidad de backfill manual.

ALTER TABLE delivery_notes
  ADD COLUMN IF NOT EXISTS tipo             text NOT NULL DEFAULT 'entrega',
  ADD COLUMN IF NOT EXISTS guia_id          text DEFAULT '',
  ADD COLUMN IF NOT EXISTS receptor_entidad jsonb;

-- Índices para listados/filtros frecuentes
CREATE INDEX IF NOT EXISTS delivery_notes_tipo_idx    ON delivery_notes (tipo);
CREATE INDEX IF NOT EXISTS delivery_notes_guia_id_idx ON delivery_notes (guia_id);

-- (Opcional) Backfill explícito de filas viejas — el DEFAULT ya lo cubre
-- para nuevas filas, pero por seguridad lo dejamos asentado.
UPDATE delivery_notes SET tipo = 'entrega' WHERE tipo IS NULL OR tipo = '';
