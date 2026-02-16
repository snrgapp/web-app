-- Campo "Acerca del Evento" para descripción del evento
ALTER TABLE eventos
ADD COLUMN IF NOT EXISTS acerca_del_evento TEXT;

COMMENT ON COLUMN eventos.acerca_del_evento IS 'Descripción del evento, mostrada en la página del evento';
