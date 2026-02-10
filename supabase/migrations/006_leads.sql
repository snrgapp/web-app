-- Tabla de leads: correos de quienes se registran desde la página de inicio (Hero)
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Lectura para listar leads en el panel
CREATE POLICY "Allow public read on leads" ON leads
  FOR SELECT USING (true);
