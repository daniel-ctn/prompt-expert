import { streamText } from "ai";
import { getModel } from "@/lib/ai";
import { SYSTEM_PROMPT_OPTIMIZER } from "@/config/prompts";
import type { AIModel } from "@/types";

export async function POST(req: Request) {
  const { prompt, model = "gpt-4o" }: { prompt: string; model?: AIModel } =
    await req.json();

  if (!prompt?.trim()) {
    return Response.json({ error: "Prompt is required" }, { status: 400 });
  }

  const result = streamText({
    model: getModel(model),
    system: SYSTEM_PROMPT_OPTIMIZER,
    prompt: `Optimize this prompt:\n\n${prompt}`,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
