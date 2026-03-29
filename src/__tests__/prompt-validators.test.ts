import { describe, expect, it } from 'vitest'
import {
  createPromptSchema,
  promptBuilderSchema,
  promptSettingsSchema,
  updatePromptSchema,
} from '@/lib/validators/prompt'

describe('promptSettingsSchema', () => {
  it('accepts valid settings', () => {
    const result = promptSettingsSchema.safeParse({
      model: 'gpt-5.4-mini',
      category: 'instruction',
      tone: 'technical',
      outputFormat: 'markdown',
      includeExamples: true,
      maxLength: 500,
      temperature: 0.8,
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid model and temperature values', () => {
    const result = promptSettingsSchema.safeParse({
      model: 'gpt-4',
      category: 'instruction',
      tone: 'technical',
      outputFormat: 'markdown',
      includeExamples: true,
      temperature: 3,
    })

    expect(result.success).toBe(false)
  })
})

describe('promptBuilderSchema', () => {
  it('applies defaults for optional builder fields', () => {
    const result = promptBuilderSchema.parse({
      task: 'Summarize this changelog',
      settings: {
        model: 'gpt-5.4-mini',
        category: 'analysis',
        tone: 'concise',
        outputFormat: 'text',
        includeExamples: false,
      },
    })

    expect(result.role).toBe('')
    expect(result.context).toBe('')
    expect(result.constraints).toEqual([])
  })

  it('rejects empty tasks and too many constraints', () => {
    const result = promptBuilderSchema.safeParse({
      task: '',
      constraints: Array.from(
        { length: 11 },
        (_, index) => `Constraint ${index}`,
      ),
      settings: {
        model: 'gpt-5.4-mini',
        category: 'analysis',
        tone: 'concise',
        outputFormat: 'text',
        includeExamples: false,
      },
    })

    expect(result.success).toBe(false)
  })
})

describe('createPromptSchema', () => {
  it('applies defaults for tags and visibility', () => {
    const result = createPromptSchema.parse({
      title: 'Support assistant',
      category: 'instruction',
      content: 'Help the user troubleshoot login issues.',
      settings: {
        model: 'gpt-5.4-mini',
        category: 'instruction',
        tone: 'formal',
        outputFormat: 'text',
        includeExamples: false,
      },
    })

    expect(result.tags).toEqual([])
    expect(result.isPublic).toBe(false)
  })

  it('rejects prompts with too many tags or content that is too long', () => {
    const result = createPromptSchema.safeParse({
      title: 'Oversized prompt',
      category: 'instruction',
      content: 'x'.repeat(10_001),
      tags: Array.from({ length: 11 }, (_, index) => `tag-${index}`),
      settings: {
        model: 'gpt-5.4-mini',
        category: 'instruction',
        tone: 'formal',
        outputFormat: 'text',
        includeExamples: false,
      },
    })

    expect(result.success).toBe(false)
  })
})

describe('updatePromptSchema', () => {
  it('allows partial updates when a valid id is provided', () => {
    const result = updatePromptSchema.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      title: 'Refined title',
    })

    expect(result.success).toBe(true)
  })

  it('rejects invalid ids', () => {
    const result = updatePromptSchema.safeParse({
      id: 'not-a-uuid',
      title: 'Refined title',
    })

    expect(result.success).toBe(false)
  })
})
