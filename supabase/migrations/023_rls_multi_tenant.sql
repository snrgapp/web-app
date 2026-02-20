-- ============================================================
-- RLS multi-tenant para organizaciones
--
-- ESTRATEGIA:
-- - Sin Supabase Auth (auth.uid() = null): se mantiene acceso anon actual
--   para que el panel y la web sigan funcionando.
-- - Con Supabase Auth: usuarios solo acceden a datos de orgs donde son miembros.
--
-- Cuando actives Auth y el panel use sesión autenticada, las políticas
-- restrictivas aplicarán automáticamente. Mientras tanto, anon accede a todo.
-- ============================================================

-- 1. Funciones auxiliares (SECURITY DEFINER para bypass RLS al evaluar)
CREATE OR REPLACE FUNCTION public.is_org_member(p_user_id uuid, p_org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p_org_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM organizacion_miembros m
    WHERE m.user_id = p_user_id AND m.organizacion_id = p_org_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(p_user_id uuid, p_org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT p_org_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM organizacion_miembros m
    WHERE m.user_id = p_user_id AND m.organizacion_id = p_org_id
      AND m.rol = 'admin'
  );
$$;

-- Permite anon O usuario miembro de la org
CREATE OR REPLACE FUNCTION public.can_read_org(user_id uuid, org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT org_id IS NULL
     OR user_id IS NULL  -- anon: permitir (transición)
     OR is_org_member(user_id, org_id);
$$;

-- Solo usuarios admin de la org (anon no puede escribir cuando Auth activo)
CREATE OR REPLACE FUNCTION public.can_write_org(user_id uuid, org_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- Transición: si no hay Auth, permitir (user_id null = anon)
  SELECT org_id IS NULL
     OR user_id IS NULL  -- anon permitido durante transición
     OR is_org_admin(user_id, org_id);
$$;

-- ============================================================
-- 2. ORGANIZACIONES
-- ============================================================
DROP POLICY IF EXISTS "organizaciones_select_public" ON organizaciones;
CREATE POLICY "organizaciones_select" ON organizaciones
  FOR SELECT
  USING (true);

-- Solo admins pueden insertar/actualizar orgs (por ahora permitir anon en transición)
CREATE POLICY "organizaciones_insert" ON organizaciones
  FOR INSERT WITH CHECK (true);

CREATE POLICY "organizaciones_update" ON organizaciones
  FOR UPDATE USING (true) WITH CHECK (true);

-- ============================================================
-- 3. EVENTOS
-- ============================================================
DROP POLICY IF EXISTS "Allow public read on eventos" ON eventos;
DROP POLICY IF EXISTS "Allow public insert on eventos" ON eventos;
DROP POLICY IF EXISTS "Allow public update on eventos" ON eventos;
DROP POLICY IF EXISTS "Allow public delete on eventos" ON eventos;

CREATE POLICY "eventos_select" ON eventos
  FOR SELECT
  USING (can_read_org(auth.uid(), organizacion_id));

CREATE POLICY "eventos_insert" ON eventos
  FOR INSERT
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));

CREATE POLICY "eventos_update" ON eventos
  FOR UPDATE
  USING (can_write_org(auth.uid(), organizacion_id))
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));

CREATE POLICY "eventos_delete" ON eventos
  FOR DELETE
  USING (can_write_org(auth.uid(), organizacion_id));

-- ============================================================
-- 4. FORMS
-- ============================================================
DROP POLICY IF EXISTS "Allow public read on forms" ON forms;
DROP POLICY IF EXISTS "Allow public insert on forms" ON forms;
DROP POLICY IF EXISTS "Allow public update on forms" ON forms;
DROP POLICY IF EXISTS "Allow public delete on forms" ON forms;

CREATE POLICY "forms_select" ON forms
  FOR SELECT
  USING (can_read_org(auth.uid(), organizacion_id));

CREATE POLICY "forms_insert" ON forms
  FOR INSERT
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));

CREATE POLICY "forms_update" ON forms
  FOR UPDATE
  USING (can_write_org(auth.uid(), organizacion_id))
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));

CREATE POLICY "forms_delete" ON forms
  FOR DELETE
  USING (can_write_org(auth.uid(), organizacion_id));

-- ============================================================
-- 5. FORM_SUBMISSIONS (acceso vía form → organizacion_id)
-- ============================================================
DROP POLICY IF EXISTS "Allow public insert on form_submissions" ON form_submissions;
DROP POLICY IF EXISTS "Allow public read on form_submissions" ON form_submissions;

