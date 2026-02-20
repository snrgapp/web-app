-- ============================================================
-- Seed de prueba para dashboard de miembros
-- Datos para: ranking de conexiones, ranking de referidos,
-- recomendaciones de conexión, últimas conexiones
-- ============================================================

-- 1. Asegurar que existe el miembro dev (para desarrollo local)
INSERT INTO members (phone, nombre, email, empresa)
VALUES ('dev', 'Dev (local)', 'dev@test.com', 'Test Co')
ON CONFLICT (phone) DO NOTHING;

-- 2. Insertar miembros de prueba
-- Conectados con dev: para ranking y últimas conexiones
-- Referidos de dev: para ranking de referidos (5001,5002,5003,5005)
-- NO conectados: para recomendaciones (5006-5010)
INSERT INTO members (phone, nombre, email, empresa, referido_por_id)
VALUES
  ('+5215512345001', 'Carlos Torres', 'carlos@towercem.com', 'TowerCem', (SELECT id FROM members WHERE phone = 'dev' LIMIT 1)),
  ('+5215512345002', 'Carlos Torres', 'carlos2@towercem.com', 'TowerCem', (SELECT id FROM members WHERE phone = 'dev' LIMIT 1)),
  ('+5215512345003', 'María García', 'maria@acme.com', 'Acme Corp', (SELECT id FROM members WHERE phone = 'dev' LIMIT 1)),
  ('+5215512345004', 'Juan Pérez', 'juan@tech.mx', 'Tech México', NULL),
  ('+5215512345005', 'Ana López', 'ana@innovar.com', 'Innovar', (SELECT id FROM members WHERE phone = 'dev' LIMIT 1)),
  ('+5215512345006', 'Carlos Torres', 'ctorres@towercem.com', 'TowerCem', NULL),
  ('+5215512345007', 'Carlos Torres', 'carlos.t@constructora.com', 'TowerCem', NULL),
  ('+5215512345008', 'Laura Martínez', 'laura@empresa.mx', 'Empresa MX', NULL),
  ('+5215512345009', 'Roberto Sánchez', 'roberto@consultores.com', 'Consultores SA', NULL),
  ('+5215512345010', 'Patricia Ruiz', 'patricia@startup.io', 'Startup IO', NULL)
ON CONFLICT (phone) DO NOTHING;

-- 3. Crear conexiones desde dev hacia miembros 5001-5005
INSERT INTO connections (member_id, connected_member_id, tipo)
SELECT
  (SELECT id FROM members WHERE phone = 'dev' LIMIT 1),
  m.id,
  CASE WHEN m.phone IN ('+5215512345001','+5215512345002') THEN 'cafe_aceptado' ELSE 'connection' END
FROM members m
WHERE m.phone IN ('+5215512345001','+5215512345002','+5215512345003','+5215512345004','+5215512345005')
ON CONFLICT (member_id, connected_member_id) DO NOTHING;

-- 4. Evento de prueba para el calendario
INSERT INTO member_events (titulo, descripcion, fecha_inicio, lugar)
SELECT 'Evento de tu contacto un café', 'Networking con miembros', now()::date + interval '1 day', 'Café Central'
WHERE NOT EXISTS (SELECT 1 FROM member_events LIMIT 1);

-- Relaciones:
-- - connections: dev conectado con 5001,5002,5003,5004,5005 (ranking + últimas conexiones)
-- - referido_por_id: 5001,5002,5003,5005 referidos por dev (ranking referidos: dev = 4)
-- - Recomendaciones: 5006,5007,5008,5009,5010 (no conectados con dev)
