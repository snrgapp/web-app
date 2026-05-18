import type { QuestionWithCategory } from '@/types/database.types'

/** Preguntas icebreaker IEEE / tecnología; mismas tarjetas que Genius, otro copy. */
const cat = {
  id: '00000000-0000-4000-8000-00000000ee01',
  name: 'IEEE · Conexión',
  slug: 'ieee-practice' as string | null,
  color_hex: '#00629B',
  icon_slug: 'cpu',
  organizacion_id: null,
  created_at: new Date().toISOString(),
}

const base = {
  category_id: cat.id,
  difficulty_level: 'easy' as const,
  created_at: new Date().toISOString(),
}

export const IEEE_PRACTICE_QUESTIONS: QuestionWithCategory[] = [
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000001',
    content: '¿Qué problema técnico o de ingeniería te motiva más en este momento?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000002',
    content: 'Cuéntale algo que hayas construido o aprendido recientemente (proyecto, curso o experimento).',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000003',
    content: 'Si pudieras colaborar con alguien de otra disciplina hoy, ¿qué combinarías?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000004',
    content: '¿Qué recurso, herramienta o comunidad te ha ayudado a crecer como profesional o estudiante?',
    category: cat,
  },
  {
    ...base,
    id: '20000000-0000-4000-8000-000000000005',
    content: '¿Qué te gustaría que tu pareja recordara de esta conversación al final de los 3 minutos?',
    category: cat,
  },
]
