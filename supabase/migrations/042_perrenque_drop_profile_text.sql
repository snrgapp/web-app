-- Deja de guardar profile_text; las conexiones usan los campos tipados.
ALTER TABLE perrenque_conecta_submissions
  DROP COLUMN IF EXISTS profile_text;
