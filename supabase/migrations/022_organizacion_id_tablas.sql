-- ============================================================
-- Añadir organizacion_id a todas las tablas y backfill con org default
-- ============================================================

-- 1. Crear organización default para datos existentes (legacy)
INSERT INTO organizaciones (nombre, slug, plan)
VALUES ('Synergy (Default)', 'snrg', 'pro')
ON CONFLICT (slug) DO NOTHING;

-- Obtener ID de la org default (usaremos el primero si hay varios)
DO $$
DECLARE
  default_org_id UUID;
BEGIN
  SELECT id INTO default_org_id FROM organizaciones WHERE slug = 'snrg' LIMIT 1;
  IF default_org_id IS NULL THEN
    SELECT id INTO default_org_id FROM organizaciones ORDER BY created_at LIMIT 1;
  END IF;

  IF default_org_id IS NOT NULL THEN
    -- 2. Añadir organizacion_id a eventos
    ALTER TABLE eventos ADD COLUMN IF NOT EXISTS organizacion_id UUID REFERENCES organizaciones(id) ON DELETE CASCADE;
    UPDATE eventos SET organizacion_id = default_org_id WHERE organizacion_id IS NULL;
    CREATE INDEX IF NOT EXISTS idx_eventos_organizacion_id ON eventos(organizacion_id);

    -- 3. Añadir organizacion_id a forms (forms puede ser standalone, no siempre tiene evento)
    ALTER TABLE forms ADD COLUMN IF NOT EXISTS organizacion_id UUID REFERENCES organizaciones(id) ON DELETE CASCADE;
    -- Backfill: forms con evento_id toman org del evento; sin evento, default
    UPDATE forms f
    SET organizacion_id = COALESCE(
      (SELECT e.organizacion_id FROM eventos e WHERE e.id = f.evento_id),
      default_org_id
    )
    WHERE f.organizacion_id IS NULL;
    CREATE INDEX IF NOT EXISTS idx_forms_organizacion_id ON forms(organizacion_id);

    -- 4. Añadir organizacion_id a categories (networking)
    ALTER TABLE categories ADD COLUMN IF NOT EXISTS organizacion_id UUID REFERENCES organizaciones(id) ON DELETE CASCADE;
    UPDATE categories SET organizacion_id = default_org_id WHERE organizacion_id IS NULL;
    CREATE INDEX IF NOT EXISTS idx_categories_organizacion_id ON categories(organizacion_id);

    -- 5. Añadir organizacion_id a leads
    ALTER TABLE leads ADD COLUMN IF NOT EXISTS organizacion_id UUID REFERENCES organizaciones(id) ON DELETE CASCADE;
    UPDATE leads SET organizacion_id = default_org_id WHERE organizacion_id IS NULL;
    CREATE INDEX IF NOT EXISTS idx_leads_organizacion_id ON leads(organizacion_id);

    -- 6. Añadir organizacion_id a contactos
    ALTER TABLE contactos ADD COLUMN IF NOT EXISTS organizacion_id UUID REFERENCES organizaciones(id) ON DELETE CASCADE;
    UPDATE contactos SET organizacion_id = default_org_id WHERE organizacion_id IS NULL;
    CREATE INDEX IF NOT EXISTS idx_contactos_organizacion_id ON contactos(organizacion_id);

    -- 7. Añadir organizacion_id a founders (Spotlight)
    ALTER TABLE founders ADD COLUMN IF NOT EXISTS organizacion_id UUID REFERENCES organizaciones(id) ON DELETE CASCADE;
    UPDATE founders SET organizacion_id = default_org_id WHERE organizacion_id IS NULL;
    CREATE INDEX IF NOT EXISTS idx_founders_organizacion_id ON founders(organizacion_id);

    -- 8. Añadir organizacion_id a votantes (Spotlight)
    ALTER TABLE votantes ADD COLUMN IF NOT EXISTS organizacion_id UUID REFERENCES organizaciones(id) ON DELETE CASCADE;
    UPDATE votantes SET organizacion_id = default_org_id WHERE organizacion_id IS NULL;
    CREATE INDEX IF NOT EXISTS idx_votantes_organizacion_id ON votantes(organizacion_id);
  END IF;
END $$;

-- 9. Unicidad de slugs por organización (no global)
-- eventos.checkin_slug: único por org
DROP INDEX IF EXISTS idx_eventos_checkin_slug_unique;
CREATE UNIQUE INDEX idx_eventos_checkin_slug_org_unique
  ON eventos(organizacion_id, checkin_slug)
  WHERE checkin_slug IS NOT NULL;

-- forms.slug: único por org
-- Nota: forms tenía slug UNIQUE global. Ahora debe ser (organizacion_id, slug)
ALTER TABLE forms DROP CONSTRAINT IF EXISTS forms_slug_key;
CREATE UNIQUE INDEX idx_forms_organizacion_slug_unique
  ON forms(organizacion_id, slug);

-- votantes.whatsapp: único por org (mismo teléfono puede votar en diferentes orgs)
ALTER TABLE votantes DROP CONSTRAINT IF EXISTS votantes_whatsapp_key;
CREATE UNIQUE INDEX idx_votantes_org_whatsapp_unique
  ON votantes(organizacion_id, whatsapp);

-- categories: name y slug únicos por org
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_name_key;
ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_slug_key;
CREATE UNIQUE INDEX idx_categories_org_name_unique
  ON categories(organizacion_id, name);
CREATE UNIQUE INDEX idx_categories_org_slug_unique
  ON categories(organizacion_id, slug)
  WHERE slug IS NOT NULL;

-- leads: email único por org (mismo email puede registrarse en distintas comunidades)
DROP INDEX IF EXISTS idx_leads_email;
CREATE UNIQUE INDEX idx_leads_org_email_unique ON leads(organizacion_id, email);
