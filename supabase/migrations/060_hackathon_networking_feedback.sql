-- Feedback post-meet & greet hackathon (estrellas + comentario opcional).

CREATE TABLE IF NOT EXISTS hackaton_networking_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES hackaton_submissions(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT hackaton_networking_feedback_submission_unique UNIQUE (submission_id)
);

CREATE INDEX IF NOT EXISTS idx_hackaton_networking_feedback_created
  ON hackaton_networking_feedback (created_at DESC);

ALTER TABLE hackaton_networking_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY hackaton_networking_feedback_select_authenticated
  ON hackaton_networking_feedback FOR SELECT TO authenticated USING (true);

CREATE POLICY hackaton_networking_feedback_insert_public
  ON hackaton_networking_feedback FOR INSERT WITH CHECK (true);

COMMENT ON TABLE hackaton_networking_feedback IS
  'Calificación después del networking hackathon (una fila por inscripción).';
