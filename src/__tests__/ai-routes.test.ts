import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CREDIT_COSTS } from '@/config/plans'

const routeMocks = vi.hoisted(() => ({
  auth: vi.fn(),
  rateLimit: vi.fn(),
  deductCredit: vi.fn(),
  getUserApiKey: vi.fn(),
  savePromptHistory: vi.fn(),
  trackUsage: vi.fn(),
  logAiRequest: vi.fn(),
  getModel: vi.fn(),
  getProviderForModel: vi.fn(),
  streamText: vi.fn(),
  generateObject: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  auth: routeMocks.auth,
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: routeMocks.rateLimit,
}))

vi.mock('@/lib/credits', () => ({
  deductCredit: routeMocks.deductCredit,
}))

vi.mock('@/lib/actions/api-keys', () => ({
  getUserApiKey: routeMocks.getUserApiKey,
}))

vi.mock('@/lib/actions/prompt-history', () => ({
  savePromptHistory: routeMocks.savePromptHistory,
}))

vi.mock('@/lib/track-usage', () => ({
  trackUsage: routeMocks.trackUsage,
}))

vi.mock('@/lib/ai/logging', () => ({
  logAiRequest: routeMocks.logAiRequest,
}))

vi.mock('@/lib/ai', () => ({
  getModel: routeMocks.getModel,
  getProviderForModel: routeMocks.getProviderForModel,
}))

vi.mock('ai', () => ({
  streamText: routeMocks.streamText,
  generateObject: routeMocks.generateObject,
}))

import { POST as analyzePOST } from '@/app/api/ai/analyze/route'
import { POST as optimizePOST } from '@/app/api/ai/optimize/route'
import { POST as testPromptPOST } from '@/app/api/ai/test/route'

