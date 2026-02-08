/**
 * Datos y rutas de imágenes para la página /inicio
 * Agregar las imágenes en public/images/ según las rutas indicadas.
 * Reemplaza estas rutas cuando tengas tus imágenes.
 */

export const heroImages = [
  '/images/hero/hero-1.jpeg',
  '/images/hero/hero-2.jpeg',
  '/images/hero/hero-3.jpeg',
  '/images/hero/hero-4.jpeg',
] as const

/** Rotaciones leves por índice para efecto orgánico (grados) */
export const heroCardRotations = [-5, 4, -4, 5] as const

export const experienciaImage = '/images/experiencia.jpeg'

export const aliadosLogos = [
  '/images/aliados/logo-1.svg',
  '/images/aliados/logo-2.svg',
  '/images/aliados/logo-3.svg',
  '/images/aliados/logo-4.svg',
  '/images/aliados/logo-5.svg',
  '/images/aliados/logo-6.svg',
  '/images/aliados/logo-7.svg',
  '/images/aliados/logo-8.svg',
] as const

/** Columna izquierda */
export const experienciaLeftItems = [
  'no es una charla.',
  'no es una feria.',
  'no es un seminario.',
] as const

/** Columna derecha: bloque 1 y bloque 2 con número resaltado */
export const experienciaRightBlock1 = 'te ubicamos en una mesa con founders de manera estratégica.'
export const experienciaRightBlock2 = { prefix: 'conectarás con mínimo ', number: '10', suffix: ' nuevos emprendedores.' }
