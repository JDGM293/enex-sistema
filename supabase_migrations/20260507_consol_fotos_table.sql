-- 20260507_consol_fotos_table.sql
-- Sistema de fotos de los contenedores asociadas a una Consolidación (Embarque).
-- Las fotos viven en Supabase Storage (bucket "consol-fotos") y esta tabla
-- mantiene la metadata: qué archivo, de qué contenedor de qué consolidación,
-- quién la subió, cuándo.
--
-- Por cada contenedor dentro de un Embarque puede haber 0..N fotos.
-- El borrado de la consolidación elimina en cascada los registros (pero NO los blobs
-- de Storage — ese cleanup se hace en código app al borrar o vía hook/función).

CREATE TABLE IF NOT EXISTS consol_fotos (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consol_id      text NOT NULL REFERENCES public.consolidaciones(id) ON DELETE CASCADE,
  container_idx  integer NOT NULL DEFAULT 0,
  url            text NOT NULL,           -- URL pública del blob en storage
  path           text NOT NULL,           -- path dentro del bucket (para borrar)
  filename       text DEFAULT '',
  mime           text DEFAULT 'image/jpeg',
  size_bytes     integer,
  source         text DEFAULT 'upload',   -- 'upload' | 'webcam'
  uploaded_by    text DEFAULT '',
  created_at     timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS consol_fotos_consol_idx       ON consol_fotos (consol_id);
CREATE INDEX IF NOT EXISTS consol_fotos_consol_cont_idx  ON consol_fotos (consol_id, container_idx);
CREATE INDEX IF NOT EXISTS consol_fotos_created_idx      ON consol_fotos (created_at DESC);

-- ── Storage bucket ─────────────────────────────────────────────────────────
-- Si el bucket ya existe no se toca. Público para lectura (cualquiera con
-- URL lo ve). La escritura la sigue controlando la app (la clave anon solo
-- inserta si la policy lo permite).
INSERT INTO storage.buckets (id, name, public)
VALUES ('consol-fotos', 'consol-fotos', true)
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
      AND policyname='consol-fotos-public-read'
  ) THEN
    CREATE POLICY "consol-fotos-public-read"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'consol-fotos');
  END IF;

  -- INSERT (cualquiera con la anon key puede subir al bucket)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND policyname='consol-fotos-anon-insert'
  ) THEN
    CREATE POLICY "consol-fotos-anon-insert"
      ON storage.objects FOR INSERT
      WITH CHECK (bucket_id = 'consol-fotos');
  END IF;

  -- DELETE (cualquiera con la anon key puede borrar — la app controla
  -- con hasPerm("borrar_foto"))
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND policyname='consol-fotos-anon-delete'
  ) THEN
    CREATE POLICY "consol-fotos-anon-delete"
      ON storage.objects FOR DELETE
      USING (bucket_id = 'consol-fotos');
  END IF;
END $$;
