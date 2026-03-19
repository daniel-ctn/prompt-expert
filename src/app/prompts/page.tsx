import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getUserPrompts } from "@/lib/actions/prompt";
import { PromptFilters } from "@/components/prompts/prompt-filters";
import { PromptList } from "@/components/prompts/prompt-list";
import { ExportImport } from "@/components/prompts/export-import";

export const metadata: Metadata = {
  title: "My Prompts",
  description: "Manage your saved prompts, collections, and prompt versions.",
};

export default async function PromptsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = params.page ? parseInt(params.page) : 1;
  const { prompts, total, totalPages } = await getUserPrompts({
    search: params.search,
    category: params.category,
    page: currentPage,
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">My Prompts</h1>
          <p className="mt-1 text-muted-foreground">
            Manage and organize your saved prompts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ExportImport prompts={prompts} />
          <Button render={<Link href="/builder" />}>
            <Plus className="mr-2 h-4 w-4" />
            New Prompt
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <PromptFilters />
        <PromptList
          prompts={prompts}
          total={total}
          page={currentPage}
          totalPages={totalPages}
          hasFilters={!!(params.search || params.category)}
        />
      </div>
    </div>
  );
}
