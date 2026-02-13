-- ============================================================
-- Spotlight: Sistema de Votación de Pitches
-- Tablas: founders, votantes, votos
-- ============================================================

-- 1. Tabla de founders (presentadores de pitch)
CREATE TABLE IF NOT EXISTS founders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  startup_nombre TEXT NOT NULL,
  image_url TEXT,
  pitch_order INTEGER NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Tabla de votantes (asistentes pre-registrados)
CREATE TABLE IF NOT EXISTS votantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp TEXT NOT NULL UNIQUE,
  nombre TEXT,
  categoria TEXT NOT NULL DEFAULT 'espectador'
    CHECK (categoria IN ('espectador', 'jurado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Tabla de votos
CREATE TABLE IF NOT EXISTS votos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  votante_id UUID NOT NULL REFERENCES votantes(id) ON DELETE CASCADE,
  founder_id UUID NOT NULL REFERENCES founders(id) ON DELETE CASCADE,
  score_innovacion INTEGER NOT NULL CHECK (score_innovacion BETWEEN 1 AND 5),
  score_claridad INTEGER NOT NULL CHECK (score_claridad BETWEEN 1 AND 5),
  score_qa INTEGER NOT NULL CHECK (score_qa BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (votante_id, founder_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================

-- founders: lectura pública, escritura desde panel (anon key)
ALTER TABLE founders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "founders_select" ON founders
  FOR SELECT USING (true);

CREATE POLICY "founders_insert" ON founders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "founders_update" ON founders
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "founders_delete" ON founders
  FOR DELETE USING (true);

-- votantes: lectura pública (para verificar whatsapp), escritura desde panel
ALTER TABLE votantes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "votantes_select" ON votantes
  FOR SELECT USING (true);

CREATE POLICY "votantes_insert" ON votantes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "votantes_update" ON votantes
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "votantes_delete" ON votantes
  FOR DELETE USING (true);

-- votos: lectura pública (para dashboard y grayout), inserción pública
ALTER TABLE votos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "votos_select" ON votos
  FOR SELECT USING (true);

CREATE POLICY "votos_insert" ON votos
  FOR INSERT WITH CHECK (true);

-- ============================================================
-- Storage bucket para imágenes de founders
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('founders', 'founders', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "founders_storage_select" ON storage.objects
  FOR SELECT USING (bucket_id = 'founders');

CREATE POLICY "founders_storage_insert" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'founders');

CREATE POLICY "founders_storage_update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'founders') WITH CHECK (bucket_id = 'founders');

CREATE POLICY "founders_storage_delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'founders');
