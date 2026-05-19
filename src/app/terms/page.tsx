import type { Metadata } from 'next'
import { AlertTriangle, Globe2, Scale } from 'lucide-react'
import { PageIntro } from '@/components/layout/page-intro'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms for using Prompt Expert as a community prompt tool.',
}

const sections = [
  {
    icon: Scale,
    title: 'Use of the service',
    items: [
      'Prompt Expert is provided as-is as a free community-oriented prompt workflow tool.',
      'Hosted AI usage may be limited, paused, or disabled to protect the service from abuse or unexpected cost.',
      'You are responsible for the prompts, outputs, and public gallery content you create or publish.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'AI output and abuse',
    items: [
      'AI-generated output may be inaccurate, incomplete, unsafe, or unsuitable for your use case.',
      'Do not use the service for abuse, spam, harassment, credential theft, or misuse of sensitive personal data.',
      'Do not publish prompts that violate laws, platform rules, or the rights of others.',
    ],
  },
  {
    icon: Globe2,
    title: 'Public content',
    items: [
      'Public prompts and shared gallery content may be visible to everyone.',
      'Only publish prompts you are comfortable making public and have permission to share.',
      'Public content may be removed or restricted to protect the community or comply with legal obligations.',
    ],
  },
]

export default function TermsPage() {
  return (
    <div className="space-y-8 pb-10">
      <div className="page-shell-compact pt-8 sm:pt-10">
        <PageIntro
          eyebrow="Terms"
          title="Use Prompt Expert responsibly and publish with care."
          description="These terms clarify the service model, AI limitations, public gallery behavior, and basic abuse rules for launch."
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
