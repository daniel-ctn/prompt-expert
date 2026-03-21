import { z } from 'zod/v4';

const promptCategories = [
  'instruction',
  'creative',
  'code',
  'analysis',
  'qa',
  'conversation',
] as const;

const toneStyles = [
  'formal',
  'casual',
  'technical',
  'creative',
  'concise',
  'detailed',
] as const;

const outputFormats = [
  'text',
  'json',
  'markdown',
  'list',
  'code',
  'table',
] as const;

const aiModels = [
  'gpt-4.1',
  'gpt-4.1-mini',
  'claude-opus-4-6',
  'claude-sonnet-4-6',
  'gemini-2.5-pro',
  'gemini-2.5-flash',
] as const;

export const promptSettingsSchema = z.object({
  model: z.enum(aiModels),
  category: z.enum(promptCategories),
  tone: z.enum(toneStyles),
  outputFormat: z.enum(outputFormats),
  maxLength: z.number().int().positive().optional(),
  includeExamples: z.boolean(),
  temperature: z.number().min(0).max(2).optional(),
});

export const createPromptSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(500).optional(),
  category: z.enum(promptCategories),
  content: z.string().min(1, 'Prompt content is required').max(10000),
  settings: promptSettingsSchema,
  tags: z.array(z.string().max(50)).max(10).default([]),
  isPublic: z.boolean().default(false),
});

export const updatePromptSchema = createPromptSchema.partial().extend({
  id: z.string().uuid(),
});

export const promptBuilderSchema = z.object({
  role: z.string().max(500).default(''),
  context: z.string().max(2000).default(''),
  task: z.string().min(1, 'Task description is required').max(2000),
  constraints: z.array(z.string().max(200)).max(10).default([]),
  settings: promptSettingsSchema,
});

export type CreatePromptInput = z.infer<typeof createPromptSchema>;
export type UpdatePromptInput = z.infer<typeof updatePromptSchema>;
export type PromptBuilderInput = z.infer<typeof promptBuilderSchema>;
