import type { Metadata } from 'next'
import { Plus } from 'lucide-react'
import { AppLink, appLinkTransitionTypes } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'
import { getUserPrompts } from '@/lib/actions/prompt'
import { PromptFilters } from '@/components/prompts/prompt-filters'
import { PromptList } from '@/components/prompts/prompt-list'
import { ExportImport } from '@/components/prompts/export-import'

export const metadata: Metadata = {
  title: 'My Prompts',
  description: 'Manage your saved prompts, collections, and prompt versions.',
}

export default async function PromptsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>
}) {
  const params = await searchParams
  const currentPage = params.page ? parseInt(params.page) : 1
  const { prompts, total, totalPages } = await getUserPrompts({
    search: params.search,
    category: params.category,
    page: currentPage,
  })

  const publicCount = prompts.filter((prompt) => prompt.isPublic).length
  const taggedCount = prompts.filter((prompt) => prompt.tags.length > 0).length

  return (
    <div className="pb-12">
      <section className="page-shell pt-10 sm:pt-14">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
          <div className="space-y-5">
            <p className="chapter-mark">№ — My library</p>
            <h1 className="font-display text-4xl leading-[0.98] font-medium tracking-[-0.025em] text-balance sm:text-5xl lg:text-6xl">
              The prompts worth <span className="italic">keeping</span>.
            </h1>
            <p className="page-copy">
              Search, organize, export, and refine your prompt inventory. Treat
              the best ones like reusable assets — not one-off drafts.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Button
                render={
                  <AppLink
                    href="/builder"
                    transitionTypes={appLinkTransitionTypes.builder}
                  />
                }
                size="lg"
                className="rounded-md"
              >
                <Plus className="h-4 w-4" />
                New prompt
              </Button>
              <ExportImport prompts={prompts} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:gap-4">
            <div className="paper-edge bg-card -rotate-[1.4deg] px-4 py-4 transition-transform hover:rotate-0">
              <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                In view
              </p>
              <p className="font-display nums mt-2 text-3xl leading-none font-medium tracking-tight">
                {total}
              </p>
              <p className="text-muted-foreground mt-1.5 text-[12px] leading-snug">
                prompts in this filter
              </p>
            </div>
            <div className="paper-edge bg-card rotate-[1deg] px-4 py-4 transition-transform hover:rotate-0">
              <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                Public
              </p>
              <p className="font-display nums mt-2 text-3xl leading-none font-medium tracking-tight">
                {publicCount}
              </p>
              <p className="text-muted-foreground mt-1.5 text-[12px] leading-snug">
                currently shared
              </p>
            </div>
            <div className="paper-edge -rotate-[0.5deg] bg-[color-mix(in_oklch,var(--marigold)_16%,var(--background))] px-4 py-4 transition-transform hover:rotate-0">
              <p className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                Tagged
              </p>
              <p className="font-display nums mt-2 text-3xl leading-none font-medium tracking-tight">
                {taggedCount}
              </p>
              <p className="text-muted-foreground mt-1.5 text-[12px] leading-snug">
                with topic tags
              </p>
            </div>
          </div>
        </div>
        <div className="hand-rule mt-10 opacity-70" />
      </section>

      <section className="page-shell pt-2">
        <PromptFilters />
      </section>

      <section className="page-shell pt-2">
        <PromptList
          prompts={prompts}
          total={total}
          page={currentPage}
          totalPages={totalPages}
          hasFilters={!!(params.search || params.category)}
        />
      </section>
    </div>
  )
}
