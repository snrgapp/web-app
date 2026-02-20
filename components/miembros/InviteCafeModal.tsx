'use client'

import { useState } from 'react'
import { Calendar, Info } from 'lucide-react'

const CAFETERIAS = [
  { id: 'cafe-404', label: 'Cafe 404' },
  { id: 'la-taza-bike', label: 'La taza bike' },
  { id: 'cafe-el-cielo', label: 'Café el cielo' },
  { id: 'otro', label: 'Otro café' },
] as const

export interface InviteCafeData {
  fecha: string
  hora: string
  cafeteriaId: string | null
}

interface InviteCafeModalProps {
  nombre: string
  empresa: string
  onClose: () => void
  onConfirm: (data: InviteCafeData) => Promise<void>
}

function formatDateForInput(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function InviteCafeModal({ nombre, empresa, onClose, onConfirm }: InviteCafeModalProps) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const [fecha, setFecha] = useState<string>(formatDateForInput(tomorrow))
  const [hora, setHora] = useState<string>('10:30')
  const [selectedCafe, setSelectedCafe] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  async function handleEnviar() {
    setSending(true)
    try {
      await onConfirm({ fecha, hora, cafeteriaId: selectedCafe })
      onClose()
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/30"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-zinc-100 p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-center text-base font-bold text-zinc-800 mb-4">
          Quiero invitar un café a :
        </h2>

        <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
          <div>
            <p className="text-lg font-bold text-zinc-900">{nombre}</p>
            <p className="text-sm text-zinc-600">{empresa}</p>
          </div>
          <p className="flex items-center gap-1.5 text-xs text-zinc-500">
            <Info className="w-4 h-4 flex-shrink-0" />
            Recibirá una notificación con tu invitación
          </p>
        </div>

        <div className="mb-4 flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-500" />
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800"
            />
          </div>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800"
          />
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-zinc-700 mb-3">Cafetería</h3>
          <div className="grid grid-cols-2 gap-3">
            {CAFETERIAS.map((cafe) => (
              <label
                key={cafe.id}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedCafe === cafe.id}
                  onChange={() => setSelectedCafe(selectedCafe === cafe.id ? null : cafe.id)}
                  className="rounded border-zinc-300 text-amber-500 focus:ring-amber-400"
                />
                <span className="text-sm text-zinc-700">{cafe.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleEnviar}
            disabled={sending}
            className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-white hover:bg-amber-500 disabled:opacity-60"
          >
            {sending ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </div>
    </>
  )
}
