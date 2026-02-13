'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { verificarVotante } from '@/app/actions/spotlight'

export default function PitchPage() {
  const router = useRouter()
  const [whatsapp, setWhatsapp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!whatsapp.trim()) return

    setLoading(true)
    setError('')

    const result = await verificarVotante(whatsapp.trim())

    if (!result.ok) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Guardar votante en localStorage
    localStorage.setItem('votante_id', result.votante.id)
    localStorage.setItem('votante_nombre', result.votante.nombre ?? '')
    localStorage.setItem('votante_categoria', result.votante.categoria)

    router.push('/pitch/votar')
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 py-10 font-sans">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <Image
          src="/logo.png"
          alt="Synergy"
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
            Spotlight
          </h1>
          <p className="text-sm text-zinc-500">
            Ingresa tu número de WhatsApp para votar por los pitches
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="whatsapp" className="block text-xs font-medium text-zinc-600 mb-1.5">
              Número de WhatsApp
            </label>
            <input
              id="whatsapp"
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
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
            disabled={!whatsapp.trim() || loading}
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
