import type { Metadata } from 'next'
import { getUserPromptPresets } from '@/lib/actions/prompt'
import { BuilderClient } from './builder-client'

export const metadata: Metadata = {
  title: 'Prompt Builder',
  description:
    'Build and optimize AI prompts with fine-tuned controls for model, tone, format, and constraints.',
}

export default async function BuilderPage() {
  const savedPresets = await getUserPromptPresets()

  return (
    <div className="pb-12">
      <section className="page-shell pt-10 sm:pt-14">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
          <div className="space-y-5">
            <p className="chapter-mark">№ — The builder</p>
            <h1 className="font-display text-4xl leading-[0.98] font-medium tracking-[-0.025em] text-balance sm:text-5xl lg:text-6xl">
              Shape the prompt <span className="italic">once</span>, then
              iterate with structure.
            </h1>
            <p className="page-copy">
              Build around role, context, task, constraints, and output format.
              Optimize only after the brief is clear — not before.
            </p>
            <div className="text-muted-foreground flex flex-wrap items-center gap-3 pt-1 font-mono text-[11px] tracking-wider uppercase">
              <span className="border-foreground/70 bg-background inline-flex items-center gap-1 border px-2 py-1">
                <kbd>Ctrl</kbd> + <kbd>Enter</kbd>
              </span>
              <span>optimizes the prompt</span>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-1">
            <div className="paper-edge bg-card -rotate-[1.5deg] px-4 py-4 transition-transform hover:rotate-0">
              <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                Saved presets
              </p>
              <p className="font-display nums mt-2 text-3xl leading-none font-medium tracking-tight">
                {savedPresets.length}
              </p>
              <p className="text-muted-foreground mt-2 text-[12px] leading-snug">
                Reusable starting points in your template menu.
              </p>
            </div>
            <div className="paper-edge bg-card rotate-[1deg] px-4 py-4 transition-transform hover:rotate-0">
              <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                Suggested flow
              </p>
              <p className="font-display mt-2 text-lg leading-snug font-medium tracking-tight">
                Brief → test → optimize.
              </p>
              <p className="text-muted-foreground mt-2 text-[12px] leading-snug">
                Resist optimizing too early.
              </p>
            </div>
            <div className="paper-edge -rotate-[0.6deg] bg-[color-mix(in_oklch,var(--marigold)_18%,var(--background))] px-4 py-4 transition-transform hover:rotate-0">
              <p className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                Tip
              </p>
              <p className="font-display mt-2 text-lg leading-snug font-medium tracking-tight">
                Fill the task <span className="italic">first</span>.
              </p>
              <p className="text-muted-foreground mt-2 text-[12px] leading-snug">
                Then save polished prompts.
              </p>
            </div>
          </div>
        </div>
        <div className="hand-rule mt-10 opacity-70" />
      </section>
      <section className="page-shell pt-2">
        <BuilderClient savedPresets={savedPresets} />
      </section>
    </div>
  )
}
