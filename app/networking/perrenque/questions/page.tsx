import { getPerrenqueQuestions } from '@/app/actions/perrenque-networking'
import PerrenqueCardDeckContainer from '@/components/PerrenqueCardDeckContainer'
import type { Category, QuestionWithCategory } from '@/types/database.types'

const PERRENQUE_CATEGORY: Category = {
  id: '00000000-0000-0000-0000-0000000000a1',
  name: 'Perrenque Creativo',
  slug: 'perrenque',
  color_hex: '#FFD600',
  icon_slug: 'sparkles',
  organizacion_id: null,
  created_at: new Date().toISOString(),
}

type Props = { searchParams: Promise<{ ronda?: string }> }

export default async function PerrenqueQuestionsPage({ searchParams }: Props) {
  const params = await searchParams
  const ronda = params.ronda === '2' ? 2 : 1
  const rows = await getPerrenqueQuestions(ronda)
  const questions: QuestionWithCategory[] = rows.map((q) => ({
    id: q.id,
    content: q.contenido,
    category_id: PERRENQUE_CATEGORY.id,
    difficulty_level: 'easy',
    created_at: q.created_at,
    category: PERRENQUE_CATEGORY,
  }))

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#1a9fd4] flex flex-col items-center justify-center p-6">
        <div className="text-center text-white font-bold max-w-md">
          <p className="mb-4">No hay preguntas activas para esta ronda en la base de datos.</p>
          <p className="text-sm opacity-90">Revisa la tabla perrenque_preguntas en Supabase.</p>
        </div>
      </div>
    )
  }

  return <PerrenqueCardDeckContainer questions={questions} ronda={ronda} />
}
