/** Valores almacenados en `genius_conecta_submissions.identidad` para el nuevo paso de arquetipos. */
export const GENIUS_ARQUETIPO_IDENTIDADES = [
  'El líder que quiere mover la aguja',
  'El creador de futuro',
  'El explorador tech',
  'El conector estratégico',
  'La tejedor/a de transformación territorial',
] as const

export type GeniusArquetipoIdentidad = (typeof GENIUS_ARQUETIPO_IDENTIDADES)[number]
