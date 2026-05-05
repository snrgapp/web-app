'use client'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { verificarPerrenquePorTelefono } from '@/app/actions/perrenque-networking'

const PERRENQUE_FORM_URL = 'https://perrenque.snrg.lat'

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

    const result = await verificarPerrenquePorTelefono(telefono.trim())

    if (!result.ok) {
      setError(
        `${result.error} Si todavía no te has registrado, completa primero el formulario en "Registrarse".`
      )
      setLoading(false)
      return
    }

    const submission = result.submission
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('perrenque_submission_id', submission.id)
      sessionStorage.setItem('perrenque_telefono', submission.telefono ?? '')
      sessionStorage.setItem('perrenque_nombre', submission.nombre_completo)
      sessionStorage.setItem('perrenque_ronda_actual', '1')
      localStorage.setItem('perrenque_submission_id', submission.id)
      localStorage.setItem('perrenque_telefono', submission.telefono ?? '')
      localStorage.setItem('perrenque_nombre', submission.nombre_completo)
      localStorage.setItem('perrenque_ronda_actual', '1')
    }

    router.push('/networking/perrenque/grupo?ronda=1')
  }

  return (
    <div className="min-h-screen bg-[#1a9fd4] flex flex-col items-center justify-center px-5 py-10">
      <div className="w-full max-w-sm absolute top-0 left-0 p-4">
        <button
          onClick={() => router.push('/networking/perrenque')}
          className="text-white drop-shadow-sm"
          aria-label="Volver"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="mx-auto w-[min(88vw,200px)] aspect-square rounded-full border-[2.5px] border-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a] overflow-hidden bg-black">
          <Image
            src="/images/perrenque-creativo-logo.png"
            alt="Perrenque Creativo"
            width={200}
            height={200}
            className="object-cover w-full h-full"
            priority
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-sm space-y-6 rounded-2xl border-[2.5px] border-[#1a1a1a] bg-[#FFD600] p-6 shadow-[5px_5px_0_#1a1a1a]"
      >
        <div className="text-center space-y-2">
          <h1 className="text-lg sm:text-xl font-black text-[#1a1a1a] uppercase tracking-[0.22em] sm:tracking-[0.28em] leading-snug">
            Tiempo de Networking
          </h1>
          <p className="text-sm font-extrabold text-[#1a1a1a]/80">
            Ingresa el mismo número que usaste en el formulario web para ver tu grupo y las
            preguntas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="telefono-pq"
              className="block text-xs font-extrabold text-[#1a1a1a] uppercase tracking-wide mb-1.5"
            >
              Número de teléfono
            </label>
            <input
              id="telefono-pq"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 300 123 4567"
              className="w-full h-12 px-4 rounded-xl border-[2.5px] border-[#1a1a1a] bg-white text-[#1a1a1a] placeholder:text-zinc-400 text-base font-bold focus:outline-none focus:ring-2 focus:ring-[#1a9fd4] transition-all"
              autoFocus
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-[#1a1a1a] font-bold bg-white/90 border border-[#1a1a1a] px-3 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            disabled={!telefono.trim() || loading}
            className="w-full h-12 text-base font-black rounded-xl bg-[#1a9fd4] text-white border-[2.5px] border-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none disabled:opacity-40"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Ingresar'}
          </Button>

          <a
            href={PERRENQUE_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-12 inline-flex items-center justify-center text-base font-black rounded-xl bg-white text-[#1a1a1a] border-[2.5px] border-[#1a1a1a] shadow-[3px_3px_0_#1a1a1a] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
          >
            Registrarse
          </a>
        </form>
      </motion.div>
    </div>
  )
}

export default function PerrenqueVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#1a9fd4] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
