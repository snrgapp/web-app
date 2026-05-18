-- Endurecer SELECT en tenant_experiences: el catálogo experience_templates sigue público,
-- pero las instancias por org solo para sesión autenticada con acceso a la org.

DROP POLICY IF EXISTS "tenant_experiences_select" ON public.tenant_experiences;

CREATE POLICY "tenant_experiences_select" ON public.tenant_experiences
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL
    AND can_read_org(auth.uid(), organizacion_id)
  );
