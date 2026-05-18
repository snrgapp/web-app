-- Paso 3 del formulario IEEE: conocimiento a ofrecer (valor fijo, ya no texto libre)

ALTER TABLE ieee_networking_submissions
  DROP CONSTRAINT IF EXISTS ieee_networking_submissions_habilidades_compartir_check;

-- Registros previos con texto libre: asignar un valor válido por defecto
UPDATE ieee_networking_submissions
SET habilidades_compartir = 'Desarrollo de software'
WHERE habilidades_compartir IS NOT NULL
  AND habilidades_compartir NOT IN (
    'Desarrollo de software',
    'Inteligencia Artificial / Machine Learning',
    'Ciencia de Datos',
    'Ciberseguridad',
    'Robótica e IoT',
    'Electrónica y hardware'
  );

ALTER TABLE ieee_networking_submissions
  ADD CONSTRAINT ieee_networking_submissions_habilidades_compartir_check
  CHECK (
    habilidades_compartir IN (
      'Desarrollo de software',
      'Inteligencia Artificial / Machine Learning',
      'Ciencia de Datos',
      'Ciberseguridad',
      'Robótica e IoT',
      'Electrónica y hardware'
    )
  );

COMMENT ON COLUMN ieee_networking_submissions.habilidades_compartir IS
  'Tipo de conocimiento que el asistente podría ofrecer (paso 3 del formulario IEEE).';
