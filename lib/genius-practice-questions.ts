import type { QuestionWithCategory } from '@/types/database.types'

/** Preguntas de prueba Genius FEST; sustituir o ampliar desde BD cuando haga falta. */
const cat = {
  id: '00000000-0000-4000-8000-00000000c0de',
  name: 'Genius · Conexión',
  slug: 'genius-practice' as string | null,
  color_hex: '#694aff',
  icon_slug: 'sparkles',
  organizacion_id: null,
  created_at: new Date().toISOString(),
}

const base = {
  category_id: cat.id,
  difficulty_level: 'easy' as const,
  created_at: new Date().toISOString(),
}

export const GENIUS_PRACTICE_QUESTIONS: QuestionWithCategory[] = [
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000001',
    content: '¿Qué te trajo al Genius FEST hoy y qué esperas llevarte a casa?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000002',
    content: '¿Qué proyecto, idea o reto te quitó el sueño recientemente?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000003',
    content: 'Si pudieras conectar con una sola persona en esta sala, ¿qué buscarías?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000004',
    content: '¿Qué habilidad o fortaleza tuya te gustaría que más gente conociera?',
    category: cat,
  },
  {
    ...base,
    id: '10000000-0000-4000-8000-000000000005',
    content: 'Describe tu “marca personal” en una sola frase.',
    category: cat,
  },
]
