/**
 * Mensajes SMS del hackathon (Inalambria). Sin exponer intenciones a terceros.
 */

import { phoneDigitsCo, sendInalambriaSmsBroadcast, sendInalambriaSmsTemplate } from '@/lib/inalambria'

const EVENT_NAME = () =>
  process.env.HACKATHON_EVENT_NAME?.trim() || 'Hackathon Barranquilla SNRG'

export async function hackathonOnRegistro(participant: {
  nombre: string
  telefono: string
  badge_id: string
}) {
  const msg =
    `Hola ${participant.nombre.split(/\s+/)[0]}, tu registro al ${EVENT_NAME()} fue exitoso. ` +
    `Badge: ${participant.badge_id}. Durante las rondas guarda a quienes quieras como compañeros.`
  return sendInalambriaSmsBroadcast(msg, [phoneDigitsCo(participant.telefono)])
}

/** Solo para interested; pass no envía SMS. */
export async function hackathonOnIntencionInterested(participantPhoneDigits: string) {
  const msg =
    'Guardado. Si esa persona también te escoge, podrán quedar en el mismo equipo.'
  return sendInalambriaSmsBroadcast(msg, [participantPhoneDigits])
}

export async function hackathonOnRecordatorio(participantsPhonesDigits: string[]) {
  if (participantsPhonesDigits.length === 0) return { ok: true as const, skipped: true }
  const msg =
    'La ronda 2 cierra pronto. Si no guardaste compañeros, el sistema te asignará al mejor equipo según tu perfil.'
  return sendInalambriaSmsBroadcast(msg, participantsPhonesDigits)
}

export async function hackathonOnEquipoFormado(recipients: {
  telefono: string
  nombre: string
  equipo: string
  desafio: string
  companeros: string
  mesa: string
}[]) {
  const pattern =
    'Tu equipo quedó listo, {{nombre}}! Equipo: {{equipo}} | Desafío: {{desafio}} | Compañeros: {{companeros}} | Mesa: {{mesa}}. ¡Éxitos!'
  return sendInalambriaSmsTemplate(
    pattern,
    recipients.map((r) => ({
      phone: r.telefono,
      vars: {
        nombre: r.nombre.split(/\s+/)[0] ?? r.nombre,
        equipo: r.equipo,
        desafio: r.desafio,
        companeros: r.companeros,
        mesa: r.mesa,
      },
    }))
  )
}

export async function hackathonOnAjuste(participant: {
  telefono: string
  nombre: string
  equipo: string
  desafio: string
  mesa: string
}) {
  const pattern =
    'Actualización, {{nombre}}: quedaste en el equipo {{equipo}}, desafío {{desafio}}, mesa {{mesa}}. Cualquier duda habla con un organizador.'
  return sendInalambriaSmsTemplate(pattern, [
    {
      phone: participant.telefono,
      vars: {
        nombre: participant.nombre.split(/\s+/)[0] ?? participant.nombre,
        equipo: participant.equipo,
        desafio: participant.desafio,
        mesa: participant.mesa,
      },
    },
  ])
}
