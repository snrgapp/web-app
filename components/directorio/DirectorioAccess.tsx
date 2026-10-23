'use client'

import { useState } from 'react'
import { ArrowRight, Loader2, ShieldCheck, Smartphone, Timer } from 'lucide-react'

type Props = {
  diasRestantes: number
  cerrado: boolean
  onSubmit: (telefono: string) => Promise<string | null>
}

function formatPhone(raw: string): string {
  const val = raw.replace(/\D/g, '').slice(0, 10)
  if (val.length <= 3) return val
  if (val.length <= 6) return `${val.slice(0, 3)} ${val.slice(3)}`
  return `${val.slice(0, 3)} ${val.slice(3, 6)} ${val.slice(6)}`
}

export function DirectorioAccess({ diasRestantes, cerrado, onSubmit }: Props) {
  const [telefono, setTelefono] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (cerrado || !telefono.trim()) return
    setLoading(true)
    setError('')
    const msg = await onSubmit(telefono)
    if (msg) setError(msg)
    setLoading(false)
  }

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center overflow-hidden bg-[#08080A] px-4 py-8">
      <div className="dir-glow w-64 h-64 -top-12 -left-16 bg-[#E5C378]/10" />
      <div className="dir-glow w-80 h-80 top-1/3 -right-24 bg-[#D4AF37]/[0.08]" />
      <div className="dir-glow w-72 h-72 bottom-12 left-1/2 -translate-x-1/2 bg-[#E5C378]/[0.06]" />

      <div className="relative z-10 w-full max-w-[400px]">
        <header className="flex justify-center items-center h-16 mb-2">
          <div className="w-10 h-10 rounded-full bg-[#121317] border border-[#C9A227] flex items-center justify-center text-[#C9A227] font-bold text-xl select-none">
            S
          </div>
        </header>

        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1a1b20] border border-white/10 text-[#d0c5b4]">
            <Timer className="w-3.5 h-3.5 text-[#ffe09d]" />
            <span className="text-[11px] font-semibold tracking-wide uppercase">
              {cerrado
                ? 'El acceso de 7 días ya cerró'
                : diasRestantes === 1
                  ? 'Último día de acceso'
                  : `El acceso estará disponible por ${diasRestantes} días`}
            </span>
          </div>
        </div>

        <section className="dir-glass rounded-3xl p-6 sm:p-7 relative">
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#e5c378]/40 to-transparent" />
          <div className="space-y-1.5 mb-6">
            <h1
              className="text-2xl font-semibold tracking-tight text-[#e3e2e7]"
              style={{ fontFamily: 'var(--dir-display), sans-serif' }}
            >
              Directorio de asistentes
            </h1>
            <p className="text-[13px] leading-relaxed text-[#d0c5b4]">
              Exclusivo para quienes asistieron a Synergy · 20 de octubre · Bruma Coffee Lab
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="dir-phone" className="block text-xs font-semibold tracking-wider text-[#d0c5b4] mb-2">
                Tu número de celular
              </label>
              <div className="dir-input-wrap group flex items-center w-full rounded-xl bg-[#08080A]/90 border border-white/10 focus-within:border-[#ffe09d] focus-within:ring-1 focus-within:ring-[#ffe09d]/40">
                <div className="flex items-center gap-1.5 pl-3.5 pr-2 py-3.5 border-r border-white/10">
                  <span className="text-sm">🇨🇴</span>
                  <span className="text-[13px] font-medium tracking-tight text-[#e3e2e7]">+57</span>
                </div>
                <input
                  id="dir-phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  placeholder="300 *** ****"
                  value={telefono}
                  onChange={(e) => setTelefono(formatPhone(e.target.value))}
                  disabled={cerrado}
                  className="w-full bg-transparent px-3.5 py-3.5 text-[15px] tracking-wider text-[#e3e2e7] placeholder:text-white/25 border-0 outline-none"
                />
                <div className="pr-3 text-white/40">
                  <Smartphone className="w-[18px] h-[18px]" />
                </div>
              </div>
            </div>

            {error && <p className="text-sm text-[#ffb4ab]">{error}</p>}

            <button
              type="submit"
              disabled={cerrado || !telefono.trim() || loading}
              className="dir-gold-btn w-full py-3.5 px-5 rounded-xl text-[#08080A] font-semibold flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>Entrar al directorio</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-center gap-1.5 text-[#d0c5b4]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#ffe09d]" />
            <span className="text-[10px] font-semibold tracking-wide uppercase">
              Verificamos tu número con la lista de asistentes
            </span>
          </div>
        </section>

        <div className="mt-5 text-center">
          <a
            href="mailto:hello@snrg.lat"
            className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-wide uppercase text-white/40 hover:text-[#ffe09d]"
          >
            ¿Problemas para entrar? Escríbenos
          </a>
        </div>
      </div>
    </div>
  )
}