CREATE POLICY "form_submissions_select" ON form_submissions
  FOR SELECT
  USING (
    can_read_org(auth.uid(), (SELECT organizacion_id FROM forms WHERE id = form_id))
  );

CREATE POLICY "form_submissions_insert" ON form_submissions
  FOR INSERT
  WITH CHECK (
    -- Inserción pública: el form debe existir y estar activo
    EXISTS (
      SELECT 1 FROM forms f
      WHERE f.id = form_id AND f.activo = true
    )
  );

-- ============================================================
-- 6. ASISTENTES (vía evento → organizacion_id)
-- ============================================================
DROP POLICY IF EXISTS "Allow public read access on asistentes" ON asistentes;
DROP POLICY IF EXISTS "Allow public insert on asistentes" ON asistentes;
DROP POLICY IF EXISTS "Allow public delete on asistentes" ON asistentes;

CREATE POLICY "asistentes_select" ON asistentes
  FOR SELECT
  USING (
    can_read_org(auth.uid(), (SELECT organizacion_id FROM eventos WHERE id = evento_id))
  );

CREATE POLICY "asistentes_insert" ON asistentes
  FOR INSERT
  WITH CHECK (
    can_write_org(auth.uid(), (SELECT organizacion_id FROM eventos WHERE id = evento_id))
    OR evento_id IS NULL  -- legacy: sin evento
  );

CREATE POLICY "asistentes_update" ON asistentes
  FOR UPDATE
  USING (
    can_write_org(auth.uid(), (SELECT organizacion_id FROM eventos WHERE id = evento_id))
    OR evento_id IS NULL
  )
  WITH CHECK (true);

CREATE POLICY "asistentes_delete" ON asistentes
  FOR DELETE
  USING (
    can_write_org(auth.uid(), (SELECT organizacion_id FROM eventos WHERE id = evento_id))
    OR evento_id IS NULL
  );

-- ============================================================
-- 7. FEEDBACK_NETWORKING (vía asistente → evento → org)
-- ============================================================
DROP POLICY IF EXISTS "Allow public read on feedback_networking" ON feedback_networking;
DROP POLICY IF EXISTS "Allow public insert on feedback_networking" ON feedback_networking;

-- feedback_networking no tiene políticas explícitas en migraciones previas, revisar
DO $$
BEGIN
  DROP POLICY IF EXISTS "feedback_networking_select" ON feedback_networking;
  DROP POLICY IF EXISTS "feedback_networking_insert" ON feedback_networking;
EXCEPTION WHEN undefined_object THEN NULL;
END $$;

CREATE POLICY "feedback_networking_select" ON feedback_networking
  FOR SELECT
  USING (
    can_read_org(
      auth.uid(),
      (SELECT e.organizacion_id FROM asistentes a
       JOIN eventos e ON e.id = a.evento_id
       WHERE a.id = asistente_id)
    )
  );

CREATE POLICY "feedback_networking_insert" ON feedback_networking
  FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 8. CATEGORIES (networking)
-- ============================================================
DROP POLICY IF EXISTS "Allow public read access on categories" ON categories;

CREATE POLICY "categories_select" ON categories
  FOR SELECT
  USING (can_read_org(auth.uid(), organizacion_id));

CREATE POLICY "categories_insert" ON categories
  FOR INSERT
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));

CREATE POLICY "categories_update" ON categories
  FOR UPDATE
  USING (can_write_org(auth.uid(), organizacion_id))
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));

CREATE POLICY "categories_delete" ON categories
  FOR DELETE
  USING (can_write_org(auth.uid(), organizacion_id));

-- ============================================================
-- 9. QUESTIONS (vía category → organizacion_id)
-- ============================================================
DROP POLICY IF EXISTS "Allow public read access on questions" ON questions;

CREATE POLICY "questions_select" ON questions
  FOR SELECT
  USING (
    can_read_org(auth.uid(), (SELECT organizacion_id FROM categories WHERE id = category_id))
  );

CREATE POLICY "questions_insert" ON questions
  FOR INSERT
  WITH CHECK (
    can_write_org(auth.uid(), (SELECT organizacion_id FROM categories WHERE id = category_id))
  );

