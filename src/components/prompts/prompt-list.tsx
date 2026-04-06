import { Plus, ChevronLeft, ChevronRight, Search, Sparkles } from 'lucide-react'
import { AppLink, appLinkTransitionTypes } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'
import { PromptCard } from './prompt-card'

interface PromptListProps {
  prompts: {
    id: string
    title: string
    description: string | null
    category: string
    content: string
    tags: string[]
    isPublic: boolean
    updatedAt: Date
  }[]
  total: number
  page: number
  totalPages: number
  hasFilters?: boolean
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
        <div className="page-frame flex flex-col items-center justify-center rounded-[calc(var(--radius-3xl)+2px)] border-dashed p-12 text-center">
          <Search className="text-muted-foreground/50 mb-4 h-10 w-10" />
          <h3 className="mb-2 text-lg font-semibold">No matching prompts</h3>
          <p className="text-muted-foreground mb-4 max-w-sm text-sm">
            Try adjusting your search terms or clearing the filters to see all
            your prompts.
          </p>
          <Button variant="outline" render={<AppLink href="/prompts" />}>
            Clear filters
          </Button>
        </div>
      )
    }

    return (
      <div className="page-frame flex flex-col items-center justify-center rounded-[calc(var(--radius-3xl)+2px)] border-dashed p-12 text-center">
        <Sparkles className="text-muted-foreground/50 mb-4 h-10 w-10" />
        <h3 className="mb-2 text-lg font-semibold">No prompts yet</h3>
        <p className="text-muted-foreground mb-4 max-w-sm text-sm">
          Get started by creating your first prompt with the builder. Choose a
          template or start from scratch.
        </p>
        <Button
          render={
            <AppLink
              href="/builder"
              transitionTypes={appLinkTransitionTypes.builder}
            />
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Create your first prompt
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="page-frame flex flex-col gap-3 rounded-[calc(var(--radius-3xl)+2px)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="section-label">Library overview</p>
          <p className="text-muted-foreground mt-2 text-sm">
            {total} prompt{total !== 1 ? 's' : ''} in this view
          </p>
        </div>
        <p className="text-muted-foreground text-sm">
          Edit titles, version prompts, and share the ones worth publishing.
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
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
              <AppLink
                href={`/prompts?page=${page - 1}`}
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
                href={`/prompts?page=${page + 1}`}
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
