import type { Metadata } from 'next'
import { getUserPromptHistory } from '@/lib/actions/prompt-history'
import { HistoryList } from '@/components/history/history-list'

export const metadata: Metadata = {
  title: 'History',
  description: 'View your prompt testing and optimization history.',
}

export default async function HistoryPage() {
  const history = await getUserPromptHistory()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          History
        </h1>
        <p className="text-muted-foreground mt-1">
          Review your past prompt tests and optimizations.
        </p>
      </div>
      <HistoryList initialHistory={history} />
    </div>
  )
}
