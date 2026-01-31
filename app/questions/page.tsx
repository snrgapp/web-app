import { getRandomQuestions } from '../actions/questions'
import CardDeckContainer from '@/components/CardDeckContainer'

type Props = { searchParams: Promise<{ category?: string }> }

export default async function QuestionsPage({ searchParams }: Props) {
  const { category } = await searchParams
  const questions = await getRandomQuestions(10, category ?? null)
  
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
  
  return <CardDeckContainer questions={questions} />
}
