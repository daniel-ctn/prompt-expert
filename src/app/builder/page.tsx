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
        <div className="max-w-3xl space-y-5">
          <p className="chapter-mark">The builder</p>
          <h1 className="font-display text-4xl leading-[0.98] font-medium tracking-[-0.025em] text-balance sm:text-5xl lg:text-6xl">
            Describe your task, <span className="italic">shape</span> the
            prompt.
          </h1>
          <p className="page-copy">
            Start with what you want the AI to do. Add a role, context, and
            rules only when they help. Preview, test, and optimize as you go.
          </p>
        </div>
        <div className="hand-rule mt-10 opacity-70" />
      </section>
      <section className="page-shell pt-2">
        <BuilderClient savedPresets={savedPresets} />
      </section>
    </div>
  )
}
