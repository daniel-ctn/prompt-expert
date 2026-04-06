import { Skeleton } from '@/components/ui/skeleton'

export default function BuilderLoading() {
  return (
    <div className="page-shell space-y-6">
      <div className="page-frame space-y-4 rounded-[calc(var(--radius-4xl)+2px)] p-6">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-11 w-full max-w-2xl" />
        <Skeleton className="h-5 w-full max-w-3xl" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(24rem,1.05fr)]">
        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-28 rounded-[calc(var(--radius-3xl)+2px)]"
              />
            ))}
          </div>
          <Skeleton className="h-[48rem] rounded-[calc(var(--radius-4xl)+2px)]" />
        </div>
        <Skeleton className="h-[48rem] rounded-[calc(var(--radius-4xl)+2px)]" />
      </div>
    </div>
  )
}
