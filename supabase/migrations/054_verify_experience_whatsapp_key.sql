-- Incluir datos->>'whatsapp' en la verificación por teléfono (paso 1 PaaS).
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
      regexp_replace(
        lower(trim(COALESCE(
          s.datos->>'telefono',
          s.datos->>'tel',
          s.datos->>'phone',
          s.datos->>'celular',
          s.datos->>'whatsapp',
          ''
        ))),
        '\s', '', 'g'
      )
      =
      regexp_replace(lower(trim(COALESCE(p_phone, ''))), '\s', '', 'g')
    )
    AND length(regexp_replace(trim(COALESCE(p_phone, '')), '\s', '', 'g')) > 0
  LIMIT 1;
$$;
