'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { verificarHackathonPorTelefono } from '@/app/actions/hackathon-networking'

const STORAGE_ID = 'hackathon_submission_id'

function VerifyContent() {
  const router = useRouter()
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!telefono.trim()) return
    setLoading(true)
    setError('')
    const result = await verificarHackathonPorTelefono(telefono.trim())
    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_ID, result.submission.id)
      localStorage.setItem(STORAGE_ID, result.submission.id)
    }
    router.push('/networking/hackathon')
  }

  return (
    <div className="hackathon-app-root role-purple relative min-h-dvh bg-[#08080C] text-white">
      <div className="ha-noise" />
      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5 py-10">
        <div className="absolute left-0 top-0 w-full p-4">
          <button
            type="button"
            onClick={() => router.push('/home')}
            className="text-white/60 transition-colors hover:text-white"
            aria-label="Volver"
          >
            <ArrowLeft size={24} />
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 mb-5 w-full max-w-sm rounded-[18px] border border-white/[0.08] bg-gradient-to-br from-[#18181f] to-[#0e0e14] p-6 shadow-[0_40px_80px_rgba(0,0,0,0.85)]"
          style={{ boxShadow: '0 0 40px rgba(123,53,255,0.12), 0 40px 80px rgba(0,0,0,0.85)' }}
        >
          <p className="text-center text-[10px] font-extrabold tracking-[0.2em] text-[#A87CFF] uppercase">
            Hackathon Barranquilla
          </p>
          <h1 className="mt-2 text-center text-xl font-black tracking-tight text-white">
            Verificar acceso
          </h1>
          <p className="mt-2 text-center text-xs leading-relaxed text-white/45">
            Ingresa el mismo número con el que te inscribiste en hackaton.snrg.lat
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="htel" className="mb-1.5 block text-[10px] font-bold tracking-widest text-white/35 uppercase">
                Teléfono
              </label>
              <input
                id="htel"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                placeholder="Ej: 300 123 4567"
                className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-base font-semibold text-white placeholder:text-white/25 focus:border-[rgba(123,53,255,0.45)] focus:outline-none focus:ring-2 focus:ring-[rgba(123,53,255,0.25)]"
                autoFocus
              />
            </div>
            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-300"
              >
                {error}
              </motion.p>
            )}
            <button
              type="submit"
              disabled={!telefono.trim() || loading}
              className="h-12 w-full rounded-xl bg-[#7B35FF] text-sm font-extrabold uppercase tracking-widest text-white shadow-[0_8px_28px_rgba(123,53,255,0.35)] transition hover:brightness-110 disabled:opacity-40"
            >
              {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'Ingresar'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}

export default function HackathonVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[#08080C]">
          <Loader2 className="h-8 w-8 animate-spin text-[#A87CFF]" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
