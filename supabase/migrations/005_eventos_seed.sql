-- Opcional: insertar el primer evento (Reunión Networking CTG - Luma)
-- Ejecuta esto después de 004_eventos.sql si quieres un evento por defecto.
-- Si usas imagen local: copia la portada a public/images/eventos/luma-promo.png
-- Si usas Storage: sube la imagen desde Panel > Eventos y no ejecutes este INSERT.

INSERT INTO eventos (titulo, image_url, link, orden)
SELECT
  'Reunión de Networking para Emprendedores - CTG',
  '/images/eventos/luma-promo.png',
  'https://luma.com/niaonzz6',
  0
WHERE NOT EXISTS (SELECT 1 FROM eventos WHERE link = 'https://luma.com/niaonzz6' LIMIT 1);
