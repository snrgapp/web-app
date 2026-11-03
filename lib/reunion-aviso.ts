import { sendBirdEmail } from '@/lib/bird-email'

/**
 * Aviso interno al registrar un founder en /proxima_reunion.
 *
 * Env:
 *   BIRD_REUNION_TEMPLATE  id o slug de la plantilla (emt_... / nuevo-registro-reunion)
 *   BIRD_REUNION_TO        destinatarios separados por coma
 */
const TEMPLATE_REF =
  process.env.BIRD_REUNION_TEMPLATE || 'emt_01m6hq9y0pf0h8fxf96fgffbg0'

const DESTINATARIOS_DEFAULT = [
  'jesusprieto@snrg.lat',
  'jesusdavidprieto@gmail.com',
]

const TIEMPO: Record<string, string> = {
  '6m': 'Temprana (+ 6 meses)',
  '1y': 'Crecimiento (+ 1 año)',
  '3y': 'Consolidada (+ 3 años)',
}

const FACTURACION: Record<string, string> = {
  '1-3m': 'Entre 1 y 3 millones',
  '3-10m': 'Entre 3 y 10 millones',
  '10m+': '+ 10 millones',
}

const EQUIPO: Record<string, string> = {
  solo: 'Solo founder',
  small: '2 a 5',
  medium: '6 a 15',
}

const CAMARA: Record<string, string> = {
  natural: 'Persona natural',
  juridica: 'Persona jurídica',
  no: 'No registrada',
}

function dato(v: string | null | undefined) {
  const t = String(v ?? '').trim()
  return t || '—'
}

function telefonoBonito(n: string) {
  const d = n.replace(/\D/g, '')
  if (d.length === 10) return `${d.slice(0, 3)} ${d.slice(3, 6)} ${d.slice(6)}`
  return dato(n)
}

function destinatarios() {
  const crudo = process.env.BIRD_REUNION_TO || DESTINATARIOS_DEFAULT.join(',')
  const vistos = new Set<string>()
  return crudo
    .split(',')
    .map((c) => c.trim().toLowerCase())
    .filter((c) => {
      if (!c.includes('@') || vistos.has(c)) return false
      vistos.add(c)
      return true
    })
    .map((email) => ({ email }))
}

export type RegistroReunionAviso = {
  nombre: string
  apellido: string
  correo: string
  telefono?: string | null
  ciudad: string
  empresa?: string | null
  instagram?: string | null
  problema?: string | null
  tiempo_empresa?: string | null
  facturacion?: string | null
  tamano_equipo?: string | null
  canales?: string[] | null
  camara_comercio?: string | null
  desafio?: string | null
}

export async function avisarRegistroReunion(reg: RegistroReunionAviso) {
  const to = destinatarios()
  if (!to.length) return { success: false, error: 'Sin destinatarios' }

  const templateId = TEMPLATE_REF.startsWith('emt_')
  return sendBirdEmail({
    to,
    template: {
      ...(templateId ? { id: TEMPLATE_REF } : { slug: TEMPLATE_REF }),
      language: 'es',
      parameters: {
        nombre: dato(reg.nombre),
        apellido: dato(reg.apellido),
        ciudad: dato(reg.ciudad),
        empresa: dato(reg.empresa),
        instagram: dato(reg.instagram).replace(/^@+/, ''),
        correo: dato(reg.correo),
        telefono: telefonoBonito(reg.telefono || ''),
        tiempo: TIEMPO[reg.tiempo_empresa || ''] || dato(reg.tiempo_empresa),
        facturacion: FACTURACION[reg.facturacion || ''] || dato(reg.facturacion),
        equipo: EQUIPO[reg.tamano_equipo || ''] || dato(reg.tamano_equipo),
        camara: CAMARA[reg.camara_comercio || ''] || dato(reg.camara_comercio),
        canales: (reg.canales || []).filter(Boolean).join(' · ') || '—',
        problema: dato(reg.problema),
        desafio: dato(reg.desafio),
        fecha: new Date().toLocaleDateString('es-CO', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          timeZone: 'America/Bogota',
        }),
      },
    },
    category: 'transactional',
    tags: { tipo: 'registro-reunion', ciudad: (reg.ciudad || '').slice(0, 40) },
  })
}
