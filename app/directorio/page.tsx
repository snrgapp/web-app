'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import {
  entrarDirectorio,
  getDirectorioMeta,
  recargarDirectorio,
  type DirectorioAsistente,
} from '@/app/actions/directorio'
import { DirectorioAccess } from '@/components/directorio/DirectorioAccess'
import { DirectorioGrid } from '@/components/directorio/DirectorioGrid'
import { DIRECTORIO_SESSION_KEY, type DirectorioSession } from '@/lib/directorio'

export default function DirectorioPage() {
  const [ready, setReady] = useState(false)
  const [cerrado, setCerrado] = useState(false)
  const [diasRestantes, setDiasRestantes] = useState(7)
  const [asistentes, setAsistentes] = useState<DirectorioAsistente[] | null>(null)

  useEffect(() => {
    let cancelled = false

    async function boot() {
      const meta = await getDirectorioMeta()
      if (cancelled) return
      if (!meta) {
        setCerrado(true)
        setReady(true)
        return
      }
      setCerrado(!meta.abierto)
      setDiasRestantes(meta.diasRestantes)

      const raw =
        typeof window !== 'undefined'
          ? localStorage.getItem(DIRECTORIO_SESSION_KEY) ?? sessionStorage.getItem(DIRECTORIO_SESSION_KEY)
          : null
      if (raw && meta.abierto) {
        try {
          const session = JSON.parse(raw) as DirectorioSession
          const reload = await recargarDirectorio(session.asistenteId)
          if (!cancelled && reload.ok) {
            setAsistentes(reload.asistentes)
            setDiasRestantes(reload.diasRestantes)
          } else if (!cancelled) {
            localStorage.removeItem(DIRECTORIO_SESSION_KEY)
            sessionStorage.removeItem(DIRECTORIO_SESSION_KEY)
          }
        } catch {
          localStorage.removeItem(DIRECTORIO_SESSION_KEY)
          sessionStorage.removeItem(DIRECTORIO_SESSION_KEY)
        }
      }
      if (!cancelled) setReady(true)
    }

    boot()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleEnter(telefono: string): Promise<string | null> {
    const result = await entrarDirectorio(telefono)
    if (!result.ok) return result.error
    const payload = JSON.stringify({ asistenteId: result.asistenteId, eventoId: result.eventoId })
    localStorage.setItem(DIRECTORIO_SESSION_KEY, payload)
    sessionStorage.setItem(DIRECTORIO_SESSION_KEY, payload)
    setAsistentes(result.asistentes)
    setDiasRestantes(result.diasRestantes)
    return null
  }

  if (!ready) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[#08080A]">
        <Loader2 className="w-8 h-8 animate-spin text-[#e5c378]" />
      </div>
    )
  }

  if (!asistentes) {
    return (
      <DirectorioAccess diasRestantes={diasRestantes} cerrado={cerrado} onSubmit={handleEnter} />
    )
  }

  return <DirectorioGrid asistentes={asistentes} diasRestantes={diasRestantes} />
}
