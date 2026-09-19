'use server'

import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'
import { sendBirdEmail } from '@/lib/bird-email'
import { waitlistConfirmationEmail, waitlistConfirmationText } from '@/lib/lista-espera-emails'

export type ListaEsperaPayload = {
  nombre: string
  email: string
  telefono: string
  empresa: string
  tipoEmpresa: string
  tipoEmpresaOther?: string
  instagram?: string
  linkedin?: string
  website?: string
  arquetipo: string
  buscando: string[]
  camara: string
  ciudad: string
  canalesVenta: string[]
  empleados: string
}

function wordCount(value: string) {
  return value.trim().split(/\s+/).filter(Boolean).length
}

export async function submitListaEsperaAction(
  payload: ListaEsperaPayload
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient()
  if (!supabase) return { success: false, error: 'No se pudo conectar.' }

  const nombre = payload.nombre.trim()
  const email = payload.email.trim().toLowerCase()
  const telefono = payload.telefono.trim()
  const empresa = payload.empresa.trim()
  const ciudad = payload.ciudad.trim()

  if (wordCount(nombre) < 2) return { success: false, error: 'Escribe nombre y apellido.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Correo inválido.' }
  }
  if (telefono.replace(/\D/g, '').length < 10) {
    return { success: false, error: 'WhatsApp inválido.' }
  }
  if (!empresa || !payload.tipoEmpresa || !payload.arquetipo || !payload.camara || !ciudad) {
    return { success: false, error: 'Faltan datos del perfil.' }
  }
  if (!payload.buscando.length || !payload.canalesVenta.length || !payload.empleados) {
    return { success: false, error: 'Completa las preguntas de matching.' }
  }

  const orgId = await getDefaultOrgId()
  const tipoEmpresa =
    payload.tipoEmpresa === 'Otro'
      ? `Otro: ${payload.tipoEmpresaOther?.trim() || ''}`.trim()
      : payload.tipoEmpresa

  const { error } = await supabase.from('lista_espera_ciudades').insert({
    organizacion_id: orgId,
    nombre,
    email,
    telefono,
    empresa,
    tipo_empresa: tipoEmpresa,
    instagram: payload.instagram?.trim() || null,
    linkedin: payload.linkedin?.trim() || null,
    website: payload.website?.trim() || null,
    arquetipo: payload.arquetipo,
    buscando: payload.buscando,
    camara_comercio: payload.camara,
    ciudad,
    canales_venta: payload.canalesVenta,
    empleados: payload.empleados,
  })

  if (error) {
    console.error('lista_espera_ciudades insert', error)
    return { success: false, error: 'No se pudo guardar. Intenta de nuevo.' }
  }

  const mail = await sendBirdEmail({
    to: [{ email, name: nombre }],
    subject: `Ya estás en la lista de Synergy en ${ciudad}`,
    html: waitlistConfirmationEmail({ nombre, ciudad }),
    text: waitlistConfirmationText({ nombre, ciudad }),
    category: 'transactional',
    tags: { product: 'lista-espera', city: ciudad.slice(0, 40) },
  })
  if (!mail.success) {
    console.error('lista_espera confirmation email', mail.error)
  }

  return { success: true }
}
