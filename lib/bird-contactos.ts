import { birdApiHost } from '@/lib/bird-email'

/**
 * Contactos de eventos en Bird: todos entran a la audiencia general y a la del evento.
 * Bird no tiene etiquetas de contacto; la audiencia por evento es lo que permite
 * escribirle solo a una ciudad/fecha. Los campos ciudad / ultimo_evento / ultimo_registro
 * guardan el registro más reciente.
 *
 * Env:
 *   BIRD_EVENTOS_AUDIENCE_ID  audiencia general (adn_...)
 */
const AUDIENCIA_GENERAL = process.env.BIRD_EVENTOS_AUDIENCE_ID || 'adn_01m5rv27mbezy9dhb8nfhx8g9h'

export type EventoBird = {
  id: string
  titulo?: string | null
  ciudad?: string | null
  fecha?: string | null
}

const audienciasEvento = new Map<string, string>()

function headers(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
}

/** El código #xxxxxxxx en el nombre es lo que la vuelve a encontrar; no lo borres al renombrarla en Bird. */
function codigoEvento(eventoId: string) {
  return `#${eventoId.replace(/-/g, '').slice(0, 8)}`
}

async function audienciaDelEvento(apiKey: string, evento: EventoBird): Promise<string | null> {
  const enCache = audienciasEvento.get(evento.id)
  if (enCache) return enCache

  const host = birdApiHost(apiKey)
  const codigo = codigoEvento(evento.id)
  const buscar = await fetch(`${host}/v1/audiences?q=${encodeURIComponent(codigo)}&limit=5`, {
    headers: headers(apiKey),
  })
  if (buscar.ok) {
    const lista = (await buscar.json()) as { data?: { id: string; name: string }[] }
    const hallada = lista.data?.find((a) => a.name.includes(codigo))
    if (hallada) {
      audienciasEvento.set(evento.id, hallada.id)
      return hallada.id
    }
  }

  const nombre = [evento.titulo || 'Evento', evento.ciudad, evento.fecha].filter(Boolean).join(' · ')
  const crear = await fetch(`${host}/v1/audiences`, {
    method: 'POST',
    headers: { ...headers(apiKey), 'Idempotency-Key': `snrg-evento-${evento.id}` },
    body: JSON.stringify({
      name: `${nombre} ${codigo}`.slice(0, 200),
      description: 'Inscritos a este evento desde el formulario de registro de Synergy.',
      type: 'static',
    }),
  })
  if (!crear.ok) return null
  const creada = (await crear.json()) as { id?: string }
  if (!creada.id) return null
  audienciasEvento.set(evento.id, creada.id)
  return creada.id
}

export async function registrarContactoEvento(input: {
  email: string
  nombre?: string | null
  apellido?: string | null
  evento?: EventoBird | null
}): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.BIRD_API_KEY ?? null
  if (!apiKey) return { success: false, error: 'BIRD_API_KEY no configurada' }

  const email = input.email.trim().toLowerCase()
  if (!email.includes('@')) return { success: false, error: 'Correo no válido' }

  const [primero, ...resto] = String(input.nombre ?? '').trim().split(/\s+/)
  const apellido = String(input.apellido ?? '').trim() || resto.join(' ')

  const contacto: {
    email: string
    first_name?: string
    last_name?: string
    data?: Record<string, string>
  } = { email }
  if (primero) contacto.first_name = primero.slice(0, 100)
  if (apellido) contacto.last_name = apellido.slice(0, 100)

  const audiencias = [AUDIENCIA_GENERAL]
  if (input.evento?.id) {
    contacto.data = {
      ciudad: String(input.evento.ciudad ?? ''),
      ultimo_evento: String(input.evento.titulo ?? ''),
      ultimo_registro: new Date().toISOString().slice(0, 10),
    }
    try {
      const delEvento = await audienciaDelEvento(apiKey, input.evento)
      if (delEvento) audiencias.push(delEvento)
    } catch (error) {
      console.warn('[Bird] audiencia del evento', error)
    }
  }

  try {
    const response = await fetch(`${birdApiHost(apiKey)}/v1/contacts/batch`, {
      method: 'POST',
      headers: headers(apiKey),
      body: JSON.stringify({ contacts: [contacto], audience_ids: audiencias, match_on: 'email' }),
    })
    if (!response.ok) {
      const body = await response.text()
      return { success: false, error: body.slice(0, 280) }
    }
    const payload = (await response.json()) as { data?: { status?: string; error?: { message?: string } }[] }
    const r = payload.data?.[0]
    if (r && r.status !== 'created' && r.status !== 'updated') {
      return { success: false, error: r.error?.message || `Bird respondió ${r.status}` }
    }
    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error al guardar contacto',
    }
  }
}
