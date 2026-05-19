import type { Metadata } from 'next'
import { Database, KeyRound, ShieldCheck } from 'lucide-react'
import { PageIntro } from '@/components/layout/page-intro'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Prompt Expert handles account, prompt, and API key data.',
}

const sections = [
  {
    icon: ShieldCheck,
    title: 'What we collect',
    items: [
      'OAuth profile data from Google or GitHub, such as name, email, avatar, and provider account identifiers.',
      'Saved prompts, public prompts, prompt metadata, prompt history, and model outputs created through the app.',
      'API token metadata and hashed token values. Raw API tokens are shown only when created.',
      'Provider API keys that you choose to save for BYO-key usage.',
    ],
  },
  {
    icon: Database,
    title: 'Where data is processed',
    items: [
      'Application data is stored in a Neon PostgreSQL database.',
      'Hosted and BYO AI requests may be sent to OpenAI, Anthropic, or Google depending on the selected model and configured key.',
      'Vercel Analytics may collect privacy-preserving usage analytics for product health and performance.',
    ],
  },
  {
    icon: KeyRound,
    title: 'Control and deletion',
    items: [
      'Provider API keys are encrypted before storage. Changing ENCRYPTION_KEY can make previously saved keys unreadable.',
      'Public prompts are visible to everyone until unpublished or deleted.',
      'Data export and account deletion controls are planned for launch readiness. Until then, contact support@prompt-expert.org for deletion or export requests and security@prompt-expert.org for security reports.',
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="page-shell-compact pt-8 sm:pt-10">
        <PageIntro
          eyebrow="Privacy"
          title="Data use is kept narrow and tied to prompt workflows."
          description="Prompt Expert stores the account and prompt data needed to run the product, support public sharing, and connect AI providers when you ask it to."
        />
      </div>

      <section className="page-shell-compact grid gap-4 pt-0 md:grid-cols-3">
        {sections.map((section) => (
          <Card key={section.title} className="bg-background/84 h-full">
            <CardHeader className="space-y-3">
              <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                <section.icon className="h-5 w-5" />
              </div>
              <CardTitle className="font-display text-xl font-semibold">
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground space-y-3 text-sm leading-6">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </section>
    </div>
  )
}
