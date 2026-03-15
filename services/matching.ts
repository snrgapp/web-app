// ============================================
// SYNERGY — Servicio de Matching
// Archivo: services/matching.ts
// Busca los mejores matches para un perfil nuevo
// ============================================

import { createAdminClient } from '@/utils/supabase/admin'

interface PerfilNuevo {
  id: string
  contacto_nombre?: string | null
  nombre_negocio?: string | null
  descripcion_negocio?: string | null
  tipo_negocio?: string | null
  momento_negocio?: string | null
  cliente_objetivo?: string | null
  busca_primario?: string | null
  busca_detalle?: string | null
  busca_secundario?: string | null
  ofrece?: string | null
  logro_notable?: string | null
  ciudad_principal?: string | null
  score_urgencia?: string | null
  embedding_need: number[]
  embedding_offer: number[]
}

interface MatchCandidate {
  id: string
  contacto_nombre: string | null
  ciudad_principal: string | null
  descripcion_negocio: string | null
  nombre_negocio: string | null
  busca_detalle: string | null
  ofrece: string | null
  score_urgencia: string | null
  notas_personalidad: string | null
  embedding_need: number[]
  embedding_offer: number[]
  similarity: number
}

export interface MatchResult {
  perfil: MatchCandidate
  score: number
  razon: string
  breakdown: {
    similarity_base: number
    city_bonus: number
    urgency_bonus: number
  }
}

// ─────────────────────────────────────────────
// cosineSimilarity
// Mide similitud entre dos vectores (0 a 1)
// ─────────────────────────────────────────────
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot   += a[i] * b[i]
    normA += a[i] ** 2
    normB += b[i] ** 2
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Tipo mínimo para generar la razón del match (Groq)
type PerfilMatch = Pick<
  MatchCandidate,
  'nombre_negocio' | 'descripcion_negocio' | 'ofrece' | 'busca_detalle' | 'ciudad_principal'
>

// ─────────────────────────────────────────────
// generarRazonMatch
// Usa Groq (llama-3.1-8b-instant) para la frase humana del match
// ─────────────────────────────────────────────
async function generarRazonMatch(candidato: PerfilMatch): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return `Encontré a alguien en la red que creo que tiene sentido para lo que buscas.`
  }

  const prompt = `Eres el sistema de matching de Synergy, una red de empresarios de Latinoamérica.

Encontraste a esta persona en la red:
- Negocio: ${candidato.nombre_negocio || 'No indicado'}
- Descripción: ${candidato.descripcion_negocio || 'No indicado'}
- Ofrece: ${candidato.ofrece || 'No indicado'}
- Busca: ${candidato.busca_detalle || 'No indicado'}
- Ciudad: ${candidato.ciudad_principal || 'No indicado'}

Escribe UNA sola oración explicando por qué el nuevo miembro debería conocerla.
- Específico con el negocio o sector
- Máximo 25 palabras
- Español colombiano, tono cálido y directo
- Sin palabras como "sinergia", "potencial", "oportunidad"
- Solo la oración, nada más.`

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant', // gratis, ultra rápido
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 60,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      console.error('Groq error:', response.status)
      return `Encontré a alguien en la red que creo que tiene sentido para lo que buscas.`
    }

    const data = await response.json() as {
      choices: Array<{ message: { content: string } }>
    }

    return data.choices[0].message.content.trim()
  } catch (err) {
    console.error('Error generando razón del match:', err)
    return `Encontré a alguien en la red de contactos, que creo que tiene sentido para lo que buscas.`
  }
}

