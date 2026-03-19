import type { Metadata } from "next";
import { getUserSystemPrompts } from "@/lib/actions/system-prompts";
import { SystemPromptManager } from "@/components/system-prompts/system-prompt-manager";

export const metadata: Metadata = {
  title: "System Prompts",
  description: "Create and manage reusable system prompt fragments.",
};

export default async function SystemPromptsPage() {
  const systemPrompts = await getUserSystemPrompts();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">System Prompts</h1>
        <p className="mt-1 text-muted-foreground">
          Create reusable system prompt fragments you can insert into any prompt.
        </p>
      </div>
      <SystemPromptManager initialPrompts={systemPrompts} />
    </div>
  );
}
