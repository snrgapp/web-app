-- Función de búsqueda vectorial para matching de Synergy
CREATE OR REPLACE FUNCTION match_by_need(
  query_embedding vector(1536),
  exclude_id      uuid,
  match_threshold float default 0.35,
  match_count     int default 10
)
RETURNS TABLE (
  id                  uuid,
  contacto_nombre     text,
  ciudad_principal    text,
  descripcion_negocio text,
  nombre_negocio      text,
  busca_detalle       text,
  ofrece              text,
  score_urgencia      text,
  notas_personalidad  text,
  embedding_need      vector(1536),
  embedding_offer     vector(1536),
  similarity          float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    id,
    contacto_nombre,
    ciudad_principal,
    descripcion_negocio,
    nombre_negocio,
    busca_detalle,
    ofrece,
    score_urgencia,
    notas_personalidad,
    embedding_need,
    embedding_offer,
    1 - (embedding_offer <=> query_embedding) AS similarity
  FROM ia_call_profiles
  WHERE
    listo_para_matching = true
    AND id != exclude_id
    AND 1 - (embedding_offer <=> query_embedding) > match_threshold
  ORDER BY similarity DESC
  LIMIT match_count;
$$;
