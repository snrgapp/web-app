-- Añadir password_hash a members para login con teléfono + contraseña
ALTER TABLE members ADD COLUMN IF NOT EXISTS password_hash TEXT;

CREATE INDEX IF NOT EXISTS idx_members_password_hash ON members(phone) WHERE password_hash IS NOT NULL;

COMMENT ON COLUMN members.password_hash IS 'Hash bcrypt de la contraseña del miembro. Null = miembro aún sin configurar contraseña';
