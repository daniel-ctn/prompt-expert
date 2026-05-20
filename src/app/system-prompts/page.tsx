import type { Metadata } from 'next'
import { getUserSystemPrompts } from '@/lib/actions/system-prompts'
import { SystemPromptManager } from '@/components/system-prompts/system-prompt-manager'

export const metadata: Metadata = {
  title: 'System Prompts',
  description: 'Create and manage reusable system prompt fragments.',
}

export default async function SystemPromptsPage() {
  const systemPrompts = await getUserSystemPrompts()

  return (
    <div className="pb-12">
      <section className="page-shell-narrow pt-10 sm:pt-14">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] md:items-end">
          <div className="space-y-5">
            <p className="chapter-mark">№ — System fragments</p>
            <h1 className="font-display text-4xl leading-[0.98] font-medium tracking-[-0.025em] text-balance sm:text-5xl">
              Reusable personas, policies,{' '}
              <span className="italic">formatting</span> rules.
            </h1>
            <p className="page-copy">
              System prompts become more valuable when they&apos;re named
              clearly, easy to preview, and simple to drop into multiple
              workflows.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 md:gap-4">
            <div className="paper-edge bg-card -rotate-[1.1deg] px-4 py-4 transition-transform hover:rotate-0">
              <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                Saved
              </p>
              <p className="font-display nums mt-2 text-3xl leading-none font-medium tracking-tight">
                {systemPrompts.length}
              </p>
              <p className="text-muted-foreground mt-1.5 text-[12px] leading-snug">
                system prompt fragments
              </p>
            </div>
            <div className="paper-edge rotate-[0.6deg] bg-[color-mix(in_oklch,var(--marigold)_16%,var(--background))] px-4 py-4 transition-transform hover:rotate-0">
              <p className="font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                Use cases
              </p>
              <p className="mt-2 text-[12.5px] leading-snug">
                Tone, structure, domain context, policies — anything you reach
                for repeatedly.
              </p>
            </div>
          </div>
        </div>
        <div className="hand-rule mt-10 opacity-70" />
      </section>
      <section className="page-shell-narrow pt-2">
        <SystemPromptManager initialPrompts={systemPrompts} />
      </section>
    </div>
  )
}
