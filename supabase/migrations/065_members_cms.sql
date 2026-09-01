-- CMS del panel admin de miembros (contenido que ven los emprendedores)
-- Acceso de escritura solo vía service_role. RLS activo sin políticas públicas de write.

ALTER TABLE members
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'free';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'members_plan_check'
  ) THEN
    ALTER TABLE members
      ADD CONSTRAINT members_plan_check CHECK (plan IN ('free', 'pro'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_members_plan ON members(plan);

ALTER TABLE member_events
  ADD COLUMN IF NOT EXISTS ciudad TEXT,
  ADD COLUMN IF NOT EXISTS link TEXT,
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT true;

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

CREATE INDEX IF NOT EXISTS idx_member_benefits_published
  ON member_benefits(published, category);

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

CREATE INDEX IF NOT EXISTS idx_member_courses_published
  ON member_courses(published, category);

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

CREATE INDEX IF NOT EXISTS idx_member_course_lessons_course
  ON member_course_lessons(course_id, sort_order);

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

ALTER TABLE member_home_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_benefits ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_benefit_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_lesson_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_group_coffees ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_group_coffee_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_pairings ENABLE ROW LEVEL SECURITY;
