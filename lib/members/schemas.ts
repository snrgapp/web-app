import { z } from 'zod'

export const loginSchema = z.object({
  phone: z.string().min(8, 'Teléfono inválido').max(20),
  code: z.string().length(6, 'Código inválido').regex(/^\d+$/, 'Solo dígitos'),
})

export const inviteCafeSchema = z.object({
  connectedMemberId: z.string().uuid(),
})

export const registerEventSchema = z.object({
  eventId: z.string().uuid(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type InviteCafeInput = z.infer<typeof inviteCafeSchema>
export type RegisterEventInput = z.infer<typeof registerEventSchema>
