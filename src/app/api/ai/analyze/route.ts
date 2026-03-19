import { generateText } from "ai";
import { getModel } from "@/lib/ai";
import { auth } from "@/lib/auth";
import { SYSTEM_PROMPT_ANALYZER } from "@/config/prompts";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { prompt }: { prompt: string } = await req.json();

  if (!prompt?.trim()) {
    return Response.json({ error: "Prompt is required" }, { status: 400 });
  }

  const { text } = await generateText({
    model: getModel("gpt-4.1-mini"),
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
