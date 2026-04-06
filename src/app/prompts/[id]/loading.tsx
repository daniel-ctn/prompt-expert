import { Skeleton } from '@/components/ui/skeleton'

export default function PromptDetailLoading() {
  return (
    <div className="page-shell-narrow space-y-4">
      <Skeleton className="h-48 rounded-[calc(var(--radius-4xl)+2px)]" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-56 rounded-full" />
        <Skeleton className="h-[34rem] rounded-[calc(var(--radius-4xl)+2px)]" />
        <Skeleton className="h-[28rem] rounded-[calc(var(--radius-4xl)+2px)]" />
      </div>
    </div>
  )
}
