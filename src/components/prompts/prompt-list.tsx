import Link from 'next/link';
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  Search,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PromptCard } from './prompt-card';

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
  page: number;
  totalPages: number;
  hasFilters?: boolean;
}

export function PromptList({
  prompts,
  total,
  page,
  totalPages,
  hasFilters,
}: PromptListProps) {
  if (prompts.length === 0) {
    if (hasFilters) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Search className="text-muted-foreground/50 mb-4 h-10 w-10" />
          <h3 className="mb-2 text-lg font-semibold">No matching prompts</h3>
          <p className="text-muted-foreground mb-4 max-w-sm text-sm">
            Try adjusting your search terms or clearing the filters to see all
            your prompts.
          </p>
          <Button variant="outline" render={<Link href="/prompts" />}>
            Clear filters
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Sparkles className="text-muted-foreground/50 mb-4 h-10 w-10" />
        <h3 className="mb-2 text-lg font-semibold">No prompts yet</h3>
        <p className="text-muted-foreground mb-4 max-w-sm text-sm">
          Get started by creating your first prompt with the builder. Choose a
          template or start from scratch.
        </p>
        <Button render={<Link href="/builder" />}>
          <Plus className="mr-2 h-4 w-4" />
          Create your first prompt
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        {total} prompt{total !== 1 ? 's' : ''}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            render={
              <Link
                href={`/prompts?page=${page - 1}`}
                aria-label="Previous page"
              />
            }
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
          <span className="text-muted-foreground px-3 text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            render={
              <Link href={`/prompts?page=${page + 1}`} aria-label="Next page" />
            }
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
