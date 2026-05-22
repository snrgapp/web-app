-- Registro hackathon: solo nombre, teléfono, perfil (+ badge_id, created_at).
DROP INDEX IF EXISTS idx_hackaton_submissions_challenge;

ALTER TABLE hackaton_submissions
  DROP COLUMN IF EXISTS challenge_id,
  DROP COLUMN IF EXISTS lenguajes,
  DROP COLUMN IF EXISTS nivel_experiencia,
  DROP COLUMN IF EXISTS team_role;

COMMENT ON TABLE hackaton_submissions IS
  'Inscripciones hackathon (formulario hackaton.snrg.lat): nombre, teléfono, perfil; acceso app vía teléfono.';
