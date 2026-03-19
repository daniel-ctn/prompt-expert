import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicPromptById } from "@/lib/actions/prompt";
import { SharedPromptView } from "@/components/prompts/shared-prompt-view";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const prompt = await getPublicPromptById(id);
  if (!prompt) return { title: "Prompt Not Found" };

  return {
    title: `${prompt.title} - Prompt Expert`,
    description: prompt.description || `A shared prompt on Prompt Expert`,
  };
}

export default async function SharePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = await getPublicPromptById(id);

  if (!prompt) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <SharedPromptView prompt={prompt} />
    </div>
  );
}
