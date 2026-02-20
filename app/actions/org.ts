'use server'

/**
 * Server Action para obtener el org actual (para uso en Client Components).
 * El panel y componentes cliente pueden llamar a getDefaultOrgIdAction()
 * para filtrar queries por organizacion_id.
 */

import { getDefaultOrgId } from '@/lib/org-resolver'

export async function getDefaultOrgIdAction(): Promise<string | null> {
  return getDefaultOrgId()
}
