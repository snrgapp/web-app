-- Agregar ciudad a members para filtrar recomendaciones por ciudad
ALTER TABLE members ADD COLUMN IF NOT EXISTS ciudad TEXT;

CREATE INDEX IF NOT EXISTS idx_members_ciudad ON members(ciudad) WHERE ciudad IS NOT NULL;

COMMENT ON COLUMN members.ciudad IS 'Ciudad del miembro (Cartagena, Barranquilla, etc.) - usado para filtrar conexiones de la misma ciudad';
