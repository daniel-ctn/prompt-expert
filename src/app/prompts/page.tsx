import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getUserPrompts } from "@/lib/actions/prompt";
import { PromptFilters } from "@/components/prompts/prompt-filters";
import { PromptList } from "@/components/prompts/prompt-list";

export const metadata: Metadata = {
  title: "My Prompts - Prompt Expert",
  description: "Manage your saved prompts.",
};

export default async function PromptsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const params = await searchParams;
  const { prompts, total } = await getUserPrompts({
    search: params.search,
    category: params.category,
    page: params.page ? parseInt(params.page) : 1,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Prompts</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and organize your saved prompts.
          </p>
        </div>
        <Button render={<Link href="/builder" />}>
          <Plus className="mr-2 h-4 w-4" />
          New Prompt
        </Button>
      </div>

      <div className="space-y-6">
        <PromptFilters />
        <PromptList prompts={prompts} total={total} />
      </div>
    </div>
  );
}
