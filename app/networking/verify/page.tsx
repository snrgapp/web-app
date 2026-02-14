'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { verificarAsistente } from '@/app/actions/networking'

export default function NetworkingVerifyPage() {
  const router = useRouter()
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!telefono.trim()) return

    setLoading(true)
    setError('')

    const result = await verificarAsistente(telefono.trim())

    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }

    const nombreCompleto = [result.asistente.nombre, result.asistente.apellido]
      .filter(Boolean)
      .join(' ')

    localStorage.setItem('asistente_id', result.asistente.id)
    localStorage.setItem('asistente_telefono', result.asistente.telefono ?? '')
    localStorage.setItem('asistente_nombre', nombreCompleto)
    localStorage.setItem('networking_ronda_actual', '1')

    router.push('/networking/mesa?ronda=1')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 py-10 font-sans">
      <div className="w-full max-w-sm absolute top-0 left-0 p-4">
        <button
          onClick={() => router.push('/networking')}
          className="text-black"
          aria-label="Volver"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Image
          src="/logo.png"
          alt="Logo"
          width={44}
          height={44}
          className="object-contain"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-sm space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-black tracking-tight">
            networking
          </h1>
          <p className="text-sm text-zinc-500">
            Ingresa tu número de teléfono para acceder a tu mesa
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="telefono"
              className="block text-xs font-medium text-zinc-600 mb-1.5"
            >
              Número de teléfono
            </label>
            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ej: 3001234567"
              className="w-full h-12 px-4 rounded-xl border border-zinc-200 bg-white text-black placeholder:text-zinc-400 text-base focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
              autoFocus
            />
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg"
            >
              {error}
            </motion.p>
          )}

          <Button
            type="submit"
            disabled={!telefono.trim() || loading}
            className="w-full h-12 text-base font-semibold rounded-xl bg-black text-white hover:bg-zinc-800 disabled:opacity-40"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              'Ingresar'
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
