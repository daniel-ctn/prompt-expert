import type { Metadata } from 'next'
import { BarChart3, Clock3 } from 'lucide-react'
import { getUserPromptHistory } from '@/lib/actions/prompt-history'
import { PageIntro } from '@/components/layout/page-intro'
import { Card, CardContent } from '@/components/ui/card'
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
    <div className="space-y-8 pb-8">
      <div className="page-shell-narrow pt-8 sm:pt-10">
        <PageIntro
          eyebrow="Run history"
          title="Review the prompt experiments you have already paid for."
          description="Use history to compare test runs, revisit good outputs, and understand which prompts were worth keeping."
          aside={
            <div className="grid gap-3 md:w-[22rem]">
              <Card className="bg-background/84">
                <CardContent className="space-y-2 py-4">
                  <Clock3 className="text-primary h-4 w-4" />
                  <p className="font-display text-2xl font-semibold">
                    {history.length}
                  </p>
                  <p className="text-muted-foreground text-sm">logged runs</p>
                </CardContent>
              </Card>
              <Card className="bg-background/84">
                <CardContent className="space-y-2 py-4">
                  <BarChart3 className="text-primary h-4 w-4" />
                  <p className="font-display text-2xl font-semibold">
                    {optimizeRuns}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    optimization runs in history
                  </p>
                </CardContent>
              </Card>
            </div>
          }
        />
      </div>
      <section className="page-shell-narrow pt-0">
        <HistoryList initialHistory={history} />
      </section>
    </div>
  )
}
