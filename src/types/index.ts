export type PromptCategory =
  | "instruction"
  | "creative"
  | "code"
  | "analysis"
  | "qa"
  | "conversation";

export type ToneStyle =
  | "formal"
  | "casual"
  | "technical"
  | "creative"
  | "concise"
  | "detailed";

export type OutputFormat =
  | "text"
  | "json"
  | "markdown"
  | "list"
  | "code"
  | "table";

export type AIModel =
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "claude-opus-4-6"
  | "claude-sonnet-4-6"
  | "gemini-2.5-pro"
  | "gemini-2.5-flash";

export type AIProvider = "openai" | "anthropic" | "google";

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
  tags: string[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptVersion {
  id: string;
  promptId: string;
  content: string;
  settings: PromptSettings;
  versionNumber: number;
  createdAt: Date;
}
