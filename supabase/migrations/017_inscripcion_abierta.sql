-- Añadir control manual de inscripción por evento
ALTER TABLE eventos
ADD COLUMN IF NOT EXISTS inscripcion_abierta BOOLEAN NOT NULL DEFAULT true;

COMMENT ON COLUMN eventos.inscripcion_abierta IS 'Si false, el botón Registrarse no se muestra en la página del evento';
