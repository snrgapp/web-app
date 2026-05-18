-- Formularios e inscripciones PaaS aisladas de `forms` / `eventos` legacy.
-- Extiende `tenant_experiences` con `experience_form_id` y `public_slug`.
-- Ajusta RLS de `tenant_experiences`: lectura pública solo de filas `published`
-- (necesario para /exp y /inscripcion-exp sin sesión Supabase).

-- ---------------------------------------------------------------------------
-- 1. Tablas nuevas
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.experience_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizacion_id UUID NOT NULL REFERENCES public.organizaciones(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  icon_url TEXT,
  cover_url TEXT,
  campos JSONB NOT NULL DEFAULT '[]'::jsonb,
  activo BOOLEAN NOT NULL DEFAULT true,
  brevo_list_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT experience_forms_org_slug_unique UNIQUE (organizacion_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_experience_forms_org ON public.experience_forms(organizacion_id);

CREATE TABLE IF NOT EXISTS public.experience_form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  experience_form_id UUID NOT NULL REFERENCES public.experience_forms(id) ON DELETE CASCADE,
  datos JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_exp_form_submissions_form
  ON public.experience_form_submissions(experience_form_id);

-- ---------------------------------------------------------------------------
-- 2. tenant_experiences: columnas PaaS (legacy evento_id / form_id se dejan en NULL)
-- ---------------------------------------------------------------------------
ALTER TABLE public.tenant_experiences
  ADD COLUMN IF NOT EXISTS experience_form_id UUID REFERENCES public.experience_forms(id) ON DELETE SET NULL;

ALTER TABLE public.tenant_experiences
  ADD COLUMN IF NOT EXISTS public_slug TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_tenant_experiences_org_public_slug
  ON public.tenant_experiences(organizacion_id, public_slug)
  WHERE public_slug IS NOT NULL AND trim(public_slug) <> '';

COMMENT ON COLUMN public.tenant_experiences.experience_form_id IS 'Formulario PaaS (experience_forms); no usar forms legacy';
COMMENT ON COLUMN public.tenant_experiences.public_slug IS 'Slug público para URLs /exp/{public_slug}';
COMMENT ON TABLE public.experience_forms IS 'Inscripciones PaaS: aislado de la tabla forms legacy';

-- ---------------------------------------------------------------------------
-- 3. Catálogo: prefijo de ruta para enlaces generados
-- ---------------------------------------------------------------------------
UPDATE public.experience_templates
SET base_path = '/exp'
WHERE base_path IS NOT NULL;

-- ---------------------------------------------------------------------------
-- 4. RLS experience_forms
-- ---------------------------------------------------------------------------
ALTER TABLE public.experience_forms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "experience_forms_select" ON public.experience_forms;
-- Público: formularios activos (el contenido del formulario es público por diseño).
CREATE POLICY "experience_forms_select" ON public.experience_forms
  FOR SELECT
  USING (
    activo = true
    OR (auth.uid() IS NOT NULL AND can_read_org(auth.uid(), organizacion_id))
  );

DROP POLICY IF EXISTS "experience_forms_insert" ON public.experience_forms;
CREATE POLICY "experience_forms_insert" ON public.experience_forms
  FOR INSERT
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));

DROP POLICY IF EXISTS "experience_forms_update" ON public.experience_forms;
CREATE POLICY "experience_forms_update" ON public.experience_forms
  FOR UPDATE
  USING (can_write_org(auth.uid(), organizacion_id))
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));

DROP POLICY IF EXISTS "experience_forms_delete" ON public.experience_forms;
CREATE POLICY "experience_forms_delete" ON public.experience_forms
  FOR DELETE
  USING (can_write_org(auth.uid(), organizacion_id));

-- ---------------------------------------------------------------------------
-- 5. RLS experience_form_submissions
-- ---------------------------------------------------------------------------
ALTER TABLE public.experience_form_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "experience_form_submissions_select" ON public.experience_form_submissions;
CREATE POLICY "experience_form_submissions_select" ON public.experience_form_submissions
  FOR SELECT
  USING (
    can_read_org(
      auth.uid(),
      (SELECT organizacion_id FROM public.experience_forms WHERE id = experience_form_id)
    )
  );

DROP POLICY IF EXISTS "experience_form_submissions_insert" ON public.experience_form_submissions;
CREATE POLICY "experience_form_submissions_insert" ON public.experience_form_submissions
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.experience_forms f
      WHERE f.id = experience_form_id AND f.activo = true
    )
  );

-- ---------------------------------------------------------------------------
-- 6. tenant_experiences SELECT: publicar lee sin login; miembros leen su org
-- ---------------------------------------------------------------------------
DROP POLICY IF EXISTS "tenant_experiences_select" ON public.tenant_experiences;

CREATE POLICY "tenant_experiences_select" ON public.tenant_experiences
  FOR SELECT
  USING (
    status = 'published'
    OR (auth.uid() IS NOT NULL AND can_read_org(auth.uid(), organizacion_id))
  );

-- ---------------------------------------------------------------------------
-- 7. Verificación por teléfono (sin exponer todas las inscripciones)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.verify_experience_submission_by_phone(
  p_public_slug text,
  p_organizacion_id uuid,
  p_phone text
)
RETURNS TABLE (
  submission_id uuid,
  experience_form_id uuid
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, s.experience_form_id
  FROM public.tenant_experiences te
  JOIN public.experience_forms ef ON ef.id = te.experience_form_id
  JOIN public.experience_form_submissions s ON s.experience_form_id = ef.id
  WHERE te.public_slug = p_public_slug
    AND te.organizacion_id = p_organizacion_id
    AND te.status = 'published'
    AND (
      regexp_replace(lower(trim(COALESCE(s.datos->>'telefono', s.datos->>'tel', s.datos->>'phone', s.datos->>'celular', ''))), '\s', '', 'g')
      =
      regexp_replace(lower(trim(COALESCE(p_phone, ''))), '\s', '', 'g')
    )
    AND length(regexp_replace(trim(COALESCE(p_phone, '')), '\s', '', 'g')) > 0
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.verify_experience_submission_by_phone(text, uuid, text) FROM public;
GRANT EXECUTE ON FUNCTION public.verify_experience_submission_by_phone(text, uuid, text) TO anon, authenticated;
