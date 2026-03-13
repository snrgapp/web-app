'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'

const ROLE_OPTIONS = [
  'Soy founder / Dueño de negocio',
  'Busco unirme a un negocio o proyecto',
  'Soy inversor',
  'Quiero ser aliado estratégico',
  'Busco un socio o co-fundador',
] as const

type Step = 'intro' | 'form' | 'success'

const formTransition = {
  initial: { opacity: 0, filter: 'blur(8px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(8px)' },
  transition: { duration: 0.4, ease: 'easeOut' },
}

export default function IAPage() {
  const [step, setStep] = useState<Step>('intro')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleSelectRole(role: string) {
    setSelectedRole(role)
    setStep('form')
  }

  function handleBack() {
    if (step === 'form') setStep('intro')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!nombre.trim() || !telefono.trim()) {
      setError('Nombre y teléfono son requeridos')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/ia/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: nombre.trim(),
          telefono: telefono.trim(),
          rol: selectedRole,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al enviar')
        return
      }
      setStep('success')
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const showVolver = step !== 'intro' && step !== 'success'

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-12 md:py-16 relative">
        {showVolver && (
          <motion.button
            type="button"
            onClick={handleBack}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-6 top-8 flex items-center gap-2 text-sm text-black/70 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </motion.button>
        )}

        <div className={showVolver ? 'pt-10' : ''}>
        <AnimatePresence mode="wait">
          {step === 'intro' ? (
            <motion.div
              key="intro"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(12px)' }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="space-y-8"
            >
              <div className="flex items-start gap-2 md:gap-3">
                <div className="flex-shrink-0 flex items-center gap-1">
                  <span className="text-base md:text-xl font-bold tracking-tight text-black">AI</span>
                  <span className="text-black/80">✦</span>
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-black">
                    Hola que bueno tenerte aqui.
                  </h1>
                  <p className="mt-2 text-sm md:text-base text-black/90 leading-tight max-w-prose">
                    Te conecto con clientes, aliados, inversores y socios estratégicos en Latinoamérica. Cuéntame, ¿cómo te describes?
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 md:gap-3 w-fit ml-8 sm:ml-10 md:ml-14">
                {ROLE_OPTIONS.map((role, i) => (
                  <motion.button
                    key={role}
                    type="button"
                    onClick={() => handleSelectRole(role)}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      'w-full text-left py-3 md:py-4 px-4 md:px-5 rounded-2xl text-sm md:text-base font-medium text-white',
                      'bg-black hover:bg-black/90 transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
                    )}
                  >
                    {role}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : step === 'form' ? (
            <motion.div
              key="form"
              {...formTransition}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-black">
                  ¡Conozcámonos!
                </h2>
                <p className="mt-2 text-sm md:text-base text-black/80 leading-tight">
                  Para validar, solo necesitamos tu nombre y teléfono. Te llamaremos en un minuto.
                </p>
                {selectedRole && (
                  <p className="mt-2 text-xs md:text-sm text-black/60">
                    Rol seleccionado: {selectedRole}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium text-black">Nombre completo</label>
                  <Input
                    placeholder="Juan Pérez"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="rounded-xl bg-zinc-100/80 border-zinc-200 text-sm md:text-base h-9 md:h-10"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium text-black">Número de teléfono</label>
                  <Input
                    type="tel"
                    placeholder="300 123 4567 o +57 300 123 4567"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    className="rounded-xl bg-zinc-100/80 border-zinc-200 text-sm md:text-base h-9 md:h-10"
                    disabled={loading}
                  />
                </div>
                {error && <p className="text-sm text-red-600">{error}</p>}
                <div className="pt-2">
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.01 }}
                    whileTap={{ scale: loading ? 1 : 0.99 }}
                    className={cn(
                      'w-full py-4 px-6 rounded-2xl font-medium text-white',
                      'bg-black hover:bg-black/90 transition-colors disabled:opacity-70',
                      'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
                    )}
                  >
                    {loading ? 'Enviando...' : 'Enviar'}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              {...formTransition}
              className="space-y-6 text-center"
            >
              <div className="py-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black">
                  ¡Listo!
                </h2>
                <p className="mt-4 text-base md:text-lg text-black/90">
                  Te vamos a llamar en un minuto.
                </p>
                <p className="mt-2 text-sm text-black/70">
                  Mantén tu teléfono cerca.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </div>
    </main>
  )
}
