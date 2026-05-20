import type { Metadata } from 'next'
import { getPublicPrompts, getUserFavoriteIds } from '@/lib/actions/prompt'
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
    <div className="pb-12">
      <section className="page-shell pt-10 sm:pt-14">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end">
          <div className="space-y-5">
            <p className="chapter-mark">№ — Community gallery</p>
            <h1 className="font-display text-4xl leading-[0.98] font-medium tracking-[-0.025em] text-balance sm:text-5xl lg:text-6xl">
              Prompts other teams are already{' '}
              <span className="italic">using</span> in the wild.
            </h1>
            <p className="page-copy">
              Explore public prompts, preview how they’re structured, and fork
              the strongest ones into your own workspace.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:gap-4">
            <div className="paper-edge bg-card -rotate-[1.2deg] px-4 py-4 transition-transform hover:rotate-0">
              <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                In view
              </p>
              <p className="font-display nums mt-2 text-3xl leading-none font-medium tracking-tight">
                {total}
              </p>
              <p className="text-muted-foreground mt-1.5 text-[12px] leading-snug">
                public prompts in this result set
              </p>
            </div>
            <div className="paper-edge bg-card rotate-[0.8deg] px-4 py-4 transition-transform hover:rotate-0">
              <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                Saved
              </p>
              <p className="font-display nums mt-2 text-3xl leading-none font-medium tracking-tight">
                {favoriteIds.size}
              </p>
              <p className="text-muted-foreground mt-1.5 text-[12px] leading-snug">
                favorites in your library
              </p>
            </div>
            <div className="paper-edge -rotate-[0.4deg] bg-[color-mix(in_oklch,var(--marigold)_16%,var(--background))] px-4 py-4 transition-transform hover:rotate-0">
              <p className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                Page
              </p>
              <p className="font-display nums mt-2 text-3xl leading-none font-medium tracking-tight">
                {currentPage}
                <span className="text-muted-foreground">
                  /{totalPages || 1}
                </span>
              </p>
              <p className="text-muted-foreground mt-1.5 text-[12px] leading-snug">
                current results page
              </p>
            </div>
          </div>
        </div>
        <div className="hand-rule mt-10 opacity-70" />
      </section>

      <section className="page-shell pt-2">
        <GalleryFilters />
      </section>

      <section className="page-shell pt-2">
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
