-- ============================================================
-- Panel de miembros Synergy — esquema completo
-- Script único e idempotente. Pegar en Supabase → SQL Editor → Run.
--
-- Cubre:
--   miembros y perfil (directorio / ficha)
--   feed de inicio (tarjetas)
--   beneficios y reclamaciones
--   cursos, lecciones, recursos e inscripciones
--   Coffee & Meets (grupales + eventos + asistencia)
--   Let's Connect (pairings)
--
-- Seguro si ya corriste 025 / 027 / 029 / 065.
-- NO inserta datos dummy. La analítica se deriva de estas tablas.
-- Escritura de CMS: service_role (API admin). Sin políticas de write públicas.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Miembros (identidad + perfil de directorio)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL UNIQUE,
  nombre TEXT,
  email TEXT,
  empresa TEXT,
  avatar_url TEXT,
  referido_por_id UUID REFERENCES members(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS nombre TEXT,
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS empresa TEXT,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS ciudad TEXT,
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free',
  ADD COLUMN IF NOT EXISTS role TEXT,
  ADD COLUMN IF NOT EXISTS tags TEXT[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS industry TEXT,
  ADD COLUMN IF NOT EXISTS stage TEXT,
  ADD COLUMN IF NOT EXISTS team TEXT,
  ADD COLUMN IF NOT EXISTS founded TEXT,
  ADD COLUMN IF NOT EXISTS revenue TEXT,
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS referido_por_id UUID,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'members_plan_check'
      AND conrelid = 'public.members'::regclass
  ) THEN
    ALTER TABLE members
      ADD CONSTRAINT members_plan_check CHECK (plan IN ('free', 'pro'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_members_phone ON members(phone);
CREATE INDEX IF NOT EXISTS idx_members_plan ON members(plan);
CREATE INDEX IF NOT EXISTS idx_members_ciudad ON members(ciudad) WHERE ciudad IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_members_empresa ON members(empresa) WHERE empresa IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_members_industry ON members(industry) WHERE industry IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_members_last_active ON members(last_active_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_members_tags ON members USING GIN (tags);
CREATE INDEX IF NOT EXISTS idx_members_referido_por ON members(referido_por_id)
  WHERE referido_por_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_members_password_hash ON members(phone)
  WHERE password_hash IS NOT NULL;

COMMENT ON TABLE members IS
  'Founders del área miembros. phone es el identificador de login.';
COMMENT ON COLUMN members.plan IS 'free = 4 pairing/mes; pro = 30 pairing/mes';
COMMENT ON COLUMN members.role IS 'Cargo en la empresa (Founder & CEO, CPO, …)';
COMMENT ON COLUMN members.tags IS 'Etiquetas de perfil para el directorio';
COMMENT ON COLUMN members.industry IS 'Industria para filtros del directorio';
COMMENT ON COLUMN members.stage IS 'Etapa (Pre-seed, Seed, Operando, …)';
COMMENT ON COLUMN members.team IS 'Tamaño de equipo, texto libre (ej. 8 personas)';
COMMENT ON COLUMN members.founded IS 'Año de fundación, texto libre';
COMMENT ON COLUMN members.revenue IS 'Rango de ingresos, texto libre';
COMMENT ON COLUMN members.last_active_at IS 'Última actividad conocida en el panel';
COMMENT ON COLUMN members.password_hash IS 'Hash bcrypt. Null = aún sin contraseña';

-- ------------------------------------------------------------
-- 2. Conexiones legacy (grafo social previo a pairings)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  connected_member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL DEFAULT 'connection'
    CHECK (tipo IN ('connection', 'cafe_invitado', 'cafe_aceptado')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (member_id, connected_member_id)
);

CREATE INDEX IF NOT EXISTS idx_connections_member ON connections(member_id);
CREATE INDEX IF NOT EXISTS idx_connections_connected ON connections(connected_member_id);
CREATE INDEX IF NOT EXISTS idx_connections_created ON connections(created_at DESC);

COMMENT ON TABLE connections IS
  'Conexiones históricas. Let’s Connect nuevo usa member_pairings.';

-- ------------------------------------------------------------
-- 3. Eventos de networking + asistencia
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS member_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  fecha_inicio TIMESTAMPTZ,
  fecha_fin TIMESTAMPTZ,
  lugar TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE member_events
  ADD COLUMN IF NOT EXISTS ciudad TEXT,
  ADD COLUMN IF NOT EXISTS link TEXT,
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_member_events_fecha
  ON member_events(fecha_inicio)
  WHERE fecha_inicio IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_member_events_published
  ON member_events(published, fecha_inicio);

COMMENT ON TABLE member_events IS
  'Eventos 1:N del tab Coffee & Meets (no grupales).';

CREATE TABLE IF NOT EXISTS event_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES member_events(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_event_attendance_event ON event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_member ON event_attendance(member_id);

COMMENT ON TABLE event_attendance IS
  'Asistencia a member_events. El contador de asistentes se deriva de aquí.';

-- ------------------------------------------------------------
-- 4. Tarjetas del feed (Inicio)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS member_home_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind TEXT NOT NULL CHECK (kind IN ('highlight', 'discover')),
  title TEXT NOT NULL,
  body TEXT,
  image_url TEXT,
  href TEXT,
  badge TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_member_home_cards_published
  ON member_home_cards(published, sort_order);

COMMENT ON TABLE member_home_cards IS
  'Tarjetas highlight/discover del feed de Inicio.';

-- ------------------------------------------------------------
-- 5. Beneficios de partners + reclamaciones
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS member_benefits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  offer TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  logo_label TEXT NOT NULL DEFAULT '',
  logo_bg TEXT NOT NULL DEFAULT '#232F3E',
  logo_color TEXT NOT NULL DEFAULT '#FFFFFF',
  brand_email TEXT,
  redeem_instructions TEXT,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE member_benefits
  ADD COLUMN IF NOT EXISTS brand TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS cover_url TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'member_benefits_status_check'
      AND conrelid = 'public.member_benefits'::regclass
  ) THEN
    ALTER TABLE member_benefits
      ADD CONSTRAINT member_benefits_status_check
      CHECK (status IN ('active', 'paused'));
  END IF;
END $$;

UPDATE member_benefits
SET
  status = CASE WHEN published THEN 'active' ELSE 'paused' END,
  brand = CASE WHEN brand = '' THEN name ELSE brand END
WHERE status = 'active' AND published = false
   OR brand = '';

CREATE INDEX IF NOT EXISTS idx_member_benefits_published
  ON member_benefits(published, category);
CREATE INDEX IF NOT EXISTS idx_member_benefits_status
  ON member_benefits(status, category);

COMMENT ON TABLE member_benefits IS
  'Catálogo de beneficios de partners. published debe coincidir con status = active.';
COMMENT ON COLUMN member_benefits.brand IS 'Marca visible (Amazon, Notion, …)';
COMMENT ON COLUMN member_benefits.cover_url IS 'Imagen de portada en el admin y el feed';
COMMENT ON COLUMN member_benefits.status IS 'active | paused';

CREATE TABLE IF NOT EXISTS member_benefit_claims (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  benefit_id UUID NOT NULL REFERENCES member_benefits(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'sent', 'failed')),
  member_notified_at TIMESTAMPTZ,
  brand_notified_at TIMESTAMPTZ,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (benefit_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_member_benefit_claims_member
  ON member_benefit_claims(member_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_member_benefit_claims_benefit
  ON member_benefit_claims(benefit_id, created_at DESC);

COMMENT ON TABLE member_benefit_claims IS
  'Un founder reclama un beneficio una sola vez. Historial del perfil.';

-- ------------------------------------------------------------
-- 6. Aprendizaje: cursos, lecciones, recursos, inscripciones
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS member_courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  short_title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  instructor TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  image_url TEXT,
  language TEXT NOT NULL DEFAULT 'Español',
  captions TEXT,
  learnings JSONB NOT NULL DEFAULT '[]'::jsonb,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  featured BOOLEAN NOT NULL DEFAULT false,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE member_courses
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'published';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'member_courses_status_check'
      AND conrelid = 'public.member_courses'::regclass
  ) THEN
    ALTER TABLE member_courses
      ADD CONSTRAINT member_courses_status_check
      CHECK (status IN ('published', 'draft', 'archived'));
  END IF;
END $$;

UPDATE member_courses
SET status = 'draft'
WHERE published = false AND status = 'published';

CREATE INDEX IF NOT EXISTS idx_member_courses_published
  ON member_courses(published, category);
CREATE INDEX IF NOT EXISTS idx_member_courses_status
  ON member_courses(status, category);

COMMENT ON TABLE member_courses IS
  'Cursos del tab Aprendizaje. published = (status = published).';
COMMENT ON COLUMN member_courses.status IS 'published | draft | archived';
COMMENT ON COLUMN member_courses.learnings IS 'Lista JSON de aprendizajes';
COMMENT ON COLUMN member_courses.tags IS 'Lista JSON de tags';

CREATE TABLE IF NOT EXISTS member_course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES member_courses(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  about TEXT NOT NULL DEFAULT '',
  duration TEXT NOT NULL DEFAULT '00:00',
  duration_seconds INT NOT NULL DEFAULT 0,
  video_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (course_id, slug)
);

ALTER TABLE member_course_lessons
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_member_course_lessons_course
  ON member_course_lessons(course_id, sort_order);

COMMENT ON TABLE member_course_lessons IS
  'Lecciones de un curso. slug único por course_id.';

CREATE TABLE IF NOT EXISTS member_lesson_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES member_course_lessons(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT,
  kind TEXT NOT NULL DEFAULT 'pdf'
    CHECK (kind IN ('pdf', 'chart', 'repo', 'article')),
  meta TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_member_lesson_resources_lesson
  ON member_lesson_resources(lesson_id, sort_order);

COMMENT ON TABLE member_lesson_resources IS
  'Materiales descargables de una lección.';

CREATE TABLE IF NOT EXISTS member_course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES member_courses(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (course_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_member_course_enrollments_member
  ON member_course_enrollments(member_id);
CREATE INDEX IF NOT EXISTS idx_member_course_enrollments_course
  ON member_course_enrollments(course_id);

COMMENT ON TABLE member_course_enrollments IS
  'Inscripciones reales. El número de estudiantes se cuenta desde aquí.';

-- ------------------------------------------------------------
-- 7. Coffee grupales + cupos
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS member_group_coffees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  anfitrion TEXT NOT NULL DEFAULT '',
  tema TEXT NOT NULL DEFAULT '',
  fecha TIMESTAMPTZ NOT NULL,
  lugar TEXT NOT NULL DEFAULT '',
  cupos INT NOT NULL DEFAULT 6 CHECK (cupos > 0 AND cupos <= 6),
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_member_group_coffees_fecha
  ON member_group_coffees(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_member_group_coffees_published
  ON member_group_coffees(published, fecha);

COMMENT ON TABLE member_group_coffees IS
  'Cafés grupales. Máximo 6 cupos.';

CREATE TABLE IF NOT EXISTS member_group_coffee_seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coffee_id UUID NOT NULL REFERENCES member_group_coffees(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'invited'
    CHECK (status IN ('invited', 'confirmed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  UNIQUE (coffee_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_member_group_coffee_seats_member
  ON member_group_coffee_seats(member_id);
CREATE INDEX IF NOT EXISTS idx_member_group_coffee_seats_coffee
  ON member_group_coffee_seats(coffee_id, status);

COMMENT ON TABLE member_group_coffee_seats IS
  'Asientos de un café grupal. Timeline de Coffee en el perfil.';

-- ------------------------------------------------------------
-- 8. Let's Connect (pairings 1:1)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS member_pairings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  target_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'confirmed', 'declined')),
  meet_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMPTZ,
  CHECK (requester_id <> target_id),
  UNIQUE (requester_id, target_id)
);

CREATE INDEX IF NOT EXISTS idx_member_pairings_requester
  ON member_pairings(requester_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_member_pairings_target
  ON member_pairings(target_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_member_pairings_status
  ON member_pairings(status, created_at DESC);

COMMENT ON TABLE member_pairings IS
  'Solicitudes 1:1. Cupos: free 4/mes, pro 30/mes (regla de app).';

-- ------------------------------------------------------------
-- 9. updated_at automático
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.members_cms_set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'members',
    'member_events',
    'member_home_cards',
    'member_benefits',
    'member_courses',
    'member_course_lessons',
    'member_group_coffees'
  ]
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS trg_%s_updated_at ON %I', t, t);
    EXECUTE format(
      'CREATE TRIGGER trg_%s_updated_at BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE PROCEDURE public.members_cms_set_updated_at()',
      t, t
    );
  END LOOP;
END $$;

-- ------------------------------------------------------------
-- 10. RLS
--     service_role bypasea RLS (APIs admin y cmsDb).
--     Lectura pública solo de contenido publicado.
--     Claims, pairings, asientos e inscripciones: sin SELECT público.
-- ------------------------------------------------------------
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_home_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_benefit_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_group_coffees ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_group_coffee_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_pairings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'member_home_cards'
      AND policyname = 'member_home_cards_select_published'
  ) THEN
    CREATE POLICY member_home_cards_select_published
      ON member_home_cards FOR SELECT
      USING (published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'member_benefits'
      AND policyname = 'member_benefits_select_published'
  ) THEN
    CREATE POLICY member_benefits_select_published
      ON member_benefits FOR SELECT
      USING (published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'member_courses'
      AND policyname = 'member_courses_select_published'
  ) THEN
    CREATE POLICY member_courses_select_published
      ON member_courses FOR SELECT
      USING (published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'member_course_lessons'
      AND policyname = 'member_course_lessons_select_published'
  ) THEN
    CREATE POLICY member_course_lessons_select_published
      ON member_course_lessons FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM member_courses c
          WHERE c.id = member_course_lessons.course_id
            AND c.published = true
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'member_lesson_resources'
      AND policyname = 'member_lesson_resources_select_published'
  ) THEN
    CREATE POLICY member_lesson_resources_select_published
      ON member_lesson_resources FOR SELECT
      USING (
        EXISTS (
          SELECT 1
          FROM member_course_lessons l
          JOIN member_courses c ON c.id = l.course_id
          WHERE l.id = member_lesson_resources.lesson_id
            AND c.published = true
        )
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'member_group_coffees'
      AND policyname = 'member_group_coffees_select_published'
  ) THEN
    CREATE POLICY member_group_coffees_select_published
      ON member_group_coffees FOR SELECT
      USING (published = true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'member_events'
      AND policyname = 'member_events_select_published'
  ) THEN
    CREATE POLICY member_events_select_published
      ON member_events FOR SELECT
      USING (published = true);
  END IF;
END $$;
