-- Tabla de asistentes para importación desde CSV
CREATE TABLE IF NOT EXISTS asistentes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nombre TEXT,
  apellido TEXT,
  telefono TEXT,
  correo TEXT,
  empresa TEXT,
  sector TEXT,
  soluciones TEXT,
  desafios TEXT,
  mesa TEXT,
  codigo_mesa TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_asistentes_correo ON asistentes(correo);
CREATE INDEX IF NOT EXISTS idx_asistentes_mesa ON asistentes(mesa);
CREATE INDEX IF NOT EXISTS idx_asistentes_codigo_mesa ON asistentes(codigo_mesa);

ALTER TABLE asistentes ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública (para mostrar en el dashboard)
CREATE POLICY "Allow public read access on asistentes" ON asistentes
  FOR SELECT USING (true);

-- Permitir inserción pública (para importación CSV desde el dashboard)
CREATE POLICY "Allow public insert on asistentes" ON asistentes
  FOR INSERT WITH CHECK (true);
