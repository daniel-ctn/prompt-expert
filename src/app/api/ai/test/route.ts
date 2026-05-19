import { streamText } from 'ai'
import { getModel, getProviderForModel } from '@/lib/ai'
import { auth } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'
import { trackUsage } from '@/lib/track-usage'
import { getUserApiKey } from '@/lib/actions/api-keys'
import { savePromptHistory } from '@/lib/actions/prompt-history'
import { logAiRequest } from '@/lib/ai/logging'
import { readJsonBodyWithLimit } from '@/lib/ai/request-body'
import { authorizeAiUsage } from '@/lib/ai/usage-policy'
import { CREDIT_COSTS, HOSTED_AI_LIMITS } from '@/config/plans'
import type { AIModel, AIProvider } from '@/types'
import { z } from 'zod'

const testRequestSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(1, 'Prompt is required')
    .max(HOSTED_AI_LIMITS.maxPromptInputLength, 'Prompt is too long'),
  model: z
    .enum(['gpt-5.4-mini', 'gemini-2.5-flash', 'claude-sonnet-4-6'])
    .default('gpt-5.4-mini'),
  temperature: z.number().min(0).max(2).default(0.7),
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

  const parsed = testRequestSchema.safeParse(body.data)
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
      { status: 400 },
    )
  }

  const { prompt, model, temperature } = parsed.data as {
    prompt: string
    model: AIModel
    temperature: number
  }
  const provider = getProviderForModel(model)
  const userKey = await getUserApiKey(session.user.id, provider)
  const userKeys: Partial<Record<AIProvider, string>> = {}
  if (userKey) userKeys[provider] = userKey

  const userId = session.user.id
  const usage = await authorizeAiUsage({
    userId,
    cost: CREDIT_COSTS.test,
    description: `Test prompt (${model})`,
    hasUserKey: !!userKey,
  })
  if (!usage.ok) {
    logAiRequest({
      userId,
      endpoint: 'test',
      model,
      provider,
      hosted: !userKey,
      promptLength: prompt.length,
      status: 'rejected',
      reason: usage.body.error,
    })
    return Response.json(usage.body, { status: usage.status })
  }

  logAiRequest({
    userId,
    endpoint: 'test',
    model,
    provider,
    hosted: usage.hosted,
    promptLength: prompt.length,
    status: 'accepted',
  })
  trackUsage(userId, 'test', model)

  const isClaudeModel = model.startsWith('claude-')

  const result = streamText({
    model: getModel(model, userKeys),
    prompt,
    maxOutputTokens: HOSTED_AI_LIMITS.maxOutputTokens.test,
    ...(isClaudeModel ? {} : { temperature }),
    onFinish: ({ text }) => {
      savePromptHistory(userId, {
        promptContent: prompt,
        output: text,
        model,
        endpoint: 'test',
      })
    },
  })

  return result.toTextStreamResponse()
}
