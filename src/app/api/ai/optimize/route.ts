import { streamText } from "ai";
import { getModel, getProviderForModel } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { trackUsage } from "@/lib/track-usage";
import { getUserApiKey } from "@/lib/actions/api-keys";
import { savePromptHistory } from "@/lib/actions/prompt-history";
import { SYSTEM_PROMPT_OPTIMIZER } from "@/config/prompts";
import type { AIModel, AIProvider } from "@/types";

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

  const provider = getProviderForModel(model);
  const userKey = await getUserApiKey(session.user.id, provider);
  const userKeys: Partial<Record<AIProvider, string>> = {};
  if (userKey) userKeys[provider] = userKey;

  const userId = session.user.id;
  trackUsage(userId, "optimize", model);

  const result = streamText({
    model: getModel(model, userKeys),
    system: SYSTEM_PROMPT_OPTIMIZER,
    prompt: `Optimize this prompt:\n\n${prompt}`,
    temperature: 0.7,
    onFinish: ({ text }) => {
      savePromptHistory(userId, {
        promptContent: prompt,
        output: text,
        model,
        endpoint: "optimize",
      });
    },
  });

  return result.toTextStreamResponse();
}
