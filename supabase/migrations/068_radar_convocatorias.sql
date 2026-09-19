-- Fichas del Radar de convocatorias (refresco diario desde portales públicos)

CREATE TABLE IF NOT EXISTS public.radar_convocatorias (
  slug TEXT PRIMARY KEY,
  card JSONB NOT NULL,
  source_portal TEXT NOT NULL,
  source_url TEXT NOT NULL,
  closes_at DATE,
  is_open BOOLEAN NOT NULL DEFAULT true,
  scrape_ok BOOLEAN NOT NULL DEFAULT true,
  scrape_note TEXT,
  scraped_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_radar_convocatorias_open
  ON public.radar_convocatorias (is_open, closes_at);

ALTER TABLE public.radar_convocatorias ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "radar_convocatorias_select" ON public.radar_convocatorias;
CREATE POLICY "radar_convocatorias_select" ON public.radar_convocatorias
  FOR SELECT
  USING (true);

GRANT SELECT ON public.radar_convocatorias TO anon, authenticated;
