-- ============================================================
-- Quitar fallback anon en can_write_org
--
-- Antes: anon (user_id NULL) podía escribir durante la transición.
-- Ahora: solo usuarios admin de la org pueden escribir.
-- El panel usa Supabase Auth; peticiones sin sesión = denegadas.
-- ============================================================

CREATE OR REPLACE FUNCTION public.can_write_org(user_id uuid, org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id IS NULL
     OR (user_id IS NOT NULL AND is_org_admin(user_id, org_id));
$$;
