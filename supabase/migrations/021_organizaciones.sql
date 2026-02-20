-- ============================================================
-- Organizaciones: tenant principal para community-as-a-service
-- Cada comunidad/organización tiene sus propios eventos, forms,
-- networking, spotlight, leads y contactos.
-- ============================================================

-- 1. Tabla organizaciones
CREATE TABLE IF NOT EXISTS organizaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  dominio_custom TEXT,
  plan TEXT NOT NULL DEFAULT 'free'
    CHECK (plan IN ('free', 'pro', 'enterprise')),
  settings JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizaciones_slug ON organizaciones(slug);
CREATE INDEX IF NOT EXISTS idx_organizaciones_dominio ON organizaciones(dominio_custom)
  WHERE dominio_custom IS NOT NULL;

COMMENT ON TABLE organizaciones IS 'Tenant principal: cada organización es una comunidad independiente';
COMMENT ON COLUMN organizaciones.slug IS 'Identificador URL (ej: snrg, acme). Usado en subdominios o rutas';
COMMENT ON COLUMN organizaciones.settings IS 'Config flexible: branding, brevo_list_id default, etc.';

-- 2. Tabla organizacion_miembros (para Supabase Auth - preparada para futuro)
-- Vincula auth.users con organizaciones y define roles
CREATE TABLE IF NOT EXISTS organizacion_miembros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizacion_id UUID NOT NULL REFERENCES organizaciones(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  rol TEXT NOT NULL DEFAULT 'member'
    CHECK (rol IN ('admin', 'member', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organizacion_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_miembros_org ON organizacion_miembros(organizacion_id);
CREATE INDEX IF NOT EXISTS idx_org_miembros_user ON organizacion_miembros(user_id);

-- Referencia a auth.users solo cuando Supabase Auth esté habilitado
-- ALTER TABLE organizacion_miembros
--   ADD CONSTRAINT fk_org_miembros_user
--   FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

COMMENT ON TABLE organizacion_miembros IS 'Miembros de cada organización. user_id referencia auth.users cuando Auth esté activo';

ALTER TABLE organizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizacion_miembros ENABLE ROW LEVEL SECURITY;

-- RLS básico (se refinará en 023): por ahora lectura para anon, escritura restringida
CREATE POLICY "organizaciones_select_public" ON organizaciones
  FOR SELECT USING (true);

CREATE POLICY "organizacion_miembros_select" ON organizacion_miembros
  FOR SELECT USING (true);
