import type { Metadata } from 'next'
import { Compass, Heart, Library } from 'lucide-react'
import { getPublicPrompts, getUserFavoriteIds } from '@/lib/actions/prompt'
import { PageIntro } from '@/components/layout/page-intro'
import { Card, CardContent } from '@/components/ui/card'
import { GalleryFilters } from '@/components/gallery/gallery-filters'
import { GalleryList } from '@/components/gallery/gallery-list'

export const metadata: Metadata = {
  title: 'Prompt Gallery',
  description:
    'Discover, fork, and favorite community prompts from the public gallery.',
}

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>
}) {
  const params = await searchParams
  const currentPage = params.page ? parseInt(params.page) : 1
  const [{ prompts, total, totalPages }, favoriteIds] = await Promise.all([
    getPublicPrompts({
      search: params.search,
      category: params.category,
      page: currentPage,
    }),
    getUserFavoriteIds(),
  ])

  return (
    <div className="space-y-8 pb-8">
      <div className="page-shell pt-8 sm:pt-10">
        <PageIntro
          eyebrow="Community gallery"
          title="Browse prompts that other teams are already using in the wild."
          description="Explore public prompts, preview how they are structured, and fork the strongest ones into your own workspace."
          aside={
            <div className="grid gap-3 md:w-[24rem]">
              <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
                <Card className="bg-background/84">
                  <CardContent className="space-y-2 py-4">
                    <Library className="text-primary h-4 w-4" />
                    <p className="font-display text-2xl font-semibold">
                      {total}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      public prompts in this result set
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-background/84">
                  <CardContent className="space-y-2 py-4">
                    <Heart className="text-primary h-4 w-4" />
                    <p className="font-display text-2xl font-semibold">
                      {favoriteIds.size}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      favorites saved to your account
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-background/84">
                  <CardContent className="space-y-2 py-4">
                    <Compass className="text-primary h-4 w-4" />
                    <p className="font-display text-2xl font-semibold">
                      {currentPage}/{totalPages || 1}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      current results page
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          }
        />
      </div>

      <section className="page-shell pt-0">
        <GalleryFilters />
      </section>

      <section className="page-shell pt-0">
        <GalleryList
          prompts={prompts}
          total={total}
          page={currentPage}
          totalPages={totalPages}
          hasFilters={!!(params.search || params.category)}
          favoriteIds={favoriteIds}
        />
      </section>
    </div>
  )
}
