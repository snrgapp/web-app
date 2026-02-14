-- ============================================================
-- Networking: Verificación por teléfono y feedback
-- - mesa_ronda2 en asistentes
-- - Tabla feedback_networking
-- ============================================================

-- 1. Añadir mesa_ronda2 a asistentes
ALTER TABLE asistentes
ADD COLUMN IF NOT EXISTS mesa_ronda2 TEXT;

CREATE INDEX IF NOT EXISTS idx_asistentes_mesa_ronda2 ON asistentes(mesa_ronda2);
CREATE INDEX IF NOT EXISTS idx_asistentes_telefono ON asistentes(telefono);

-- Política UPDATE para asistentes (editar mesa_ronda2 desde panel)
CREATE POLICY "Allow public update on asistentes" ON asistentes
  FOR UPDATE USING (true) WITH CHECK (true);

-- 2. Tabla feedback_networking
CREATE TABLE IF NOT EXISTS feedback_networking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asistente_id UUID NOT NULL REFERENCES asistentes(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_networking_asistente_id ON feedback_networking(asistente_id);

-- RLS para feedback_networking
ALTER TABLE feedback_networking ENABLE ROW LEVEL SECURITY;

-- SELECT: lectura pública (para panel y consultas)
CREATE POLICY "feedback_networking_select" ON feedback_networking
  FOR SELECT USING (true);

-- INSERT: inserción pública (asistentes envían feedback)
CREATE POLICY "feedback_networking_insert" ON feedback_networking
  FOR INSERT WITH CHECK (true);
