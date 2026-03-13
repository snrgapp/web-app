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

function str(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t || null
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const nombre = str(body.nombre) ?? ''
    const telefono = str(body.telefono) ?? ''

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

    const { data: submission, error } = await supabase
      .from('ia_form_submissions')
      .insert({
        rol: str(body.rol),
        nombre_completo: nombre,
        nombre_empresa: str(body.nombre_empresa),
        url_sitio_web: str(body.url_sitio_web),
        que_vende: str(body.que_vende),
        telefono: phoneE164,
        email_empresa: str(body.email_empresa),
        linkedin: str(body.linkedin),
        como_vende: str(body.como_vende),
        desafios_puntos_dolor: str(body.desafios_puntos_dolor),
        cliente_objetivo: str(body.cliente_objetivo),
        tamano_equipo: str(body.tamano_equipo),
        presupuesto_ventas: str(body.presupuesto_ventas),
        como_enteraste_synergy: str(body.como_enteraste_synergy),
        acepta_terminos: !!body.acepta_terminos,
      })
      .select('id')
      .single()

    if (error) {
      console.error('ia_form_submissions insert error:', error)
      return NextResponse.json(
        { error: 'Error al guardar. Intenta más tarde.' },
        { status: 500 }
      )
    }

    const callResult = await scheduleOutboundCall({
      to: phoneE164,
      customerName: nombre,
      leadId: submission?.id,
    })

    if (!callResult.ok) {
      console.error('Vapi call failed:', callResult.error, callResult.details)
      return NextResponse.json(
        {
          ok: true,
          saved: true,
          callScheduled: false,
          message: 'Datos guardados. Hubo un problema al programar la llamada.',
          debug: process.env.NODE_ENV === 'development' ? callResult : undefined,
        },
        { status: 200 }
      )
    }

    return NextResponse.json({
      ok: true,
      saved: true,
      callScheduled: true,
      message: 'Te llamamos en un momento, mantén tu teléfono cerca.',
    })
  } catch (e) {
    console.error('ia submit error:', e)
    return NextResponse.json(
      { error: 'Error inesperado. Intenta más tarde.' },
      { status: 500 }
    )
  }
}
