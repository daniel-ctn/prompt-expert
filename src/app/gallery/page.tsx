import type { Metadata } from "next";
import { getPublicPrompts, getUserFavoriteIds } from "@/lib/actions/prompt";
import { GalleryFilters } from "@/components/gallery/gallery-filters";
import { GalleryList } from "@/components/gallery/gallery-list";

export const metadata: Metadata = {
  title: "Prompt Gallery",
  description:
    "Discover, fork, and favorite community prompts from the public gallery.",
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = params.page ? parseInt(params.page) : 1;
  const [{ prompts, total, totalPages }, favoriteIds] = await Promise.all([
    getPublicPrompts({
    search: params.search,
    category: params.category,
    page: currentPage,
  }),
    getUserFavoriteIds(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Prompt Gallery</h1>
        <p className="mt-1 text-muted-foreground">
          Discover and fork community prompts into your own library.
        </p>
      </div>

      <div className="space-y-6">
        <GalleryFilters />
        <GalleryList
          prompts={prompts}
          total={total}
          page={currentPage}
          totalPages={totalPages}
          hasFilters={!!(params.search || params.category)}
          favoriteIds={favoriteIds}
        />
      </div>
    </div>
  );
}
