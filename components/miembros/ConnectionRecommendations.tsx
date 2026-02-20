'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Coffee, MessageCircle, Mail } from 'lucide-react'
import { InviteCafeModal } from './InviteCafeModal'

interface Recommendation {
  id: string
  nombre: string
  empresa: string
  email?: string
  phone?: string
}

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.length >= 10) {
    return `https://wa.me/${digits.startsWith('52') ? '' : '52'}${digits}`
  }
  return '#'
}

export function ConnectionRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [inviteTarget, setInviteTarget] = useState<Recommendation | null>(null)

  useEffect(() => {
    fetch('/api/miembros/recommendations')
      .then((r) => r.json())
      .then((data) => setRecommendations(data.recommendations || []))
      .catch(() => setRecommendations([]))
      .finally(() => setLoading(false))
  }, [])

  async function handleConfirmInvite(_data: { fecha: string; hora: string; cafeteriaId: string | null }) {
    if (!inviteTarget) return
    const res = await fetch('/api/miembros/invite-cafe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ connectedMemberId: inviteTarget.id }),
    })
    if (res.ok) {
      setRecommendations((prev) => prev.filter((r) => r.id !== inviteTarget.id))
    }
    setInviteTarget(null)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <p className="text-sm text-zinc-400 text-center">Cargando recomendaciones...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <h3 className="text-sm font-semibold text-zinc-700">Recomendaciones de conexión</h3>
        </CardHeader>
        <CardContent>
          {recommendations.length === 0 ? (
            <p className="text-sm text-zinc-400">No hay recomendaciones por ahora</p>
          ) : (
            <div className="overflow-x-auto max-h-[280px] overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="text-left py-2 font-medium text-zinc-500">Nombre</th>
                    <th className="text-left py-2 font-medium text-zinc-500">Empresa</th>
                    <th className="text-left py-2 font-medium text-zinc-500">Contacto</th>
                    <th className="text-left py-2 font-medium text-zinc-500">Invitar un café</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendations.map((r) => (
                    <tr key={r.id} className="border-b border-zinc-100">
                      <td className="py-3 font-medium text-zinc-800">{r.nombre}</td>
                      <td className="py-3 text-zinc-600">{r.empresa}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {r.phone && (
                            <a
                              href={formatPhone(r.phone)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded text-zinc-500 hover:text-green-600"
                            >
                              <MessageCircle className="w-4 h-4" />
                            </a>
                          )}
                          {r.email && (
                            <a
                              href={`mailto:${r.email}`}
                              className="p-1.5 rounded text-zinc-500 hover:text-blue-600"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3">
                        <Button
                          size="sm"
                          variant="secondary"
                          className="bg-amber-100 hover:bg-amber-200 text-amber-900"
                          onClick={() => setInviteTarget(r)}
                        >
                          <Coffee className="w-4 h-4 mr-1" />
                          Invitar un café
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {inviteTarget && (
        <InviteCafeModal
          nombre={inviteTarget.nombre}
          empresa={inviteTarget.empresa}
          onClose={() => setInviteTarget(null)}
          onConfirm={handleConfirmInvite}
        />
      )}
    </>
  )
}
