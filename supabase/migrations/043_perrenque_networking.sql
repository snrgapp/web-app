-- Preguntas por ronda (app networking Perrenque)
CREATE TABLE IF NOT EXISTS perrenque_preguntas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contenido TEXT NOT NULL,
  ronda SMALLINT NOT NULL CHECK (ronda IN (1, 2)),
  orden INT NOT NULL DEFAULT 0,
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_perrenque_preguntas_ronda
  ON perrenque_preguntas (ronda)
  WHERE activo = true;

-- Número de grupo visible por persona y ronda ("Grupo 3")
CREATE TABLE IF NOT EXISTS perrenque_grupo_ronda (
  submission_id UUID NOT NULL REFERENCES perrenque_conecta_submissions(id) ON DELETE CASCADE,
  ronda SMALLINT NOT NULL CHECK (ronda IN (1, 2)),
  grupo_numero SMALLINT NOT NULL,
  PRIMARY KEY (submission_id, ronda)
);

CREATE INDEX IF NOT EXISTS idx_perrenque_grupo_ronda_num
  ON perrenque_grupo_ronda (grupo_numero, ronda);

-- Matches sugeridos (IA) entre inscritos
CREATE TABLE IF NOT EXISTS match_perrenque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES perrenque_conecta_submissions(id) ON DELETE CASCADE,
  matched_submission_id UUID NOT NULL REFERENCES perrenque_conecta_submissions(id) ON DELETE CASCADE,
  ronda SMALLINT NOT NULL CHECK (ronda IN (1, 2)),
  razon TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT match_perrenque_no_self CHECK (submission_id <> matched_submission_id),
  CONSTRAINT match_perrenque_unique_pair UNIQUE (submission_id, matched_submission_id, ronda)
);

CREATE INDEX IF NOT EXISTS idx_match_perrenque_viewer
  ON match_perrenque (submission_id, ronda);

-- Feedback post dinámica (una vez por submission)
CREATE TABLE IF NOT EXISTS feedback_perrenque (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES perrenque_conecta_submissions(id) ON DELETE CASCADE,
  rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT feedback_perrenque_one_per_user UNIQUE (submission_id)
);

ALTER TABLE perrenque_preguntas ENABLE ROW LEVEL SECURITY;
ALTER TABLE perrenque_grupo_ronda ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_perrenque ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_perrenque ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE perrenque_preguntas IS 'Preguntas del networking en app (Perrenque), por ronda.';
COMMENT ON TABLE perrenque_grupo_ronda IS 'Asignación de número de grupo por inscrito y ronda (UI).';
COMMENT ON TABLE match_perrenque IS 'Conexiones sugeridas entre inscritos; población vía job Groq.';
COMMENT ON TABLE feedback_perrenque IS 'Calificación 1–5 tras completar la dinámica Perrenque en app.';

-- Seed inicial idempotente
INSERT INTO perrenque_preguntas (contenido, ronda, orden)
SELECT v.contenido, v.ronda::smallint, v.orden
FROM (
  VALUES
    ('¿Qué te motivó a venir hoy y qué esperas llevarte al final del día?', 1, 1),
    ('Cuéntale a tu grupo una idea o proyecto que te emocione ahora mismo.', 1, 2),
    ('¿Qué habilidad tuya podría ayudar a alguien de tu grupo esta semana?', 1, 3),
    ('Si tuvieras que presentarte en una sola frase creativa, ¿cuál sería?', 1, 4),
    ('¿Qué tipo de personas o perfiles te gustaría conocer antes de irte?', 2, 1),
    ('Comparte algo que hayas aprendido en el evento que no sabías esta mañana.', 2, 2),
    ('¿Con quién del grupo te gustaría seguir la conversación después — y sobre qué tema?', 2, 3),
    ('¿Qué harías diferente en tu próximo networking para conectar mejor?', 2, 4)
) AS v(contenido, ronda, orden)
WHERE NOT EXISTS (
  SELECT 1 FROM perrenque_preguntas p WHERE p.contenido = v.contenido AND p.ronda = v.ronda::smallint
);
