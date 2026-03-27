import type { PromptBuilderInput } from '@/lib/validators/prompt';

export type PromptCategory =
  | 'instruction'
  | 'creative'
  | 'code'
  | 'analysis'
  | 'qa'
  | 'conversation';

export type ToneStyle =
  | 'formal'
  | 'casual'
  | 'technical'
  | 'creative'
  | 'concise'
  | 'detailed';

export type OutputFormat =
  | 'text'
  | 'json'
  | 'markdown'
  | 'list'
  | 'code'
  | 'table';

export type AIModel = 'gpt-5.4-mini' | 'gpt-5.2-mini' | 'gemini-3.0-flash';

export type AIProvider = 'openai' | 'google';

export interface PromptSettings {
  model: AIModel;
  category: PromptCategory;
  tone: ToneStyle;
  outputFormat: OutputFormat;
  maxLength?: number;
  includeExamples: boolean;
  temperature?: number;
}

export interface PromptBuilderState {
  role: string;
  context: string;
  task: string;
  constraints: string[];
  settings: PromptSettings;
  generatedPrompt: string;
}

export interface SavedPrompt {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: PromptCategory;
  content: string;
  settings: PromptSettings;
  builderState?: PromptBuilderInput | null;
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavedPromptPreset {
  id: string;
  title: string;
  description: string | null;
  builderState: PromptBuilderInput;
}

export interface PromptVersion {
  id: string;
  promptId: string;
  content: string;
  settings: PromptSettings;
  versionNumber: number;
  createdAt: Date;
}
