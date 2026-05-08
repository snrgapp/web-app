-- Hackathon Barranquilla / SNRG — inscripciones, equipos, matches
-- Ejecutar en Supabase Dashboard (Realtime): Database → Replication → añadir tablas
--   hackaton_equipos, hackaton_equipo_miembros si no se aplican vía migración.

CREATE SEQUENCE IF NOT EXISTS hackaton_badge_num_seq;

CREATE TABLE IF NOT EXISTS hackaton_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo TEXT NOT NULL CHECK (
    char_length(trim(nombre_completo)) BETWEEN 2 AND 200
  ),
  telefono TEXT NOT NULL CHECK (
    telefono ~ '^[0-9]{7,15}$'
  ),
  perfil TEXT NOT NULL CHECK (perfil IN (
    'frontend',
    'backend',
    'full_stack',
    'data_analyst'
  )),
  lenguajes TEXT[] NOT NULL CHECK (
    array_length(lenguajes, 1) IS NOT NULL
    AND array_length(lenguajes, 1) >= 1
    AND lenguajes <@ ARRAY[
      'Python',
      'JavaScript',
      'C++',
      'TypeScript',
      'Java',
      'Go',
      'Rust',
      'SQL'
    ]::TEXT[]
  ),
  nivel_experiencia TEXT NOT NULL CHECK (nivel_experiencia IN (
    'principiante',
    'intermedio',
    'avanzado'
  )),
  badge_id TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_hackaton_submissions_telefono_unique
  ON hackaton_submissions (telefono);

CREATE INDEX IF NOT EXISTS idx_hackaton_submissions_created_at
  ON hackaton_submissions (created_at DESC);

CREATE OR REPLACE FUNCTION set_hackaton_badge_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.badge_id IS NULL OR btrim(NEW.badge_id) = '' THEN
    NEW.badge_id :=
      'HCK-'
      || to_char(EXTRACT(YEAR FROM now())::INT, 'FM9999')
      || '-'
      || lpad(nextval('hackaton_badge_num_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_hackaton_badge_id ON hackaton_submissions;
CREATE TRIGGER trg_hackaton_badge_id
  BEFORE INSERT ON hackaton_submissions
  FOR EACH ROW
  EXECUTE PROCEDURE set_hackaton_badge_id();

COMMENT ON TABLE hackaton_submissions IS
  'Inscripciones hackathon (formulario hackaton.snrg.lat); acceso app vía teléfono.';

CREATE TABLE IF NOT EXISTS hackaton_equipos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  numero SMALLINT NOT NULL CHECK (numero >= 1),
  nombre TEXT NOT NULL DEFAULT '',
  cupos_max SMALLINT NOT NULL DEFAULT 5 CHECK (cupos_max BETWEEN 1 AND 20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT hackaton_equipos_numero_unique UNIQUE (numero)
);

CREATE INDEX IF NOT EXISTS idx_hackaton_equipos_numero ON hackaton_equipos (numero);

CREATE TABLE IF NOT EXISTS hackaton_equipo_miembros (
  equipo_id UUID NOT NULL REFERENCES hackaton_equipos(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES hackaton_submissions(id) ON DELETE CASCADE,
  ronda SMALLINT NOT NULL CHECK (ronda IN (1, 2)),
  orden INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (equipo_id, submission_id, ronda)
);

CREATE INDEX IF NOT EXISTS idx_hackaton_equipo_miembros_sub
  ON hackaton_equipo_miembros (submission_id, ronda);

CREATE INDEX IF NOT EXISTS idx_hackaton_equipo_miembros_equipo_ronda
  ON hackaton_equipo_miembros (equipo_id, ronda);

CREATE INDEX IF NOT EXISTS idx_hackaton_equipo_miembros_created
  ON hackaton_equipo_miembros (created_at DESC);

CREATE TABLE IF NOT EXISTS match_hackaton (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES hackaton_submissions(id) ON DELETE CASCADE,
  matched_submission_id UUID NOT NULL REFERENCES hackaton_submissions(id) ON DELETE CASCADE,
  ronda SMALLINT NOT NULL CHECK (ronda IN (1, 2)),
  razon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT match_hackaton_no_self CHECK (submission_id <> matched_submission_id),
  CONSTRAINT match_hackaton_unique_pair UNIQUE (submission_id, matched_submission_id, ronda)
);

CREATE INDEX IF NOT EXISTS idx_match_hackaton_viewer
  ON match_hackaton (submission_id, ronda);

ALTER TABLE hackaton_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackaton_equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackaton_equipo_miembros ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_hackaton ENABLE ROW LEVEL SECURITY;

-- Panel (Supabase Auth): lectura para Realtime y tablas; escritura vía service role en server actions.
CREATE POLICY hackaton_submissions_select_authenticated
  ON hackaton_submissions FOR SELECT TO authenticated USING (true);

CREATE POLICY hackaton_equipos_select_authenticated
  ON hackaton_equipos FOR SELECT TO authenticated USING (true);

CREATE POLICY hackaton_equipo_miembros_select_authenticated
  ON hackaton_equipo_miembros FOR SELECT TO authenticated USING (true);

CREATE POLICY match_hackaton_select_authenticated
  ON match_hackaton FOR SELECT TO authenticated USING (true);

COMMENT ON TABLE hackaton_equipos IS 'Equipos del hackathon (vista en panel y sticky en app).';
COMMENT ON TABLE hackaton_equipo_miembros IS 'Asignación de participantes a equipo por ronda; Realtime en panel.';
COMMENT ON TABLE match_hackaton IS 'Sugerencias de conexión por ronda (población manual o job futuro).';

-- Replicación Realtime (Supabase hosted: suele existir publicación supabase_realtime)
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE hackaton_equipos;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime ADD TABLE hackaton_equipo_miembros;
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;
