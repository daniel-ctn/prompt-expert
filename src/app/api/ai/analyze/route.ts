import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";
import { trackUsage } from "@/lib/track-usage";
import { getUserApiKey } from "@/lib/actions/api-keys";
import { SYSTEM_PROMPT_ANALYZER } from "@/config/prompts";
import { hasCredits, deductCredit } from "@/lib/credits";
import { CREDIT_COSTS } from "@/config/plans";
import type { AIProvider } from "@/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } = rateLimit({ key: `ai:${session.user.id}`, limit: 20, windowMs: 60_000 });
  if (!success) {
    return Response.json({ error: "Too many requests. Please wait a moment." }, { status: 429 });
  }

  const canProceed = await hasCredits(session.user.id, CREDIT_COSTS.analyze);
  if (!canProceed) {
    return Response.json(
      { error: "insufficient_credits", message: "You've run out of credits. Upgrade your plan or buy more." },
      { status: 403 },
    );
  }

  const { prompt }: { prompt: string } = await req.json();

  if (!prompt?.trim()) {
    return Response.json({ error: "Prompt is required" }, { status: 400 });
  }

  const userKey = await getUserApiKey(session.user.id, "openai");
  const userKeys: Partial<Record<AIProvider, string>> = {};
  if (userKey) userKeys.openai = userKey;

  await deductCredit(session.user.id, CREDIT_COSTS.analyze, "Analyze prompt (gpt-4.1-mini)");
  trackUsage(session.user.id, "analyze", "gpt-4.1-mini");

  const { text } = await generateText({
    model: getModel("gpt-4.1-mini", userKeys),
    system: SYSTEM_PROMPT_ANALYZER,
    prompt: `Analyze this prompt:\n\n${prompt}`,
    temperature: 0.3,
  });

  try {
    const analysis = JSON.parse(text);
    return Response.json(analysis);
  } catch {
    return Response.json(
      { error: "Failed to parse analysis" },
      { status: 500 },
    );
  }
}
