import type { SupabaseClient } from '@supabase/supabase-js'
import { sendBirdEmail } from '@/lib/bird-email'
import { registrarContactoEvento } from '@/lib/bird-contactos'

/**
 * Correo "Pago completado" (plantilla Bird). El nombre lo pinta la plantilla desde
 * bird.contact.first_name. El contacto normalmente ya existe desde el registro; se
 * vuelve a guardar por si vino de una lista, del panel o con otro correo.
 *
 * Env:
 *   BIRD_PAGO_CONFIRM_TEMPLATE  id de la plantilla (emt_...)
 */
const TEMPLATE_ID = process.env.BIRD_PAGO_CONFIRM_TEMPLATE || 'emt_01m5rt30w6ez9t3990yfkr22gm'

type Pago = Record<string, unknown> & { id: string }

export function debeConfirmarPago(p: Pago | null | undefined) {
  return Boolean(p && p.estado === 'aprobado' && p.comprobante_url && !p.confirmacion_enviada_at)
}

export async function enviarConfirmacionPago(
  db: SupabaseClient,
  pago: Pago
): Promise<{ ok: boolean; error?: string; correo?: string; fila: Pago }> {
  const [{ data: asistente }, { data: evento }] = await Promise.all([
    pago.asistente_id
      ? db.from('asistentes').select('nombre, apellido, correo').eq('id', pago.asistente_id).maybeSingle()
      : Promise.resolve({ data: null }),
    pago.evento_id
      ? db.from('eventos').select('id, titulo, ciudad, fecha').eq('id', pago.evento_id).maybeSingle()
      : Promise.resolve({ data: null }),
  ])

  const correo = String(pago.correo || asistente?.correo || '').trim().toLowerCase()
  const nombreCompleto = String(asistente?.nombre || pago.pagador || '').trim()

  let error: string | undefined
  if (!correo.includes('@')) {
    error = 'El pago no tiene correo: agrégalo o vincula un asistente con correo'
  } else {
    const contacto = await registrarContactoEvento({
      email: correo,
      nombre: nombreCompleto,
      apellido: asistente?.apellido,
      evento,
    })
    if (!contacto.success) {
      error = `No se pudo guardar el contacto en Bird: ${contacto.error}`
    } else {
      const entradas = Number(pago.entradas) || 1
      const concepto = String(pago.concepto || 'Entrada')
      const r = await sendBirdEmail({
        to: [{ email: correo, name: nombreCompleto || undefined }],
        template: {
          id: TEMPLATE_ID,
          parameters: {
            fecha: new Date(String(pago.created_at || Date.now())).toLocaleDateString('es-CO', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              timeZone: 'America/Bogota',
            }),
            codigo_transaccion: String(pago.referencia || pago.id.slice(0, 8).toUpperCase()),
            descripcion: `${entradas > 1 ? `${entradas} × ` : ''}${concepto}${evento?.titulo ? ` · ${evento.titulo}` : ''}`,
            monto: `$${Number(pago.monto_cop || 0).toLocaleString('es-CO')} COP`,
          },
        },
        category: 'transactional',
        tags: { tipo: 'confirmacion_pago' },
      })
      if (!r.success) error = r.error || 'Bird rechazó el envío'
    }
  }

  const { data: fila } = await db
    .from('evento_pagos')
    .update(
      error
        ? { confirmacion_error: error }
        : { confirmacion_enviada_at: new Date().toISOString(), confirmacion_error: null }
    )
    .eq('id', pago.id)
    .select()
    .single()

  return { ok: !error, error, correo, fila: (fila as Pago) ?? pago }
}
