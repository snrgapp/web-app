'use server'

import { createServerClient } from '@/utils/supabase/server'
import { getDefaultOrgId } from '@/lib/org-resolver'

export async function createLeadAction(email: string, ciudad?: string | null): Promise<{ success: boolean; error?: string }> {
  const supabase = createServerClient()
  if (!supabase) return { success: false, error: 'No se pudo conectar.' }

  const orgId = await getDefaultOrgId()
  if (!orgId) return { success: false, error: 'Configuración no disponible.' }

  const { error } = await supabase.from('leads').insert({
    email: email.trim().toLowerCase(),
    ciudad: ciudad?.trim() || null,
    organizacion_id: orgId,
  })

  if (error) {
    if (error.code === '23505') return { success: false, error: 'Este correo ya está registrado.' }
    return { success: false, error: 'No se pudo guardar. Intenta de nuevo.' }
  }
  return { success: true }
}
