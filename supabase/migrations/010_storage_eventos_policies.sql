-- Políticas RLS para el bucket "eventos".
-- Requisito: crea el bucket "eventos" en Supabase Dashboard (Storage > New bucket)
-- con nombre "eventos" y marcado como público (Public: true).

-- Eliminar políticas previas si existen (para re-ejecutar la migración)
DROP POLICY IF EXISTS "Allow public insert to eventos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read from eventos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update in eventos bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete from eventos bucket" ON storage.objects;

-- INSERT: permitir subir archivos
CREATE POLICY "Allow public insert to eventos bucket"
ON storage.objects FOR INSERT TO public
WITH CHECK (bucket_id = 'eventos');

-- SELECT: permitir leer archivos públicamente
CREATE POLICY "Allow public read from eventos bucket"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'eventos');

-- UPDATE: permitir actualizar/sobrescribir
CREATE POLICY "Allow public update in eventos bucket"
ON storage.objects FOR UPDATE TO public
USING (bucket_id = 'eventos')
WITH CHECK (bucket_id = 'eventos');

-- DELETE: permitir eliminar archivos
CREATE POLICY "Allow public delete from eventos bucket"
ON storage.objects FOR DELETE TO public
USING (bucket_id = 'eventos');
