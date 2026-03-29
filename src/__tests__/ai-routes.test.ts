import { beforeEach, describe, expect, it, vi } from 'vitest'
import { CREDIT_COSTS } from '@/config/plans'

const routeMocks = vi.hoisted(() => ({
  auth: vi.fn(),
  rateLimit: vi.fn(),
  hasCredits: vi.fn(),
  deductCredit: vi.fn(),
  getUserApiKey: vi.fn(),
  savePromptHistory: vi.fn(),
  trackUsage: vi.fn(),
  getModel: vi.fn(),
  getProviderForModel: vi.fn(),
  streamText: vi.fn(),
  generateText: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  auth: routeMocks.auth,
}))

vi.mock('@/lib/rate-limit', () => ({
  rateLimit: routeMocks.rateLimit,
}))

vi.mock('@/lib/credits', () => ({
  hasCredits: routeMocks.hasCredits,
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

vi.mock('@/lib/ai', () => ({
  getModel: routeMocks.getModel,
  getProviderForModel: routeMocks.getProviderForModel,
}))

vi.mock('ai', () => ({
  streamText: routeMocks.streamText,
  generateText: routeMocks.generateText,
}))

import { POST as analyzePOST } from '@/app/api/ai/analyze/route'
import { POST as optimizePOST } from '@/app/api/ai/optimize/route'
import { POST as testPromptPOST } from '@/app/api/ai/test/route'

function createPostRequest(path: string, body: unknown): Request {
  return new Request(`http://localhost${path}`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  })
}

function createStreamResponse(body = 'streamed completion'): Response {
  return new Response(body, { status: 200 })
}

describe('AI route handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    routeMocks.auth.mockResolvedValue({ user: { id: 'user-1' } })
    routeMocks.rateLimit.mockReturnValue({ success: true, remaining: 19 })
    routeMocks.hasCredits.mockResolvedValue(true)
    routeMocks.deductCredit.mockResolvedValue(true)
    routeMocks.getUserApiKey.mockResolvedValue(null)
    routeMocks.savePromptHistory.mockResolvedValue(undefined)
    routeMocks.trackUsage.mockResolvedValue(undefined)
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
    routeMocks.generateText.mockResolvedValue({
      text: JSON.stringify({ overall: 8, strengths: [], improvements: [] }),
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

    it('returns 403 when the user has no remaining credits', async () => {
      routeMocks.hasCredits.mockResolvedValue(false)

      const response = await analyzePOST(
        createPostRequest('/api/ai/analyze', { prompt: 'Analyze this' }),
      )

      expect(response.status).toBe(403)
      expect(await response.json()).toEqual({
        error: 'insufficient_credits',
        message: "You've run out of credits. Upgrade your plan or buy more.",
      })
    })

    it('returns 400 when the prompt is blank', async () => {
      const response = await analyzePOST(
        createPostRequest('/api/ai/analyze', { prompt: '   ' }),
      )

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ error: 'Prompt is required' })
    })

    it('analyzes a prompt with the saved OpenAI key and returns parsed JSON', async () => {
      routeMocks.getUserApiKey.mockResolvedValue('user-openai-key')
      routeMocks.generateText.mockResolvedValue({
        text: JSON.stringify({
          overall: 9,
          strengths: ['Clear task'],
          improvements: ['Add constraints'],
        }),
      })

      const response = await analyzePOST(
        createPostRequest('/api/ai/analyze', { prompt: 'Analyze this prompt' }),
      )

      expect(routeMocks.getUserApiKey).toHaveBeenCalledWith('user-1', 'openai')
      expect(routeMocks.getModel).toHaveBeenCalledWith('gpt-5.4-mini', {
        openai: 'user-openai-key',
      })
      expect(routeMocks.deductCredit).toHaveBeenCalledWith(
        'user-1',
        CREDIT_COSTS.analyze,
        'Analyze prompt (gpt-5.4-mini)',
      )
      expect(routeMocks.trackUsage).toHaveBeenCalledWith(
        'user-1',
        'analyze',
        'gpt-5.4-mini',
      )
      expect(response.status).toBe(200)
      expect(await response.json()).toEqual({
        overall: 9,
        strengths: ['Clear task'],
        improvements: ['Add constraints'],
      })
    })

    it('returns 500 when the model does not return valid JSON', async () => {
      routeMocks.generateText.mockResolvedValue({ text: 'not json' })

      const response = await analyzePOST(
        createPostRequest('/api/ai/analyze', { prompt: 'Analyze this prompt' }),
      )

      expect(response.status).toBe(500)
      expect(await response.json()).toEqual({
        error: 'Failed to parse analysis',
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

    it('streams an optimized prompt and records history for non-Claude models', async () => {
      routeMocks.getUserApiKey.mockResolvedValue('user-google-key')

      const response = await optimizePOST(
        createPostRequest('/api/ai/optimize', {
          prompt: 'Make this prompt clearer',
          model: 'gemini-2.5-flash',
        }),
      )

      expect(routeMocks.getProviderForModel).toHaveBeenCalledWith(
        'gemini-2.5-flash',
      )
      expect(routeMocks.getUserApiKey).toHaveBeenCalledWith('user-1', 'google')
      expect(routeMocks.getModel).toHaveBeenCalledWith('gemini-2.5-flash', {
        google: 'user-google-key',
      })
      expect(routeMocks.deductCredit).toHaveBeenCalledWith(
        'user-1',
        CREDIT_COSTS.optimize,
        'Optimize prompt (gemini-2.5-flash)',
      )
      expect(routeMocks.trackUsage).toHaveBeenCalledWith(
        'user-1',
        'optimize',
        'gemini-2.5-flash',
      )

      const options = routeMocks.streamText.mock.calls[0][0]
      expect(options.temperature).toBe(0.7)
      expect(routeMocks.savePromptHistory).toHaveBeenCalledWith('user-1', {
        promptContent: 'Make this prompt clearer',
        output: 'streamed completion',
        model: 'gemini-2.5-flash',
        endpoint: 'optimize',
      })
      expect(response.status).toBe(200)
      expect(await response.text()).toBe('streamed completion')
    })

    it('omits the temperature override for Claude models', async () => {
      await optimizePOST(
        createPostRequest('/api/ai/optimize', {
          prompt: 'Optimize this for Claude',
          model: 'claude-sonnet-4-6',
        }),
      )

      const options = routeMocks.streamText.mock.calls[0][0]
      expect(routeMocks.getProviderForModel).toHaveBeenCalledWith(
        'claude-sonnet-4-6',
      )
      expect(options).not.toHaveProperty('temperature')
    })
  })

  describe('test route', () => {
    it('returns 403 when the user has no credits left', async () => {
      routeMocks.hasCredits.mockResolvedValue(false)

      const response = await testPromptPOST(
        createPostRequest('/api/ai/test', { prompt: 'Test this prompt' }),
      )

      expect(response.status).toBe(403)
      expect(await response.json()).toEqual({
        error: 'insufficient_credits',
        message: "You've run out of credits. Upgrade your plan or buy more.",
      })
    })

    it('returns 400 when the prompt is blank', async () => {
      const response = await testPromptPOST(
        createPostRequest('/api/ai/test', { prompt: '   ' }),
      )

      expect(response.status).toBe(400)
      expect(await response.json()).toEqual({ error: 'Prompt is required' })
    })

    it('uses the requested temperature for non-Claude models', async () => {
      routeMocks.getUserApiKey.mockResolvedValue('user-openai-key')

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
      expect(routeMocks.getModel).toHaveBeenCalledWith('gpt-5.4-mini', {
        openai: 'user-openai-key',
      })
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
          model: 'claude-sonnet-4-6',
          temperature: 1.4,
        }),
      )

      const options = routeMocks.streamText.mock.calls[0][0]
      expect(options).not.toHaveProperty('temperature')
    })
  })
})
