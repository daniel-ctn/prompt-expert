import type {
  AIModel,
  AIProvider,
  OutputFormat,
  PromptCategory,
  ToneStyle,
} from "@/types";

export const APP_NAME = "Prompt Expert";
export const APP_DESCRIPTION =
  "Create efficient, optimized prompts for any AI model";

export const AI_MODELS: { value: AIModel; label: string; provider: AIProvider }[] = [
  { value: "gpt-4.1", label: "GPT-4.1", provider: "openai" },
  { value: "gpt-4.1-mini", label: "GPT-4.1 Mini", provider: "openai" },
  { value: "claude-opus-4-6", label: "Claude Opus 4.6", provider: "anthropic" },
  { value: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", provider: "anthropic" },
  { value: "gemini-2.5-pro", label: "Gemini 2.5 Pro", provider: "google" },
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash", provider: "google" },
];

export const PROMPT_CATEGORIES: { value: PromptCategory; label: string; description: string }[] = [
  { value: "instruction", label: "Instruction", description: "Step-by-step tasks and commands" },
  { value: "creative", label: "Creative", description: "Writing, brainstorming, and ideation" },
  { value: "code", label: "Code", description: "Programming and technical tasks" },
  { value: "analysis", label: "Analysis", description: "Data analysis and interpretation" },
  { value: "qa", label: "Q&A", description: "Question answering and information retrieval" },
  { value: "conversation", label: "Conversation", description: "Dialogue and chat interactions" },
];

export const TONE_STYLES: { value: ToneStyle; label: string }[] = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "technical", label: "Technical" },
  { value: "creative", label: "Creative" },
  { value: "concise", label: "Concise" },
  { value: "detailed", label: "Detailed" },
];

export const OUTPUT_FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "text", label: "Plain Text" },
  { value: "json", label: "JSON" },
  { value: "markdown", label: "Markdown" },
  { value: "list", label: "Bullet List" },
  { value: "code", label: "Code Block" },
  { value: "table", label: "Table" },
];

export const DEFAULT_PROMPT_SETTINGS = {
  model: "gpt-4.1-mini" as AIModel,
  category: "instruction" as PromptCategory,
  tone: "formal" as ToneStyle,
  outputFormat: "text" as OutputFormat,
  includeExamples: false,
  temperature: 0.7,
} as const;
