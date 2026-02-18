-- Agregar columna ciudad a la tabla leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ciudad TEXT;
