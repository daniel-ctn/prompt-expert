import type { Metadata } from 'next'
import { Command, Sparkles, Wand2 } from 'lucide-react'
import { getUserPromptPresets } from '@/lib/actions/prompt'
import { PageIntro } from '@/components/layout/page-intro'
import { Card, CardContent } from '@/components/ui/card'
import { BuilderClient } from './builder-client'

export const metadata: Metadata = {
  title: 'Prompt Builder',
  description:
    'Build and optimize AI prompts with fine-tuned controls for model, tone, format, and constraints.',
}

export default async function BuilderPage() {
  const savedPresets = await getUserPromptPresets()

  return (
    <div className="space-y-8 pb-8">
      <div className="page-shell pt-8 sm:pt-10">
        <PageIntro
          eyebrow="Prompt builder"
          title="Shape the prompt once, then iterate with structure."
          description="Build around role, context, task, constraints, and output format. Optimize only after the brief is clear, not before."
          aside={
            <div className="grid gap-3 md:w-[24rem]">
              <Card className="bg-background/84">
                <CardContent className="space-y-3 py-4">
                  <p className="section-label">Saved presets</p>
                  <p className="font-display text-3xl font-semibold">
                    {savedPresets.length}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Reusable starting points already available in your template
                    menu.
                  </p>
                </CardContent>
              </Card>
              <div className="grid gap-3 sm:grid-cols-2">
                <Card className="bg-background/84">
                  <CardContent className="space-y-2 py-4">
                    <Command className="text-primary h-4 w-4" />
                    <p className="text-sm font-medium">Keyboard flow</p>
                    <p className="text-muted-foreground text-sm">
                      <kbd className="border-border/80 rounded border px-1.5 py-0.5 text-[11px]">
                        Ctrl
                      </kbd>{' '}
                      +{' '}
                      <kbd className="border-border/80 rounded border px-1.5 py-0.5 text-[11px]">
                        Enter
                      </kbd>{' '}
                      optimizes the prompt.
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-background/84">
                  <CardContent className="space-y-2 py-4">
                    <Sparkles className="text-primary h-4 w-4" />
                    <p className="text-sm font-medium">Suggested flow</p>
                    <p className="text-muted-foreground text-sm">
                      Define the brief first, then test, then optimize.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          }
        />
      </div>
      <section className="page-shell pt-0">
        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
          <Wand2 className="text-primary h-4 w-4" />
          The builder now groups work into setup, briefing, and guardrails so
          the output stays easier to reason about.
        </div>
        <BuilderClient savedPresets={savedPresets} />
      </section>
    </div>
  )
}
