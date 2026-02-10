-- Tabla de eventos para la página /eventos (imagen + enlace, orden)
CREATE TABLE IF NOT EXISTS eventos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT,
  image_url TEXT NOT NULL,
  link TEXT NOT NULL,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_eventos_orden ON eventos(orden);

ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

-- Lectura pública para la página de eventos
CREATE POLICY "Allow public read on eventos" ON eventos
  FOR SELECT USING (true);

-- Inserción/actualización/borrado: permitir para que el panel pueda gestionar (mismo patrón que asistentes)
CREATE POLICY "Allow public insert on eventos" ON eventos
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on eventos" ON eventos
  FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on eventos" ON eventos
  FOR DELETE USING (true);

-- Storage: crear bucket "eventos" en Dashboard (Storage > New bucket, nombre: eventos, Public: sí).
-- Políticas en el bucket: permitir SELECT público, INSERT/UPDATE/DELETE para subir desde el panel.
