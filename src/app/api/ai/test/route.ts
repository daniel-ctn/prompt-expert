import { streamText } from "ai";
import { getModel } from "@/lib/ai";
import { auth } from "@/lib/auth";
import type { AIModel } from "@/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    prompt,
    model = "gpt-4.1-mini",
    temperature = 0.7,
  }: {
    prompt: string;
    model?: AIModel;
    temperature?: number;
  } = await req.json();

  if (!prompt?.trim()) {
    return Response.json({ error: "Prompt is required" }, { status: 400 });
  }

  const result = streamText({
    model: getModel(model),
    prompt,
    temperature,
  });

  return result.toTextStreamResponse();
}
