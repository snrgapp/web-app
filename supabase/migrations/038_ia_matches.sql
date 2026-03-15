CREATE TABLE ia_matches (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_a_id  uuid REFERENCES ia_call_profiles(id) ON DELETE CASCADE,
  profile_b_id  uuid REFERENCES ia_call_profiles(id) ON DELETE CASCADE,
  score         numeric(6,4),
  razon         text,
  status        text DEFAULT 'pendiente',
  -- pendiente → enviado → aceptado → rechazado → concretado
  created_at    timestamptz DEFAULT now(),
  updated_at    timestamptz DEFAULT now()
);

CREATE INDEX ON ia_matches (profile_a_id);
CREATE INDEX ON ia_matches (profile_b_id);
CREATE INDEX ON ia_matches (status);
