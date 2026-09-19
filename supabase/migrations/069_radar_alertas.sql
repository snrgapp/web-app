-- Suscriptores de alertas del Radar de convocatorias

CREATE TABLE IF NOT EXISTS public.radar_alertas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  telefono TEXT,
  departamento TEXT NOT NULL DEFAULT 'bogota',
  canal TEXT NOT NULL DEFAULT 'email',
  unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid(),
  active BOOLEAN NOT NULL DEFAULT true,
  confirmation_sent_at TIMESTAMPTZ,
  last_digest_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_radar_alertas_email
  ON public.radar_alertas (lower(email))
  WHERE email IS NOT NULL AND active = true;

CREATE INDEX IF NOT EXISTS idx_radar_alertas_active
  ON public.radar_alertas (active, last_digest_at);

ALTER TABLE public.radar_alertas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "radar_alertas_insert" ON public.radar_alertas;
CREATE POLICY "radar_alertas_insert" ON public.radar_alertas
  FOR INSERT
  WITH CHECK (true);

GRANT INSERT ON public.radar_alertas TO anon, authenticated;
GRANT SELECT, UPDATE ON public.radar_alertas TO authenticated;
