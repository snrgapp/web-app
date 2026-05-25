-- Genius FEST: identidad paso 2 como arquetipos (manteniendo valores legacy en filas históricas).

ALTER TABLE genius_conecta_submissions
  DROP CONSTRAINT IF EXISTS genius_conecta_submissions_identidad_check;

ALTER TABLE genius_conecta_submissions
  ADD CONSTRAINT genius_conecta_submissions_identidad_check
  CHECK (
    identidad IN (
      'Estudiante',
      'Emprendedor/a',
      'Empleado en empresa',
      'Freelance / Independiente',
      'Dueño/a de negocio',
      'Creativo/a',
      'El líder que quiere mover la aguja',
      'El creador de futuro',
      'El explorador tech',
      'El conector estratégico',
      'La tejedor/a de transformación territorial'
    )
  );

COMMENT ON COLUMN genius_conecta_submissions.identidad IS
  'Arquetipo o perfil legado Genius FEST; nuevo formulario genius.snrg.lat usa los 5 arquetipos.';
