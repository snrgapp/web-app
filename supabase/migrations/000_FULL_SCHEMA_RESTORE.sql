-- =============================================================
-- SCRIPT DE RESTAURACIÓN COMPLETO — SNRG / Synergy Platform
-- Generado a partir de las 60 migraciones del proyecto.
-- Ejecutar en un proyecto Supabase nuevo desde el SQL Editor.
-- Usa IF NOT EXISTS en todas partes para ser idempotente.
-- =============================================================

-- ─────────────────────────────────────────────
-- 0. EXTENSIONES
-- ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";   -- para embeddings IA (si se usa)


-- =============================================================
-- 1. ORGANIZACIONES (tenant base)
-- =============================================================
CREATE TABLE IF NOT EXISTS organizaciones (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre       TEXT NOT NULL,
  slug         TEXT NOT NULL UNIQUE,
  dominio_custom TEXT,
  plan         TEXT NOT NULL DEFAULT 'free'
               CHECK (plan IN ('free', 'pro', 'enterprise')),
  settings     JSONB NOT NULL DEFAULT '{}',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_organizaciones_slug ON organizaciones(slug);
CREATE INDEX IF NOT EXISTS idx_organizaciones_dominio ON organizaciones(dominio_custom)
  WHERE dominio_custom IS NOT NULL;

CREATE TABLE IF NOT EXISTS organizacion_miembros (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organizacion_id UUID NOT NULL REFERENCES organizaciones(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL,
  rol             TEXT NOT NULL DEFAULT 'member'
                  CHECK (rol IN ('admin', 'member', 'viewer')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organizacion_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_org_miembros_org  ON organizacion_miembros(organizacion_id);
CREATE INDEX IF NOT EXISTS idx_org_miembros_user ON organizacion_miembros(user_id);

ALTER TABLE organizaciones       ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizacion_miembros ENABLE ROW LEVEL SECURITY;

-- Org default SNRG
INSERT INTO organizaciones (nombre, slug, plan)
VALUES ('Synergy (Default)', 'snrg', 'pro')
ON CONFLICT (slug) DO NOTHING;


-- =============================================================
-- 2. FUNCIONES RLS MULTI-TENANT
-- =============================================================
CREATE OR REPLACE FUNCTION public.is_org_member(p_user_id uuid, p_org_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT p_org_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM organizacion_miembros m
    WHERE m.user_id = p_user_id AND m.organizacion_id = p_org_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(p_user_id uuid, p_org_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT p_org_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM organizacion_miembros m
    WHERE m.user_id = p_user_id AND m.organizacion_id = p_org_id
      AND m.rol = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.can_read_org(user_id uuid, org_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT org_id IS NULL OR user_id IS NULL OR is_org_member(user_id, org_id);
$$;

CREATE OR REPLACE FUNCTION public.can_write_org(user_id uuid, org_id uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT org_id IS NULL OR user_id IS NULL OR is_org_admin(user_id, org_id);
$$;


-- =============================================================
-- 3. CATEGORÍAS Y PREGUNTAS (networking cards)
-- =============================================================
CREATE TABLE IF NOT EXISTS categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  slug            TEXT,
  color_hex       TEXT NOT NULL,
  icon_slug       TEXT NOT NULL,
  organizacion_id UUID REFERENCES organizaciones(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_organizacion_id ON categories(organizacion_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_org_slug_unique
  ON categories(organizacion_id, slug) WHERE slug IS NOT NULL;

CREATE TABLE IF NOT EXISTS questions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content          TEXT NOT NULL,
  category_id      UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  created_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questions_category_id  ON questions(category_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty    ON questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_questions_created_at   ON questions(created_at);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions   ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories_select" ON categories FOR SELECT
  USING (can_read_org(auth.uid(), organizacion_id));
CREATE POLICY "categories_insert" ON categories FOR INSERT
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));
CREATE POLICY "categories_update" ON categories FOR UPDATE
  USING (can_write_org(auth.uid(), organizacion_id));
CREATE POLICY "categories_delete" ON categories FOR DELETE
  USING (can_write_org(auth.uid(), organizacion_id));

CREATE POLICY "questions_select" ON questions FOR SELECT
  USING (can_read_org(auth.uid(), (SELECT organizacion_id FROM categories WHERE id = category_id)));
CREATE POLICY "questions_insert" ON questions FOR INSERT
  WITH CHECK (can_write_org(auth.uid(), (SELECT organizacion_id FROM categories WHERE id = category_id)));
CREATE POLICY "questions_update" ON questions FOR UPDATE
  USING (can_write_org(auth.uid(), (SELECT organizacion_id FROM categories WHERE id = category_id)));
CREATE POLICY "questions_delete" ON questions FOR DELETE
  USING (can_write_org(auth.uid(), (SELECT organizacion_id FROM categories WHERE id = category_id)));


-- =============================================================
-- 4. EVENTOS
-- =============================================================
CREATE TABLE IF NOT EXISTS eventos (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo             TEXT,
  image_url          TEXT,
  link               TEXT,
  orden              INTEGER NOT NULL DEFAULT 0,
  fecha              DATE,
  ciudad             TEXT,
  checkin_slug       TEXT,
  inscripcion_abierta BOOLEAN NOT NULL DEFAULT true,
  acerca_del_evento  TEXT,
  organizacion_id    UUID REFERENCES organizaciones(id) ON DELETE CASCADE,
  created_at         TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_eventos_orden          ON eventos(orden);
CREATE INDEX IF NOT EXISTS idx_eventos_fecha          ON eventos(fecha);
CREATE INDEX IF NOT EXISTS idx_eventos_organizacion_id ON eventos(organizacion_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_eventos_checkin_slug_org_unique
  ON eventos(organizacion_id, checkin_slug) WHERE checkin_slug IS NOT NULL;

ALTER TABLE eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "eventos_select" ON eventos FOR SELECT
  USING (can_read_org(auth.uid(), organizacion_id));
CREATE POLICY "eventos_insert" ON eventos FOR INSERT
  WITH CHECK (can_write_org(auth.uid(), organizacion_id));
CREATE POLICY "eventos_update" ON eventos FOR UPDATE
  USING (can_write_org(auth.uid(), organizacion_id));
CREATE POLICY "eventos_delete" ON eventos FOR DELETE
  USING (can_write_org(auth.uid(), organizacion_id));

-- Evento legacy para datos históricos
INSERT INTO eventos (titulo, image_url, link, orden, checkin_slug, organizacion_id)
SELECT 'Evento histórico', 'https://placehold.co/400x200?text=Legacy',
       'https://snrg.lat', -1, 'legacy', id
FROM organizaciones WHERE slug = 'snrg' LIMIT 1
ON CONFLICT DO NOTHING;


-- =============================================================
-- 5. LEADS Y CONTACTOS
-- =============================================================
CREATE TABLE IF NOT EXISTS leads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT NOT NULL,
  ciudad          TEXT,
  organizacion_id UUID REFERENCES organizaciones(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_organizacion_id ON leads(organizacion_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_org_email_unique ON leads(organizacion_id, email);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads_select" ON leads FOR SELECT USING (can_read_org(auth.uid(), organizacion_id));
CREATE POLICY "leads_insert" ON leads FOR INSERT WITH CHECK (true);

CREATE TABLE IF NOT EXISTS contactos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          TEXT,
  whatsapp        TEXT,
  correo          TEXT,
  mensaje         TEXT NOT NULL,
  organizacion_id UUID REFERENCES organizaciones(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_contactos_created_at    ON contactos(created_at);
CREATE INDEX IF NOT EXISTS idx_contactos_organizacion_id ON contactos(organizacion_id);

ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contactos_select" ON contactos FOR SELECT USING (can_read_org(auth.uid(), organizacion_id));
CREATE POLICY "contactos_insert" ON contactos FOR INSERT WITH CHECK (true);


-- =============================================================
-- 6. FORMULARIOS (PaaS)
-- =============================================================
CREATE TABLE IF NOT EXISTS forms (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id       UUID REFERENCES eventos(id) ON DELETE SET NULL,
  slug            TEXT NOT NULL,
  titulo          TEXT NOT NULL,
  descripcion     TEXT,
  campos          JSONB NOT NULL DEFAULT '[]',
  activo          BOOLEAN NOT NULL DEFAULT true,
  icon_url        TEXT,
  cover_url       TEXT,
  brevo_list_id   INTEGER,
  organizacion_id UUID REFERENCES organizaciones(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_forms_evento_id       ON forms(evento_id);
CREATE INDEX IF NOT EXISTS idx_forms_activo          ON forms(activo) WHERE activo = true;
CREATE INDEX IF NOT EXISTS idx_forms_organizacion_id ON forms(organizacion_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_forms_organizacion_slug_unique ON forms(organizacion_id, slug);

ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "forms_select" ON forms FOR SELECT USING (can_read_org(auth.uid(), organizacion_id));
CREATE POLICY "forms_insert" ON forms FOR INSERT WITH CHECK (can_write_org(auth.uid(), organizacion_id));
CREATE POLICY "forms_update" ON forms FOR UPDATE USING (can_write_org(auth.uid(), organizacion_id));
CREATE POLICY "forms_delete" ON forms FOR DELETE USING (can_write_org(auth.uid(), organizacion_id));

CREATE TABLE IF NOT EXISTS form_submissions (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  form_id    UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,
  datos      JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_form_submissions_form_id    ON form_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_form_submissions_created_at ON form_submissions(created_at DESC);

ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "form_submissions_select" ON form_submissions FOR SELECT
  USING (can_read_org(auth.uid(), (SELECT organizacion_id FROM forms WHERE id = form_id)));
CREATE POLICY "form_submissions_insert" ON form_submissions FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM forms f WHERE f.id = form_id AND f.activo = true));


-- =============================================================
-- 7. ASISTENTES (networking presencial)
-- =============================================================
CREATE TABLE IF NOT EXISTS asistentes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre       TEXT,
  apellido     TEXT,
  telefono     TEXT,
  correo       TEXT,
  empresa      TEXT,
  sector       TEXT,
  soluciones   TEXT,
  desafios     TEXT,
  mesa         TEXT,
  codigo_mesa  TEXT,
  mesa_ronda2  TEXT,
  evento_id    UUID REFERENCES eventos(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_asistentes_correo         ON asistentes(correo);
CREATE INDEX IF NOT EXISTS idx_asistentes_mesa           ON asistentes(mesa);
CREATE INDEX IF NOT EXISTS idx_asistentes_codigo_mesa    ON asistentes(codigo_mesa);
CREATE INDEX IF NOT EXISTS idx_asistentes_mesa_ronda2    ON asistentes(mesa_ronda2);
CREATE INDEX IF NOT EXISTS idx_asistentes_telefono       ON asistentes(telefono);
CREATE INDEX IF NOT EXISTS idx_asistentes_evento_id      ON asistentes(evento_id);
CREATE INDEX IF NOT EXISTS idx_asistentes_evento_telefono ON asistentes(evento_id, telefono);

ALTER TABLE asistentes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "asistentes_select" ON asistentes FOR SELECT
  USING (can_read_org(auth.uid(), (SELECT organizacion_id FROM eventos WHERE id = evento_id)));
CREATE POLICY "asistentes_insert" ON asistentes FOR INSERT WITH CHECK (true);
CREATE POLICY "asistentes_update" ON asistentes FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "asistentes_delete" ON asistentes FOR DELETE USING (true);

CREATE TABLE IF NOT EXISTS feedback_networking (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  asistente_id UUID NOT NULL REFERENCES asistentes(id) ON DELETE CASCADE,
  rating       INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_feedback_networking_asistente_id ON feedback_networking(asistente_id);

ALTER TABLE feedback_networking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "feedback_networking_select" ON feedback_networking FOR SELECT USING (true);
CREATE POLICY "feedback_networking_insert" ON feedback_networking FOR INSERT WITH CHECK (true);


-- =============================================================
-- 8. SPOTLIGHT (pitches y votación)
-- =============================================================
CREATE TABLE IF NOT EXISTS founders (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre          TEXT NOT NULL,
  startup_nombre  TEXT NOT NULL,
  image_url       TEXT,
  pitch_order     INTEGER NOT NULL DEFAULT 0,
  activo          BOOLEAN NOT NULL DEFAULT true,
  organizacion_id UUID REFERENCES organizaciones(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_founders_organizacion_id ON founders(organizacion_id);

CREATE TABLE IF NOT EXISTS votantes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp        TEXT NOT NULL,
  nombre          TEXT,
  categoria       TEXT NOT NULL DEFAULT 'espectador'
                  CHECK (categoria IN ('espectador', 'jurado')),
  organizacion_id UUID REFERENCES organizaciones(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_votantes_organizacion_id ON votantes(organizacion_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_votantes_org_whatsapp_unique ON votantes(organizacion_id, whatsapp);

CREATE TABLE IF NOT EXISTS votos (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  votante_id       UUID NOT NULL REFERENCES votantes(id) ON DELETE CASCADE,
  founder_id       UUID NOT NULL REFERENCES founders(id) ON DELETE CASCADE,
  score_innovacion INTEGER NOT NULL CHECK (score_innovacion BETWEEN 1 AND 5),
  score_claridad   INTEGER NOT NULL CHECK (score_claridad BETWEEN 1 AND 5),
  score_qa         INTEGER NOT NULL CHECK (score_qa BETWEEN 1 AND 5),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (votante_id, founder_id)
);

ALTER TABLE founders ENABLE ROW LEVEL SECURITY;
ALTER TABLE votantes  ENABLE ROW LEVEL SECURITY;
ALTER TABLE votos     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "founders_select" ON founders FOR SELECT USING (can_read_org(auth.uid(), organizacion_id));
CREATE POLICY "founders_insert" ON founders FOR INSERT WITH CHECK (can_write_org(auth.uid(), organizacion_id));
CREATE POLICY "founders_update" ON founders FOR UPDATE USING (can_write_org(auth.uid(), organizacion_id));
CREATE POLICY "founders_delete" ON founders FOR DELETE USING (can_write_org(auth.uid(), organizacion_id));

CREATE POLICY "votantes_select" ON votantes FOR SELECT USING (can_read_org(auth.uid(), organizacion_id));
CREATE POLICY "votantes_insert" ON votantes FOR INSERT WITH CHECK (can_write_org(auth.uid(), organizacion_id));
CREATE POLICY "votantes_update" ON votantes FOR UPDATE USING (can_write_org(auth.uid(), organizacion_id));
CREATE POLICY "votantes_delete" ON votantes FOR DELETE USING (can_write_org(auth.uid(), organizacion_id));

CREATE POLICY "votos_select" ON votos FOR SELECT
  USING (can_read_org(auth.uid(), (SELECT organizacion_id FROM votantes WHERE id = votante_id)));
CREATE POLICY "votos_insert" ON votos FOR INSERT WITH CHECK (true);

-- Storage bucket founders
INSERT INTO storage.buckets (id, name, public) VALUES ('founders', 'founders', true)
ON CONFLICT (id) DO NOTHING;
CREATE POLICY "founders_storage_select" ON storage.objects FOR SELECT USING (bucket_id = 'founders');
CREATE POLICY "founders_storage_insert" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'founders');
CREATE POLICY "founders_storage_update" ON storage.objects FOR UPDATE USING (bucket_id = 'founders');
CREATE POLICY "founders_storage_delete" ON storage.objects FOR DELETE USING (bucket_id = 'founders');


-- =============================================================
-- 9. MIEMBROS (miembros.snrg.lat)
-- =============================================================
CREATE TABLE IF NOT EXISTS members (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone          TEXT NOT NULL UNIQUE,
  nombre         TEXT,
  email          TEXT,
  empresa        TEXT,
  avatar_url     TEXT,
  ciudad         TEXT,
  password_hash  TEXT,
  referido_por_id UUID REFERENCES members(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_members_phone       ON members(phone);
CREATE INDEX IF NOT EXISTS idx_members_referido_por ON members(referido_por_id) WHERE referido_por_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_members_empresa      ON members(empresa) WHERE empresa IS NOT NULL;

CREATE TABLE IF NOT EXISTS connections (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id           UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  connected_member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  tipo                TEXT NOT NULL DEFAULT 'connection'
                      CHECK (tipo IN ('connection', 'cafe_invitado', 'cafe_aceptado')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (member_id, connected_member_id)
);

CREATE INDEX IF NOT EXISTS idx_connections_member    ON connections(member_id);
CREATE INDEX IF NOT EXISTS idx_connections_connected ON connections(connected_member_id);
CREATE INDEX IF NOT EXISTS idx_connections_created   ON connections(created_at DESC);

CREATE TABLE IF NOT EXISTS member_events (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo       TEXT NOT NULL,
  descripcion  TEXT,
  fecha_inicio TIMESTAMPTZ,
  fecha_fin    TIMESTAMPTZ,
  lugar        TEXT,
  image_url    TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_member_events_fecha ON member_events(fecha_inicio) WHERE fecha_inicio IS NOT NULL;

CREATE TABLE IF NOT EXISTS event_attendance (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id   UUID NOT NULL REFERENCES member_events(id) ON DELETE CASCADE,
  member_id  UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_event_attendance_event  ON event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_member ON event_attendance(member_id);

ALTER TABLE members         ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections     ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "members_select_public"   ON members       FOR SELECT USING (true);
CREATE POLICY "members_insert_public"   ON members       FOR INSERT WITH CHECK (true);
CREATE POLICY "members_update_public"   ON members       FOR UPDATE USING (true);
CREATE POLICY "connections_select_public" ON connections FOR SELECT USING (true);
CREATE POLICY "connections_insert_public" ON connections FOR INSERT WITH CHECK (true);
CREATE POLICY "connections_update_public" ON connections FOR UPDATE USING (true);
CREATE POLICY "member_events_select_public" ON member_events FOR SELECT USING (true);
CREATE POLICY "member_events_insert_public" ON member_events FOR INSERT WITH CHECK (true);
CREATE POLICY "member_events_update_public" ON member_events FOR UPDATE USING (true);
CREATE POLICY "event_attendance_select_public" ON event_attendance FOR SELECT USING (true);
CREATE POLICY "event_attendance_insert_public" ON event_attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "event_attendance_delete_public" ON event_attendance FOR DELETE USING (true);


-- =============================================================
-- 10. HACKATON (hackaton.snrg.lat)
-- =============================================================
CREATE SEQUENCE IF NOT EXISTS hackaton_badge_num_seq;

CREATE TABLE IF NOT EXISTS hackaton_submissions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo TEXT NOT NULL CHECK (char_length(trim(nombre_completo)) BETWEEN 2 AND 200),
  telefono        TEXT NOT NULL CHECK (telefono ~ '^[0-9]{7,15}$'),
  perfil          TEXT NOT NULL CHECK (char_length(trim(perfil)) BETWEEN 1 AND 200),
  badge_id        TEXT NOT NULL UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_hackaton_submissions_telefono_unique
  ON hackaton_submissions (telefono);
CREATE INDEX IF NOT EXISTS idx_hackaton_submissions_created_at
  ON hackaton_submissions (created_at DESC);

-- Trigger: normalizar teléfono (solo dígitos)
CREATE OR REPLACE FUNCTION hackaton_normalize_telefono()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.telefono IS NOT NULL THEN
    NEW.telefono := regexp_replace(NEW.telefono, '\D', '', 'g');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_hackaton_normalize_telefono ON hackaton_submissions;
CREATE TRIGGER trg_hackaton_normalize_telefono
  BEFORE INSERT OR UPDATE ON hackaton_submissions
  FOR EACH ROW EXECUTE PROCEDURE hackaton_normalize_telefono();

-- Trigger: auto badge_id
CREATE OR REPLACE FUNCTION set_hackaton_badge_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.badge_id IS NULL OR btrim(NEW.badge_id) = '' THEN
    NEW.badge_id :=
      'HCK-' || to_char(EXTRACT(YEAR FROM now())::INT, 'FM9999')
      || '-' || lpad(nextval('hackaton_badge_num_seq')::TEXT, 6, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_hackaton_badge_id ON hackaton_submissions;
CREATE TRIGGER trg_hackaton_badge_id
  BEFORE INSERT ON hackaton_submissions
  FOR EACH ROW EXECUTE PROCEDURE set_hackaton_badge_id();

CREATE TABLE IF NOT EXISTS match_hackaton (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id         UUID NOT NULL REFERENCES hackaton_submissions(id) ON DELETE CASCADE,
  matched_submission_id UUID NOT NULL REFERENCES hackaton_submissions(id) ON DELETE CASCADE,
  ronda                 SMALLINT NOT NULL CHECK (ronda IN (1, 2)),
  razon                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT match_hackaton_no_self     CHECK (submission_id <> matched_submission_id),
  CONSTRAINT match_hackaton_unique_pair UNIQUE (submission_id, matched_submission_id, ronda)
);

CREATE INDEX IF NOT EXISTS idx_match_hackaton_viewer ON match_hackaton (submission_id, ronda);

CREATE TABLE IF NOT EXISTS hackaton_networking_feedback (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES hackaton_submissions(id) ON DELETE CASCADE,
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT hackaton_networking_feedback_submission_unique UNIQUE (submission_id)
);

CREATE INDEX IF NOT EXISTS idx_hackaton_networking_feedback_created
  ON hackaton_networking_feedback (created_at DESC);

ALTER TABLE hackaton_submissions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_hackaton               ENABLE ROW LEVEL SECURITY;
ALTER TABLE hackaton_networking_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY hackaton_submissions_select_authenticated
  ON hackaton_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY match_hackaton_select_authenticated
  ON match_hackaton FOR SELECT TO authenticated USING (true);
CREATE POLICY hackaton_networking_feedback_select_authenticated
  ON hackaton_networking_feedback FOR SELECT TO authenticated USING (true);
CREATE POLICY hackaton_networking_feedback_insert_public
  ON hackaton_networking_feedback FOR INSERT WITH CHECK (true);


-- =============================================================
-- 11. IEEE NETWORKING (ieee.snrg.lat)
-- =============================================================
CREATE TABLE IF NOT EXISTS ieee_networking_submissions (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo        TEXT NOT NULL CHECK (char_length(trim(nombre_completo)) BETWEEN 2 AND 200),
  telefono               TEXT NOT NULL CHECK (telefono ~ '^[0-9]{7,15}$'),
  correo                 TEXT NOT NULL CHECK (
                           char_length(trim(correo)) BETWEEN 5 AND 320
                           AND correo ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
                         ),
  areas_interes          TEXT[] NOT NULL CHECK (
                           cardinality(areas_interes) BETWEEN 1 AND 6
                           AND areas_interes <@ ARRAY[
                             'Inteligencia Artificial','Ciencia de Datos','Ciberseguridad',
                             'IoT','Robótica','Desarrollo de Software'
                           ]::TEXT[]
                         ),
  habilidades_compartir  TEXT NOT NULL CHECK (char_length(trim(habilidades_compartir)) BETWEEN 3 AND 2000),
  tipos_conexion         TEXT[] NOT NULL CHECK (
                           cardinality(tipos_conexion) BETWEEN 1 AND 5
                           AND tipos_conexion <@ ARRAY[
                             'Mentoría','Socios para proyectos','Oportunidades laborales',
                             'Colaboración en investigación','Amistades profesionales'
                           ]::TEXT[]
                         ),
  conocimiento_ofrecido  TEXT,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_ieee_networking_telefono_unique
  ON ieee_networking_submissions (telefono);
CREATE INDEX IF NOT EXISTS idx_ieee_networking_created_at
  ON ieee_networking_submissions (created_at DESC);

CREATE TABLE IF NOT EXISTS match_ieee (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id         UUID NOT NULL REFERENCES ieee_networking_submissions(id) ON DELETE CASCADE,
  matched_submission_id UUID NOT NULL REFERENCES ieee_networking_submissions(id) ON DELETE CASCADE,
  ronda                 SMALLINT NOT NULL CHECK (ronda IN (1, 2)),
  razon                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT match_ieee_no_self     CHECK (submission_id <> matched_submission_id),
  CONSTRAINT match_ieee_unique_pair UNIQUE (submission_id, matched_submission_id, ronda)
);

CREATE INDEX IF NOT EXISTS idx_match_ieee_viewer ON match_ieee (submission_id, ronda);

CREATE TABLE IF NOT EXISTS ieee_networking_feedback (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID NOT NULL REFERENCES ieee_networking_submissions(id) ON DELETE CASCADE,
  rating        INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ieee_networking_feedback_submission
  ON ieee_networking_feedback (submission_id, created_at DESC);

ALTER TABLE ieee_networking_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_ieee                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE ieee_networking_feedback    ENABLE ROW LEVEL SECURITY;

CREATE POLICY ieee_networking_submissions_select_authenticated
  ON ieee_networking_submissions FOR SELECT TO authenticated USING (true);
CREATE POLICY match_ieee_select_authenticated
  ON match_ieee FOR SELECT TO authenticated USING (true);
CREATE POLICY ieee_networking_feedback_select_authenticated
  ON ieee_networking_feedback FOR SELECT TO authenticated USING (true);
CREATE POLICY ieee_networking_feedback_insert_public
  ON ieee_networking_feedback FOR INSERT WITH CHECK (true);


-- =============================================================
-- 12. GENIUS FEST (genius.snrg.lat) — estado FINAL
-- =============================================================
CREATE TABLE IF NOT EXISTS genius_conecta_submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_completo TEXT NOT NULL CHECK (char_length(trim(nombre_completo)) BETWEEN 2 AND 200),
  telefono        TEXT NOT NULL CHECK (telefono ~ '^[0-9]{7,15}$'),
  identidad       TEXT NOT NULL CHECK (identidad IN (
    -- valores legacy (filas históricas)
    'Estudiante','Emprendedor/a','Empleado en empresa',
    'Freelance / Independiente','Dueño/a de negocio','Creativo/a',
    -- arquetipos nuevos (formulario genius.snrg.lat 2026)
    'El líder que quiere mover la aguja',
    'El creador de futuro',
    'El explorador tech',
    'El conector estratégico',
    'La tejedor/a de transformación territorial'
  )),
  motivacion      TEXT NOT NULL CHECK (motivacion IN (
    'Aprender algo nuevo',
    'Encontrar clientes o proyectos',
    'Conectar con personas afines',
    'Buscar empleo u oportunidades',
    'Curiosidad / me invitaron'
  )),
  mundo           TEXT,   -- nullable desde migración 062
  valor_humano    TEXT NOT NULL CHECK (char_length(valor_humano) BETWEEN 3 AND 200),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_genius_conecta_telefono_unique
  ON genius_conecta_submissions (telefono);
CREATE INDEX IF NOT EXISTS idx_genius_conecta_created_at
  ON genius_conecta_submissions (created_at DESC);

ALTER TABLE genius_conecta_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY genius_conecta_submissions_select_authenticated
  ON genius_conecta_submissions FOR SELECT TO authenticated USING (true);

COMMENT ON TABLE genius_conecta_submissions IS
  'Genius FEST — respuestas del formulario genius.snrg.lat; acceso app por teléfono.';
COMMENT ON COLUMN genius_conecta_submissions.mundo IS
  'Mundo profesional; nullable desde 2026 (pregunta eliminada del formulario).';
COMMENT ON COLUMN genius_conecta_submissions.identidad IS
  'Arquetipo o perfil legacy Genius FEST; nuevo formulario usa los 5 arquetipos.';

-- Matches
CREATE TABLE IF NOT EXISTS match_genius (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id         UUID NOT NULL REFERENCES genius_conecta_submissions(id) ON DELETE CASCADE,
  matched_submission_id UUID NOT NULL REFERENCES genius_conecta_submissions(id) ON DELETE CASCADE,
  ronda                 SMALLINT NOT NULL CHECK (ronda IN (1, 2)),
  razon                 TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT match_genius_no_self     CHECK (submission_id <> matched_submission_id),
  CONSTRAINT match_genius_unique_pair UNIQUE (submission_id, matched_submission_id, ronda)
);

CREATE INDEX IF NOT EXISTS idx_match_genius_viewer ON match_genius (submission_id, ronda);

ALTER TABLE match_genius ENABLE ROW LEVEL SECURITY;
CREATE POLICY match_genius_select_authenticated
  ON match_genius FOR SELECT TO authenticated USING (true);

-- Feedback (incluye conexiones_count agregado en migración 063)
CREATE TABLE IF NOT EXISTS genius_networking_feedback (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id    UUID NOT NULL REFERENCES genius_conecta_submissions(id) ON DELETE CASCADE,
  rating           INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment          TEXT,
  conexiones_count SMALLINT CHECK (conexiones_count >= 0 AND conexiones_count <= 3),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_genius_networking_feedback_submission
  ON genius_networking_feedback (submission_id, created_at DESC);

ALTER TABLE genius_networking_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY genius_networking_feedback_select_authenticated
  ON genius_networking_feedback FOR SELECT TO authenticated USING (true);
CREATE POLICY genius_networking_feedback_insert_public
  ON genius_networking_feedback FOR INSERT WITH CHECK (true);

COMMENT ON COLUMN genius_networking_feedback.conexiones_count IS
  '¿Con cuántas personas lograste conectar? 0=ninguna 1=una 2=dos 3=tres o más';

-- Clicks WhatsApp (migración 063)
CREATE TABLE IF NOT EXISTS genius_networking_wa_clicks (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id         UUID NOT NULL REFERENCES genius_conecta_submissions(id) ON DELETE CASCADE,
  clicked_submission_id UUID NOT NULL REFERENCES genius_conecta_submissions(id) ON DELETE CASCADE,
  ronda                 SMALLINT NOT NULL CHECK (ronda IN (1, 2)),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS genius_wa_clicks_submission_idx
  ON genius_networking_wa_clicks (submission_id);
CREATE INDEX IF NOT EXISTS genius_wa_clicks_clicked_idx
  ON genius_networking_wa_clicks (clicked_submission_id);

ALTER TABLE genius_networking_wa_clicks ENABLE ROW LEVEL SECURITY;
CREATE POLICY genius_wa_clicks_select_authenticated
  ON genius_networking_wa_clicks FOR SELECT TO authenticated USING (true);
CREATE POLICY genius_wa_clicks_insert_public
  ON genius_networking_wa_clicks FOR INSERT WITH CHECK (true);

COMMENT ON TABLE genius_networking_wa_clicks IS
  'Registra cada vez que un asistente Genius toca el botón WhatsApp en una tarjeta de conexión.';


-- =============================================================
-- 13. RLS — ORGANIZACION_MIEMBROS
-- =============================================================
CREATE POLICY "organizaciones_select" ON organizaciones FOR SELECT USING (true);
CREATE POLICY "organizaciones_insert" ON organizaciones FOR INSERT WITH CHECK (true);
CREATE POLICY "organizaciones_update" ON organizaciones FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "organizacion_miembros_select" ON organizacion_miembros FOR SELECT
  USING (auth.uid() IS NULL OR user_id = auth.uid() OR is_org_admin(auth.uid(), organizacion_id));
CREATE POLICY "organizacion_miembros_insert" ON organizacion_miembros FOR INSERT
  WITH CHECK (is_org_admin(auth.uid(), organizacion_id) OR auth.uid() IS NULL);
CREATE POLICY "organizacion_miembros_delete" ON organizacion_miembros FOR DELETE
  USING (is_org_admin(auth.uid(), organizacion_id) OR user_id = auth.uid() OR auth.uid() IS NULL);


-- =============================================================
-- 14. STORAGE BUCKETS
-- =============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('eventos', 'eventos', true)
ON CONFLICT (id) DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('formularios', 'formularios', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas eventos bucket
DROP POLICY IF EXISTS "Allow public insert to eventos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from eventos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update in eventos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from eventos bucket" ON storage.objects;

CREATE POLICY "Allow public insert to eventos bucket" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'eventos');
CREATE POLICY "Allow public read from eventos bucket" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'eventos');
CREATE POLICY "Allow public update in eventos bucket" ON storage.objects
  FOR UPDATE TO public USING (bucket_id = 'eventos') WITH CHECK (bucket_id = 'eventos');
CREATE POLICY "Allow public delete from eventos bucket" ON storage.objects
  FOR DELETE TO public USING (bucket_id = 'eventos');

-- Políticas formularios bucket
DROP POLICY IF EXISTS "Allow public insert to formularios bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from formularios bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update in formularios bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from formularios bucket" ON storage.objects;

CREATE POLICY "Allow public insert to formularios bucket" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'formularios');
CREATE POLICY "Allow public read from formularios bucket" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'formularios');
CREATE POLICY "Allow public update in formularios bucket" ON storage.objects
  FOR UPDATE TO public USING (bucket_id = 'formularios') WITH CHECK (bucket_id = 'formularios');
CREATE POLICY "Allow public delete from formularios bucket" ON storage.objects
  FOR DELETE TO public USING (bucket_id = 'formularios');


-- =============================================================
-- FIN DEL SCRIPT
-- Próximos pasos:
--   1. Configurar variables de entorno en Vercel (NEXT_PUBLIC_SUPABASE_URL,
--      NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, etc.)
--   2. Crear los buckets de Storage si no se crearon automáticamente
--      (eventos, formularios, founders).
--   3. Verificar que el proyecto tiene Supabase Auth activado si usas panel.
-- =============================================================