// ─────────────────────────────────────────────
// findMatches
// Función principal — busca top 3 matches para un perfil
// ─────────────────────────────────────────────
export async function findMatches(perfil: PerfilNuevo): Promise<MatchResult[]> {
  const supabase = createAdminClient()
  if (!supabase) throw new Error('Supabase no configurado')

  console.log('🔍 Buscando matches para:', perfil.contacto_nombre || perfil.id)

  const { data: candidatos, error } = await supabase.rpc('match_by_need', {
    query_embedding: perfil.embedding_need,
    exclude_id: perfil.id,
    match_threshold: 0.30,
    match_count: 10,
  })

  if (error) {
    console.error('Error en match_by_need:', error)
    throw new Error(`Error buscando matches: ${error.message}`)
  }

  if (!candidatos || candidatos.length === 0) {
    console.log('ℹ️ No se encontraron candidatos por encima del umbral')
    return []
  }

  console.log(`📋 Candidatos encontrados: ${candidatos.length}`)

  // Normalizar embedding (puede venir como array o string desde la RPC)
  const toVector = (v: unknown): number[] =>
    Array.isArray(v) ? v as number[] : typeof v === 'string' ? JSON.parse(v) : []

  const scored = (candidatos as Array<Record<string, unknown>>).map((row) => {
    const candidato: MatchCandidate = {
      id: row.id as string,
      contacto_nombre: row.contacto_nombre as string | null,
      ciudad_principal: row.ciudad_principal as string | null,
      descripcion_negocio: row.descripcion_negocio as string | null,
      nombre_negocio: row.nombre_negocio as string | null,
      busca_detalle: row.busca_detalle as string | null,
      ofrece: row.ofrece as string | null,
      score_urgencia: row.score_urgencia as string | null,
      notas_personalidad: row.notas_personalidad as string | null,
      embedding_need: toVector(row.embedding_need),
      embedding_offer: toVector(row.embedding_offer),
      similarity: Number(row.similarity),
    }
    const similarity_base = candidato.similarity

    const city_bonus =
      candidato.ciudad_principal &&
      perfil.ciudad_principal &&
      candidato.ciudad_principal === perfil.ciudad_principal
        ? 0.08 : 0

    const urgency_bonus =
      perfil.score_urgencia === 'alta' &&
      candidato.score_urgencia === 'alta'
        ? 0.05 : 0

    const score_final = parseFloat(
      (similarity_base + city_bonus + urgency_bonus).toFixed(4)
    )

    return {
      candidato,
      score_final,
      breakdown: { similarity_base, city_bonus, urgency_bonus },
      razon: '',
    }
  })

  const top3 = scored
    .sort((a, b) => b.score_final - a.score_final)
    .slice(0, 3)

  const matchesConRazon = await Promise.all(
    top3.map(async (m) => ({
      perfil: m.candidato,
      score: m.score_final,
      razon: await generarRazonMatch(m.candidato),
      breakdown: m.breakdown,
    }))
  )

  // Quién llama a findMatches/buscarMatches puede guardar con guardarMatches()
  console.log(`✅ Top ${matchesConRazon.length} matches generados`)
  matchesConRazon.forEach((m, i) => {
    console.log(`   ${i + 1}. ${m.perfil.contacto_nombre || m.perfil.id} — score: ${m.score}`)
    console.log(`      Razón: ${m.razon}`)
  })

  return matchesConRazon
}

// ─────────────────────────────────────────────
// logMatches
// Guarda el historial de matches en ia_matches
// ─────────────────────────────────────────────
async function logMatches(profileId: string, matches: MatchResult[]): Promise<void> {
  const supabase = createAdminClient()
  if (!supabase || matches.length === 0) return

  const records = matches.map((m) => ({
    profile_a_id: profileId,
    profile_b_id: m.perfil.id,
    score: m.score,
    razon: m.razon,
    status: 'pendiente',
  }))

  const { error } = await supabase
    .from('ia_matches')
    .insert(records)

  if (error) console.error('Error guardando historial de matches:', error)
}

/** Alias para uso en webhook: busca matches dado un perfil completo. */
export const buscarMatches = findMatches

/** Alias para uso en webhook: guarda los matches en ia_matches. */
export async function guardarMatches(profileId: string, matches: MatchResult[]): Promise<void> {
  return logMatches(profileId, matches)
}
