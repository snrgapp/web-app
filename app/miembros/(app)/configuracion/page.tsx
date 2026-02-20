'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Member {
  id: string
  phone: string
  nombre?: string | null
  email?: string | null
  empresa?: string | null
}

export default function ConfiguracionPage() {
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/miembros/auth/session')
      .then((r) => (r.ok ? r.json() : null))
      .then(setMember)
      .catch(() => setMember(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-4 lg:p-6 max-w-7xl mx-auto">
        <div className="h-64 rounded-xl border border-zinc-200 bg-white animate-pulse" />
      </div>
    )
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
          Configuración
        </p>
        <h1 className="text-2xl font-light text-black tracking-tight">
          Tu perfil
        </h1>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <h2 className="font-semibold text-zinc-800">Datos personales</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-zinc-600 block mb-1">
              Teléfono
            </label>
            <Input value={member?.phone || ''} disabled className="bg-zinc-50" />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-600 block mb-1">
              Nombre
            </label>
            <Input
              placeholder="Tu nombre"
              defaultValue={member?.nombre || ''}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-600 block mb-1">
              Email
            </label>
            <Input
              type="email"
              placeholder="tu@email.com"
              defaultValue={member?.email || ''}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-600 block mb-1">
              Empresa
            </label>
            <Input
              placeholder="Tu empresa"
              defaultValue={member?.empresa || ''}
            />
          </div>
          <Button>Guardar cambios</Button>
        </CardContent>
      </Card>
    </div>
  )
}
