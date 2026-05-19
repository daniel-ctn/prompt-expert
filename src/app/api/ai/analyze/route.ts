import { generateText } from 'ai'
import { getModel } from '@/lib/ai'
import { auth } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { trackUsage } from '@/lib/track-usage'
import { getUserApiKey } from '@/lib/actions/api-keys'
import { SYSTEM_PROMPT_ANALYZER } from '@/config/prompts'
import { logAiRequest } from '@/lib/ai/logging'
import { readJsonBodyWithLimit } from '@/lib/ai/request-body'
import { authorizeAiUsage } from '@/lib/ai/usage-policy'
import { CREDIT_COSTS, HOSTED_AI_LIMITS } from '@/config/plans'
import type { AIProvider } from '@/types'
import { z } from 'zod'

const analyzeRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(HOSTED_AI_LIMITS.maxPromptInputLength, 'Prompt is too long'),
})

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { success } = await rateLimit({
    key: `ai:${session.user.id}`,
    limit: 20,
    windowMs: 60_000,
  })
  if (!success) {
    return Response.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 },
    )
  }

  const body = await readJsonBodyWithLimit(
    req,
    HOSTED_AI_LIMITS.maxRequestBodyBytes,
  )
  if (!body.ok) return body.response

  const parsed = analyzeRequestSchema.safeParse(body.data)
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
      { status: 400 },
    )
  }

  const { prompt } = parsed.data
  const userKey = await getUserApiKey(session.user.id, 'openai')
  const userKeys: Partial<Record<AIProvider, string>> = {}
  if (userKey) userKeys.openai = userKey

  const usage = await authorizeAiUsage({
    userId: session.user.id,
    cost: CREDIT_COSTS.analyze,
    description: 'Analyze prompt (gpt-5.4-mini)',
    hasUserKey: !!userKey,
  })
  if (!usage.ok) {
    logAiRequest({
      userId: session.user.id,
      endpoint: 'analyze',
      model: 'gpt-5.4-mini',
      provider: 'openai',
      hosted: !userKey,
      promptLength: prompt.length,
      status: 'rejected',
      reason: usage.body.error,
    })
    return Response.json(usage.body, { status: usage.status })
  }

  logAiRequest({
    userId: session.user.id,
    endpoint: 'analyze',
    model: 'gpt-5.4-mini',
    provider: 'openai',
    hosted: usage.hosted,
    promptLength: prompt.length,
    status: 'accepted',
  })
  trackUsage(session.user.id, 'analyze', 'gpt-5.4-mini')

  const { text } = await generateText({
    model: getModel('gpt-5.4-mini', userKeys),
    system: SYSTEM_PROMPT_ANALYZER,
    prompt: `Analyze this prompt:\n\n${prompt}`,
    maxOutputTokens: HOSTED_AI_LIMITS.maxOutputTokens.analyze,
    temperature: 0.3,
  })

  try {
    const analysis = JSON.parse(text)
    return Response.json(analysis)
  } catch {
    return Response.json({ error: 'Failed to parse analysis' }, { status: 500 })
  }
}
