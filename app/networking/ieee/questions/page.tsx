import { IEEE_PRACTICE_QUESTIONS } from '@/lib/ieee-practice-questions'
import IeeeCardDeckContainer from '@/components/networking/ieee/IeeeCardDeckContainer'

type Props = { searchParams: Promise<{ ronda?: string }> }

export default async function IeeeNetworkingQuestionsPage({ searchParams }: Props) {
  const params = await searchParams
  const ronda = params.ronda === '2' ? 2 : 1

  return <IeeeCardDeckContainer questions={IEEE_PRACTICE_QUESTIONS} ronda={ronda} />
}
