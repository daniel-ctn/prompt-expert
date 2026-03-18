import { streamText } from "ai";
import { getModel } from "@/lib/ai";
import { SYSTEM_PROMPT_ASSEMBLER } from "@/config/prompts";
import type { AIModel } from "@/types";

export async function POST(req: Request) {
  const body = await req.json();
  const { role, context, task, constraints, settings } = body as {
    role: string;
    context: string;
    task: string;
    constraints: string[];
    settings: {
      model: AIModel;
      tone: string;
      outputFormat: string;
      includeExamples: boolean;
      temperature?: number;
    };
  };

  if (!task?.trim()) {
    return Response.json(
      { error: "Task description is required" },
      { status: 400 },
    );
  }

  const structuredInput = [
    role && `Role: ${role}`,
    context && `Context: ${context}`,
    `Task: ${task}`,
    constraints.length > 0 &&
      `Constraints:\n${constraints.map((c) => `- ${c}`).join("\n")}`,
    `Tone: ${settings.tone}`,
    `Output Format: ${settings.outputFormat}`,
    settings.includeExamples && "Include examples in the prompt",
  ]
    .filter(Boolean)
    .join("\n\n");

  const result = streamText({
    model: getModel(settings.model),
    system: SYSTEM_PROMPT_ASSEMBLER,
    prompt: `Assemble a prompt from these structured inputs:\n\n${structuredInput}`,
    temperature: settings.temperature ?? 0.7,
  });

  return result.toTextStreamResponse();
}
