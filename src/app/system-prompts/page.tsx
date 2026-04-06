import type { Metadata } from 'next'
import { FileStack, Sparkles } from 'lucide-react'
import { getUserSystemPrompts } from '@/lib/actions/system-prompts'
import { PageIntro } from '@/components/layout/page-intro'
import { Card, CardContent } from '@/components/ui/card'
import { SystemPromptManager } from '@/components/system-prompts/system-prompt-manager'

export const metadata: Metadata = {
  title: 'System Prompts',
  description: 'Create and manage reusable system prompt fragments.',
}

export default async function SystemPromptsPage() {
  const systemPrompts = await getUserSystemPrompts()

  return (
    <div className="space-y-8 pb-8">
      <div className="page-shell-narrow pt-8 sm:pt-10">
        <PageIntro
          eyebrow="System prompt fragments"
          title="Keep reusable personas, policies, and formatting rules in one place."
          description="System prompts become more valuable when they are named clearly, easy to preview, and simple to drop into multiple workflows."
          aside={
            <div className="grid gap-3 md:w-[22rem]">
              <Card className="bg-background/84">
                <CardContent className="space-y-2 py-4">
                  <FileStack className="text-primary h-4 w-4" />
                  <p className="font-display text-2xl font-semibold">
                    {systemPrompts.length}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    saved system prompts
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-background/84">
                <CardContent className="space-y-2 py-4">
                  <Sparkles className="text-primary h-4 w-4" />
                  <p className="text-muted-foreground text-sm">
                    Build reusable fragments for tone, structure, domain
                    context, and policies.
                  </p>
                </CardContent>
              </Card>
            </div>
          }
        />
      </div>
      <section className="page-shell-narrow pt-0">
        <SystemPromptManager initialPrompts={systemPrompts} />
      </section>
    </div>
  )
}