function createPostRequest(path: string, body: unknown): Request {
  const serialized = JSON.stringify(body)
  return new Request(`http://localhost${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'content-length': String(new TextEncoder().encode(serialized).length),
    },
    body: serialized,
  })
}

function createStreamResponse(body = 'streamed completion'): Response {
  return new Response(body, { status: 200 })
}

describe('AI route handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete process.env.ENABLE_HOSTED_AI

    routeMocks.auth.mockResolvedValue({ user: { id: 'user-1' } })
    routeMocks.rateLimit.mockReturnValue({ success: true, remaining: 19 })
    routeMocks.deductCredit.mockResolvedValue(true)
    routeMocks.getUserApiKey.mockResolvedValue(null)
    routeMocks.savePromptHistory.mockResolvedValue(undefined)
    routeMocks.trackUsage.mockResolvedValue(undefined)
    routeMocks.logAiRequest.mockReturnValue(undefined)
    routeMocks.getModel.mockReturnValue('mock-model')
    routeMocks.getProviderForModel.mockImplementation((model: string) => {
      if (model.startsWith('claude-')) return 'anthropic'
      if (model.startsWith('gemini-')) return 'google'
      return 'openai'
    })
    routeMocks.streamText.mockImplementation(({ onFinish }) => {
      onFinish?.({ text: 'streamed completion' })
      return {
        toTextStreamResponse: () => createStreamResponse(),
      }
    })
    routeMocks.generateObject.mockResolvedValue({
      object: {
        scores: {
          clarity: 8,
          specificity: 8,
          structure: 8,
          completeness: 8,
          effectiveness: 8,
        },
        overall: 8,
        strengths: [],
        improvements: [],
      },
    })
  })

  describe('analyze route', () => {
    it('returns 401 when the user is not authenticated', async () => {
      routeMocks.auth.mockResolvedValue(null)

      const response = await analyzePOST(
        createPostRequest('/api/ai/analyze', { prompt: 'Analyze this' }),
      )

      expect(response.status).toBe(401)
      expect(await response.json()).toEqual({ error: 'Unauthorized' })
      expect(routeMocks.rateLimit).not.toHaveBeenCalled()
    })

    it('returns 429 when the user hits the rate limit', async () => {
      routeMocks.rateLimit.mockReturnValue({ success: false, remaining: 0 })

      const response = await analyzePOST(
        createPostRequest('/api/ai/analyze', { prompt: 'Analyze this' }),
      )

      expect(response.status).toBe(429)
      expect(await response.json()).toEqual({
        error: 'Too many requests. Please wait a moment.',
      })
    })

    it('returns 403 when hosted credit deduction fails', async () => {
      routeMocks.deductCredit.mockResolvedValue(false)

      const response = await analyzePOST(
        createPostRequest('/api/ai/analyze', { prompt: 'Analyze this' }),
      )

      expect(response.status).toBe(403)
      expect(await response.json()).toEqual({
        error: 'insufficient_credits',
        message:
          'You have used your hosted AI allowance for this period. You can keep building prompts or use your own provider key from Settings.',
      })
    })

    it('returns 503 when hosted AI is disabled and no BYO key is configured', async () => {
      process.env.ENABLE_HOSTED_AI = 'false'

      const response = await analyzePOST(
        createPostRequest('/api/ai/analyze', { prompt: 'Analyze this' }),
      )

      expect(response.status).toBe(503)
      expect(await response.json()).toEqual({
        error: 'hosted_ai_disabled',
        message:
          'Hosted AI is temporarily unavailable. You can keep building prompts and use your own provider key from Settings.',
      })
      expect(routeMocks.deductCredit).not.toHaveBeenCalled()
      expect(routeMocks.generateObject).not.toHaveBeenCalled()
    })

    it('returns 400 when the prompt is blank', async () => {
      const response = await analyzePOST(
        createPostRequest('/api/ai/analyze', { prompt: '   ' }),
      )

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ error: 'Prompt is required' })
    })

    it('returns 413 when the request body is too large', async () => {
      const response = await analyzePOST(
        createPostRequest('/api/ai/analyze', { prompt: 'x'.repeat(32_001) }),
      )

      expect(response.status).toBe(413)
      expect(await response.json()).toEqual({
        error: 'Request body is too large',
      })
      expect(routeMocks.deductCredit).not.toHaveBeenCalled()
    })

    it('analyzes a prompt with the saved OpenAI key and returns the structured result', async () => {
      routeMocks.getUserApiKey.mockResolvedValue('user-openai-key')
      const analysis = {
        scores: {
          clarity: 9,
          specificity: 8,
          structure: 9,
          completeness: 7,
          effectiveness: 9,
        },
        overall: 9,
        strengths: ['Clear task'],
        improvements: ['Add constraints'],
      }
      routeMocks.generateObject.mockResolvedValue({ object: analysis })

      const response = await analyzePOST(
        createPostRequest('/api/ai/analyze', { prompt: 'Analyze this prompt' }),
      )

      expect(routeMocks.getUserApiKey).toHaveBeenCalledWith('user-1', 'openai')
      expect(routeMocks.getModel).toHaveBeenCalledWith('gpt-5.4-mini', {
        openai: 'user-openai-key',
      })
      expect(routeMocks.deductCredit).not.toHaveBeenCalled()
      expect(routeMocks.trackUsage).toHaveBeenCalledWith(
        'user-1',
        'analyze',
        'gpt-5.4-mini',
      )
      expect(response.status).toBe(200)
      expect(await response.json()).toEqual(analysis)
    })

    it('returns 500 when structured generation fails', async () => {
      routeMocks.generateObject.mockRejectedValue(new Error('no object'))

      const response = await analyzePOST(
        createPostRequest('/api/ai/analyze', { prompt: 'Analyze this prompt' }),
      )

      expect(response.status).toBe(500)
      expect(await response.json()).toEqual({
        error: 'Failed to analyze prompt',
      })
    })
  })

  describe('optimize route', () => {
    it('returns 401 when the user is not authenticated', async () => {
      routeMocks.auth.mockResolvedValue(null)

      const response = await optimizePOST(
        createPostRequest('/api/ai/optimize', { prompt: 'Optimize this' }),
      )

      expect(response.status).toBe(401)
      expect(await response.json()).toEqual({ error: 'Unauthorized' })
    })

    it('returns 400 when the prompt is blank', async () => {
      const response = await optimizePOST(
        createPostRequest('/api/ai/optimize', { prompt: '' }),
      )

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ error: 'Prompt is required' })
    })

    it('streams an optimized prompt and records hosted usage for non-Claude models', async () => {
      const response = await optimizePOST(
        createPostRequest('/api/ai/optimize', {
          prompt: 'Make this prompt clearer',
          model: 'gemini-3-flash-preview',
        }),
      )

      expect(routeMocks.getProviderForModel).toHaveBeenCalledWith(
        'gemini-3-flash-preview',
      )
      expect(routeMocks.getUserApiKey).toHaveBeenCalledWith('user-1', 'google')
      expect(routeMocks.getModel).toHaveBeenCalledWith(
        'gemini-3-flash-preview',
        {},
      )
      expect(routeMocks.deductCredit).toHaveBeenCalledWith(
        'user-1',
        CREDIT_COSTS.optimize,
        'Optimize prompt (gemini-3-flash-preview)',
      )
      expect(routeMocks.trackUsage).toHaveBeenCalledWith(
        'user-1',
        'optimize',
        'gemini-3-flash-preview',
      )

      const options = routeMocks.streamText.mock.calls[0][0]
      expect(options.temperature).toBe(0.7)
      expect(options.maxOutputTokens).toBe(1200)
      expect(routeMocks.savePromptHistory).toHaveBeenCalledWith('user-1', {
        promptContent: 'Make this prompt clearer',
        output: 'streamed completion',
        model: 'gemini-3-flash-preview',
        endpoint: 'optimize',
      })
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('streamed completion')
    })

    it('omits the temperature override for Claude models', async () => {
      await optimizePOST(
        createPostRequest('/api/ai/optimize', {
          prompt: 'Optimize this for Claude',
          model: 'claude-haiku-4-5-20251001',
        }),
      )

      const options = routeMocks.streamText.mock.calls[0][0]
      expect(routeMocks.getProviderForModel).toHaveBeenCalledWith(
        'claude-haiku-4-5-20251001',
      )
      expect(options).not.toHaveProperty('temperature')
    })
  })

  describe('test route', () => {
    it('returns 403 when hosted credit deduction fails', async () => {
      routeMocks.deductCredit.mockResolvedValue(false)

      const response = await testPromptPOST(
        createPostRequest('/api/ai/test', { prompt: 'Test this prompt' }),
      )

      expect(response.status).toBe(403)
      expect(await response.json()).toEqual({
        error: 'insufficient_credits',
        message:
          'You have used your hosted AI allowance for this period. You can keep building prompts or use your own provider key from Settings.',
      })
    })

    it('returns 400 when the prompt is blank', async () => {
      const response = await testPromptPOST(
        createPostRequest('/api/ai/test', { prompt: '   ' }),
      )

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ error: 'Prompt is required' })
    })

    it('uses the requested temperature for hosted non-Claude models', async () => {
      const response = await testPromptPOST(
        createPostRequest('/api/ai/test', {
          prompt: 'Test this prompt',
          model: 'gpt-5.4-mini',
          temperature: 1.1,
        }),
      )

      expect(routeMocks.getProviderForModel).toHaveBeenCalledWith(
        'gpt-5.4-mini',
      )
      expect(routeMocks.getUserApiKey).toHaveBeenCalledWith('user-1', 'openai')
      expect(routeMocks.getModel).toHaveBeenCalledWith('gpt-5.4-mini', {})
      expect(routeMocks.deductCredit).toHaveBeenCalledWith(
        'user-1',
        CREDIT_COSTS.test,
        'Test prompt (gpt-5.4-mini)',
      )
      expect(routeMocks.trackUsage).toHaveBeenCalledWith(
        'user-1',
        'test',
        'gpt-5.4-mini',
      )

      const options = routeMocks.streamText.mock.calls[0][0]
      expect(options.temperature).toBe(1.1)
      expect(options.maxOutputTokens).toBe(1600)
      expect(routeMocks.savePromptHistory).toHaveBeenCalledWith('user-1', {
        promptContent: 'Test this prompt',
        output: 'streamed completion',
        model: 'gpt-5.4-mini',
        endpoint: 'test',
      })
      expect(response.status).toBe(200)
    })

    it('omits the temperature override for Claude models', async () => {
      await testPromptPOST(
        createPostRequest('/api/ai/test', {
          prompt: 'Test this prompt',
          model: 'claude-haiku-4-5-20251001',
          temperature: 1.4,
        }),
      )

      const options = routeMocks.streamText.mock.calls[0][0]
      expect(options).not.toHaveProperty('temperature')
    })

    it('does not deduct hosted credits when a BYO provider key is available', async () => {
      routeMocks.getUserApiKey.mockResolvedValue('user-openai-key')

      const response = await testPromptPOST(
        createPostRequest('/api/ai/test', {
          prompt: 'Test this prompt',
          model: 'gpt-5.4-mini',
        }),
      )

      expect(routeMocks.deductCredit).not.toHaveBeenCalled()
      expect(response.status).toBe(200)
    })
  })
})
