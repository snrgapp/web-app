-- Genius FEST: mundo ya no se recopila en el formulario (pregunta eliminada).
-- Se hace nullable para no romper filas históricas que sí tienen el valor.

ALTER TABLE genius_conecta_submissions
  ALTER COLUMN mundo DROP NOT NULL;
