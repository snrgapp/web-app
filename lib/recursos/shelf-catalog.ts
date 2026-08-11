/**
 * Catálogo de 19 hardcovers para The Complete Shelf.
 * Procedural por ahora; listo para sustituir por manifests Mint (GLB/textures).
 */

export type ShelfBook = {
  id: string
  title: string
  subtitle: string
  /** Ancho (eje X del lomo) */
  width: number
  /** Alto */
  height: number
  /** Profundidad */
  depth: number
  cloth: string
  foil: string
  motif: 'arc' | 'grid' | 'orbit' | 'slash' | 'dot'
}

const CLOTHS = [
  '#5C4A3A', '#3D4F5F', '#6B4E71', '#4A5D4E', '#7A5C48',
  '#4E5A6B', '#6E5B4B', '#3F4A3C', '#5A3E4A', '#4A4E5C',
  '#6A5540', '#3C4F4A', '#5B4A5E', '#4F4638', '#46585A',
  '#6B5348', '#3E4556', '#584A3C', '#4A5560',
]

const FOILS = [
  '#C9B896', '#D4C4A8', '#B8A88C', '#E0D2B8', '#A89878',
]

const MOTIFS: ShelfBook['motif'][] = ['arc', 'grid', 'orbit', 'slash', 'dot']

const TITLES = [
  ['Atlas de Conexiones', 'Fundamentos'],
  ['El Oficio', 'Ensayos'],
  ['Redes Vivas', 'Comunidad'],
  ['Capital Paciente', 'Notas'],
  ['Mesa Redonda', 'Diálogos'],
  ['Señal Débil', 'Tendencias'],
  ['Craft & Code', 'Práctica'],
  ['Origen', 'Memoria'],
  ['Latencia Cero', 'Producto'],
  ['La Estantería', 'Curaduría'],
  ['Puente Norte', 'Mercados'],
  ['Bitácora', 'Operaciones'],
  ['Eco', 'Marca'],
  ['Trama', 'Cultura'],
  ['Horizonte', 'Estrategia'],
  ['Semilla', 'Impacto'],
  ['Vértice', 'Diseño'],
  ['Brújula', 'Liderazgo'],
  ['Archivo Abierto', 'Recursos'],
] as const

function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function buildShelfCatalog(): ShelfBook[] {
  const rand = mulberry32(19)
  return TITLES.map(([title, subtitle], i) => {
    const r = rand()
    return {
      id: `book-${String(i + 1).padStart(2, '0')}`,
      title,
      subtitle,
      width: 0.22 + r * 0.18,
      height: 1.35 + rand() * 0.55,
      depth: 0.95 + rand() * 0.35,
      cloth: CLOTHS[i % CLOTHS.length],
      foil: FOILS[i % FOILS.length],
      motif: MOTIFS[i % MOTIFS.length],
    }
  })
}

/** Posición X del centro de cada libro a lo largo del estante */
export function layoutBooksOnShelf(books: ShelfBook[], gap = 0.06) {
  const positions: number[] = []
  let x = 0
  for (const book of books) {
    positions.push(x + book.width / 2)
    x += book.width + gap
  }
  const totalWidth = x - gap
  const offset = -totalWidth / 2
  return {
    positions: positions.map((p) => p + offset),
    totalWidth,
  }
}
