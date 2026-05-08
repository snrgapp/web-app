-- Desafíos, intenciones silenciosas y metadatos de equipos para formación automática.

CREATE TABLE IF NOT EXISTS hackaton_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  max_teams INT NOT NULL DEFAULT 4 CHECK (max_teams >= 1 AND max_teams <= 99),
  sort_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_hackaton_challenges_sort ON hackaton_challenges (sort_order);

ALTER TABLE hackaton_submissions
  ADD COLUMN IF NOT EXISTS challenge_id UUID REFERENCES hackaton_challenges(id) ON DELETE SET NULL;

ALTER TABLE hackaton_submissions
  ADD COLUMN IF NOT EXISTS team_role TEXT NOT NULL DEFAULT 'flexible'
  CHECK (team_role IN ('lider', 'colaborador', 'flexible'));

CREATE INDEX IF NOT EXISTS idx_hackaton_submissions_challenge ON hackaton_submissions (challenge_id);

CREATE TABLE IF NOT EXISTS hackaton_intentions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_submission_id UUID NOT NULL REFERENCES hackaton_submissions(id) ON DELETE CASCADE,
  to_submission_id UUID NOT NULL REFERENCES hackaton_submissions(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'interested' CHECK (type IN ('interested', 'pass')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT hackaton_intentions_no_self CHECK (from_submission_id <> to_submission_id),
  CONSTRAINT hackaton_intentions_unique_pair UNIQUE (from_submission_id, to_submission_id)
);

CREATE INDEX IF NOT EXISTS idx_hackaton_intentions_from ON hackaton_intentions (from_submission_id);
CREATE INDEX IF NOT EXISTS idx_hackaton_intentions_to ON hackaton_intentions (to_submission_id);

ALTER TABLE hackaton_equipos
  ADD COLUMN IF NOT EXISTS challenge_id UUID REFERENCES hackaton_challenges(id) ON DELETE SET NULL;

ALTER TABLE hackaton_equipos
  ADD COLUMN IF NOT EXISTS leader_submission_id UUID REFERENCES hackaton_submissions(id) ON DELETE SET NULL;

ALTER TABLE hackaton_equipos
  ADD COLUMN IF NOT EXISTS mesa TEXT NOT NULL DEFAULT '';

ALTER TABLE hackaton_equipos
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'forming'
  CHECK (status IN ('forming', 'confirmed', 'active'));

ALTER TABLE hackaton_equipos
  ADD COLUMN IF NOT EXISTS auto_formed BOOLEAN NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_hackaton_equipos_challenge ON hackaton_equipos (challenge_id);

-- Badge correlativo 3 dígitos (HCK-YYYY-NNN)
CREATE OR REPLACE FUNCTION set_hackaton_badge_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.badge_id IS NULL OR btrim(NEW.badge_id) = '' THEN
    NEW.badge_id :=
      'HCK-'
      || to_char(EXTRACT(YEAR FROM now())::INT, 'FM9999')
      || '-'
      || lpad(nextval('hackaton_badge_num_seq')::TEXT, 3, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE hackaton_challenges IS 'Desafíos del hackathon; los equipos pueden anclarse a uno.';
COMMENT ON TABLE hackaton_intentions IS 'Interés o pasar entre participantes; solo legible en servidor para matching.';
COMMENT ON COLUMN hackaton_equipos.auto_formed IS 'true si el equipo fue creado por el algoritmo (se puede limpiar en nueva formación).';

CREATE OR REPLACE VIEW v_hackaton_mutual_matches AS
SELECT
  a.from_submission_id AS from_id,
  a.to_submission_id AS to_id
FROM hackaton_intentions a
JOIN hackaton_intentions b
  ON a.from_submission_id = b.to_submission_id
 AND a.to_submission_id = b.from_submission_id
WHERE a.type = 'interested'
  AND b.type = 'interested';

CREATE OR REPLACE VIEW v_hackaton_exclusions AS
SELECT from_submission_id AS from_id, to_submission_id AS to_id
FROM hackaton_intentions
WHERE type = 'pass';

ALTER TABLE hackaton_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackaton_intentions ENABLE ROW LEVEL SECURITY;

CREATE POLICY hackaton_challenges_select_authenticated
  ON hackaton_challenges FOR SELECT TO authenticated USING (true);

-- Sin políticas de lectura para intenciones: solo service_role en app server.

COMMENT ON VIEW v_hackaton_mutual_matches IS 'Pares con interested mutuo (matching).';
COMMENT ON VIEW v_hackaton_exclusions IS 'Pares con pass unilateral (bloquean mismo equipo).';

INSERT INTO hackaton_challenges (name, description, max_teams, sort_order)
SELECT v.name, v.description, v.max_teams, v.sort_order
FROM (
  VALUES
    ('Datos y visualización'::TEXT, 'Retos con datos y dashboards'::TEXT, 4::INT, 1::SMALLINT),
    ('Experiencia de usuario'::TEXT, 'Interfaces y flujo de producto'::TEXT, 4::INT, 2::SMALLINT),
    ('Automatización'::TEXT, 'Scripts, APIs y eficiencia'::TEXT, 4::INT, 3::SMALLINT),
    ('Abierto'::TEXT, 'Propuesta libre del equipo'::TEXT, 4::INT, 4::SMALLINT)
) AS v(name, description, max_teams, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM hackaton_challenges LIMIT 1);
