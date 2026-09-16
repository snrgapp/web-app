-- Lista de espera para nuevas ciudades (formulario /lista-espera)

CREATE TABLE IF NOT EXISTS public.lista_espera_ciudades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizacion_id UUID REFERENCES public.organizaciones(id) ON DELETE SET NULL,
  nombre TEXT NOT NULL,
  email TEXT NOT NULL,
  telefono TEXT NOT NULL,
  empresa TEXT NOT NULL,
  tipo_empresa TEXT NOT NULL,
  instagram TEXT,
  linkedin TEXT,
  website TEXT,
  arquetipo TEXT NOT NULL,
  buscando TEXT[] NOT NULL DEFAULT '{}',
  camara_comercio TEXT NOT NULL,
  ciudad TEXT NOT NULL,
  canales_venta TEXT[] NOT NULL DEFAULT '{}',
  empleados TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lista_espera_ciudades_email
  ON public.lista_espera_ciudades (lower(email));
CREATE INDEX IF NOT EXISTS idx_lista_espera_ciudades_ciudad
  ON public.lista_espera_ciudades (ciudad);
CREATE INDEX IF NOT EXISTS idx_lista_espera_ciudades_created_at
  ON public.lista_espera_ciudades (created_at DESC);

ALTER TABLE public.lista_espera_ciudades ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lista_espera_ciudades_insert" ON public.lista_espera_ciudades;
CREATE POLICY "lista_espera_ciudades_insert" ON public.lista_espera_ciudades
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "lista_espera_ciudades_select" ON public.lista_espera_ciudades;
CREATE POLICY "lista_espera_ciudades_select" ON public.lista_espera_ciudades
  FOR SELECT
  USING (can_read_org(auth.uid(), organizacion_id));

GRANT SELECT, INSERT ON public.lista_espera_ciudades TO anon, authenticated;
