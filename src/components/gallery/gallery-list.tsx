import Link from 'next/link';
import { ChevronLeft, ChevronRight, Search, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GalleryCard } from './gallery-card';

interface GalleryListProps {
  prompts: {
    id: string;
    title: string;
    description: string | null;
    category: string;
    content: string;
    tags: string[];
    authorName: string | null;
    authorImage: string | null;
  }[];
  total: number;
  page: number;
  totalPages: number;
  hasFilters?: boolean;
  favoriteIds?: Set<string>;
}

export function GalleryList({
  prompts,
  total,
  page,
  totalPages,
  hasFilters,
  favoriteIds,
}: GalleryListProps) {
  if (prompts.length === 0) {
    if (hasFilters) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <Search className="text-muted-foreground/50 mb-4 h-10 w-10" />
          <h3 className="mb-2 text-lg font-semibold">No matching prompts</h3>
          <p className="text-muted-foreground mb-4 max-w-sm text-sm">
            Try adjusting your search terms or clearing the filters.
          </p>
          <Button variant="outline" render={<Link href="/gallery" />}>
            Clear filters
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
        <Globe className="text-muted-foreground/50 mb-4 h-10 w-10" />
        <h3 className="mb-2 text-lg font-semibold">No public prompts yet</h3>
        <p className="text-muted-foreground mb-4 max-w-sm text-sm">
          Be the first to share a prompt! Make any of your prompts public from
          the builder.
        </p>
        <Button render={<Link href="/builder" />}>Create a prompt</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground text-sm">
        {total} public prompt{total !== 1 ? 's' : ''}
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {prompts.map((prompt) => (
          <GalleryCard
            key={prompt.id}
            prompt={prompt}
            isFavorited={favoriteIds?.has(prompt.id)}
          />
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
                href={`/gallery?page=${page - 1}`}
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
              <Link href={`/gallery?page=${page + 1}`} aria-label="Next page" />
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
