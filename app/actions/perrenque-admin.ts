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

/** Panel: por defecto solo asigna quienes no tienen r1+r2. `fullReset` vacía todo y recomputa. */
export async function ejecutarPerrenqueRecomputeDesdePanel(options?: {
  fullReset?: boolean
}): Promise<PerrenqueRecomputePanelResult> {
  const authed = await isAuthenticated()
  if (!authed) {
    return { authorized: false, error: 'Inicia sesión en el panel para usar esta acción.' }
  }

  const run = await recomputePerrenqueMatches({ mode: options?.fullReset ? 'full' : 'incremental' })
  return {
    authorized: true,
    groqApiKeyConfigured: Boolean(process.env.GROQ_API_KEY?.trim()),
    ...run,
  }
}
