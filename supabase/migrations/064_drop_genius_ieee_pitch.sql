-- ============================================================
-- Limpieza: eliminar Genius FEST, IEEE Networking y Pitch/Spotlight
-- Solo se conserva el networking original de Synergy (asistentes, feedback_networking)
-- ============================================================

-- 1. GENIUS FEST
DROP TABLE IF EXISTS genius_networking_wa_clicks CASCADE;
DROP TABLE IF EXISTS genius_networking_feedback    CASCADE;
DROP TABLE IF EXISTS match_genius                  CASCADE;
DROP TABLE IF EXISTS genius_conecta_submissions    CASCADE;

-- 2. IEEE NETWORKING
DROP TABLE IF EXISTS ieee_networking_feedback     CASCADE;
DROP TABLE IF EXISTS match_ieee                   CASCADE;
DROP TABLE IF EXISTS ieee_networking_submissions  CASCADE;

-- 3. PITCH / SPOTLIGHT
DROP TABLE IF EXISTS votos    CASCADE;
DROP TABLE IF EXISTS votantes CASCADE;
DROP TABLE IF EXISTS founders CASCADE;

-- 4. Eliminar bucket de founders de Storage (si existe)
DELETE FROM storage.objects WHERE bucket_id = 'founders';
DELETE FROM storage.buckets WHERE id = 'founders';

-- 5. Eliminar políticas huérfanas de Storage founders (por si quedaron)
DROP POLICY IF EXISTS "founders_storage_select" ON storage.objects;
DROP POLICY IF EXISTS "founders_storage_insert" ON storage.objects;
DROP POLICY IF EXISTS "founders_storage_update" ON storage.objects;
DROP POLICY IF EXISTS "founders_storage_delete" ON storage.objects;
