import { sendBirdEmail } from '@/lib/bird-email'

/** Compat: el envío transaccional ahora va por Bird, no por Brevo. */
export async function sendTransactionalEmail(input: {
  to: { email: string; name?: string }[]
  subject: string
  html: string
  text?: string
}): Promise<{ success: boolean; error?: string }> {
  return sendBirdEmail({
    ...input,
    category: 'transactional',
    tags: { product: 'synergy' },
  })
}
