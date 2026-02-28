'use client'

import { useState, Suspense } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'

const HOME_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://snrg.lat'

function MiembrosLoginForm() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!phone.trim()) {
      setError('Ingresa tu número de teléfono')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/miembros/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Error al enviar código')
        return
      }
      setStep('code')
      setCode('')
      setError('')
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!code.trim() || code.length !== 6) {
      setError('Ingresa el código de 6 dígitos')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/miembros/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), code: code.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Código incorrecto')
        return
      }
      const redirect = data.redirect || '/miembros'
      window.location.href = redirect
    } catch {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  function handleBack() {
    setStep('phone')
    setCode('')
    setError('')
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 relative">
      <a
        href={HOME_URL}
        className="absolute left-4 top-4 flex items-center gap-2 text-xs font-light text-zinc-600 hover:text-black transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </a>
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-zinc-200 bg-white shadow-sm p-8">
          <div className="flex flex-col items-center gap-4 mb-8">
            <Image src="/logo.png" alt="Snergy" width={56} height={56} />
            <h1 className="text-xl font-semibold text-black">Panel de miembros</h1>
            <p className="text-sm text-zinc-500 text-center">
              {step === 'phone'
                ? 'Ingresa tu número de teléfono para recibir un código'
                : `Código enviado a ***${phone.replace(/\D/g, '').slice(-4)}. Revisa tu SMS.`}
            </p>
          </div>

          {step === 'phone' ? (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <div>
                <Input
                  type="tel"
                  placeholder="302 4567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full"
                  disabled={loading}
                  autoFocus
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-center pt-1">
                <Button type="submit" className="px-8" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar código'}
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full text-center text-lg tracking-[0.4em]"
                  disabled={loading}
                  autoFocus
                  maxLength={6}
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex flex-col gap-2">
                <Button type="submit" className="px-8 w-full" disabled={loading || code.length !== 6}>
                  {loading ? 'Verificando...' : 'Verificar y entrar'}
                </Button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="text-sm text-zinc-500 hover:text-black"
                >
                  Cambiar número
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MiembrosLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <p className="text-zinc-500">Cargando...</p>
      </div>
    }>
      <MiembrosLoginForm />
    </Suspense>
  )
}
