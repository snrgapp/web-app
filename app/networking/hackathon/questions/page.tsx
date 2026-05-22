import { HACKATHON_PRACTICE_QUESTIONS } from '@/lib/hackathon-practice-questions'
import HackathonCardDeckContainer from '@/components/networking/hackathon/HackathonCardDeckContainer'

type Props = { searchParams: Promise<{ ronda?: string }> }

export default async function HackathonNetworkingQuestionsPage({ searchParams }: Props) {
  const params = await searchParams
  const ronda = params.ronda === '2' ? 2 : 1

  return <HackathonCardDeckContainer questions={HACKATHON_PRACTICE_QUESTIONS} ronda={ronda} />
}
