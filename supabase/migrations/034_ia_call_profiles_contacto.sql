-- Nombre de quien atendió la llamada (formulario) + refuerzo post-webhook
ALTER TABLE ia_call_profiles
  ADD COLUMN IF NOT EXISTS contacto_nombre TEXT;

COMMENT ON COLUMN ia_call_profiles.contacto_nombre IS 'Nombre completo del lead (formulario / dynamic vars en llamada).';
