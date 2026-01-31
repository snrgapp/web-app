-- ============================================================
-- EJECUTAR EN SUPABASE (con la base de datos ya activa, no pausada)
-- 1. Entra a tu proyecto en supabase.com
-- 2. SQL Editor → New query
-- 3. Copia y pega TODO este archivo
-- 4. Run
--
-- Aplica: columna slug, categorías founder/company, 4 preguntas de ejemplo.
-- Si sale error "relation categories does not exist", ejecuta antes
-- el contenido de supabase/migrations/001_initial_schema_clean.sql
-- ============================================================

-- 1. Añadir columna slug a categories (si no existe)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- 2. Crear o actualizar las dos categorías de la app
INSERT INTO categories (name, slug, color_hex, icon_slug) VALUES
  ('Conocer al founder', 'founder', '#000000', 'rocket'),
  ('Desafíos de la empresa', 'company', '#FFE100', 'coffee')
ON CONFLICT (name) DO UPDATE SET
  slug = EXCLUDED.slug,
  color_hex = EXCLUDED.color_hex,
  icon_slug = EXCLUDED.icon_slug;

-- 3. Preguntas de ejemplo para "Conocer al founder" (solo si no existen ya)
INSERT INTO questions (content, category_id, difficulty_level)
SELECT '¿Cuál ha sido la lección más valiosa que aprendiste en el último error que cometiste?', c.id, 'medium'
FROM categories c
WHERE c.slug = 'founder'
  AND NOT EXISTS (
    SELECT 1 FROM questions q
    WHERE q.category_id = c.id
      AND q.content = '¿Cuál ha sido la lección más valiosa que aprendiste en el último error que cometiste?'
  )
LIMIT 1;

INSERT INTO questions (content, category_id, difficulty_level)
SELECT '¿Qué te motivó a emprender y qué te mantiene motivado hoy?', c.id, 'easy'
FROM categories c
WHERE c.slug = 'founder'
  AND NOT EXISTS (
    SELECT 1 FROM questions q
    WHERE q.category_id = c.id
      AND q.content = '¿Qué te motivó a emprender y qué te mantiene motivado hoy?'
  )
LIMIT 1;

-- 4. Preguntas de ejemplo para "Desafíos de la empresa"
INSERT INTO questions (content, category_id, difficulty_level)
SELECT '¿Cuál es el mayor desafío que está viviendo tu empresa en este momento?', c.id, 'medium'
FROM categories c
WHERE c.slug = 'company'
  AND NOT EXISTS (
    SELECT 1 FROM questions q
    WHERE q.category_id = c.id
      AND q.content = '¿Cuál es el mayor desafío que está viviendo tu empresa en este momento?'
  )
LIMIT 1;

INSERT INTO questions (content, category_id, difficulty_level)
SELECT '¿Cómo ha evolucionado tu empresa ante los obstáculos del último año?', c.id, 'easy'
FROM categories c
WHERE c.slug = 'company'
  AND NOT EXISTS (
    SELECT 1 FROM questions q
    WHERE q.category_id = c.id
      AND q.content = '¿Cómo ha evolucionado tu empresa ante los obstáculos del último año?'
  )
LIMIT 1;
