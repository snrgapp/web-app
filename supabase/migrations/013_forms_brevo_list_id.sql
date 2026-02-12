-- Agregar brevo_list_id a forms para vincular cada formulario con una lista de Brevo
ALTER TABLE forms ADD COLUMN IF NOT EXISTS brevo_list_id INTEGER;

COMMENT ON COLUMN forms.brevo_list_id IS 'ID de la lista en Brevo donde se agregan los contactos al inscribirse';
