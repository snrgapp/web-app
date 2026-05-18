'use client'

import { useState, Suspense } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { verifyExperienceSubmissionByPhoneAction } from '@/app/actions/experience-paas-flow'

function VerifyInner() {
  const router = useRouter()
  const params = useParams()
  const publicSlug = String(params.publicSlug ?? '')

  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!telefono.trim() || !publicSlug) return
    setLoading(true)
    setError('')
    const r = await verifyExperienceSubmissionByPhoneAction(publicSlug, telefono.trim())
    setLoading(false)
    if (!r.ok) {
      setError(r.error)
      return
    }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`paas_submission_${publicSlug}`, r.submissionId)
    }
    router.push(`/exp/${publicSlug}/salon`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 font-sans">
      <div className="w-full max-w-sm absolute top-0 left-0 p-4">
        <button
          type="button"
          onClick={() => router.push(`/exp/${publicSlug}`)}
          className="text-[var(--net-fg)]"
          aria-label="Volver"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-6 text-center"
      >
        <h1 className="text-2xl font-semibold text-[var(--net-fg)]">Verificación</h1>
        <p className="text-sm text-[var(--net-muted)]">
          Introduce el mismo teléfono que usaste al inscribirte para entrar al salón del evento.
        </p>
        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4 text-left">
          <Input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="Teléfono"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="rounded-xl"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full rounded-xl">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Continuar'}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}

export default function ExpVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[var(--net-muted)]" />
        </div>
      }
    >
      <VerifyInner />
    </Suspense>
  )
}
