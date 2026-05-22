'use server'

import { revalidatePath } from 'next/cache'
import { isAuthenticated } from '@/app/actions/auth'
import {
  recomputeHackathonMatches,
  type RecomputeHackathonResult,
} from '@/services/hackathon-matching'

export type HackathonRecomputePanelResult =
  | { authorized: false; error: string }
  | ({ authorized: true } & RecomputeHackathonResult)

/** Regenera `match_hackaton` para todos los inscritos (misma lógica que tras cada submit). */
export async function ejecutarHackathonRecomputeDesdePanel(): Promise<HackathonRecomputePanelResult> {
  const authed = await isAuthenticated()
  if (!authed) {
    return { authorized: false, error: 'Inicia sesión en el panel para usar esta acción.' }
  }
  const run = await recomputeHackathonMatches()
  revalidatePath('/panel/hackathon')
  return { authorized: true, ...run }
}
