CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  color_hex TEXT NOT NULL,
  icon_slug TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('easy', 'medium', 'hard')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_questions_category_id ON questions(category_id);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON questions(created_at);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on questions" ON questions
  FOR SELECT USING (true);

INSERT INTO categories (name, color_hex, icon_slug) VALUES
  ('Programación', '#3b82f6', 'code'),
  ('Matemáticas', '#8b5cf6', 'calculator'),
  ('Ciencia', '#10b981', 'flask'),
  ('Historia', '#f59e0b', 'book'),
  ('Arte', '#ec4899', 'palette')
ON CONFLICT (name) DO NOTHING;

INSERT INTO questions (content, category_id, difficulty_level)
SELECT 
  '¿Cuál es tu lenguaje de programación favorito y por qué?',
  id,
  'easy'
FROM categories 
WHERE name = 'Programación'
LIMIT 1;

INSERT INTO questions (content, category_id, difficulty_level)
SELECT 
  '¿Qué es un algoritmo y cómo lo explicarías a un niño?',
  id,
  'medium'
FROM categories 
WHERE name = 'Programación'
LIMIT 1;

INSERT INTO questions (content, category_id, difficulty_level)
SELECT 
  '¿Cuál es la diferencia entre frontend y backend?',
  id,
  'easy'
FROM categories 
WHERE name = 'Programación'
LIMIT 1;

INSERT INTO questions (content, category_id, difficulty_level)
SELECT 
  '¿Qué es la recursión y cuándo la usarías?',
  id,
  'hard'
FROM categories 
WHERE name = 'Programación'
LIMIT 1;

INSERT INTO questions (content, category_id, difficulty_level)
SELECT 
  '¿Cuál es el resultado de 15 × 23?',
  id,
  'medium'
FROM categories 
WHERE name = 'Matemáticas'
LIMIT 1;

INSERT INTO questions (content, category_id, difficulty_level)
SELECT 
  '¿Qué es el número Pi y por qué es importante?',
  id,
  'easy'
FROM categories 
WHERE name = 'Matemáticas'
LIMIT 1;

INSERT INTO questions (content, category_id, difficulty_level)
SELECT 
  '¿Qué es la teoría de la relatividad de Einstein?',
  id,
  'hard'
FROM categories 
WHERE name = 'Ciencia'
LIMIT 1;

INSERT INTO questions (content, category_id, difficulty_level)
SELECT 
  '¿Cuál fue el evento más importante de la Segunda Guerra Mundial?',
  id,
  'medium'
FROM categories 
WHERE name = 'Historia'
LIMIT 1;

INSERT INTO questions (content, category_id, difficulty_level)
SELECT 
  '¿Quién pintó la Mona Lisa?',
  id,
  'easy'
FROM categories 
WHERE name = 'Arte'
LIMIT 1;

INSERT INTO questions (content, category_id, difficulty_level)
SELECT 
  '¿Qué movimiento artístico te inspira más?',
  id,
  'medium'
FROM categories 
WHERE name = 'Arte'
LIMIT 1;
