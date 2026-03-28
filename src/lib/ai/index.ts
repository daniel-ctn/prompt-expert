import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import type { AIModel, AIProvider } from '@/types'

const MODEL_MAP: Record<AIModel, { provider: AIProvider; modelId: string }> = {
  'gpt-5.4-mini': { provider: 'openai', modelId: 'gpt-5.4-mini' },
  'gpt-5.2-mini': { provider: 'openai', modelId: 'gpt-5.2-mini' },
  'gemini-3.0-flash': { provider: 'google', modelId: 'gemini-3.0-flash' },
}

function getProviderInstance(
  provider: AIProvider,
  userKeys?: Partial<Record<AIProvider, string>>,
) {
  switch (provider) {
    case 'openai':
      return createOpenAI({
        apiKey: userKeys?.openai ?? process.env.OPENAI_API_KEY,
      })
    case 'google':
      return createGoogleGenerativeAI({
        apiKey: userKeys?.google ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      })
  }
}

export function getModel(
  model: AIModel,
  userKeys?: Partial<Record<AIProvider, string>>,
) {
  const config = MODEL_MAP[model]
  const provider = getProviderInstance(config.provider, userKeys)
  return provider(config.modelId)
}

export function getProviderForModel(model: AIModel): AIProvider {
  return MODEL_MAP[model].provider
}

export function assemblePrompt({
  role,
  context,
  task,
  constraints,
  tone,
  outputFormat,
  includeExamples,
}: {
  role: string
  context: string
  task: string
  constraints: string[]
  tone: string
  outputFormat: string
  includeExamples: boolean
}): string {
  const parts: string[] = []

  if (role) {
    parts.push(`You are ${role}.`)
  }

  if (context) {
    parts.push(`\nContext:\n${context}`)
  }

  parts.push(`\nTask:\n${task}`)

  if (constraints.length > 0) {
    parts.push(`\nConstraints:\n${constraints.map((c) => `- ${c}`).join('\n')}`)
  }

  if (tone) {
    parts.push(`\nTone: ${tone}`)
  }

  if (outputFormat && outputFormat !== 'text') {
    const formatInstructions: Record<string, string> = {
      json: 'Respond in valid JSON format.',
      markdown: 'Format your response in Markdown.',
      list: 'Respond with a bullet-point list.',
      code: 'Respond with code only, inside a code block.',
      table: 'Format your response as a table.',
    }
    parts.push(`\nOutput Format: ${formatInstructions[outputFormat] ?? ''}`)
  }

  if (includeExamples) {
    parts.push(
      '\nPlease include relevant examples to illustrate your response.',
    )
  }

  return parts.join('\n')
}
