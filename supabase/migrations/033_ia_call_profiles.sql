-- Perfiles de llamadas IA - datos recolectados durante la llamada Vapi
-- Relacionado con ia_form_submissions (lead_id) para múltiples llamadas/follow-up
-- Evita pisar datos del formulario original

CREATE TABLE IF NOT EXISTS ia_call_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES ia_form_submissions(id) ON DELETE CASCADE,
  vapi_call_id TEXT NOT NULL,

  -- campos extraídos durante la llamada
  ciudad_principal TEXT,
  nombre_negocio TEXT,
  descripcion_negocio TEXT,
  tipo_negocio TEXT,
  momento_negocio TEXT,
  antiguedad_negocio TEXT,
  cliente_objetivo TEXT,
  busca_primario TEXT,
  busca_detalle TEXT,
  busca_secundario TEXT,
  ofrece TEXT,
  logro_notable TEXT,
  preferencia_conexion TEXT,
  referido_por TEXT,
  notas_personalidad TEXT,
  score_urgencia TEXT,
  perfil_completo BOOLEAN,
  follow_up_pendiente BOOLEAN,

  -- metadata de la llamada
  ended_reason TEXT,
  started_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  cost NUMERIC,

  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ia_call_profiles_lead_id ON ia_call_profiles(lead_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_ia_call_profiles_vapi_call_id ON ia_call_profiles(vapi_call_id);

COMMENT ON TABLE ia_call_profiles IS 'Datos recolectados durante llamadas Vapi. Relacionado con ia_form_submissions. Soporta múltiples llamadas/follow-up por lead.';
