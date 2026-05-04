-- Perrenque Creativo 2026 — formulario "Conéctate" (campos exclusivos de este evento)
CREATE TABLE IF NOT EXISTS perrenque_conecta_submissions (
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
    char_length(valor_humano) BETWEEN 1 AND 200
  ),
  profile_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_perrenque_conecta_telefono_unique
  ON perrenque_conecta_submissions (telefono);

CREATE INDEX IF NOT EXISTS idx_perrenque_conecta_created_at
  ON perrenque_conecta_submissions (created_at DESC);

ALTER TABLE perrenque_conecta_submissions ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE perrenque_conecta_submissions IS
  'Respuestas del micro-formulario de networking Perrenque Creativo 2026 (subdominio perrenque); no comparte esquema con otros eventos.';
