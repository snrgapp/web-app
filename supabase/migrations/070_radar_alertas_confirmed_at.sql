-- Cierra el ciclo de confirmación de alertas del Radar (doble opt-in)

ALTER TABLE public.radar_alertas
  ADD COLUMN IF NOT EXISTS confirmed_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_radar_alertas_confirmed
  ON public.radar_alertas (active, confirmed_at)
  WHERE email IS NOT NULL AND active = true;
