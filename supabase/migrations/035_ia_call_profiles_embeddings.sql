-- Embeddings para matching need ↔ offer (pgvector 1536 ≈ text-embedding-3-small)
-- Requiere extensión vector (Supabase: Database → Extensions → vector, o línea de abajo)

CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE ia_call_profiles
  ADD COLUMN IF NOT EXISTS embedding_need vector(1536),
  ADD COLUMN IF NOT EXISTS embedding_offer vector(1536),
  ADD COLUMN IF NOT EXISTS listo_para_matching boolean DEFAULT false;

COMMENT ON COLUMN ia_call_profiles.embedding_need IS 'Embedding del texto de necesidad/desafío (busca_primario + busca_detalle o similar).';
COMMENT ON COLUMN ia_call_profiles.embedding_offer IS 'Embedding del texto de lo que ofrece (ofrece + descripcion_negocio o similar).';
COMMENT ON COLUMN ia_call_profiles.listo_para_matching IS 'true cuando ambos embeddings están listos para consultas de similitud.';

-- HNSW: búsqueda por coseno (filas con NULL no entran al índice de todas formas útiles)
CREATE INDEX IF NOT EXISTS idx_ia_call_profiles_embedding_need_hnsw
  ON ia_call_profiles
  USING hnsw (embedding_need vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_ia_call_profiles_embedding_offer_hnsw
  ON ia_call_profiles
  USING hnsw (embedding_offer vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_ia_call_profiles_listo_matching
  ON ia_call_profiles (listo_para_matching);
