'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Loader2, ArrowLeft } from 'lucide-react'
import { verificarAsistente } from '@/app/actions/networking'
import '@/components/networking/snrg-metal-theme.css'
import './verify.css'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventSlug = searchParams.get('event')

  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (eventSlug) {
      router.replace(`/checkin?event=${eventSlug}`)
    }
  }, [eventSlug, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!telefono.trim()) return

    setLoading(true)
    setError('')

    const result = await verificarAsistente(telefono.trim(), null)

    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }

    const nombreCompleto = [result.asistente.nombre, result.asistente.apellido]
      .filter(Boolean)
      .join(' ')

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('asistente_id', result.asistente.id)
      sessionStorage.setItem('asistente_telefono', result.asistente.telefono ?? '')
      sessionStorage.setItem('asistente_nombre', nombreCompleto)
      if (result.asistente.evento_id) {
        sessionStorage.setItem('evento_id', result.asistente.evento_id)
      }
      sessionStorage.setItem('networking_ronda_actual', '1')
    }

    router.push('/networking/mesa?ronda=1')
  }

  if (eventSlug) {
    return (
      <div className="verify-page verify-page--loading">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="verify-page">
      <div className="verify-page__back">
        <button
          type="button"
          onClick={() => router.push('/networking')}
          className="verify-page__back-btn"
          aria-label="Volver"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="verify-page__logo"
      >
        <Image
          src="/logowhite.png"
          alt="Synergy"
          width={48}
          height={48}
          className="object-contain"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="verify-page__content"
      >
        <div className="verify-page__copy">
          <h1 className="verify-page__title">Tiempo de Networking</h1>
          <p className="verify-page__desc">Conoce a tus próximas conexiones</p>
        </div>

        <form onSubmit={handleSubmit} className="verify-page__form">
          <div>
            <label htmlFor="telefono" className="verify-page__label">
              Número de teléfono
            </label>
            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 3001234567"
              className="verify-page__input"
              autoFocus
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="verify-page__error"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={!telefono.trim() || loading}
            className="verify-page__submit"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Ingresar'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

export default function NetworkingVerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="verify-page verify-page--loading">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
