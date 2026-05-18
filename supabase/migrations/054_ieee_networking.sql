-- IEEE networking — formulario ieee.snrg.lat + matches por ronda (app.snrg.lat)

CREATE TABLE IF NOT EXISTS ieee_networking_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo TEXT NOT NULL CHECK (
    char_length(trim(nombre_completo)) BETWEEN 2 AND 200
  ),
  telefono TEXT NOT NULL CHECK (
    telefono ~ '^[0-9]{7,15}$'
  ),
  correo TEXT NOT NULL CHECK (
    char_length(trim(correo)) BETWEEN 5 AND 320
    AND correo ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
  ),
  areas_interes TEXT[] NOT NULL CHECK (
    cardinality(areas_interes) BETWEEN 1 AND 6
    AND areas_interes <@ ARRAY[
      'Inteligencia Artificial',
      'Ciencia de Datos',
      'Ciberseguridad',
      'IoT',
      'Robótica',
      'Desarrollo de Software'
    ]::TEXT[]
  ),
  habilidades_compartir TEXT NOT NULL CHECK (
    char_length(trim(habilidades_compartir)) BETWEEN 3 AND 2000
  ),
  tipos_conexion TEXT[] NOT NULL CHECK (
    cardinality(tipos_conexion) BETWEEN 1 AND 5
    AND tipos_conexion <@ ARRAY[
      'Mentoría',
      'Socios para proyectos',
      'Oportunidades laborales',
      'Colaboración en investigación',
      'Amistades profesionales'
    ]::TEXT[]
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ieee_networking_telefono_unique
  ON ieee_networking_submissions (telefono);

CREATE INDEX IF NOT EXISTS idx_ieee_networking_created_at
  ON ieee_networking_submissions (created_at DESC);

ALTER TABLE ieee_networking_submissions ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE ieee_networking_submissions IS
  'IEEE networking — respuestas del formulario ieee.snrg.lat; acceso app por teléfono.';

CREATE POLICY ieee_networking_submissions_select_authenticated
  ON ieee_networking_submissions FOR SELECT TO authenticated USING (true);

CREATE TABLE IF NOT EXISTS match_ieee (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES ieee_networking_submissions(id) ON DELETE CASCADE,
  matched_submission_id UUID NOT NULL REFERENCES ieee_networking_submissions(id) ON DELETE CASCADE,
  ronda SMALLINT NOT NULL CHECK (ronda IN (1, 2)),
  razon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT match_ieee_no_self CHECK (submission_id <> matched_submission_id),
  CONSTRAINT match_ieee_unique_pair UNIQUE (submission_id, matched_submission_id, ronda)
);

CREATE INDEX IF NOT EXISTS idx_match_ieee_viewer
  ON match_ieee (submission_id, ronda);

ALTER TABLE match_ieee ENABLE ROW LEVEL SECURITY;

CREATE POLICY match_ieee_select_authenticated
  ON match_ieee FOR SELECT TO authenticated USING (true);

COMMENT ON TABLE match_ieee IS
  'Sugerencias de conexión IEEE por ronda (población vía servicio interno).';

CREATE TABLE IF NOT EXISTS ieee_networking_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES ieee_networking_submissions(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ieee_networking_feedback_submission
  ON ieee_networking_feedback (submission_id, created_at DESC);

ALTER TABLE ieee_networking_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY ieee_networking_feedback_select_authenticated
  ON ieee_networking_feedback FOR SELECT TO authenticated USING (true);

CREATE POLICY ieee_networking_feedback_insert_public
  ON ieee_networking_feedback FOR INSERT WITH CHECK (true);

COMMENT ON TABLE ieee_networking_feedback IS
  'Calificación y comentario tras completar ronda 2 de la dinámica IEEE.';
