'use client'

import { ConnectionRecommendations } from '@/components/miembros/ConnectionRecommendations'
import { LatestConnections } from '@/components/miembros/LatestConnections'
import { useState, useEffect } from 'react'

export default function RedContactosPage() {
  const [latestConnections, setLatestConnections] = useState<
    { id: string; nombre: string; empresa: string; email?: string; phone?: string }[]
  >([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/miembros/connections')
      .then((r) => r.json())
      .then((data) => setLatestConnections(data.latestConnections || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
      <div>
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
          Red de contactos
        </p>
        <h1 className="text-2xl font-light text-black tracking-tight">
          Conecta con otros miembros
        </h1>
      </div>

      <div className="space-y-6">
        <ConnectionRecommendations />
        <div>
          <h2 className="text-lg font-medium text-zinc-800 mb-4">Tus conexiones</h2>
          {loading ? (
            <div className="h-48 rounded-xl border border-zinc-200 bg-white animate-pulse" />
          ) : (
            <LatestConnections connections={latestConnections} />
          )}
        </div>
      </div>
    </div>
  )
}
