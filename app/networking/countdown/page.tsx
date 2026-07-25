'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FlipCountdown } from '@/components/networking/FlipCountdown'

export default function NetworkingCountdownPage() {
  const router = useRouter()
  const [ronda, setRonda] = useState<string>('1')

  useEffect(() => {
    const stored =
      sessionStorage.getItem('networking_ronda_actual') ??
      localStorage.getItem('networking_ronda_actual') ??
      '1'
    setRonda(stored)
  }, [])

  function handleComplete() {
    router.push(`/networking/questions?ronda=${ronda}`)
  }

  return <FlipCountdown startFrom={3} onComplete={handleComplete} />
}
