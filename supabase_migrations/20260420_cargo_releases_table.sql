-- 20260420_cargo_releases_table.sql
-- Crea la tabla cargo_releases para el módulo de Egreso (Cargo Release).
-- Cada fila representa una liberación de carga a un agente/transportista,
-- agrupando 1 o más WRs. Los WRs pasan a estado 25 Egresado al crearse el release.

CREATE TABLE IF NOT EXISTS cargo_releases (
  id               text PRIMARY KEY,
  fecha            timestamptz NOT NULL DEFAULT now(),
  wr_ids           jsonb NOT NULL DEFAULT '[]'::jsonb,
  agente_carga     text NOT NULL DEFAULT '',
  contacto         text DEFAULT '',
  documento        text DEFAULT '',
  vehiculo         text DEFAULT '',
  notas            text DEFAULT '',
  usuario          text DEFAULT '',
  firma_data_url   text DEFAULT '',
  anulado          boolean NOT NULL DEFAULT false,
  motivo_anulacion text DEFAULT '',
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- Índice para buscar por agente y por fecha
CREATE INDEX IF NOT EXISTS cargo_releases_fecha_idx   ON cargo_releases (fecha DESC);
CREATE INDEX IF NOT EXISTS cargo_releases_agente_idx  ON cargo_releases (agente_carga);
CREATE INDEX IF NOT EXISTS cargo_releases_anulado_idx ON cargo_releases (anulado);
