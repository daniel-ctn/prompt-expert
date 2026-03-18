import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PromptCard } from "./prompt-card";

interface PromptListProps {
  prompts: {
    id: string;
    title: string;
    description: string | null;
    category: string;
    content: string;
    tags: string[];
    isPublic: boolean;
    updatedAt: Date;
  }[];
  total: number;
}

export function PromptList({ prompts, total }: PromptListProps) {
  if (prompts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <h3 className="mb-2 text-lg font-semibold">No prompts yet</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Create your first prompt using the builder.
        </p>
        <Button render={<Link href="/builder" />}>
          <Plus className="mr-2 h-4 w-4" />
          Create Prompt
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {total} prompt{total !== 1 ? "s" : ""}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
    </div>
  );
}
