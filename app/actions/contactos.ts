'use server'

import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'

export async function createContactoAction(datos: {
  nombre?: string | null
  whatsapp?: string | null
  correo?: string | null
  mensaje: string
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createServerClient()
  if (!supabase) return { success: false, error: 'No se pudo conectar.' }

  if (!datos.mensaje?.trim()) {
    return { success: false, error: 'El mensaje es obligatorio.' }
  }

  const orgId = await getDefaultOrgId()
  if (!orgId) return { success: false, error: 'Configuración no disponible.' }

  const { error } = await supabase.from('contactos').insert({
    nombre: datos.nombre?.trim() || null,
    whatsapp: datos.whatsapp?.trim() || null,
    correo: datos.correo?.trim() || null,
    mensaje: datos.mensaje.trim(),
    organizacion_id: orgId,
  })

  if (error) return { success: false, error: 'No se pudo enviar. Intenta de nuevo.' }
  return { success: true }
}
