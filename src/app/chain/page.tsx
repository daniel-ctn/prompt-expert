import type { Metadata } from 'next'
import { ChainClient } from './chain-client'

export const metadata: Metadata = {
  title: 'Prompt Chain',
  description:
    "Build multi-step prompt workflows where each step's output feeds into the next.",
}

export default function ChainPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Prompt Chain
        </h1>
        <p className="text-muted-foreground mt-1">
          Build multi-step workflows where each prompt&apos;s output feeds into
          the next.
        </p>
      </div>
      <ChainClient />
    </div>
  )
}
