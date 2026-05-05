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

/** Solo usuarios con sesión del panel (/panel). Ejecuta el mismo job que el POST cron. */
export async function ejecutarPerrenqueRecomputeDesdePanel(): Promise<PerrenqueRecomputePanelResult> {
  const authed = await isAuthenticated()
  if (!authed) {
    return { authorized: false, error: 'Inicia sesión en el panel para usar esta acción.' }
  }

  const run = await recomputePerrenqueMatches()
  return {
    authorized: true,
    groqApiKeyConfigured: Boolean(process.env.GROQ_API_KEY?.trim()),
    ...run,
  }
}
