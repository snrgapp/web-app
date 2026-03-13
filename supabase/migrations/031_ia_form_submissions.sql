-- Formulario IA Nova (/ia) - datos recolectados para validar modelo
-- Separado del resto de tablas para validación independiente

CREATE TABLE IF NOT EXISTS ia_form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rol TEXT,
  nombre_completo TEXT NOT NULL,
  nombre_empresa TEXT,
  url_sitio_web TEXT,
  que_vende TEXT,
  telefono TEXT NOT NULL,
  email_empresa TEXT,
  linkedin TEXT,
  como_vende TEXT,
  desafios_puntos_dolor TEXT,
  cliente_objetivo TEXT,
  tamano_equipo TEXT,
  presupuesto_ventas TEXT,
  como_enteraste_synergy TEXT,
  acepta_terminos BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ia_form_created ON ia_form_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ia_form_telefono ON ia_form_submissions(telefono);

COMMENT ON TABLE ia_form_submissions IS 'Formulario /ia - Nova. Para validación del modelo antes de integrar con otras tablas.';
