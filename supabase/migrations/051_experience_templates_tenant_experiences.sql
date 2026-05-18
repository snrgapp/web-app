-- Plantillas de experiencia (catálogo) y instancias por tenant + branding storage.
-- Ejecutar en Supabase SQL Editor o vía migraciones locales.

-- 1. Tablas
CREATE TABLE IF NOT EXISTS public.experience_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  default_modules JSONB NOT NULL DEFAULT '{}',
  default_form_preset JSONB NOT NULL DEFAULT '[]',
  base_path TEXT NOT NULL DEFAULT '/networking',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tenant_experiences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizacion_id UUID NOT NULL REFERENCES public.organizaciones(id) ON DELETE CASCADE,
  template_id UUID NOT NULL REFERENCES public.experience_templates(id) ON DELETE RESTRICT,
  evento_id UUID REFERENCES public.eventos(id) ON DELETE SET NULL,
  form_id UUID REFERENCES public.forms(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tenant_experiences_org
  ON public.tenant_experiences(organizacion_id);
CREATE INDEX IF NOT EXISTS idx_tenant_experiences_org_status
  ON public.tenant_experiences(organizacion_id, status);

ALTER TABLE public.experience_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "experience_templates_select" ON public.experience_templates;
CREATE POLICY "experience_templates_select"
  ON public.experience_templates FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "tenant_experiences_select" ON public.tenant_experiences;
CREATE POLICY "tenant_experiences_select"
  ON public.tenant_experiences FOR SELECT
  USING (can_read_org(auth.uid(), organizacion_id));

DROP POLICY IF EXISTS "tenant_experiences_insert" ON public.tenant_experiences;
CREATE POLICY "tenant_experiences_insert"
  ON public.tenant_experiences FOR INSERT
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));

DROP POLICY IF EXISTS "tenant_experiences_update" ON public.tenant_experiences;
CREATE POLICY "tenant_experiences_update"
  ON public.tenant_experiences FOR UPDATE
  USING (can_write_org(auth.uid(), organizacion_id))
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));

DROP POLICY IF EXISTS "tenant_experiences_delete" ON public.tenant_experiences;
CREATE POLICY "tenant_experiences_delete"
  ON public.tenant_experiences FOR DELETE
  USING (can_write_org(auth.uid(), organizacion_id));

-- 2. Endurecer UPDATE de organizaciones: solo admins de la org (no anon)
DROP POLICY IF EXISTS "organizaciones_update" ON public.organizaciones;
CREATE POLICY "organizaciones_update"
  ON public.organizaciones FOR UPDATE
  USING (is_org_admin(auth.uid(), id))
  WITH CHECK (is_org_admin(auth.uid(), id));

-- 3. Bucket público org-branding (logos)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'org-branding',
  'org-branding',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

DROP POLICY IF EXISTS "org_branding_insert" ON storage.objects;
DROP POLICY IF EXISTS "org_branding_read" ON storage.objects;
DROP POLICY IF EXISTS "org_branding_update" ON storage.objects;
DROP POLICY IF EXISTS "org_branding_delete" ON storage.objects;

CREATE POLICY "org_branding_read"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'org-branding');

CREATE POLICY "org_branding_insert"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'org-branding'
    AND split_part(name, '/', 1) <> ''
    AND EXISTS (
      SELECT 1 FROM public.organizacion_miembros m
      WHERE m.user_id = auth.uid()
        AND m.rol = 'admin'
        AND m.organizacion_id::text = split_part(name, '/', 1)
    )
  );

CREATE POLICY "org_branding_update"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'org-branding'
    AND EXISTS (
      SELECT 1 FROM public.organizacion_miembros m
      WHERE m.user_id = auth.uid()
        AND m.rol = 'admin'
        AND m.organizacion_id::text = split_part(name, '/', 1)
    )
  )
  WITH CHECK (
    bucket_id = 'org-branding'
    AND EXISTS (
      SELECT 1 FROM public.organizacion_miembros m
      WHERE m.user_id = auth.uid()
        AND m.rol = 'admin'
        AND m.organizacion_id::text = split_part(name, '/', 1)
    )
  );

CREATE POLICY "org_branding_delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'org-branding'
    AND EXISTS (
      SELECT 1 FROM public.organizacion_miembros m
      WHERE m.user_id = auth.uid()
        AND m.rol = 'admin'
        AND m.organizacion_id::text = split_part(name, '/', 1)
    )
  );

-- 4. Catálogo inicial (idempotente)
INSERT INTO public.experience_templates (key, label, description, default_modules, default_form_preset, base_path)
VALUES
(
  'classic_networking',
  'Networking clásico',
  'Landing, verificación, preguntas y feedback (rutas /networking).',
  '{"inscripcion": true, "verify": true, "questions": true, "feedback": true}'::jsonb,
  '[
    {"key": "nombre_completo", "label": "Nombre completo", "type": "text", "required": true},
    {"key": "email", "label": "Correo", "type": "email", "required": true},
    {"key": "telefono", "label": "Teléfono", "type": "tel", "required": false}
  ]'::jsonb,
  '/networking'
),
(
  'genius_card_deck',
  'Genius — mazo de cartas',
  'Flujo Genius: verify y preguntas bajo /networking/genius.',
  '{"inscripcion": true, "verify": true, "questions": true, "feedback": true}'::jsonb,
  '[
    {"key": "nombre_completo", "label": "Nombre completo", "type": "text", "required": true},
    {"key": "email", "label": "Correo", "type": "email", "required": true},
    {"key": "telefono", "label": "Teléfono", "type": "tel", "required": false},
    {"key": "empresa", "label": "Empresa / proyecto", "type": "text", "required": false}
  ]'::jsonb,
  '/networking/genius'
),
(
  'hackathon_shell',
  'Hackathon',
  'Experiencia hackathon con verify en /networking/hackathon.',
  '{"inscripcion": true, "verify": true, "matching": true, "feedback": false}'::jsonb,
  '[
    {"key": "nombre_completo", "label": "Nombre completo", "type": "text", "required": true},
    {"key": "email", "label": "Correo", "type": "email", "required": true},
    {"key": "equipo", "label": "Nombre del equipo", "type": "text", "required": false}
  ]'::jsonb,
  '/networking/hackathon'
)
ON CONFLICT (key) DO UPDATE SET
  label = EXCLUDED.label,
  description = EXCLUDED.description,
  default_modules = EXCLUDED.default_modules,
  default_form_preset = EXCLUDED.default_form_preset,
  base_path = EXCLUDED.base_path;

COMMENT ON TABLE public.experience_templates IS 'Catálogo global de plantillas PaaS (solo lectura para tenants).';
COMMENT ON TABLE public.tenant_experiences IS 'Instancia de plantilla por organización: evento + form + estado.';