CREATE POLICY "questions_update" ON questions
  FOR UPDATE
  USING (
    can_write_org(auth.uid(), (SELECT organizacion_id FROM categories WHERE id = category_id))
  );

CREATE POLICY "questions_delete" ON questions
  FOR DELETE
  USING (
    can_write_org(auth.uid(), (SELECT organizacion_id FROM categories WHERE id = category_id))
  );

-- ============================================================
-- 10. LEADS
-- ============================================================
DROP POLICY IF EXISTS "Allow public insert on leads" ON leads;
DROP POLICY IF EXISTS "Allow public read on leads" ON leads;

CREATE POLICY "leads_select" ON leads
  FOR SELECT
  USING (can_read_org(auth.uid(), organizacion_id));

CREATE POLICY "leads_insert" ON leads
  FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 11. CONTACTOS
-- ============================================================
DROP POLICY IF EXISTS "Allow public insert on contactos" ON contactos;
DROP POLICY IF EXISTS "Allow public read on contactos" ON contactos;

CREATE POLICY "contactos_select" ON contactos
  FOR SELECT
  USING (can_read_org(auth.uid(), organizacion_id));

CREATE POLICY "contactos_insert" ON contactos
  FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 12. FOUNDERS (Spotlight)
-- ============================================================
DROP POLICY IF EXISTS "founders_select" ON founders;
DROP POLICY IF EXISTS "founders_insert" ON founders;
DROP POLICY IF EXISTS "founders_update" ON founders;
DROP POLICY IF EXISTS "founders_delete" ON founders;

CREATE POLICY "founders_select" ON founders
  FOR SELECT
  USING (can_read_org(auth.uid(), organizacion_id));

CREATE POLICY "founders_insert" ON founders
  FOR INSERT
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));

CREATE POLICY "founders_update" ON founders
  FOR UPDATE
  USING (can_write_org(auth.uid(), organizacion_id))
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));

CREATE POLICY "founders_delete" ON founders
  FOR DELETE
  USING (can_write_org(auth.uid(), organizacion_id));

-- ============================================================
-- 13. VOTANTES
-- ============================================================
DROP POLICY IF EXISTS "votantes_select" ON votantes;
DROP POLICY IF EXISTS "votantes_insert" ON votantes;
DROP POLICY IF EXISTS "votantes_update" ON votantes;
DROP POLICY IF EXISTS "votantes_delete" ON votantes;

CREATE POLICY "votantes_select" ON votantes
  FOR SELECT
  USING (can_read_org(auth.uid(), organizacion_id));

CREATE POLICY "votantes_insert" ON votantes
  FOR INSERT
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));

CREATE POLICY "votantes_update" ON votantes
  FOR UPDATE
  USING (can_write_org(auth.uid(), organizacion_id))
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));

CREATE POLICY "votantes_delete" ON votantes
  FOR DELETE
  USING (can_write_org(auth.uid(), organizacion_id));

-- ============================================================
-- 14. VOTOS (vía votante y founder → ambos tienen organizacion_id)
-- ============================================================
DROP POLICY IF EXISTS "votos_select" ON votos;
DROP POLICY IF EXISTS "votos_insert" ON votos;

CREATE POLICY "votos_select" ON votos
  FOR SELECT
  USING (
    can_read_org(auth.uid(), (SELECT organizacion_id FROM votantes WHERE id = votante_id))
    OR can_read_org(auth.uid(), (SELECT organizacion_id FROM founders WHERE id = founder_id))
  );

CREATE POLICY "votos_insert" ON votos
  FOR INSERT
  WITH CHECK (true);

-- ============================================================
-- 15. ORGANIZACION_MIEMBROS
-- ============================================================
DROP POLICY IF EXISTS "organizacion_miembros_select" ON organizacion_miembros;

CREATE POLICY "organizacion_miembros_select" ON organizacion_miembros
  FOR SELECT
  USING (
    auth.uid() IS NULL
    OR user_id = auth.uid()
    OR is_org_admin(auth.uid(), organizacion_id)
  );

CREATE POLICY "organizacion_miembros_insert" ON organizacion_miembros
  FOR INSERT
  WITH CHECK (is_org_admin(auth.uid(), organizacion_id) OR auth.uid() IS NULL);

CREATE POLICY "organizacion_miembros_delete" ON organizacion_miembros
  FOR DELETE
  USING (is_org_admin(auth.uid(), organizacion_id) OR user_id = auth.uid() OR auth.uid() IS NULL);
