'use client'

import { Suspense, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { verificarIeeePorTelefono } from '@/app/actions/ieee-networking'

const STORAGE_ID = 'ieee_submission_id'

const REGISTRO_IEEE_URL = 'https://ieee.snrg.lat'

function VerifyContent() {
  const router = useRouter()
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const telefonoValido = telefono.replace(/\D/g, '').length >= 7

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!telefonoValido) return
    setLoading(true)
    setError('')
    const result = await verificarIeeePorTelefono(telefono.trim())
    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(STORAGE_ID, result.submission.id)
      localStorage.setItem(STORAGE_ID, result.submission.id)
    }
    router.push('/networking/ieee')
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

      <div className="relative z-[1] mx-auto mb-8 flex w-full justify-center bg-transparent px-4">
        <img
          src="/images/ieee.png"
          alt="IEEE"
          width={800}
          height={800}
          decoding="async"
          className="block h-[clamp(108px,34vmin,178px)] w-auto max-w-[min(400px,92vw)] border-0 bg-transparent object-contain object-center shadow-none outline-none"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm rounded-[22px] border border-white/10 bg-[#252525] p-7 shadow-[6px_6px_0_#00629B]"
      >
        <p
          className="text-center text-[0.68rem] font-medium uppercase tracking-[0.15em] text-white/65"
          style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          IEEE · Acceso
        </p>
        <h1
          className="mt-3 text-center text-2xl font-black tracking-tight text-white"
          style={{ fontFamily: 'var(--font-fraunces-ieee), serif' }}
        >
          Verificar acceso
        </h1>
        <p className="mt-3 text-center text-sm font-light leading-relaxed text-white/72">
          Ingresa el mismo número de WhatsApp o teléfono con el que completaste el registro.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label
              htmlFor="ieee-verify-tel"
              className="mb-2 block text-[0.68rem] font-medium uppercase tracking-[0.15em] text-white/55"
              style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
            >
              WhatsApp / teléfono
            </label>
            <input
              id="ieee-verify-tel"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 300 123 4567"
              className="h-12 w-full rounded-xl border border-white/10 bg-[#1a1a1a] px-4 text-base font-normal text-white placeholder:text-white/28 focus:border-white/35 focus:outline-none focus:ring-2 focus:ring-white/15"
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
            disabled={!telefonoValido || loading}
            className="h-12 w-full rounded-xl border-2 border-[#161616] bg-white text-sm font-medium uppercase tracking-wide text-[#161616] shadow-[6px_6px_0_#00629B] transition hover:bg-white/95 disabled:opacity-40"
          >
            {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin text-[#161616]" /> : 'Ingresar'}
          </button>
        </form>

        <a
          href={REGISTRO_IEEE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex h-12 w-full items-center justify-center rounded-xl border border-white/18 bg-[#1a1a1a] text-sm font-medium uppercase tracking-wide text-white shadow-[4px_4px_0_#00629B] transition hover:border-white/28 hover:bg-[#1f1f1f]"
        >
          Inscribirse
        </a>
      </motion.div>

      <footer className="relative z-[1] mx-auto mt-12 flex w-full max-w-sm flex-col items-center gap-2.5 px-4 pb-8 opacity-[0.9]">
        <p
          className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/42"
          style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
        >
          Powered by
        </p>
        <img
          src="/images/logowhite.png"
          alt="Synergy"
          width={160}
          height={48}
          decoding="async"
          loading="lazy"
          className="h-[26px] w-auto object-contain"
        />
      </footer>
    </div>
  )
}

export default function IeeeVerifyPage() {
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
