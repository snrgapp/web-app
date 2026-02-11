-- Añadir columna fecha a eventos (fecha del evento; si es pasada, aparece en "Eventos pasados")
ALTER TABLE eventos
  ADD COLUMN IF NOT EXISTS fecha DATE;

CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON eventos(fecha);

COMMENT ON COLUMN eventos.fecha IS 'Fecha del evento; NULL = se considera próximo';
