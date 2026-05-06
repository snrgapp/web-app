'use server'

import { isAuthenticated } from '@/app/actions/auth'
import { recomputePerrenqueMatches } from '@/services/perrenque-matching'
import type { RecomputePerrenqueResult } from '@/services/perrenque-matching'

export type PerrenqueRecomputePanelResult =
  | { authorized: false; error: string }
  | ({
      authorized: true
      groqApiKeyConfigured: boolean
    } & RecomputePerrenqueResult)

/** Panel: incremental por defecto; `fullReset` vacía el día activo y recomputa; `matchDay2` regenera día 2 para toda la cohorte. */
export async function ejecutarPerrenqueRecomputeDesdePanel(options?: {
  fullReset?: boolean
  matchDay2?: boolean
}): Promise<PerrenqueRecomputePanelResult> {
  const authed = await isAuthenticated()
  if (!authed) {
    return { authorized: false, error: 'Inicia sesión en el panel para usar esta acción.' }
  }

  const run = options?.matchDay2
    ? await recomputePerrenqueMatches({ matchDay2: true })
    : await recomputePerrenqueMatches({ mode: options?.fullReset ? 'full' : 'incremental' })
  return {
    authorized: true,
    groqApiKeyConfigured: Boolean(process.env.GROQ_API_KEY?.trim()),
    ...run,
  }
}
