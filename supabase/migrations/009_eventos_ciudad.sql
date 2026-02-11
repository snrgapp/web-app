-- Agregar campo ciudad a la tabla eventos
ALTER TABLE eventos ADD COLUMN IF NOT EXISTS ciudad TEXT;
