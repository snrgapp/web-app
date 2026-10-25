/**
 * Formulario público de un evento: Nombre, Correo y Celular siempre se piden;
 * el resto sale de evento_form_campos (pestaña Formularios del panel).
 */

export type CampoEvento = {
  id: string
  label: string
  tipo: string
  obligatorio: boolean | null
  opciones: string | null
  orden: number | null
}

export const MAX_ARCHIVO_MB = 4

function normalizar(s: string) {
  return s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const BASE = /^(nombres?|nombre completo|tu nombre|correo|correo electronico|email|e mail|celular|telefono|whatsapp|telefono whatsapp|numero de celular)$/

const COLUMNA: Record<string, 'empresa' | 'cargo' | 'sector'> = {
  empresa: 'empresa',
  'nombre de la empresa': 'empresa',
  'nombre de tu empresa': 'empresa',
  startup: 'empresa',
  cargo: 'cargo',
  rol: 'cargo',
  sector: 'sector',
  vertical: 'sector',
  industria: 'sector',
}

/**
 * Preguntas del panel que se muestran, sin repetir los campos base.
 * El tipo `nombre` sí pasa: cambia el nombre completo por Nombre y Apellido separados.
 */
export function camposPublicos(campos: CampoEvento[]) {
  return campos
    .filter((c) => c.tipo === 'nombre' || (c.label?.trim() && !BASE.test(normalizar(c.label))))
    .sort((a, b) => (a.orden ?? 0) - (b.orden ?? 0))
}

export function columnaDeCampo(label: string) {
  return COLUMNA[normalizar(label)] ?? null
}

export function opcionesCampo(c: Pick<CampoEvento, 'opciones'>) {
  const t = String(c.opciones ?? '')
  return (t.includes('\n') ? t.split('\n') : t.split(','))
    .map((s) => s.trim())
    .filter(Boolean)
}
