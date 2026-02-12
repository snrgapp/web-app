-- Forms: formularios de inscripción con campos personalizados (JSON)
-- Vinculados opcionalmente a eventos para contexto
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  evento_id UUID REFERENCES eventos(id) ON DELETE SET NULL,
  slug TEXT NOT NULL UNIQUE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  campos JSONB NOT NULL DEFAULT '[]',
  activo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_forms_slug ON forms(slug);
CREATE INDEX IF NOT EXISTS idx_forms_evento_id ON forms(evento_id);
CREATE INDEX IF NOT EXISTS idx_forms_activo ON forms(activo) WHERE activo = true;

ALTER TABLE forms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on forms" ON forms
  FOR SELECT USING (activo = true);

CREATE POLICY "Allow public insert on forms" ON forms
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on forms" ON forms
  FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on forms" ON forms
  FOR DELETE USING (true);

-- Form submissions: inscripciones con datos que coinciden con la configuración del form
CREATE TABLE IF NOT EXISTS form_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  datos JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on form_submissions" ON form_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on form_submissions" ON form_submissions
  FOR SELECT USING (true);

COMMENT ON TABLE forms IS 'Formularios de inscripción con campos personalizados definidos en JSON';
COMMENT ON COLUMN forms.campos IS 'Array JSON de configuraciones: [{key, label, type, required, options?}]';
COMMENT ON TABLE form_submissions IS 'Inscripciones/ respuestas enviadas por asistentes';
COMMENT ON COLUMN form_submissions.datos IS 'Objeto JSON con valores que coinciden con los keys de forms.campos';
