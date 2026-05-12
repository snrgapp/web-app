-- Genius FEST — formulario Conéctate + matches por ronda
CREATE TABLE IF NOT EXISTS genius_conecta_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo TEXT NOT NULL CHECK (
    char_length(trim(nombre_completo)) BETWEEN 2 AND 200
  ),
  telefono TEXT NOT NULL CHECK (
    telefono ~ '^[0-9]{7,15}$'
  ),
  identidad TEXT NOT NULL CHECK (identidad IN (
    'Estudiante',
    'Emprendedor/a',
    'Empleado en empresa',
    'Freelance / Independiente',
    'Dueño/a de negocio',
    'Creativo/a'
  )),
  motivacion TEXT NOT NULL CHECK (motivacion IN (
    'Aprender algo nuevo',
    'Encontrar clientes o proyectos',
    'Conectar con personas afines',
    'Buscar empleo u oportunidades',
    'Curiosidad / me invitaron'
  )),
  mundo TEXT NOT NULL CHECK (mundo IN (
    'Marketing y publicidad',
    'Tecnología e innovación',
    'Negocios y emprendimiento',
    'Arte, cultura y medios',
    'Educación y academia',
    'Comunicación corporativa'
  )),
  valor_humano TEXT NOT NULL CHECK (
    char_length(valor_humano) BETWEEN 3 AND 200
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_genius_conecta_telefono_unique
  ON genius_conecta_submissions (telefono);

CREATE INDEX IF NOT EXISTS idx_genius_conecta_created_at
  ON genius_conecta_submissions (created_at DESC);

ALTER TABLE genius_conecta_submissions ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE genius_conecta_submissions IS
  'Genius FEST — respuestas del formulario www.genius.snrg.lat; acceso app por teléfono.';

CREATE TABLE IF NOT EXISTS match_genius (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES genius_conecta_submissions(id) ON DELETE CASCADE,
  matched_submission_id UUID NOT NULL REFERENCES genius_conecta_submissions(id) ON DELETE CASCADE,
  ronda SMALLINT NOT NULL CHECK (ronda IN (1, 2)),
  razon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT match_genius_no_self CHECK (submission_id <> matched_submission_id),
  CONSTRAINT match_genius_unique_pair UNIQUE (submission_id, matched_submission_id, ronda)
);

CREATE INDEX IF NOT EXISTS idx_match_genius_viewer
  ON match_genius (submission_id, ronda);

ALTER TABLE match_genius ENABLE ROW LEVEL SECURITY;

CREATE POLICY genius_conecta_submissions_select_authenticated
  ON genius_conecta_submissions FOR SELECT TO authenticated USING (true);

CREATE POLICY match_genius_select_authenticated
  ON match_genius FOR SELECT TO authenticated USING (true);

COMMENT ON TABLE match_genius IS
  'Sugerencias de conexión Genius FEST por ronda (población vía servicio interno).';
