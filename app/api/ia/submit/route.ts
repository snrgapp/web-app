import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { scheduleOutboundCall } from '@/lib/vapi'

/**
 * Normaliza teléfono a formato E.164.
 * Ej: "300 123 4567" + país 57 -> "+573001234567"
 */
function toE164(phone: string, countryCode = '57'): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith(countryCode) && digits.length >= 10) {
    return `+${digits}`
  }
  if (digits.length >= 8) {
    return `+${countryCode}${digits}`
  }
  return ''
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : ''
    const telefono = typeof body.telefono === 'string' ? body.telefono.trim() : ''
    const rol = typeof body.rol === 'string' ? body.rol.trim() : null

    if (!nombre || !telefono) {
      return NextResponse.json(
        { error: 'Nombre y teléfono son requeridos' },
        { status: 400 }
      )
    }

    const countryCode = process.env.DEFAULT_SMS_COUNTRY_CODE || '57'
    const phoneE164 = toE164(telefono, countryCode)
    if (!phoneE164) {
      return NextResponse.json(
        { error: 'Teléfono inválido. Incluye el número con código de país si es necesario.' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()
    if (!supabase) {
      return NextResponse.json(
        { error: 'Error de configuración. Intenta más tarde.' },
        { status: 503 }
      )
    }

    const { error } = await supabase.from('ia_form_submissions').insert({
      rol: rol || null,
      nombre_completo: nombre,
      telefono: phoneE164,
    })

    if (error) {
      console.error('ia_form_submissions insert error:', error)
      return NextResponse.json(
        { error: 'Error al guardar. Intenta más tarde.' },
        { status: 500 }
      )
    }

    const callResult = await scheduleOutboundCall(phoneE164)

    if (!callResult.ok) {
      return NextResponse.json(
        {
          ok: true,
          saved: true,
          callScheduled: false,
          message: 'Datos guardados. Hubo un problema al programar la llamada.',
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      ok: true,
      saved: true,
      callScheduled: true,
      message: 'Te vamos a llamar en un minuto.',
    })
  } catch (e) {
    console.error('ia submit error:', e)
    return NextResponse.json(
      { error: 'Error inesperado. Intenta más tarde.' },
      { status: 500 }
    )
  }
}
