-- Tabla de mensajes de contacto (formulario Contáctanos)
CREATE TABLE IF NOT EXISTS contactos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT,
  whatsapp TEXT,
  correo TEXT,
  mensaje TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contactos_created_at ON contactos(created_at);

ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on contactos" ON contactos
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on contactos" ON contactos
  FOR SELECT USING (true);
