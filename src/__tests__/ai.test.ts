import { beforeEach, describe, expect, it, vi } from 'vitest'

const providerMocks = vi.hoisted(() => {
  const openaiProvider = vi.fn((modelId: string) => ({
    provider: 'openai',
    modelId,
  }))
  const googleProvider = vi.fn((modelId: string) => ({
    provider: 'google',
    modelId,
  }))
  const anthropicProvider = vi.fn((modelId: string) => ({
    provider: 'anthropic',
    modelId,
  }))

  return {
    openaiProvider,
    googleProvider,
    anthropicProvider,
    createOpenAI: vi.fn(() => openaiProvider),
    createGoogleGenerativeAI: vi.fn(() => googleProvider),
    createAnthropic: vi.fn(() => anthropicProvider),
  }
})

vi.mock('@ai-sdk/openai', () => ({
  createOpenAI: providerMocks.createOpenAI,
}))

vi.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: providerMocks.createGoogleGenerativeAI,
}))

vi.mock('@ai-sdk/anthropic', () => ({
  createAnthropic: providerMocks.createAnthropic,
}))

import { assemblePrompt, getModel, getProviderForModel } from '@/lib/ai'

describe('getProviderForModel', () => {
  it.each([
    ['gpt-5.4-mini', 'openai'],
    ['gemini-2.5-flash', 'google'],
    ['claude-sonnet-4-6', 'anthropic'],
  ] as const)('returns %s provider as %s', (model, provider) => {
    expect(getProviderForModel(model)).toBe(provider)
  })
})

describe('getModel', () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.clearAllMocks()
    process.env = { ...originalEnv }
    delete process.env.OPENAI_API_KEY
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY
    delete process.env.ANTHROPIC_API_KEY
  })

  it('uses the OpenAI environment key when no user key is provided', () => {
    process.env.OPENAI_API_KEY = 'openai-env-key'

    const model = getModel('gpt-5.4-mini')

    expect(providerMocks.createOpenAI).toHaveBeenCalledWith({
      apiKey: 'openai-env-key',
    })
    expect(providerMocks.openaiProvider).toHaveBeenCalledWith('gpt-5.4-mini')
    expect(model).toEqual({
      provider: 'openai',
      modelId: 'gpt-5.4-mini',
    })
  })

  it('prefers a user-supplied Google key over the environment key', () => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = 'google-env-key'

    const model = getModel('gemini-2.5-flash', {
      google: 'google-user-key',
    })

    expect(providerMocks.createGoogleGenerativeAI).toHaveBeenCalledWith({
      apiKey: 'google-user-key',
    })
    expect(providerMocks.googleProvider).toHaveBeenCalledWith(
      'gemini-2.5-flash',
    )
    expect(model).toEqual({
      provider: 'google',
      modelId: 'gemini-2.5-flash',
    })
  })

  it('uses the Anthropic environment key for Claude models', () => {
    process.env.ANTHROPIC_API_KEY = 'anthropic-env-key'

    const model = getModel('claude-sonnet-4-6')

    expect(providerMocks.createAnthropic).toHaveBeenCalledWith({
      apiKey: 'anthropic-env-key',
    })
    expect(providerMocks.anthropicProvider).toHaveBeenCalledWith(
      'claude-sonnet-4-6',
    )
    expect(model).toEqual({
      provider: 'anthropic',
      modelId: 'claude-sonnet-4-6',
    })
  })
})

describe('assemblePrompt', () => {
  it('builds a minimal prompt with just a task', () => {
    const result = assemblePrompt({
      role: '',
      context: '',
      task: 'Summarize this article',
      constraints: [],
      tone: '',
      outputFormat: 'text',
      includeExamples: false,
    })

    expect(result).toContain('Task:')
    expect(result).toContain('Summarize this article')
    expect(result).not.toContain('You are')
  })

  it('includes every optional section when provided', () => {
    const result = assemblePrompt({
      role: 'a helpful assistant',
      context: 'This is an onboarding flow for new users.',
      task: 'Answer questions',
      constraints: ['Use TypeScript', 'Follow best practices'],
      tone: 'technical',
      outputFormat: 'markdown',
      includeExamples: true,
    })

    expect(result).toContain('You are a helpful assistant.')
    expect(result).toContain(
      'Context:\nThis is an onboarding flow for new users.',
    )
    expect(result).toContain('Task:\nAnswer questions')
    expect(result).toContain(
      'Constraints:\n- Use TypeScript\n- Follow best practices',
    )
    expect(result).toContain('Tone: technical')
    expect(result).toContain('Output Format: Format your response in Markdown.')
    expect(result).toContain(
      'Please include relevant examples to illustrate your response.',
    )
  })

  it('adds output format instructions for JSON', () => {
    const result = assemblePrompt({
      role: '',
      context: '',
      task: 'List items',
      constraints: [],
      tone: '',
      outputFormat: 'json',
      includeExamples: false,
    })

    expect(result).toContain('Respond in valid JSON format.')
  })

  it.each([
    ['list', 'Respond with a bullet-point list.'],
    ['code', 'Respond with code only, inside a code block.'],
    ['table', 'Format your response as a table.'],
  ] as const)('supports the %s output format', (outputFormat, instruction) => {
    const result = assemblePrompt({
      role: '',
      context: '',
      task: 'Format this response',
      constraints: [],
      tone: '',
      outputFormat,
      includeExamples: false,
    })

    expect(result).toContain(instruction)
  })
})
