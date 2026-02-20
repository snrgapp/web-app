/**
 * Rate limit con Upstash Redis para login.
 * 5 intentos por IP cada 15 minutos. Si Upstash no está configurado, no bloquea.
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

let ratelimit: Ratelimit | null = null

function getRatelimit(): Ratelimit | null {
  if (ratelimit) return ratelimit
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(5, '15 m'),
    analytics: true,
  })
  return ratelimit
}

/** Verifica e incrementa el rate limit. Retorna true si debe bloquear (demasiados intentos). */
export async function checkLoginRateLimit(identifier: string): Promise<boolean> {
  const rl = getRatelimit()
  if (!rl) return false
  const { success } = await rl.limit(`login:${identifier}`)
  return !success
}
