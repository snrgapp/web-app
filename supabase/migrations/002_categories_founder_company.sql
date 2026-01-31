-- Slug para identificar categorías en la app (founder / company)
ALTER TABLE categories ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Crear las dos categorías que usa la app
INSERT INTO categories (name, slug, color_hex, icon_slug) VALUES
  ('Conocer al founder', 'founder', '#000000', 'rocket'),
  ('Desafíos de la empresa', 'company', '#FFE100', 'coffee')
ON CONFLICT (name) DO UPDATE SET
  slug = EXCLUDED.slug,
  color_hex = EXCLUDED.color_hex,
  icon_slug = EXCLUDED.icon_slug;

-- Si ya existían categorías sin slug, asignar uno (opcional)
-- UPDATE categories SET slug = LOWER(REPLACE(name, ' ', '-')) WHERE slug IS NULL;

-- Ejemplo: 2 preguntas para "Conocer al founder"
INSERT INTO questions (content, category_id, difficulty_level)
SELECT '¿Cuál ha sido la lección más valiosa que aprendiste en el último error que cometiste?', id, 'medium'
FROM categories WHERE slug = 'founder' LIMIT 1;

INSERT INTO questions (content, category_id, difficulty_level)
SELECT '¿Qué te motivó a emprender y qué te mantiene motivado hoy?', id, 'easy'
FROM categories WHERE slug = 'founder' LIMIT 1;

-- Ejemplo: 2 preguntas para "Desafíos de la empresa"
INSERT INTO questions (content, category_id, difficulty_level)
SELECT '¿Cuál es el mayor desafío que está viviendo tu empresa en este momento?', id, 'medium'
FROM categories WHERE slug = 'company' LIMIT 1;

INSERT INTO questions (content, category_id, difficulty_level)
SELECT '¿Cómo ha evolucionado tu empresa ante los obstáculos del último año?', id, 'easy'
FROM categories WHERE slug = 'company' LIMIT 1;
