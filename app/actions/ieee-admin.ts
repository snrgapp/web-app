'use server'

import { revalidatePath } from 'next/cache'
import { isAuthenticated } from '@/app/actions/auth'
import {
  recomputeIeeeMatches,
  type RecomputeIeeeResult,
} from '@/services/ieee-matching'

export type IeeeRecomputePanelResult =
  | { authorized: false; error: string }
  | ({ authorized: true } & RecomputeIeeeResult)

/** Regenera `match_ieee` para todos los inscritos (misma lógica que tras cada submit del formulario). */
export async function ejecutarIeeeRecomputeDesdePanel(): Promise<IeeeRecomputePanelResult> {
  const authed = await isAuthenticated()
  if (!authed) {
    return { authorized: false, error: 'Inicia sesión en el panel para usar esta acción.' }
  }
  const run = await recomputeIeeeMatches()
  revalidatePath('/panel/ieee-networking')
  return { authorized: true, ...run }
}
