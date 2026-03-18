import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { AIModel, AIProvider } from "@/types";

const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = createAnthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

const MODEL_MAP: Record<AIModel, { provider: AIProvider; modelId: string }> = {
  "gpt-4o": { provider: "openai", modelId: "gpt-4o" },
  "gpt-4o-mini": { provider: "openai", modelId: "gpt-4o-mini" },
  "claude-3.5-sonnet": { provider: "anthropic", modelId: "claude-3-5-sonnet-latest" },
  "claude-3-haiku": { provider: "anthropic", modelId: "claude-3-haiku-20240307" },
  "gemini-2.0-flash": { provider: "google", modelId: "gemini-2.0-flash" },
  "gemini-1.5-pro": { provider: "google", modelId: "gemini-1.5-pro" },
};

export function getModel(model: AIModel) {
  const config = MODEL_MAP[model];
  switch (config.provider) {
    case "openai":
      return openai(config.modelId);
    case "anthropic":
      return anthropic(config.modelId);
    case "google":
      return google(config.modelId);
  }
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
  role: string;
  context: string;
  task: string;
  constraints: string[];
  tone: string;
  outputFormat: string;
  includeExamples: boolean;
}): string {
  const parts: string[] = [];

  if (role) {
    parts.push(`You are ${role}.`);
  }

  if (context) {
    parts.push(`\nContext:\n${context}`);
  }

  parts.push(`\nTask:\n${task}`);

  if (constraints.length > 0) {
    parts.push(
      `\nConstraints:\n${constraints.map((c) => `- ${c}`).join("\n")}`,
    );
  }

  if (tone) {
    parts.push(`\nTone: ${tone}`);
  }

  if (outputFormat && outputFormat !== "text") {
    const formatInstructions: Record<string, string> = {
      json: "Respond in valid JSON format.",
      markdown: "Format your response in Markdown.",
      list: "Respond with a bullet-point list.",
      code: "Respond with code only, inside a code block.",
      table: "Format your response as a table.",
    };
    parts.push(`\nOutput Format: ${formatInstructions[outputFormat] ?? ""}`);
  }

  if (includeExamples) {
    parts.push(
      "\nPlease include relevant examples to illustrate your response.",
    );
  }

  return parts.join("\n");
}
