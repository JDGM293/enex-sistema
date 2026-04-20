-- 20260422_facturas_y_pagos.sql
-- Lote 6 — Facturación + Contabilidad (rewrite)
-- Reemplaza el manejo anterior basado solo en memoria/localStorage.
-- Paquetería internacional: solo USD o EUR, sin IVA, sin IGTF.
-- El modelo fiscal completo por país se implementará en iteración futura.
--
-- IDEMPOTENTE: puede ejecutarse varias veces con seguridad.
-- Si la tabla `facturas` ya existía con otro esquema (sistema viejo), este script
-- agrega las columnas faltantes sin tocar las existentes.

-- ── FACTURAS ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS facturas (
  id text PRIMARY KEY
);

-- Columnas nuevas (se agregan solo si faltan)
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS numero             integer;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS tipo               text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS fecha              timestamptz;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS fecha_emision      timestamptz;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS status             text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS moneda             text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS receptor_tipo      text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS receptor_id        text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS receptor_nombre    text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS receptor_doc       text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS receptor_dir       text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS receptor_tel       text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS receptor_email     text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS receptor_casillero text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS lineas             jsonb;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS subtotal           numeric(14,2);
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS descuento          numeric(14,2);
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS total              numeric(14,2);
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS pagado             numeric(14,2);
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS saldo              numeric(14,2);
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS wr_ids             jsonb;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS guia_ids           jsonb;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS nc_factura_origen  text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS notas              text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS condiciones        text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS usuario            text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS motivo_anulacion   text;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS fecha_anulacion    timestamptz;
ALTER TABLE facturas ADD COLUMN IF NOT EXISTS created_at         timestamptz DEFAULT now();

-- Defaults sensatos (los NOT NULL los maneja la app al insertar)
ALTER TABLE facturas ALTER COLUMN tipo           SET DEFAULT 'factura';
ALTER TABLE facturas ALTER COLUMN fecha          SET DEFAULT now();
ALTER TABLE facturas ALTER COLUMN status         SET DEFAULT 'borrador';
ALTER TABLE facturas ALTER COLUMN moneda         SET DEFAULT 'USD';
ALTER TABLE facturas ALTER COLUMN receptor_tipo  SET DEFAULT 'cliente';
ALTER TABLE facturas ALTER COLUMN lineas         SET DEFAULT '[]'::jsonb;
ALTER TABLE facturas ALTER COLUMN subtotal       SET DEFAULT 0;
ALTER TABLE facturas ALTER COLUMN descuento      SET DEFAULT 0;
ALTER TABLE facturas ALTER COLUMN total          SET DEFAULT 0;
ALTER TABLE facturas ALTER COLUMN pagado         SET DEFAULT 0;
ALTER TABLE facturas ALTER COLUMN saldo          SET DEFAULT 0;
ALTER TABLE facturas ALTER COLUMN wr_ids         SET DEFAULT '[]'::jsonb;
ALTER TABLE facturas ALTER COLUMN guia_ids       SET DEFAULT '[]'::jsonb;
ALTER TABLE facturas ALTER COLUMN created_at     SET DEFAULT now();

-- Índices (ahora la columna `numero` existe sí o sí gracias al ADD COLUMN previo)
CREATE INDEX IF NOT EXISTS facturas_numero_idx       ON facturas (numero DESC);
CREATE INDEX IF NOT EXISTS facturas_fecha_idx        ON facturas (fecha DESC);
CREATE INDEX IF NOT EXISTS facturas_status_idx       ON facturas (status);
CREATE INDEX IF NOT EXISTS facturas_tipo_idx         ON facturas (tipo);
CREATE INDEX IF NOT EXISTS facturas_receptor_idx     ON facturas (receptor_id);
CREATE INDEX IF NOT EXISTS facturas_nc_origen_idx    ON facturas (nc_factura_origen);

-- ── PAGOS ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pagos (
  id text PRIMARY KEY
);

ALTER TABLE pagos ADD COLUMN IF NOT EXISTS factura_id        text;
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS fecha             timestamptz;
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS monto             numeric(14,2);
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS moneda            text;
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS tipo_pago         text;
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS referencia        text;
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS nota_referencial  text;
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS anulado           boolean;
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS motivo_anulacion  text;
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS usuario           text;
ALTER TABLE pagos ADD COLUMN IF NOT EXISTS created_at        timestamptz DEFAULT now();

ALTER TABLE pagos ALTER COLUMN fecha      SET DEFAULT now();
ALTER TABLE pagos ALTER COLUMN monto      SET DEFAULT 0;
ALTER TABLE pagos ALTER COLUMN moneda     SET DEFAULT 'USD';
ALTER TABLE pagos ALTER COLUMN tipo_pago  SET DEFAULT 'efectivo';
ALTER TABLE pagos ALTER COLUMN anulado    SET DEFAULT false;
ALTER TABLE pagos ALTER COLUMN created_at SET DEFAULT now();

CREATE INDEX IF NOT EXISTS pagos_factura_idx ON pagos (factura_id);
CREATE INDEX IF NOT EXISTS pagos_fecha_idx   ON pagos (fecha DESC);
CREATE INDEX IF NOT EXISTS pagos_anulado_idx ON pagos (anulado);
