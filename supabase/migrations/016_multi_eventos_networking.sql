-- ============================================================
-- Multi-eventos networking: checkin_slug en eventos, evento_id en asistentes
-- Permite múltiples eventos simultáneos con check-in independiente
-- ============================================================

-- 1. Añadir checkin_slug a eventos (identificador corto para URL QR)
ALTER TABLE eventos
ADD COLUMN IF NOT EXISTS checkin_slug TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_eventos_checkin_slug_unique
  ON eventos(checkin_slug) WHERE checkin_slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_eventos_checkin_slug ON eventos(checkin_slug);

-- 2. Crear evento legacy para asistentes existentes (solo si no existe)
INSERT INTO eventos (titulo, image_url, link, orden, checkin_slug)
SELECT
  'Evento histórico',
  'https://placehold.co/400x200?text=Legacy',
  'https://snrg.lat',
  -1,
  'legacy'
WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE checkin_slug = 'legacy' LIMIT 1);

-- 3-6. Añadir evento_id, asignar legacy, índices
DO $$
DECLARE
  legacy_id UUID;
BEGIN
  SELECT id INTO legacy_id FROM eventos WHERE checkin_slug = 'legacy' LIMIT 1;

  IF legacy_id IS NOT NULL THEN
    -- 3. Añadir evento_id a asistentes
    ALTER TABLE asistentes
    ADD COLUMN IF NOT EXISTS evento_id UUID REFERENCES eventos(id) ON DELETE SET NULL;

    -- 4. Asignar asistentes existentes al evento legacy
    UPDATE asistentes SET evento_id = legacy_id WHERE evento_id IS NULL;

    -- 5. Índices para búsqueda eficiente
    CREATE INDEX IF NOT EXISTS idx_asistentes_evento_id ON asistentes(evento_id);
    CREATE INDEX IF NOT EXISTS idx_asistentes_evento_telefono ON asistentes(evento_id, telefono);

    -- 6. Índice compuesto para búsquedas (unicidad opcional omitida por compatibilidad)
  END IF;
END $$;

-- 7. Política DELETE para reemplazo de asistentes por evento (importación CSV)
DROP POLICY IF EXISTS "Allow public delete on asistentes" ON asistentes;
CREATE POLICY "Allow public delete on asistentes" ON asistentes
  FOR DELETE USING (true);
