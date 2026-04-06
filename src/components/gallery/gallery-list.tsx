import { ChevronLeft, ChevronRight, Search, Globe } from 'lucide-react'
import { AppLink, appLinkTransitionTypes } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'
import { GalleryCard } from './gallery-card'

interface GalleryListProps {
  prompts: {
    id: string
    title: string
    description: string | null
    category: string
    content: string
    tags: string[]
    authorName: string | null
    authorImage: string | null
  }[]
  total: number
  page: number
  totalPages: number
  hasFilters?: boolean
  favoriteIds?: Set<string>
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
        <div className="page-frame flex flex-col items-center justify-center rounded-[calc(var(--radius-3xl)+2px)] border-dashed p-12 text-center">
          <Search className="text-muted-foreground/50 mb-4 h-10 w-10" />
          <h3 className="mb-2 text-lg font-semibold">No matching prompts</h3>
          <p className="text-muted-foreground mb-4 max-w-sm text-sm">
            Try adjusting your search terms or clearing the filters.
          </p>
          <Button variant="outline" render={<AppLink href="/gallery" />}>
            Clear filters
          </Button>
        </div>
      )
    }

    return (
      <div className="page-frame flex flex-col items-center justify-center rounded-[calc(var(--radius-3xl)+2px)] border-dashed p-12 text-center">
        <Globe className="text-muted-foreground/50 mb-4 h-10 w-10" />
        <h3 className="mb-2 text-lg font-semibold">No public prompts yet</h3>
        <p className="text-muted-foreground mb-4 max-w-sm text-sm">
          Be the first to share a prompt! Make any of your prompts public from
          the builder.
        </p>
        <Button
          render={
            <AppLink
              href="/builder"
              transitionTypes={appLinkTransitionTypes.builder}
            />
          }
        >
          Create a prompt
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="page-frame flex flex-col gap-3 rounded-[calc(var(--radius-3xl)+2px)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-label">Browse public prompts</p>
          <p className="text-muted-foreground mt-2 text-sm">
            {total} public prompt{total !== 1 ? 's' : ''} in this result set
          </p>
        </div>
        <p className="text-muted-foreground text-sm">
          Preview structure, favorite strong patterns, then fork them into your
          own library.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {prompts.map((prompt, index) => (
          <GalleryCard
            key={prompt.id}
            prompt={prompt}
            isFavorited={favoriteIds?.has(prompt.id)}
            featured={!hasFilters && page === 1 && index < 2}
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
              <AppLink
                href={`/gallery?page=${page - 1}`}
                aria-label="Previous page"
                transitionTypes={appLinkTransitionTypes.paginationPrevious}
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
              <AppLink
                href={`/gallery?page=${page + 1}`}
                aria-label="Next page"
                transitionTypes={appLinkTransitionTypes.paginationNext}
              />
            }
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
