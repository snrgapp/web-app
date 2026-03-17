'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import HeroOnboarding from '@/components/ia/HeroOnboarding'

const ROLE_OPTIONS = [
  'Soy founder / Dueño de negocio',
  'Busco unirme a un negocio o proyecto',
  'Soy inversor',
  'Quiero ser aliado estratégico',
  'Busco un socio o co-fundador',
] as const

type Step = 'intro' | 'formA' | 'formB' | 'success'

const formTransition = {
  initial: { opacity: 0, filter: 'blur(8px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(8px)' },
  transition: { duration: 0.4, ease: 'easeOut' },
}

export default function IAPage() {
  const [step, setStep] = useState<Step>('intro')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [nombre, setNombre] = useState('')
  const [nombreEmpresa, setNombreEmpresa] = useState('')
  const [urlSitio, setUrlSitio] = useState('')
  const [queVende, setQueVende] = useState('')
  const [telefono, setTelefono] = useState('')
  const [emailEmpresa, setEmailEmpresa] = useState('')
  const [linkedin, setLinkedin] = useState('')
  const [comoVende, setComoVende] = useState('')
  const [desafios, setDesafios] = useState('')
  const [clienteObjetivo, setClienteObjetivo] = useState('')
  const [tamanoEquipo, setTamanoEquipo] = useState('')
  const [presupuestoVentas, setPresupuestoVentas] = useState('')
  const [comoEnteraste, setComoEnteraste] = useState('')
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  function handleSelectRole(role: string) {
    setSelectedRole(role)
    setStep('formA')
  }

  function handleBack() {
    if (step === 'formA') setStep('intro')
    else if (step === 'formB') setStep('formA')
  }

  function handleNext() {
    setStep('formB')
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
          nombre_empresa: nombreEmpresa.trim() || null,
          url_sitio_web: urlSitio.trim() || null,
          que_vende: queVende.trim() || null,
          email_empresa: emailEmpresa.trim() || null,
          linkedin: linkedin.trim() || null,
          como_vende: comoVende.trim() || null,
          desafios_puntos_dolor: desafios.trim() || null,
          cliente_objetivo: clienteObjetivo.trim() || null,
          tamano_equipo: tamanoEquipo.trim() || null,
          presupuesto_ventas: presupuestoVentas.trim() || null,
          como_enteraste_synergy: comoEnteraste.trim() || null,
          acepta_terminos: aceptaTerminos,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al enviar')
        return
      }
      setStep('success')
      setLoading(false)

      if (data.submissionId) {
        setTimeout(() => {
          fetch('/api/ia/trigger-call', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ submissionId: data.submissionId }),
          }).catch(() => {})
        }, 25 * 1000)
      }
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const showVolver = step !== 'intro' && step !== 'success'

  return (
    <main className="min-h-screen bg-white">
      {step === 'intro' ? (
        <motion.div
          key="intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(12px)' }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="min-h-screen"
        >
          <HeroOnboarding onSelect={handleSelectRole} />
        </motion.div>
      ) : (
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
          {step === 'formA' ? (
            <motion.div
              key="formA"
              {...formTransition}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-black">
                  ¡Conozcámonos!
                </h2>
                <p className="mt-2 text-sm md:text-base text-black/80 leading-tight">
                  Completa el formulario y te contactaré para hablar de los próximos pasos.
                </p>
                {selectedRole && (
                  <p className="mt-2 text-xs md:text-sm text-black/60">
                    Rol seleccionado: {selectedRole}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-black">Nombre completo *</label>
                    <Input
                      placeholder="Juan Pérez"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="rounded-xl bg-zinc-100/80 border-zinc-200 text-sm md:text-base h-9 md:h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-black">Nombre de la empresa</label>
                    <Input
                      placeholder="Ejemplo Empresa"
                      value={nombreEmpresa}
                      onChange={(e) => setNombreEmpresa(e.target.value)}
                      className="rounded-xl bg-zinc-100/80 border-zinc-200 text-sm md:text-base h-9 md:h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-black">URL del sitio web</label>
                    <Input
                      type="url"
                      placeholder="https://misitio.com"
                      value={urlSitio}
                      onChange={(e) => setUrlSitio(e.target.value)}
                      className="rounded-xl bg-zinc-100/80 border-zinc-200 text-sm md:text-base h-9 md:h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-black">¿Qué vendes?</label>
                    <Input
                      placeholder="Producto, servicio, etc."
                      value={queVende}
                      onChange={(e) => setQueVende(e.target.value)}
                      className="rounded-xl bg-zinc-100/80 border-zinc-200 text-sm md:text-base h-9 md:h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-black">Número de teléfono *</label>
                    <Input
                      type="tel"
                      placeholder="300 123 4567 o +57 300 123 4567"
                      value={telefono}
                      onChange={(e) => setTelefono(e.target.value)}
                      className="rounded-xl bg-zinc-100/80 border-zinc-200 text-sm md:text-base h-9 md:h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-black">Email de la empresa</label>
                    <Input
                      type="email"
                      placeholder="juan@empresa.com"
                      value={emailEmpresa}
                      onChange={(e) => setEmailEmpresa(e.target.value)}
                      className="rounded-xl bg-zinc-100/80 border-zinc-200 text-sm md:text-base h-9 md:h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-black">LinkedIn</label>
                    <Input
                      placeholder="https://linkedin.com/in/..."
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      className="rounded-xl bg-zinc-100/80 border-zinc-200 text-sm md:text-base h-9 md:h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-black">¿Cómo vendes actualmente?</label>
                    <Input
                      placeholder="Outbound, Partnerships, etc."
                      value={comoVende}
                      onChange={(e) => setComoVende(e.target.value)}
                      className="rounded-xl bg-zinc-100/80 border-zinc-200 text-sm md:text-base h-9 md:h-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-black">Desafíos o puntos de dolor</label>
                    <Input
                      placeholder="Desafíos que enfrentas"
                      value={desafios}
                      onChange={(e) => setDesafios(e.target.value)}
                      className="rounded-xl bg-zinc-100/80 border-zinc-200 text-sm md:text-base h-9 md:h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-black">Cliente objetivo</label>
                    <Input
                      placeholder="Edad, ubicación, intereses..."
                      value={clienteObjetivo}
                      onChange={(e) => setClienteObjetivo(e.target.value)}
                      className="rounded-xl bg-zinc-100/80 border-zinc-200 text-sm md:text-base h-9 md:h-10"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <motion.button
                    type="button"
                    onClick={handleNext}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={cn(
                      'w-full py-4 px-6 rounded-2xl font-medium text-white',
                      'bg-black hover:bg-black/90 transition-colors',
                      'focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2'
                    )}
                  >
                    Siguiente
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ) : step === 'formB' ? (
            <motion.div
              key="formB"
              {...formTransition}
              className="space-y-6"
            >
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-black">
                  Últimos detalles para conectar contigo.
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-black">Tamaño actual del equipo</label>
                    <Input
                      placeholder="Ventas o equipo total"
                      value={tamanoEquipo}
                      onChange={(e) => setTamanoEquipo(e.target.value)}
                      className="rounded-xl bg-zinc-100/80 border-zinc-200 text-sm md:text-base h-9 md:h-10"
                      disabled={loading}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs md:text-sm font-medium text-black">Presupuesto de ventas</label>
                    <Input
                      placeholder="Ej: $25K mensuales"
                      value={presupuestoVentas}
                      onChange={(e) => setPresupuestoVentas(e.target.value)}
                      className="rounded-xl bg-zinc-100/80 border-zinc-200 text-sm md:text-base h-9 md:h-10"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs md:text-sm font-medium text-black">
                    ¿Cómo te enteraste de Synergy?
                    <span className="font-normal text-black/70"> (si te refirió alguien, incluye su nombre)</span>
                  </label>
                  <textarea
                    placeholder="Cuéntanos..."
                    rows={4}
                    value={comoEnteraste}
                    onChange={(e) => setComoEnteraste(e.target.value)}
                    className="flex w-full rounded-xl border border-zinc-200 bg-zinc-100/80 px-3 py-2 text-sm md:text-base placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 resize-none"
                    disabled={loading}
                  />
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={aceptaTerminos}
                    onChange={(e) => setAceptaTerminos(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-zinc-300 text-black focus:ring-black"
                    disabled={loading}
                  />
                  <label htmlFor="terms" className="text-xs md:text-sm text-black/80">
                    Acepto los{' '}
                    <a href="/terminos" className="text-black font-medium underline hover:no-underline">
                      Términos y Condiciones
                    </a>{' '}
                    de Synergy
                  </label>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="pt-4">
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
                  Te llamamos en un momento, mantén tu teléfono cerca.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
          </div>
        </div>
      )}
    </main>
  )
}
