-- ============================================================
-- Dashboard de miembros Snergy (miembros.snrg.lat)
-- Tablas: members, connections, member_events, event_attendance
-- ============================================================

-- 1. Tabla members (teléfono como identificador principal)
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

CREATE INDEX IF NOT EXISTS idx_members_phone ON members(phone);
CREATE INDEX IF NOT EXISTS idx_members_referido_por ON members(referido_por_id) WHERE referido_por_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_members_empresa ON members(empresa) WHERE empresa IS NOT NULL;

COMMENT ON TABLE members IS 'Miembros con membresía comprada. phone es el identificador principal para login inicial (sin SMS)';

-- 2. Tabla connections (conexiones entre miembros)
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

COMMENT ON TABLE connections IS 'Conexiones entre miembros. tipo: connection, cafe_invitado, cafe_aceptado';

-- 3. Tabla member_events (eventos exclusivos del área miembros)
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

CREATE INDEX IF NOT EXISTS idx_member_events_fecha ON member_events(fecha_inicio) WHERE fecha_inicio IS NOT NULL;

COMMENT ON TABLE member_events IS 'Eventos para miembros (separado de eventos del panel org)';

-- 4. Tabla event_attendance (registro de asistencia)
CREATE TABLE IF NOT EXISTS event_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES member_events(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (event_id, member_id)
);

CREATE INDEX IF NOT EXISTS idx_event_attendance_event ON event_attendance(event_id);
CREATE INDEX IF NOT EXISTS idx_event_attendance_member ON event_attendance(member_id);

COMMENT ON TABLE event_attendance IS 'Registro de asistencia de miembros a eventos';

-- RLS: habilitar en todas las tablas
-- Fase inicial: permitir acceso vía service_role desde API routes.
-- Las políticas permiten SELECT público para desarrollo; en producción
-- se filtraría por sesión. Por ahora usamos service_role en API.
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendance ENABLE ROW LEVEL SECURITY;

-- Políticas permisivas para que las API routes con service_role puedan operar
-- (service_role bypasses RLS, pero anon/authenticated no)
CREATE POLICY "members_select_public" ON members FOR SELECT USING (true);
CREATE POLICY "members_insert_public" ON members FOR INSERT WITH CHECK (true);
CREATE POLICY "members_update_public" ON members FOR UPDATE USING (true);

CREATE POLICY "connections_select_public" ON connections FOR SELECT USING (true);
CREATE POLICY "connections_insert_public" ON connections FOR INSERT WITH CHECK (true);
CREATE POLICY "connections_update_public" ON connections FOR UPDATE USING (true);

CREATE POLICY "member_events_select_public" ON member_events FOR SELECT USING (true);
CREATE POLICY "member_events_insert_public" ON member_events FOR INSERT WITH CHECK (true);
CREATE POLICY "member_events_update_public" ON member_events FOR UPDATE USING (true);

CREATE POLICY "event_attendance_select_public" ON event_attendance FOR SELECT USING (true);
CREATE POLICY "event_attendance_insert_public" ON event_attendance FOR INSERT WITH CHECK (true);
CREATE POLICY "event_attendance_delete_public" ON event_attendance FOR DELETE USING (true);
