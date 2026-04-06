import { Skeleton } from '@/components/ui/skeleton'

export default function PromptsLoading() {
  return (
    <div className="page-shell space-y-6">
      <div className="page-frame space-y-4 rounded-[calc(var(--radius-4xl)+2px)] p-6">
        <Skeleton className="h-4 w-28 rounded-full" />
        <Skeleton className="h-11 w-full max-w-2xl" />
        <Skeleton className="h-5 w-full max-w-3xl" />
      </div>
      <Skeleton className="h-24 rounded-[calc(var(--radius-3xl)+2px)]" />
      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className="h-[24rem] rounded-[calc(var(--radius-4xl)+2px)]"
          />
        ))}
      </div>
    </div>
  )
}
