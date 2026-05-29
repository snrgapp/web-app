-- Genius FEST: rastreo de clicks WhatsApp y pregunta de conexiones en feedback.

-- 1. Tabla de clicks WhatsApp
CREATE TABLE IF NOT EXISTS genius_networking_wa_clicks (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id        uuid NOT NULL REFERENCES genius_conecta_submissions(id) ON DELETE CASCADE,
  clicked_submission_id uuid NOT NULL REFERENCES genius_conecta_submissions(id) ON DELETE CASCADE,
  ronda                smallint NOT NULL CHECK (ronda IN (1, 2)),
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS genius_wa_clicks_submission_idx
  ON genius_networking_wa_clicks (submission_id);

CREATE INDEX IF NOT EXISTS genius_wa_clicks_clicked_idx
  ON genius_networking_wa_clicks (clicked_submission_id);

-- 2. Columna conexiones_count en feedback
--    0 = ninguna, 1 = una, 2 = dos, 3 = tres o más
ALTER TABLE genius_networking_feedback
  ADD COLUMN IF NOT EXISTS conexiones_count smallint
    CHECK (conexiones_count >= 0 AND conexiones_count <= 3);

COMMENT ON TABLE  genius_networking_wa_clicks IS
  'Registra cada vez que un asistente Genius toca el botón WhatsApp en una tarjeta de conexión.';

COMMENT ON COLUMN genius_networking_feedback.conexiones_count IS
  '¿Con cuántas personas lograste conectar? 0=ninguna 1=una 2=dos 3=tres o más';
