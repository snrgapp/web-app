'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Mail, ArrowRight, Star } from 'lucide-react'
import { useState } from 'react'
import { heroImages } from '@/lib/inicio-data'
import { supabase } from '@/utils/supabase/client'

export default function Hero() {
  const [email, setEmail] = useState('')
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
    const { error: insertError } = await supabase.from('leads').insert({ email: email.trim().toLowerCase() })
    if (insertError) {
      setError(insertError.code === '23505' ? 'Este correo ya está registrado.' : 'No se pudo guardar. Intenta de nuevo.')
      setLoading(false)
      return
    }
    setSubmitted(true)
    setEmail('')
    setLoading(false)
  }

  const col1Images = [heroImages[0], heroImages[1]]
  const col2Images = [heroImages[2], heroImages[3]]
  const duplicatedCol1 = [...col1Images, ...col1Images]
  const duplicatedCol2 = [...col2Images, ...col2Images]

  return (
    <section className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Columna izquierda: texto y formulario */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1a1a1a] lowercase tracking-tight leading-[1.1]">
                no es magia, es networking.
              </h1>
              <p className="text-base text-gray-500 tracking-widest max-w-md lowercase">
                creamos experiencias de conexión entre founders
              </p>
            </motion.div>

            <motion.form
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md"
            >
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-gray-300 bg-white text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition-all"
                />
              </div>
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={loading ? undefined : { scale: 1.03 }}
                whileTap={loading ? undefined : { scale: 0.98 }}
                className="px-8 py-3.5 rounded-2xl bg-black text-white font-medium flex items-center justify-center gap-2 hover:bg-black/90 transition-colors shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'guardando...' : 'regístrame'}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </motion.form>

            {error && (
              <p className="text-sm text-red-600 font-light">
                {error}
              </p>
            )}

            {/* Rating: 4,9 con estrellas doradas */}
            <div className="flex flex-col gap-4 max-w-md">
              <div className="flex items-center gap-1.5 text-sm text-[#1a1a1a]">
                <span className="font-medium">4,9</span>
                <div className="flex items-center">
                  {[1, 2, 3, 4].map((i) => (
                    <Star key={i} className="w-4 h-4 text-[#E5B318] fill-[#E5B318]" />
                  ))}
                  <div className="w-2 h-4 overflow-hidden flex-shrink-0">
                    <Star className="w-4 h-4 text-[#E5B318] fill-[#E5B318]" />
                  </div>
                </div>
                <span className="font-light text-gray-600">en + 350 founders</span>
              </div>
            </div>

            {submitted && (
              <p className="text-sm text-gray-600 font-light">
                te estaremos enviando un correo
              </p>
            )}
          </div>

          {/* Columna derecha: dos columnas de imágenes con movimiento vertical */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 gap-3 sm:gap-4"
          >
            {/* Columna 1: se mueve hacia arriba */}
            <div className="h-[280px] sm:h-[340px] overflow-hidden rounded-[2rem]">
              <motion.div
                className="flex flex-col gap-3"
                animate={{ y: ['0%', '-50%'] }}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 12,
                    ease: 'linear',
                  },
                }}
              >
                {duplicatedCol1.map((src, i) => (
                  <div
                    key={`col1-${i}`}
                    className="relative w-full aspect-square rounded-[2rem] overflow-hidden shrink-0"
                  >
                    <Image
                      src={src}
                      alt={`Networking ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
            {/* Columna 2: se mueve hacia abajo */}
            <div className="h-[280px] sm:h-[340px] overflow-hidden rounded-[2rem]">
              <motion.div
                className="flex flex-col gap-3"
                animate={{ y: ['-50%', '0%'] }}
                transition={{
                  y: {
                    repeat: Infinity,
                    repeatType: 'loop',
                    duration: 12,
                    ease: 'linear',
                  },
                }}
              >
                {duplicatedCol2.map((src, i) => (
                  <div
                    key={`col2-${i}`}
                    className="relative w-full aspect-square rounded-[2rem] overflow-hidden shrink-0"
                  >
                    <Image
                      src={src}
                      alt={`Networking ${i + 2}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
