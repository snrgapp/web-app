/**
 * OTP de 6 dígitos para login de miembros.
 * Usa Redis (Upstash) para almacenar códigos con TTL.
 */

import { Redis } from '@upstash/redis'

const OTP_TTL_SECONDS = 300 // 5 minutos
const OTP_PREFIX = 'member_otp:'

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

export function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

export function otpKey(phone: string): string {
  const normalized = phone.replace(/\D/g, '').trim()
  return `${OTP_PREFIX}${normalized}`
}

export async function setOtp(phone: string, code: string): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false
  const key = otpKey(phone)
  await redis.set(key, code, { ex: OTP_TTL_SECONDS })
  return true
}

export async function verifyOtp(phone: string, code: string): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return false
  const key = otpKey(phone)
  const stored = await redis.get<string>(key)
  if (!stored || stored !== code) return false
  await redis.del(key)
  return true
}
