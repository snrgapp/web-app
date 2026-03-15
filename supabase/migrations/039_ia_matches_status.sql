-- Permitir status aceptado_a y otros valores en ia_matches
ALTER TABLE ia_matches
DROP CONSTRAINT IF EXISTS ia_matches_status_check;
