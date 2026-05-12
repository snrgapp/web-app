'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { verificarGeniusPorTelefono } from '@/app/actions/genius-networking'

const STORAGE_ID = 'genius_submission_id'

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
    const result = await verificarGeniusPorTelefono(telefono.trim())
    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_ID, result.submission.id)
      localStorage.setItem(STORAGE_ID, result.submission.id)
    }
    router.push('/networking/genius')
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-start px-3 pb-10 pt-10 sm:px-5">
      <div className="absolute left-0 top-0 w-full p-4">
        <button
          type="button"
          onClick={() => router.push('/home')}
          className="text-white/55 transition-colors hover:text-white"
          aria-label="Volver"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      {/* Misma apariencia que .gf-logo-top en public/genius.html; padding en el contenedor para no pintar caja alrededor del img */}
      <div className="relative z-[1] mx-auto mb-10 flex w-full justify-center px-4">
        <img
          src="/images/genius-fest-logo.png"
          alt="Genius FEST 2026"
          width={600}
          height={200}
          decoding="async"
          className="block h-[clamp(132px,36vmin,220px)] w-auto max-w-[min(400px,92vw)] border-0 bg-transparent object-contain object-[center_top] shadow-none outline-none"
          style={{ mixBlendMode: 'screen' }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm rounded-[22px] border border-white/10 bg-[#1c1c1c] p-7 shadow-[6px_6px_0_#daff00]"
      >
        <p
          className="text-center text-[0.68rem] font-medium uppercase tracking-[0.15em] text-white/65"
          style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          Genius FEST · Acceso
        </p>
        <h1
          className="mt-3 text-center text-2xl font-black tracking-tight text-white"
          style={{ fontFamily: 'var(--font-fraunces-genius), serif' }}
        >
          Verificar acceso
        </h1>
        <p className="mt-3 text-center text-sm font-light leading-relaxed text-white/58">
          Ingresa el mismo número con el que te inscribiste en{' '}
          <span className="font-medium text-white/88">www.genius.snrg.lat</span>
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="gf-verify-tel"
              className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.15em] text-white/55"
              style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
            >
              Teléfono
            </label>
            <input
              id="gf-verify-tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 300 123 4567"
              className="h-12 w-full rounded-xl border border-white/10 bg-[#141414] px-4 text-base font-normal text-white placeholder:text-white/28 focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-white/15"
              autoFocus
            />
          </div>
          {error ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-red-500/35 bg-red-500/10 px-3 py-2 text-sm font-normal text-red-300"
            >
              {error}
            </motion.p>
          ) : null}
          <button
            type="submit"
            disabled={!telefono.trim() || loading}
            className="h-12 w-full rounded-xl border-2 border-[#161616] bg-white text-sm font-medium uppercase tracking-wide text-[#161616] shadow-[6px_6px_0_#daff00] transition hover:bg-white/95 disabled:opacity-40"
          >
            {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#161616]" /> : 'Ingresar'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default function GeniusVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[#161616]">
          <Loader2 className="h-8 w-8 animate-spin text-white/65" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
