-- Hacer link opcional en eventos
-- Permite crear evento primero y luego vincular un formulario de inscripción
-- (resuelve dependencia circular: evento necesita link vs form necesita evento)
ALTER TABLE eventos
ALTER COLUMN link DROP NOT NULL;

COMMENT ON COLUMN eventos.link IS 'URL externa de registro (Luma, etc.) o vacío si se usa formulario vinculado en forms.evento_id';
