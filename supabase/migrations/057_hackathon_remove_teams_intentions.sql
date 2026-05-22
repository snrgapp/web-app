-- Hackathon solo relacionamiento: quitar equipos, intenciones (pass/guardar), desafíos y vistas derivadas.

-- Quitar de Realtime antes de DROP (evita errores en proyectos donde la publicación existe).
DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime DROP TABLE public.hackaton_equipo_miembros;
EXCEPTION
  WHEN undefined_object THEN NULL;
  WHEN undefined_table THEN NULL;
END $$;

DO $$
BEGIN
  ALTER PUBLICATION supabase_realtime DROP TABLE public.hackaton_equipos;
EXCEPTION
  WHEN undefined_object THEN NULL;
  WHEN undefined_table THEN NULL;
END $$;

DROP VIEW IF EXISTS public.v_hackaton_mutual_matches;
DROP VIEW IF EXISTS public.v_hackaton_exclusions;

DROP TABLE IF EXISTS public.hackaton_intentions CASCADE;
DROP TABLE IF EXISTS public.hackaton_equipo_miembros CASCADE;
DROP TABLE IF EXISTS public.hackaton_equipos CASCADE;
DROP TABLE IF EXISTS public.hackaton_challenges CASCADE;
