import type { TamanoTarjeta, TarjetaDirectorio, TonoTarjeta } from '@/lib/directorio/tipos'

const ZONA = 'America/Bogota'

const TONOS: TonoTarjeta[] = ['lima', 'naranja', 'azul', 'rosa']
const TAMANOS: TamanoTarjeta[] = ['amplia', 'compacta', 'media', 'media', 'amplia', 'compacta']

export function presentarPersona(nombre: string, apellido: string): {
  nombre: string
  apellido: string
  iniciales: string
} {
  const n = nombre.trim()
  let a = apellido.trim()
  // El registro trae los dos apellidos; en la grilla se ve el primero (JS).
  if (n.toLocaleLowerCase('es') === 'jorge' && /^s[aá]nchez\b/i.test(a)) {
    a = 'Sánchez'
  }
  return {
    nombre: n,
    apellido: a,
    iniciales: `${letra(n)}${letra(a)}`,
  }
}

function letra(valor: string): string {
  const caracter = Array.from(valor.trim())[0] ?? ''
  return caracter.toLocaleUpperCase('es-CO')
}

export function estiloTarjeta(indice: number): { tono: TonoTarjeta; tamano: TamanoTarjeta } {
  return {
    tono: TONOS[indice % TONOS.length],
    tamano: TAMANOS[indice % TAMANOS.length],
  }
}

export function limpiarTexto(valor: string | null | undefined): string {
  return (valor ?? '').replace(/\r\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
}

export function sinTildes(valor: string): string {
  return valor
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('es')
}

export function fechaEnBogota(fecha: Date): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(fecha)
}

export function diasHasta(expiraIso: string, ahora = new Date()): number {
  const fin = new Date(expiraIso)
  if (Number.isNaN(fin.getTime())) return 0
  const hoy = fechaEnBogota(ahora)
  const cierre = fechaEnBogota(fin)
  const [anioHoy, mesHoy, diaHoy] = hoy.split('-').map(Number)
  const [anioFin, mesFin, diaFin] = cierre.split('-').map(Number)
  const ms = Date.UTC(anioFin, mesFin - 1, diaFin) - Date.UTC(anioHoy, mesHoy - 1, diaHoy)
  return Math.round(ms / 86_400_000)
}

export function textoDisponibilidad(expiraIso: string, ahora = new Date()): string {
  const dias = diasHasta(expiraIso, ahora)
  if (dias <= 0) return 'Disponible hasta hoy'
  if (dias === 1) return 'Disponible 1 día más'
  return `Disponible ${dias} días más`
}

export function tituloDirectorio(total: number): string {
  if (total === 1) return 'Quiénes estuvieron · 1 asistente'
  return `Quiénes estuvieron · ${total} asistentes`
}

export function sectoresUnicos(sectores: string[]): string[] {
  const unicos = new Set<string>()
  for (const sector of sectores) {
    const limpio = sector.trim()
    if (limpio) unicos.add(limpio)
  }
  return [...unicos].sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
}

export function textoBuscable(partes: string[]): string {
  return sinTildes(partes.join(' '))
}

export function coincide(
  tarjeta: Pick<
    TarjetaDirectorio,
    'nombre' | 'apellido' | 'empresa' | 'sector' | 'soluciones' | 'desafios'
  >,
  consulta: string,
  sector: string
): boolean {
  if (sector !== 'todos' && tarjeta.sector !== sector) return false
  const q = sinTildes(consulta.trim())
  if (!q) return true
  return textoBuscable([
    tarjeta.nombre,
    tarjeta.apellido,
    tarjeta.empresa,
    tarjeta.sector,
    tarjeta.soluciones,
    tarjeta.desafios,
  ]).includes(q)
}
