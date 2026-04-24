-- 20260424_wr_fotos_table.sql
-- Sistema de fotos del paquete asociadas al WR y a la caja dentro del WR.
-- Las fotos viven en Supabase Storage (bucket "wr-fotos") y esta tabla
-- mantiene la metadata: qué archivo, de qué caja de qué WR, quién lo subió,
-- cuándo.
--
-- Por cada caja (registro) dentro de un WR puede haber 0..N fotos.
-- El borrado del WR elimina en cascada los registros (pero NO los blobs de
-- Storage — ese cleanup se hace en código app al borrar o vía hook/función).

CREATE TABLE IF NOT EXISTS wr_fotos (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wr_id       text NOT NULL REFERENCES wr(id) ON DELETE CASCADE,
  caja_idx    integer NOT NULL DEFAULT 0,
  url         text NOT NULL,           -- URL pública del blob en storage
  path        text NOT NULL,           -- path dentro del bucket (para borrar)
  filename    text DEFAULT '',
  mime        text DEFAULT 'image/jpeg',
  size_bytes  integer,
  source      text DEFAULT 'upload',   -- 'upload' | 'webcam'
  uploaded_by text DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS wr_fotos_wr_id_idx     ON wr_fotos (wr_id);
CREATE INDEX IF NOT EXISTS wr_fotos_wr_caja_idx   ON wr_fotos (wr_id, caja_idx);
CREATE INDEX IF NOT EXISTS wr_fotos_created_idx   ON wr_fotos (created_at DESC);

-- ── Storage bucket ─────────────────────────────────────────────────────────
-- Si el bucket ya existe no se toca. Público para lectura (cualquiera con
-- URL lo ve). La escritura la sigue controlando la app (la clave anon solo
-- inserta si la policy lo permite).
INSERT INTO storage.buckets (id, name, public)
VALUES ('wr-fotos', 'wr-fotos', true)
ON CONFLICT (id) DO NOTHING;

-- Policies mínimas del bucket (asumiendo que el proyecto hoy trabaja con
-- la clave anon — ajustar cuando se introduzca auth real).
-- Si ya corrés con otras policies y estas chocan, borrá y re-creá.
DO $$
BEGIN
  -- SELECT (cualquiera puede leer objetos del bucket)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND policyname='wr-fotos-public-read'
  ) THEN
    CREATE POLICY "wr-fotos-public-read"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'wr-fotos');
  END IF;

  -- INSERT (cualquiera con la anon key puede subir al bucket)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND policyname='wr-fotos-anon-insert'
  ) THEN
    CREATE POLICY "wr-fotos-anon-insert"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'wr-fotos');
  END IF;

  -- DELETE (cualquiera con la anon key puede borrar — la app controla
  -- con hasPerm("borrar_foto"))
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND policyname='wr-fotos-anon-delete'
  ) THEN
    CREATE POLICY "wr-fotos-anon-delete"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'wr-fotos');
  END IF;
END $$;
