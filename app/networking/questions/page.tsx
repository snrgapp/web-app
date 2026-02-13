import { getRandomQuestions } from '../../actions/questions'
import CardDeckContainer from '@/components/CardDeckContainer'

type Props = { searchParams: Promise<{ category?: string }> }

export default async function NetworkingQuestionsPage({ searchParams }: Props) {
  const params = await searchParams
  const category = typeof params.category === 'string' ? params.category : params.category?.[0] ?? null
  const questions = await getRandomQuestions(10, category)
  
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <p className="text-black mb-4">No hay preguntas disponibles en la base de datos.</p>
          <p className="text-gray-500 text-sm">
            Por favor, ejecuta la migración SQL en Supabase para crear las tablas y agregar datos de ejemplo.
          </p>
        </div>
      </div>
    )
  }
  
  const categorySlug = category ?? questions[0]?.category?.slug ?? undefined
  return <CardDeckContainer questions={questions} categorySlug={categorySlug} />
}
