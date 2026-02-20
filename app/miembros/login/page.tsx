'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'

function MiembrosLoginForm() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from') || ''
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!phone.trim()) {
      setError('Ingresa tu número de teléfono')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/miembros/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        const msg = data.hint ? `${data.error}: ${data.hint}` : (data.error || 'Error al iniciar sesión')
        setError(msg)
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

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-4">
          <Image src="/logo.png" alt="Snergy" width={56} height={56} />
          <h1 className="text-xl font-semibold text-black">Panel de miembros</h1>
          <p className="text-sm text-zinc-500 text-center">
            Ingresa tu número de teléfono para acceder
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="tel"
              placeholder="+52 123 456 7890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full"
              disabled={loading}
              autoFocus
            />
          </div>
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <p className="text-xs text-zinc-400 text-center">
          Sin verificación por SMS en esta fase. Cualquier teléfono permite el acceso.
        </p>
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
