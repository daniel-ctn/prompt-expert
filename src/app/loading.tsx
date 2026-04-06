import { Skeleton } from '@/components/ui/skeleton'

export default function Loading() {
  return (
    <div className="page-shell space-y-6">
      <div className="page-frame space-y-4 rounded-[calc(var(--radius-4xl)+2px)] p-6">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-11 w-full max-w-xl" />
        <Skeleton className="h-5 w-full max-w-2xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-44 rounded-[calc(var(--radius-3xl)+2px)]"
          />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-[22rem] rounded-[calc(var(--radius-4xl)+2px)]"
          />
        ))}
      </div>
    </div>
  )
}
