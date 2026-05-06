-- Día 1 / Día 2 del evento Perrenque: asignaciones por event_day sin pisarse entre días.

ALTER TABLE perrenque_grupo_ronda
  ADD COLUMN IF NOT EXISTS event_day SMALLINT NOT NULL DEFAULT 1;

ALTER TABLE match_perrenque
  ADD COLUMN IF NOT EXISTS event_day SMALLINT NOT NULL DEFAULT 1;

ALTER TABLE perrenque_grupo_ronda
  DROP CONSTRAINT IF EXISTS perrenque_grupo_ronda_pkey;

ALTER TABLE perrenque_grupo_ronda
  ADD CONSTRAINT perrenque_grupo_ronda_pkey PRIMARY KEY (submission_id, ronda, event_day);

ALTER TABLE match_perrenque
  DROP CONSTRAINT IF EXISTS match_perrenque_unique_pair;

ALTER TABLE match_perrenque
  ADD CONSTRAINT match_perrenque_unique_pair
  UNIQUE (submission_id, matched_submission_id, ronda, event_day);

ALTER TABLE perrenque_grupo_ronda
  ADD CONSTRAINT perrenque_grupo_ronda_event_day_chk CHECK (event_day IN (1, 2));

ALTER TABLE match_perrenque
  ADD CONSTRAINT match_perrenque_event_day_chk CHECK (event_day IN (1, 2));

CREATE INDEX IF NOT EXISTS idx_perrenque_grupo_ronda_event_day
  ON perrenque_grupo_ronda (event_day, ronda, grupo_numero);

CREATE INDEX IF NOT EXISTS idx_match_perrenque_event_day
  ON match_perrenque (event_day, ronda);

COMMENT ON COLUMN perrenque_grupo_ronda.event_day IS '1 = primer día del evento, 2 = segundo día (matching independiente).';
COMMENT ON COLUMN match_perrenque.event_day IS 'Misma convención que perrenque_grupo_ronda.event_day.';
