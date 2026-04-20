-- 20260421_delivery_notes_table.sql
-- Crea la tabla delivery_notes para el módulo de Notas de Entrega (Lote 5).
-- Cada fila representa la entrega física al cliente final (o su representante),
-- agrupando 1 o más WRs. Los WRs pasan a estado 21 Entregado al crearse la nota.

CREATE TABLE IF NOT EXISTS delivery_notes (
  id                 text PRIMARY KEY,
  fecha              timestamptz NOT NULL DEFAULT now(),
  wr_ids             jsonb NOT NULL DEFAULT '[]'::jsonb,
  cliente_id         text DEFAULT '',
  consignatario      text NOT NULL DEFAULT '',
  receptor_nombre    text DEFAULT '',
  receptor_documento text DEFAULT '',
  receptor_telefono  text DEFAULT '',
  direccion_entrega  text DEFAULT '',
  metodo_entrega     text DEFAULT '',
  transportista      text DEFAULT '',
  notas              text DEFAULT '',
  usuario            text DEFAULT '',
  firma_data_url     text DEFAULT '',
  anulado            boolean NOT NULL DEFAULT false,
  motivo_anulacion   text DEFAULT '',
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- Índices para buscar por fecha / cliente / anulados
CREATE INDEX IF NOT EXISTS delivery_notes_fecha_idx    ON delivery_notes (fecha DESC);
CREATE INDEX IF NOT EXISTS delivery_notes_cliente_idx  ON delivery_notes (cliente_id);
CREATE INDEX IF NOT EXISTS delivery_notes_anulado_idx  ON delivery_notes (anulado);
