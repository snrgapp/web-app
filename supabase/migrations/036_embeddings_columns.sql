-- Columnas de embeddings para matching vectorial
ALTER TABLE ia_call_profiles
ADD COLUMN IF NOT EXISTS embedding_need       vector(1536),
ADD COLUMN IF NOT EXISTS embedding_offer      vector(1536),
ADD COLUMN IF NOT EXISTS listo_para_matching  boolean DEFAULT false;

-- Índices para búsqueda vectorial eficiente
CREATE INDEX IF NOT EXISTS ia_call_profiles_embedding_need_idx
  ON ia_call_profiles
  USING hnsw (embedding_need vector_cosine_ops);

CREATE INDEX IF NOT EXISTS ia_call_profiles_embedding_offer_idx
  ON ia_call_profiles
  USING hnsw (embedding_offer vector_cosine_ops);

CREATE INDEX IF NOT EXISTS ia_call_profiles_listo_para_matching_idx
  ON ia_call_profiles (listo_para_matching);
