'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import QRCode from 'qrcode'

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://snrg.lat'

interface CheckinQRCardProps {
  checkinSlug: string
  eventoNombre?: string
  size?: number
}

export function CheckinQRCard({
  checkinSlug,
  eventoNombre,
  size = 200,
}: CheckinQRCardProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    const url = `${BASE_URL}/checkin?event=${encodeURIComponent(checkinSlug)}`
    QRCode.toDataURL(url, { width: size, margin: 2 })
      .then(setDataUrl)
      .catch(() => setDataUrl(null))
  }, [checkinSlug, size])

  function handleDownload() {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `qr-checkin-${checkinSlug}.png`
    a.click()
  }

  const url = `${BASE_URL}/checkin?event=${checkinSlug}`

  if (!dataUrl) {
    return (
      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 inline-flex items-center justify-center">
        <span className="text-zinc-500 text-sm">Generando QR...</span>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 inline-flex flex-col items-center gap-3">
      {eventoNombre && (
        <p className="text-sm font-medium text-zinc-700 truncate max-w-full">
          {eventoNombre}
        </p>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={dataUrl}
        alt={`QR Check-in ${checkinSlug}`}
        width={size}
        height={size}
        className="rounded-lg"
      />
      <p className="text-xs text-zinc-500 font-mono break-all text-center max-w-[220px]">
        {url}
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="gap-2"
      >
        <Download className="w-4 h-4" />
        Descargar QR
      </Button>
    </div>
  )
}
