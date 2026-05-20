import type { Metadata } from 'next'
import { getUserPromptHistory } from '@/lib/actions/prompt-history'
import { HistoryList } from '@/components/history/history-list'

export const metadata: Metadata = {
  title: 'History',
  description: 'View your prompt testing and optimization history.',
}

export default async function HistoryPage() {
  const history = await getUserPromptHistory()
  const optimizeRuns = history.filter(
    (entry) => entry.endpoint !== 'test',
  ).length

  return (
    <div className="pb-12">
      <section className="page-shell-narrow pt-10 sm:pt-14">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
          <div className="space-y-5">
            <p className="chapter-mark">№ — Run history</p>
            <h1 className="font-display text-4xl leading-[0.98] font-medium tracking-[-0.025em] text-balance sm:text-5xl">
              The experiments you&apos;ve{' '}
              <span className="italic">already</span> run.
            </h1>
            <p className="page-copy">
              Compare test runs, revisit good outputs, and understand which
              prompts were worth keeping.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-1 md:gap-4">
            <div className="paper-edge bg-card -rotate-[1.2deg] px-4 py-4 transition-transform hover:rotate-0">
              <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                Logged
              </p>
              <p className="font-display nums mt-2 text-3xl leading-none font-medium tracking-tight">
                {history.length}
              </p>
              <p className="text-muted-foreground mt-1.5 text-[12px] leading-snug">
                total runs in history
              </p>
            </div>
            <div className="paper-edge rotate-[0.8deg] bg-[color-mix(in_oklch,var(--marigold)_16%,var(--background))] px-4 py-4 transition-transform hover:rotate-0">
              <p className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                Optimized
              </p>
              <p className="font-display nums mt-2 text-3xl leading-none font-medium tracking-tight">
                {optimizeRuns}
              </p>
              <p className="text-muted-foreground mt-1.5 text-[12px] leading-snug">
                refinement passes
              </p>
            </div>
          </div>
        </div>
        <div className="hand-rule mt-10 opacity-70" />
      </section>
      <section className="page-shell-narrow pt-2">
        <HistoryList initialHistory={history} />
      </section>
    </div>
  )
}
