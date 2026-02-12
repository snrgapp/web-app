-- Agregar icon_url y cover_url a forms
ALTER TABLE forms
  ADD COLUMN IF NOT EXISTS icon_url TEXT,
  ADD COLUMN IF NOT EXISTS cover_url TEXT;

-- Bucket "formularios" para íconos y portadas.
-- IMPORTANTE: Crear en Supabase Dashboard: Storage > New bucket > nombre: formularios, Public: true

-- Políticas para el bucket formularios
DROP POLICY IF EXISTS "Allow public insert to formularios bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from formularios bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update in formularios bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from formularios bucket" ON storage.objects;

CREATE POLICY "Allow public insert to formularios bucket"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'formularios');

CREATE POLICY "Allow public read from formularios bucket"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'formularios');

CREATE POLICY "Allow public update in formularios bucket"
ON storage.objects FOR UPDATE TO public
USING (bucket_id = 'formularios')
WITH CHECK (bucket_id = 'formularios');

CREATE POLICY "Allow public delete from formularios bucket"
ON storage.objects FOR DELETE TO public
USING (bucket_id = 'formularios');
