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
        <div className="max-w-3xl space-y-5">
          <p className="chapter-mark">Prompt chains</p>
          <h1 className="font-display text-4xl leading-[0.98] font-medium tracking-[-0.025em] text-balance sm:text-5xl lg:text-6xl">
            Design prompt workflows with{' '}
            <span className="italic">explicit</span> handoffs.
          </h1>
          <p className="page-copy">
            Use chained prompts when a result needs to move through stages —
            extraction, drafting, validation, formatting. Each step has a narrow
            job.
          </p>
        </div>
        <div className="hand-rule mt-10 opacity-70" />
      </section>
      <section className="page-shell pt-2">
        <ChainClient />
      </section>
    </div>
  )
}
