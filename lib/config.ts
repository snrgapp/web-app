/**
 * URL canónica de formularios de inscripción.
 * Los formularios siempre deben dirigir a inscripcion.snrg.lat.
 */
export const INSCRIPCION_BASE_URL =
  process.env.NEXT_PUBLIC_INSCRIPCION_BASE_URL ?? 'https://inscripcion.snrg.lat'

/** URL completa de un formulario por slug */
export function getInscripcionFormUrl(slug: string): string {
  return `${INSCRIPCION_BASE_URL}/${slug}`
}
