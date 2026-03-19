import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import type { AIModel, AIProvider } from "@/types";

const MODEL_MAP: Record<AIModel, { provider: AIProvider; modelId: string }> = {
  "gpt-4.1": { provider: "openai", modelId: "gpt-4.1" },
  "gpt-4.1-mini": { provider: "openai", modelId: "gpt-4.1-mini" },
  "claude-opus-4-6": { provider: "anthropic", modelId: "claude-opus-4-6" },
  "claude-sonnet-4-6": { provider: "anthropic", modelId: "claude-sonnet-4-6" },
  "gemini-2.5-pro": { provider: "google", modelId: "gemini-2.5-pro" },
  "gemini-2.5-flash": { provider: "google", modelId: "gemini-2.5-flash" },
};

function getProviderInstance(
  provider: AIProvider,
  userKeys?: Partial<Record<AIProvider, string>>,
) {
  switch (provider) {
    case "openai":
      return createOpenAI({
        apiKey: userKeys?.openai ?? process.env.OPENAI_API_KEY,
      });
    case "anthropic":
      return createAnthropic({
        apiKey: userKeys?.anthropic ?? process.env.ANTHROPIC_API_KEY,
      });
    case "google":
      return createGoogleGenerativeAI({
        apiKey: userKeys?.google ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY,
      });
  }
}

export function getModel(
  model: AIModel,
  userKeys?: Partial<Record<AIProvider, string>>,
) {
  const config = MODEL_MAP[model];
  const provider = getProviderInstance(config.provider, userKeys);
  return provider(config.modelId);
}

export function getProviderForModel(model: AIModel): AIProvider {
  return MODEL_MAP[model].provider;
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
