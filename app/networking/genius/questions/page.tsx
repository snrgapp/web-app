import { GENIUS_PRACTICE_QUESTIONS } from '@/lib/genius-practice-questions'
import GeniusCardDeckContainer from '@/components/networking/genius/GeniusCardDeckContainer'

type Props = { searchParams: Promise<{ ronda?: string }> }

export default async function GeniusNetworkingQuestionsPage({ searchParams }: Props) {
  const params = await searchParams
  const ronda = params.ronda === '2' ? 2 : 1

  return <GeniusCardDeckContainer questions={GENIUS_PRACTICE_QUESTIONS} ronda={ronda} />
}
