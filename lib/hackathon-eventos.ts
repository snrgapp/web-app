/**
 * Mensajes SMS del hackathon (Inalambria).
 */

import { phoneDigitsCo, sendInalambriaSmsBroadcast } from '@/lib/inalambria'

const EVENT_NAME = () =>
  process.env.HACKATHON_EVENT_NAME?.trim() || 'Hackathon Barranquilla SNRG'

export async function hackathonOnRegistro(participant: {
  nombre: string
  telefono: string
  badge_id: string
}) {
  const msg =
    `Hola ${participant.nombre.split(/\s+/)[0]}, tu registro al ${EVENT_NAME()} fue exitoso. ` +
    `Badge: ${participant.badge_id}. En la app de networking verás tu credencial y conexiones sugeridas por ronda.`
  return sendInalambriaSmsBroadcast(msg, [phoneDigitsCo(participant.telefono)])
}
