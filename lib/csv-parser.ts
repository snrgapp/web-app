import Papa from 'papaparse'
import type { Database } from '@/types/database.types'

type AsistenteInsert = Database['public']['Tables']['asistentes']['Insert']

// Mapeo flexible de columnas CSV a campos de la base de datos
const COLUMN_MAP: Record<string, keyof Omit<AsistenteInsert, 'id' | 'created_at'>> = {
  nombre: 'nombre',
  apellido: 'apellido',
  telefono: 'telefono',
  teléfono: 'telefono',
  correo: 'correo',
  email: 'correo',
  empresa: 'empresa',
  sector: 'sector',
  soluciones: 'soluciones',
  desafios: 'desafios',
  desafíos: 'desafios',
  mesa: 'mesa',
  codigo_mesa: 'codigo_mesa',
  'codigo de mesa': 'codigo_mesa',
  'código de mesa': 'codigo_mesa',
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase()
}

export function parseCsvToAsistentes(csvText: string): AsistenteInsert[] {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => normalizeHeader(h),
  })

  if (result.errors.length > 0) {
    throw new Error(result.errors.map((e) => e.message).join('; '))
  }

  return result.data
    .filter((row) => Object.values(row).some((v) => v?.trim()))
    .map((row) => {
      const asistente: AsistenteInsert = {}
      for (const [col, value] of Object.entries(row)) {
        const field = COLUMN_MAP[normalizeHeader(col)]
        if (field && value?.trim()) {
          asistente[field] = value.trim()
        }
      }
      return asistente
    })
}
