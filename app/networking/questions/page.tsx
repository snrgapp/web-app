import { redirect } from 'next/navigation'

type Props = { searchParams: Promise<{ ronda?: string }> }

/** La experiencia de preguntas vive en /networking/countdown */
export default async function NetworkingQuestionsPage({ searchParams }: Props) {
  const params = await searchParams
  const ronda = params.ronda === '2' ? '2' : '1'
  redirect(`/networking/countdown?ronda=${ronda}`)
}
