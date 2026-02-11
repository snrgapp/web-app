'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase/client'
import { cn } from '@/lib/utils'

export default function ContactSection() {
  const [nombre, setNombre] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [correo, setCorreo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    if (!supabase) {
      setError('No se pudo conectar. Intenta más tarde.')
      setLoading(false)
      return
    }
    if (!mensaje.trim()) {
      setError('El mensaje es obligatorio.')
      setLoading(false)
      return
    }
    const { error: insertError } = await supabase.from('contactos').insert({
      nombre: nombre.trim() || null,
      whatsapp: whatsapp.trim() || null,
      correo: correo.trim() || null,
      mensaje: mensaje.trim(),
    })
    if (insertError) {
      setError('No se pudo enviar. Intenta de nuevo.')
      setLoading(false)
      return
    }
    setSubmitted(true)
    setNombre('')
    setWhatsapp('')
    setCorreo('')
    setMensaje('')
    setLoading(false)
  }

  return (
    <section id="contacto" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f2f2f2]">
      <div className="max-w-xl mx-auto">
        <div className="border border-[#1a1a1a]/15 rounded-xl bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-2xl lg:text-3xl font-bold text-[#1a1a1a] lowercase mb-3">
            Contáctanos:
          </h2>
          <p className="text-base text-gray-500 tracking-widest max-w-md lowercase mb-10">
            Queremos saber de ti, dejanos un feedback o si te gustaría ser partner de nuestros
            experiencias. Nos pondremos en contacto tan pronto sea posible.
          </p>

          {submitted ? (
            <p className="text-lg font-medium text-[#1a1a1a] py-8 text-center lowercase">
              Mensaje enviado
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="contacto-nombre" className="block text-sm font-medium text-[#1a1a1a] mb-1 lowercase">
                nombre
              </label>
              <input
                id="contacto-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className={cn(
                  'flex h-10 w-full rounded-md border border-[#1a1a1a]/20 bg-white px-3 py-2 text-[#1a1a1a]',
                  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a]/40'
                )}
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="contacto-whatsapp" className="block text-sm font-medium text-[#1a1a1a] mb-1 lowercase">
                whatsapp
              </label>
              <input
                id="contacto-whatsapp"
                type="tel"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className={cn(
                  'flex h-10 w-full rounded-md border border-[#1a1a1a]/20 bg-white px-3 py-2 text-[#1a1a1a]',
                  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a]/40'
                )}
                placeholder="Número con código de país"
              />
            </div>
            <div>
              <label htmlFor="contacto-correo" className="block text-sm font-medium text-[#1a1a1a] mb-1 lowercase">
                correo
              </label>
              <input
                id="contacto-correo"
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className={cn(
                  'flex h-10 w-full rounded-md border border-[#1a1a1a]/20 bg-white px-3 py-2 text-[#1a1a1a]',
                  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a]/40'
                )}
                placeholder="tu@correo.com"
              />
            </div>
            <div>
              <label htmlFor="contacto-mensaje" className="block text-sm font-medium text-[#1a1a1a] mb-1 lowercase">
                duda o comentario
              </label>
              <textarea
                id="contacto-mensaje"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                required
                rows={4}
                className={cn(
                  'flex w-full rounded-md border border-[#1a1a1a]/20 bg-white px-3 py-2 text-[#1a1a1a] resize-y min-h-[100px]',
                  'placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a1a1a]/20 focus:border-[#1a1a1a]/40'
                )}
                placeholder="Escribe tu mensaje..."
              />
            </div>
            {error && (
              <p className="text-sm text-red-600 lowercase">{error}</p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-black text-white font-medium lowercase hover:bg-black/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1a1a1a] focus-visible:ring-offset-2"
            >
              {loading ? 'enviando...' : 'enviar'}
            </button>
          </form>
          )}
        </div>
      </div>
    </section>
  )
}
