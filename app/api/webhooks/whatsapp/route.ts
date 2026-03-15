// ============================================
// SYNERGY — Webhook de WhatsApp entrante
// Archivo: app/api/webhooks/whatsapp/route.ts
// Recibe respuestas del usuario (ASI, ANO, BSI, etc.)
// y procesa el doble opt-in
// ============================================

import { NextResponse } from 'next/server'
import { createAdminClient } from '@/utils/supabase/admin'
import { procesarRespuesta, enviarIntroGrupal } from '@/services/whatsapp'

export async function POST(req: Request) {
  try {
    // Twilio envía los datos como form-urlencoded
    const formData = await req.formData()
    const from = formData.get('From') as string // whatsapp:+573001234567
    const body = formData.get('Body') as string // "ASI", "ANO", "BSI"...

    console.log('📱 WhatsApp recibido de:', from, '| Mensaje:', body)

    const telefono = from.replace('whatsapp:', '')

    // Interpretar la respuesta
    const respuesta = procesarRespuesta(body)

    if (!respuesta) {
      // Mensaje que no entendemos — responder con ayuda
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response>
          <Message>No entendí tu respuesta. Para aceptar una conexión responde *ASI*, *BSI* o *CSI*. Para rechazar *ANO*, *BNO* o *CNO*.</Message>
        </Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }

    const { letra, acepto } = respuesta
    console.log(`📊 Respuesta procesada: letra=${letra}, acepto=${acepto}`)

    const supabase = createAdminClient()
    if (!supabase) return NextResponse.json({ error: 'Config error' }, { status: 503 })

    // Buscar el match pendiente para este usuario y esta letra
    const letraIndex = ['A', 'B', 'C'].indexOf(letra)

    // Buscar el perfil del usuario por teléfono
    const { data: submission } = await supabase
      .from('ia_form_submissions')
      .select('id')
      .eq('telefono', telefono)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!submission) {
      console.warn('No se encontró submission para:', telefono)
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response><Message>No encontré tu perfil. ¿Llenaste el formulario en synergy.lat?</Message></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }

    const { data: perfil } = await supabase
      .from('ia_call_profiles')
      .select('id')
      .eq('lead_id', submission.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!perfil) {
      console.warn('No se encontró perfil de llamada para submission:', submission.id)
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response><Message>No encontré tu perfil de llamada. Intenta de nuevo más tarde.</Message></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }

    // Buscar los matches pendientes ordenados por created_at
    const { data: matches } = await supabase
      .from('ia_matches')
      .select(`
        id,
        profile_b_id,
        score,
        razon,
        status
      `)
      .eq('profile_a_id', perfil.id)
      .eq('status', 'enviado')
      .order('created_at', { ascending: true })

    if (!matches || matches.length === 0) {
      console.warn('No hay matches enviados para:', perfil.id)
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response><Message>No encontré conexiones pendientes para ti. Escríbeme cuando quieras y reviso de nuevo. 🔍</Message></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }

    const matchSeleccionado = matches[letraIndex]
    if (!matchSeleccionado) {
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response><Message>No encontré esa opción. Responde *ASI*, *BSI* o *CSI* para aceptar.</Message></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }

    if (!acepto) {
      // Usuario rechazó — actualizar status
      await supabase
        .from('ia_matches')
        .update({ status: 'rechazado', updated_at: new Date().toISOString() })
        .eq('id', matchSeleccionado.id)

      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response><Message>Entendido, no hay problema. Si en algún momento cambias de opinión, avísame. 🙌</Message></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }

    // Usuario aceptó — marcar como aceptado_a (espera que B también acepte)
    await supabase
      .from('ia_matches')
      .update({ status: 'aceptado_a', updated_at: new Date().toISOString() })
      .eq('id', matchSeleccionado.id)

    const profileBId = matchSeleccionado.profile_b_id
    if (!profileBId) {
      console.error('Match sin profile_b_id:', matchSeleccionado.id)
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response><Message>¡Perfecto! Voy a confirmar con la otra persona y te aviso. 🤝</Message></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }

    // Buscar datos del perfil B para hacer la intro
    const { data: perfilB } = await supabase
      .from('ia_call_profiles')
      .select(`
        id,
        contacto_nombre,
        nombre_negocio,
        lead_id
      `)
      .eq('id', profileBId)
      .single()

    if (!perfilB) {
      console.error('No se encontró perfil B:', profileBId)
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response><Message>¡Perfecto! Voy a confirmar con la otra persona y te aviso. 🤝</Message></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }

    // Buscar teléfono de B
    const { data: submissionB } = await supabase
      .from('ia_form_submissions')
      .select('telefono, nombre_completo')
      .eq('id', perfilB.lead_id)
      .single()

    if (!submissionB?.telefono) {
      console.error('No se encontró teléfono de B')
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>
        <Response><Message>¡Perfecto! Voy a confirmar con la otra persona y te aviso. 🤝</Message></Response>`,
        { headers: { 'Content-Type': 'text/xml' } }
      )
    }

    // Buscar datos de A para la intro
    const { data: submissionA } = await supabase
      .from('ia_form_submissions')
      .select('nombre_completo')
      .eq('id', submission.id)
      .single()

    const { data: perfilA } = await supabase
      .from('ia_call_profiles')
      .select('contacto_nombre, nombre_negocio')
      .eq('id', perfil.id)
      .single()

    // Hacer la intro directamente (flujo simplificado sin esperar opt-in de B)
    // En producción aquí harías doble opt-in completo
    await enviarIntroGrupal(
      telefono,
      perfilA?.contacto_nombre || submissionA?.nombre_completo || null,
      perfilA?.nombre_negocio || null,
      submissionB.telefono,
      perfilB.contacto_nombre || submissionB.nombre_completo || null,
      perfilB.nombre_negocio || null,
      matchSeleccionado.razon ?? ''
    )

    // Marcar match como concretado
    await supabase
      .from('ia_matches')
      .update({ status: 'concretado', updated_at: new Date().toISOString() })
      .eq('id', matchSeleccionado.id)

    // TwiML vacío — ya enviamos los mensajes con la API
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response></Response>`,
      { headers: { 'Content-Type': 'text/xml' } }
    )
  } catch (error) {
    console.error('Error en webhook WhatsApp:', error)
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
      <Response><Message>Hubo un error. Intenta de nuevo en un momento.</Message></Response>`,
      { headers: { 'Content-Type': 'text/xml' } }
    )
  }
}
