// ============================================
// SYNERGY — Servicio de WhatsApp
// Archivo: services/whatsapp.ts
// Envía intros de matching vía Twilio WhatsApp
// ============================================

import twilio from 'twilio'
import type { MatchResult } from './matching'

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
)

const FROM = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`

// ─────────────────────────────────────────────
// formatPhone
// Normaliza números colombianos a formato WhatsApp
// ─────────────────────────────────────────────
function formatPhone(phone: string): string {
  let cleaned = phone.replace(/[\s\-\(\)]/g, '')
  if (cleaned.startsWith('+')) return `whatsapp:${cleaned}`
  if (cleaned.startsWith('57')) return `whatsapp:+${cleaned}`
  if (cleaned.startsWith('3') && cleaned.length === 10) return `whatsapp:+57${cleaned}`
  return `whatsapp:+57${cleaned}`
}

// ─────────────────────────────────────────────
// sendMessage
// Envía un mensaje de WhatsApp simple
// ─────────────────────────────────────────────
async function sendMessage(to: string, body: string): Promise<void> {
  await client.messages.create({
    from: FROM,
    to: formatPhone(to),
    body,
  })
}

// ─────────────────────────────────────────────
// enviarBienvenida
// Mensaje inicial cuando llega un perfil nuevo
// Se envía después de que Gabi termina la llamada
// ─────────────────────────────────────────────
export async function enviarBienvenida(
  telefono: string,
  nombre: string | null
): Promise<void> {
  const nombreStr = nombre ? `, ${nombre}` : ''
  const mensaje = `¡Hola${nombreStr}! 👋 Soy Gabi de Synergy.

Acabo de revisar nuestra red y encontré personas que creo que deberías conocer.

En los próximos minutos te presento las conexiones. ¿Estás listo/a?`

  await sendMessage(telefono, mensaje)
  console.log('📱 Bienvenida enviada a:', telefono)
}

// ─────────────────────────────────────────────
// enviarMatches
// Envía los matches encontrados al nuevo miembro
// Un mensaje por match con la razón generada por Groq
// ─────────────────────────────────────────────
export async function enviarMatches(
  telefono: string,
  nombre: string | null,
  matches: MatchResult[]
): Promise<void> {
  if (matches.length === 0) {
    await sendMessage(
      telefono,
      `Hola${nombre ? ` ${nombre}` : ''}! Por ahora no encontré un match exacto en la red, pero seguiré buscando. A medida que la red crece te voy conectando. 🔍`
    )
    return
  }

  // Mensaje intro
  await sendMessage(
    telefono,
    `Encontré ${matches.length === 1 ? 'una persona' : `${matches.length} personas`} en la red que creo que ${matches.length === 1 ? 'te interesa conocer' : 'te interesan conocer'} 👇`
  )

  // Pausa de 1 segundo entre mensajes para que no lleguen todos juntos
  await delay(1000)

  // Un mensaje por match
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i]
    const letra = ['A', 'B', 'C'][i]

    const mensaje = `(${letra}) *${match.perfil.nombre_negocio || 'Empresa en la red'}*
${match.perfil.ciudad_principal ? `📍 ${match.perfil.ciudad_principal}` : ''}

${match.razon}

¿Quieres que los conecte? Responde *${letra}SI* o *${letra}NO*`

    await sendMessage(telefono, mensaje)
    await delay(800)
  }

  console.log(`📱 ${matches.length} matches enviados a:`, telefono)
}

// ─────────────────────────────────────────────
// procesarRespuesta
// Interpreta la respuesta del usuario (ASI, ANO, BSI, etc.)
// Retorna { letra, acepto }
// ─────────────────────────────────────────────
export function procesarRespuesta(texto: string): { letra: string; acepto: boolean } | null {
  const limpio = texto.trim().toUpperCase().replace(/\s/g, '')

  const match = limpio.match(/^([ABC])(SI|NO|SÍ)$/)
  if (!match) return null

  return {
    letra: match[1],
    acepto: match[2] === 'SI' || match[2] === 'SÍ',
  }
}

// ─────────────────────────────────────────────
// enviarIntroGrupal
// Cuando ambos aceptan, crea la intro entre los dos
// ─────────────────────────────────────────────
export async function enviarIntroGrupal(
  telefonoA: string,
  nombreA: string | null,
  negocioA: string | null,
  telefonoB: string,
  nombreB: string | null,
  negocioB: string | null,
  razon: string
): Promise<void> {
  const msgParaA = `¡Perfecto! 🤝 Te presento a *${nombreB || negocioB || 'tu nuevo contacto'}*.

${razon}

Su WhatsApp: *${telefonoB}*

Los dejo hablar. Cualquier cosa, aquí estoy. 🙌`

  const msgParaB = `¡Hola${nombreB ? ` ${nombreB}` : ''}! 👋 Te presento a *${nombreA || negocioA || 'tu nuevo contacto'}* de parte de Synergy.

${razon}

Su WhatsApp: *${telefonoA}*

Espero que sea una gran conexión. 🚀`

  await sendMessage(telefonoA, msgParaA)
  await delay(500)
  await sendMessage(telefonoB, msgParaB)

  console.log('🤝 Intro enviada entre:', telefonoA, '↔', telefonoB)
}

// ─────────────────────────────────────────────
// Utilidad
// ─────────────────────────────────────────────
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
