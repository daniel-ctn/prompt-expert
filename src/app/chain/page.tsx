import type { Metadata } from 'next'
import { ArrowDown, Play, Workflow } from 'lucide-react'
import { PageIntro } from '@/components/layout/page-intro'
import { Card, CardContent } from '@/components/ui/card'
import { ChainClient } from './chain-client'

export const metadata: Metadata = {
  title: 'Prompt Chain',
  description:
    "Build multi-step prompt workflows where each step's output feeds into the next.",
}

export default function ChainPage() {
  return (
    <div className="space-y-8 pb-8">
      <div className="page-shell pt-8 sm:pt-10">
        <PageIntro
          eyebrow="Prompt chain"
          title="Design prompt workflows with explicit handoffs between steps."
          description="Use chained prompts when a result needs to move through stages like extraction, drafting, validation, and formatting."
          aside={
            <div className="grid gap-3 md:w-[22rem]">
              <Card className="bg-background/84">
                <CardContent className="space-y-3 py-4">
                  <Workflow className="text-primary h-5 w-5" />
                  <p className="text-sm font-medium">Best for staged work</p>
                  <p className="text-muted-foreground text-sm">
                    Research synthesis, support triage, and content production
                    are all easier when each step has a narrow job.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background/84">
                <CardContent className="space-y-3 py-4">
                  <div className="text-primary flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    <ArrowDown className="h-4 w-4" />
                  </div>
                  <p className="text-sm font-medium">Clear handoff token</p>
                  <p className="text-muted-foreground text-sm">
                    Use{' '}
                    <code className="bg-background rounded px-1 py-0.5 text-[11px]">
                      {'{{previous_output}}'}
                    </code>{' '}
                    to feed one step directly into the next.
                  </p>
                </CardContent>
              </Card>
            </div>
          }
        />
      </div>
      <section className="page-shell pt-0">
        <ChainClient />
      </section>
    </div>
  )
}
