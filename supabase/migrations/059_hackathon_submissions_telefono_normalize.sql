-- Permite CSV/import con teléfonos con espacios, guiones o + ; se guardan solo dígitos (cumple CHECK existente).

CREATE OR REPLACE FUNCTION hackaton_normalize_telefono()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.telefono IS NOT NULL THEN
    NEW.telefono := regexp_replace(NEW.telefono, '\D', '', 'g');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_hackaton_normalize_telefono ON hackaton_submissions;

CREATE TRIGGER trg_hackaton_normalize_telefono
  BEFORE INSERT OR UPDATE ON hackaton_submissions
  FOR EACH ROW
  EXECUTE PROCEDURE hackaton_normalize_telefono();

COMMENT ON FUNCTION hackaton_normalize_telefono() IS
  'Deja telefono solo en dígitos antes del CHECK /^[0-9]{7,15}$/ (import desde Excel/sheets).';
