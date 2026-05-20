import type { Metadata } from 'next'
import { ChainClient } from './chain-client'

export const metadata: Metadata = {
  title: 'Prompt Chain',
  description:
    "Build multi-step prompt workflows where each step's output feeds into the next.",
}

export default function ChainPage() {
  return (
    <div className="pb-12">
      <section className="page-shell pt-10 sm:pt-14">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
          <div className="space-y-5">
            <p className="chapter-mark">№ — Prompt chains</p>
            <h1 className="font-display text-4xl leading-[0.98] font-medium tracking-[-0.025em] text-balance sm:text-5xl lg:text-6xl">
              Design prompt workflows with{' '}
              <span className="italic">explicit</span> handoffs.
            </h1>
            <p className="page-copy">
              Use chained prompts when a result needs to move through stages —
              extraction, drafting, validation, formatting. Each step has a
              narrow job.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <div className="paper-edge bg-card -rotate-[1deg] px-4 py-4 transition-transform hover:rotate-0">
              <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                Best for
              </p>
              <p className="font-display mt-2 text-lg leading-snug font-medium tracking-tight">
                Staged work
              </p>
              <p className="text-muted-foreground mt-1.5 text-[12px] leading-snug">
                Research synthesis, support triage, content production.
              </p>
            </div>
            <div className="paper-edge rotate-[0.6deg] bg-[color-mix(in_oklch,var(--marigold)_18%,var(--background))] px-4 py-4 transition-transform hover:rotate-0">
              <p className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                Handoff token
              </p>
              <code className="border-foreground/80 bg-background mt-2 inline-block border px-2 py-1 font-mono text-[11.5px]">
                {'{{previous_output}}'}
              </code>
              <p className="text-muted-foreground mt-2 text-[12px] leading-snug">
                Feeds one step directly into the next.
              </p>
            </div>
          </div>
        </div>
        <div className="hand-rule mt-10 opacity-70" />
      </section>
      <section className="page-shell pt-2">
        <ChainClient />
      </section>
    </div>
  )
}
