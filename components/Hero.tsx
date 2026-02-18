'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Mail, MapPin, ArrowRight, Star, Instagram, Linkedin, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { heroImages } from '@/lib/inicio-data'
import { supabase } from '@/utils/supabase/client'

gsap.registerPlugin(ScrollTrigger)

const CAROUSEL_DURATION = 25

export default function Hero() {
  const [email, setEmail] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [foundersCount, setFoundersCount] = useState(0)

  const heroSectionRef = useRef<HTMLElement>(null)
  const titlePart1Ref = useRef<HTMLSpanElement>(null)
  const titlePart2Ref = useRef<HTMLSpanElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    if (!supabase) {
      setError('No se pudo conectar. Intenta más tarde.')
      setLoading(false)
      return
    }
    const { error: insertError } = await supabase.from('leads').insert({
      email: email.trim().toLowerCase(),
      ciudad: ciudad.trim() || null,
    })
    if (insertError) {
      setError(insertError.code === '23505' ? 'Este correo ya está registrado.' : 'No se pudo guardar. Intenta de nuevo.')
      setLoading(false)
      return
    }
    setSubmitted(true)
    setEmail('')
    setCiudad('')
    setLoading(false)
  }

  useEffect(() => {
    if (!submitted) return
    const t = setTimeout(() => setSubmitted(false), 3200)
    return () => clearTimeout(t)
  }, [submitted])

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        if (!titlePart1Ref.current || !titlePart2Ref.current || !subtitleRef.current) return

        gsap.set(titlePart1Ref.current, { filter: 'blur(8px)', opacity: 0.5 })
        gsap.set(titlePart2Ref.current, { filter: 'blur(8px)', opacity: 0.5 })

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        })

        tl.to(titlePart1Ref.current, {
          filter: 'blur(0px)',
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
        })
          .to({}, { duration: 0.5 })
          .to(titlePart2Ref.current, {
            filter: 'blur(0px)',
            opacity: 1,
            duration: 1,
            ease: 'power2.out',
          }, '-=0.1')
          .to(subtitleRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
          }, '-=0.3')

        gsap.set(subtitleRef.current, { opacity: 0, y: 36 })

        if (heroSectionRef.current) {
          const obj = { val: 0 }
          gsap.to(obj, {
            val: 630,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: heroSectionRef.current,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
            onUpdate: () => {
              setFoundersCount(Math.round(obj.val))
            },
          })
        }

      }, heroSectionRef)

      return () => ctx.revert()
    },
    { dependencies: [setFoundersCount] }
  )

  const col1Images = heroImages.filter((_, i) => i % 2 === 0)
  const col2Images = heroImages.filter((_, i) => i % 2 === 1)

  return (
    <section
      ref={heroSectionRef}
      className="relative min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 flex items-center"
    >
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
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-[#1a1a1a] lowercase tracking-tight leading-[1.1]"
              >
                <span ref={titlePart1Ref} className="inline-block">no es magia,</span>
                {' '}
                <span ref={titlePart2Ref} className="inline-block">es networking.</span>
              </h1>
              <p
                ref={subtitleRef}
                className="text-base text-gray-500 tracking-widest max-w-md lowercase"
              >
                creamos experiencias de conexión entre founders
              </p>
            </motion.div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-3 max-w-xl">
              <div className="min-h-[52px] flex items-center flex-1 w-full sm:w-auto">
                <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3 text-[#1a1a1a]"
                  >
                    <Check className="w-6 h-6 text-[#E5B318] flex-shrink-0" strokeWidth={2.5} />
                    <p className="text-sm sm:text-base font-light lowercase">
                      registro satisfactorio. te llegará más información a tu correo.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 w-full"
                >
                  <div className="relative flex-1 min-w-0 sm:min-w-[120px] sm:max-w-[160px]">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ciudad"
                      value={ciudad}
                      onChange={(e) => setCiudad(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-300 bg-white text-[#1a1a1a] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black/20 transition-all"
                    />
                  </div>
                  <div className="relative flex-[2_1_0] min-w-0 sm:flex-[3_1_0]">
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
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:contents">
                    {/* Mobile: línea 1 - rating izquierda, botón derecha */}
                    <div className="flex sm:hidden justify-between items-center w-full">
                      <div className="flex items-center gap-1.5 text-[10px] text-[#1a1a1a]">
                        <span className="font-medium">4,9</span>
                        <div className="flex items-center">
                          {[1, 2, 3, 4].map((i) => (
                            <Star key={i} className="w-2.5 h-2.5 text-[#E5B318] fill-[#E5B318]" />
                          ))}
                          <div className="w-1.5 h-2.5 overflow-hidden flex-shrink-0">
                            <Star className="w-2.5 h-2.5 text-[#E5B318] fill-[#E5B318]" />
                          </div>
                        </div>
                        <span className="font-light text-gray-600">
                          en + <span>{foundersCount}</span> founders
                        </span>
                      </div>
                      <motion.button
                        type="submit"
                        disabled={loading}
                        whileHover={loading ? undefined : { scale: 1.03 }}
                        whileTap={loading ? undefined : { scale: 0.98 }}
                        className="shrink-0 px-6 py-3 rounded-2xl bg-black text-white text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-black/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? 'enviando...' : 'regístrame'}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </motion.button>
                    </div>
                    {/* Mobile: línea 2 - iconos más grandes */}
                    <div className="flex sm:hidden items-center gap-3">
                      <a href="https://www.instagram.com/_____synergy?igsh=MjhocGI0eWp3dDJr&utm_source=qr" target="_blank" rel="noopener noreferrer" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors" aria-label="Instagram">
                        <Instagram className="w-5 h-5" />
                      </a>
                      <a href="https://www.linkedin.com/company/synergy-founders-makers" target="_blank" rel="noopener noreferrer" className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors" aria-label="LinkedIn">
                        <Linkedin className="w-5 h-5" />
                      </a>
                    </div>
                    {/* Desktop: solo el botón */}
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={loading ? undefined : { scale: 1.03 }}
                      whileTap={loading ? undefined : { scale: 0.98 }}
                      className="hidden sm:flex shrink-0 px-6 py-3 rounded-2xl bg-black text-white text-sm font-medium items-center justify-center gap-1.5 hover:bg-black/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed sm:ml-auto"
                    >
                      {loading ? 'enviando...' : 'regístrame'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </motion.form>
                )}
              </AnimatePresence>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600 font-light">
                {error}
              </p>
            )}

            <div className="hidden sm:flex flex-col sm:flex-row sm:flex-wrap gap-4 max-w-md">
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
                <span className="font-light text-gray-600">
                  en + <span>{foundersCount}</span> founders
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.instagram.com/_____synergy?igsh=MjhocGI0eWp3dDJr&utm_source=qr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/company/synergy-founders-makers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1a1a1a]/60 hover:text-[#1a1a1a] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>

          </div>

          {/* Columna derecha: dos carruseles verticales */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex gap-3 sm:gap-4 justify-center lg:justify-start"
          >
            {/* Carrusel descendente (columna izq) */}
            <div
              className="relative h-[380px] sm:h-[520px] w-[150px] sm:w-[200px] flex-shrink-0 overflow-hidden rounded-xl"
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, black 20%, black 80%, rgba(0,0,0,0.3) 92%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, black 20%, black 80%, rgba(0,0,0,0.3) 92%, transparent 100%)',
                maskSize: '100% 100%',
              }}
            >
              <div
                className="flex flex-col gap-4 animate-carousel-down"
                style={{
                  animationDuration: `${CAROUSEL_DURATION}s`,
                }}
              >
                {[...col1Images, ...col1Images].map((src, i) => (
                  <div
                    key={`col1-${src}-${i}`}
                    className="relative w-[150px] sm:w-[200px] h-[180px] sm:h-[240px] flex-shrink-0 rounded-xl overflow-hidden shadow-lg"
                  >
                    <Image
                      src={src}
                      alt={`Networking ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 150px, 200px"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Carrusel ascendente (columna der) */}
            <div
              className="relative h-[380px] sm:h-[520px] w-[150px] sm:w-[200px] flex-shrink-0 overflow-hidden rounded-xl"
              style={{
                maskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, black 20%, black 80%, rgba(0,0,0,0.3) 92%, transparent 100%)',
                WebkitMaskImage:
                  'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 8%, black 20%, black 80%, rgba(0,0,0,0.3) 92%, transparent 100%)',
                maskSize: '100% 100%',
              }}
            >
              <div
                className="flex flex-col gap-4 animate-carousel-up"
                style={{
                  animationDuration: `${CAROUSEL_DURATION}s`,
                }}
              >
                {[...col2Images, ...col2Images].map((src, i) => (
                  <div
                    key={`col2-${src}-${i}`}
                    className="relative w-[150px] sm:w-[200px] h-[180px] sm:h-[240px] flex-shrink-0 rounded-xl overflow-hidden shadow-lg"
                  >
                    <Image
                      src={src}
                      alt={`Networking ${i + 3}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 150px, 200px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
