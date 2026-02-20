/**
 * Helpers para sesión que pueden ejecutarse en Edge Runtime (middleware).
 * Solo valida formato; la verificación criptográfica se hace en API routes (Node).
 */

export const COOKIE_NAME = 'member_session'

export function getCookieName(): string {
  return COOKIE_NAME
}

/** Verifica si el token tiene formato plausible (base64.signature). Sin verificación criptográfica. */
export function hasValidSessionFormat(token: string): boolean {
  if (!token || typeof token !== 'string') return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [encoded, sig] = parts
  if (!encoded || !sig) return false
  if (encoded.length < 10 || sig.length !== 64) return false
  return true
}
