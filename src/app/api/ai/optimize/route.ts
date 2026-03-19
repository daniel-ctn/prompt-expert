import { streamText } from "ai";
import { getModel } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { trackUsage } from "@/lib/track-usage";
import { SYSTEM_PROMPT_OPTIMIZER } from "@/config/prompts";
import type { AIModel } from "@/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = rateLimit({ key: `ai:${session.user.id}`, limit: 20, windowMs: 60_000 });
  if (!success) {
    return Response.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  const { prompt, model = "gpt-4.1-mini" }: { prompt: string; model?: AIModel } =
    await req.json();

  if (!prompt?.trim()) {
    return Response.json({ error: "Prompt is required" }, { status: 400 });
  }

  trackUsage(session.user.id, "optimize", model);

  const result = streamText({
    model: getModel(model),
    system: SYSTEM_PROMPT_OPTIMIZER,
    prompt: `Optimize this prompt:\n\n${prompt}`,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
