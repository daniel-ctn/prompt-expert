import { deductCredit } from '@/lib/credits'

export const HOSTED_AI_DISABLED_RESPONSE = {
  error: 'hosted_ai_disabled',
  message:
    'Hosted AI is temporarily unavailable. You can keep building prompts and use your own provider key from Settings.',
} as const

export const INSUFFICIENT_CREDITS_RESPONSE = {
  error: 'insufficient_credits',
  message:
    'You have used your hosted AI allowance for this period. You can keep building prompts or use your own provider key from Settings.',
} as const

export function isHostedAiEnabled(): boolean {
  return process.env.ENABLE_HOSTED_AI !== 'false'
}

export async function authorizeAiUsage({
  userId,
  cost,
  description,
  hasUserKey,
}: {
  userId: string
  cost: number
  description: string
  hasUserKey: boolean
}): Promise<
  | { ok: true; hosted: boolean }
  | { ok: false; status: 403 | 503; body: typeof INSUFFICIENT_CREDITS_RESPONSE }
  | { ok: false; status: 503; body: typeof HOSTED_AI_DISABLED_RESPONSE }
> {
  if (hasUserKey) {
    return { ok: true, hosted: false }
  }

  if (!isHostedAiEnabled()) {
    return { ok: false, status: 503, body: HOSTED_AI_DISABLED_RESPONSE }
  }

  const charged = await deductCredit(userId, cost, description)
  if (!charged) {
    return { ok: false, status: 403, body: INSUFFICIENT_CREDITS_RESPONSE }
  }

  return { ok: true, hosted: true }
}
