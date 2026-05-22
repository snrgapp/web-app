-- perfil como texto libre (ej. "estudiante", import CSV, respuestas abiertas).

ALTER TABLE hackaton_submissions
  DROP CONSTRAINT IF EXISTS hackaton_submissions_perfil_check;

ALTER TABLE hackaton_submissions
  ADD CONSTRAINT hackaton_submissions_perfil_trim_check
  CHECK (
    char_length(trim(perfil)) BETWEEN 1 AND 200
  );

COMMENT ON COLUMN hackaton_submissions.perfil IS
  'Rol o descripción abierta por el participante u organizadores (max 200 caracteres).';
