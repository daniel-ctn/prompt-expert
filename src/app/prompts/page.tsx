import type { Metadata } from 'next'
import { Plus, Share2, Shapes, Sparkles } from 'lucide-react'
import { AppLink, appLinkTransitionTypes } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { getUserPrompts } from '@/lib/actions/prompt'
import { PageIntro } from '@/components/layout/page-intro'
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
    <div className="space-y-8 pb-8">
      <div className="page-shell pt-8 sm:pt-10">
        <PageIntro
          eyebrow="Prompt library"
          title="Manage the prompts that are worth keeping."
          description="Search, organize, export, and refine your prompt inventory. Treat the best ones like reusable assets, not one-off drafts."
          actions={
            <>
              <ExportImport prompts={prompts} />
              <Button
                render={
                  <AppLink
                    href="/builder"
                    transitionTypes={appLinkTransitionTypes.builder}
                  />
                }
                className="rounded-full"
              >
                <Plus className="h-4 w-4" />
                New prompt
              </Button>
            </>
          }
          aside={
            <div className="grid gap-3 md:w-[24rem]">
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                <Card className="bg-background/84">
                  <CardContent className="space-y-2 py-4">
                    <Sparkles className="text-primary h-4 w-4" />
                    <p className="font-display text-2xl font-semibold">
                      {total}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      prompts in this view
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-background/84">
                  <CardContent className="space-y-2 py-4">
                    <Share2 className="text-primary h-4 w-4" />
                    <p className="font-display text-2xl font-semibold">
                      {publicCount}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      prompts currently public
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-background/84">
                  <CardContent className="space-y-2 py-4">
                    <Shapes className="text-primary h-4 w-4" />
                    <p className="font-display text-2xl font-semibold">
                      {taggedCount}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      prompts carrying tags
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          }
        />
      </div>

      <section className="page-shell pt-0">
        <PromptFilters />
      </section>

      <section className="page-shell pt-0">
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
