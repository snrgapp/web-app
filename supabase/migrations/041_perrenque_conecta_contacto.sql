-- Añade nombre y teléfono para proyectos que ya aplicaron una versión anterior de 040.
-- Teléfono en dígitos (7–15); índice único para usarlo como llave en la app.
ALTER TABLE perrenque_conecta_submissions
  ADD COLUMN IF NOT EXISTS nombre_completo TEXT,
  ADD COLUMN IF NOT EXISTS telefono TEXT;

COMMENT ON COLUMN perrenque_conecta_submissions.nombre_completo IS
  'Nombre completo del participante.';

COMMENT ON COLUMN perrenque_conecta_submissions.telefono IS
  'Teléfono solo dígitos (7–15); único por fila para usarlo como llave en la app.';

CREATE UNIQUE INDEX IF NOT EXISTS idx_perrenque_conecta_telefono_unique
  ON perrenque_conecta_submissions (telefono);
