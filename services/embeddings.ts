// ============================================
// SYNERGY — Servicio de Embeddings
// Archivo: services/embeddings.ts
// Usa Voyage AI (gratuito) para generar vectores
// ============================================

// Sin SDK — usa fetch directo para evitar ERR_UNSUPPORTED_DIR_IMPORT con ESM

export interface PerfilParaEmbedding {
  id?: string
  contacto_nombre?: string | null
  nombre_negocio?: string | null
  descripcion_negocio?: string | null
  sector?: string | null
  tipo_negocio?: string | null
  momento_negocio?: string | null
  cliente_objetivo?: string | null
  busca_primario?: string | null
  busca_detalle?: string | null
  busca_secundario?: string | null
  ofrece?: string | null
  logro_notable?: string | null
  ciudad_principal?: string | null
}

// ─────────────────────────────────────────────
// buildNeedText
// Texto que representa LO QUE BUSCA el miembro
// ─────────────────────────────────────────────
export function buildNeedText(perfil: PerfilParaEmbedding): string {
  return [
    perfil.busca_primario && `Busca: ${perfil.busca_primario}`,
    perfil.busca_detalle && `Necesita específicamente: ${perfil.busca_detalle}`,
    perfil.busca_secundario && `También busca: ${perfil.busca_secundario}`,
    perfil.sector && `Sector: ${perfil.sector}`,
    perfil.momento_negocio && `Momento del negocio: ${perfil.momento_negocio}`,
    perfil.cliente_objetivo && `Cliente objetivo: ${perfil.cliente_objetivo}`,
    perfil.ciudad_principal && `Ciudad: ${perfil.ciudad_principal}`,
  ]
    .filter(Boolean)
    .join('. ')
    .trim()
}

// ─────────────────────────────────────────────
// buildOfferText
// Texto que representa LO QUE OFRECE el miembro
// ─────────────────────────────────────────────
export function buildOfferText(perfil: PerfilParaEmbedding): string {
  return [
    perfil.nombre_negocio && `Negocio: ${perfil.nombre_negocio}`,
    perfil.descripcion_negocio && `Descripción: ${perfil.descripcion_negocio}`,
    perfil.ofrece && `Ofrece a la red: ${perfil.ofrece}`,
    perfil.sector && `Sector: ${perfil.sector}`,
    perfil.tipo_negocio && `Tipo: ${perfil.tipo_negocio}`,
    perfil.cliente_objetivo && `Clientes que atiende: ${perfil.cliente_objetivo}`,
    perfil.logro_notable && `Logro notable: ${perfil.logro_notable}`,
    perfil.ciudad_principal && `Ciudad: ${perfil.ciudad_principal}`,
  ]
    .filter(Boolean)
    .join('. ')
    .trim()
}

// ─────────────────────────────────────────────
// generateEmbedding
// Llama a Voyage AI y retorna el vector (1536 dims)
// ─────────────────────────────────────────────
export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.VOYAGE_API_KEY
  if (!apiKey) throw new Error('VOYAGE_API_KEY no está definida en las variables de entorno')

  const response = await fetch('https://api.voyageai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      input: [text],
      model: 'voyage-large-2',
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Voyage AI error ${response.status}: ${errorText}`)
  }

  const data = (await response.json()) as {
    data: Array<{ embedding: number[] }>
  }

  return data.data[0].embedding
}

// ─────────────────────────────────────────────
// generateProfileEmbeddings
// Genera los DOS vectores de un perfil en paralelo
// ─────────────────────────────────────────────
export async function generateProfileEmbeddings(
  perfil: PerfilParaEmbedding
): Promise<{ embedding_need: number[]; embedding_offer: number[] }> {
  const needText = buildNeedText(perfil)
  const offerText = buildOfferText(perfil)

  console.log('🧠 Generando embeddings para:', perfil.contacto_nombre || perfil.id)
  console.log('   Need text:', (needText.slice(0, 80) || '(vacío)') + (needText.length > 80 ? '...' : ''))
  console.log('   Offer text:', (offerText.slice(0, 80) || '(vacío)') + (offerText.length > 80 ? '...' : ''))

  const [embedding_need, embedding_offer] = await Promise.all([
    generateEmbedding(needText || 'sin texto need'),
    generateEmbedding(offerText || 'sin texto offer'),
  ])

  return { embedding_need, embedding_offer }
}
