-- Genius FEST — feedback post dinámica de preguntas / tarjetas
CREATE TABLE IF NOT EXISTS genius_networking_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES genius_conecta_submissions(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_genius_networking_feedback_submission
  ON genius_networking_feedback (submission_id, created_at DESC);

ALTER TABLE genius_networking_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY genius_networking_feedback_select_authenticated
  ON genius_networking_feedback FOR SELECT TO authenticated USING (true);

CREATE POLICY genius_networking_feedback_insert_public
  ON genius_networking_feedback FOR INSERT WITH CHECK (true);

COMMENT ON TABLE genius_networking_feedback IS
  'Calificación y comentario tras completar ronda 2 de la dinámica de preguntas Genius FEST.';
