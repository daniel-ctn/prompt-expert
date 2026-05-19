import type { Metadata } from 'next'
import { HeartHandshake, KeyRound, Zap } from 'lucide-react'
import { auth } from '@/lib/auth'
import { getUserCredits } from '@/lib/credits'
import { PageIntro } from '@/components/layout/page-intro'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn, StaggerGroup, StaggerItem } from '@/components/ui/reveal'
import { PricingCards } from './pricing-cards'

export const metadata: Metadata = {
  title: 'Usage — Prompt Expert',
  description:
    'Review hosted AI limits, BYO provider key options, and community support for Prompt Expert.',
}

const usageCards = [
  {
    icon: Zap,
    title: 'Small hosted allowance',
    description:
      'Every account gets a limited hosted AI allowance for testing, optimizing, and analyzing prompts.',
  },
  {
    icon: KeyRound,
    title: 'Bring your own keys',
    description:
      'Connect your own OpenAI, Google, or Anthropic key in Settings when your workflow needs more usage.',
  },
  {
    icon: HeartHandshake,
    title: 'No paid feature gates',
    description:
      'Prompt Expert is positioned as a free community tool. Donations or sponsorships do not unlock features.',
  },
]

const faqs = [
  {
    question: 'How do credits work?',
    answer:
      'Hosted testing, optimization, and analysis consume credits from your monthly allowance. BYO-key calls use your provider account instead.',
  },
  {
    question: 'Can I bring my own provider keys?',
    answer:
      'Yes. Settings already supports connecting your own OpenAI, Google, and Anthropic keys if you want more direct control.',
  },
  {
    question: 'What happens when hosted AI is paused?',
    answer:
      'You can keep building prompts locally in the app. AI calls continue when you use a configured provider key.',
  },
]

export default async function PricingPage() {
  const session = await auth()
  let currentPlan: 'free' | 'pro' = 'free'
  let credits: Awaited<ReturnType<typeof getUserCredits>> = {
    monthly: 0,
    bonus: 0,
    total: 0,
    plan: 'free',
  }

  if (session?.user?.id) {
    currentPlan = session.user.plan || 'free'
    credits = await getUserCredits(session.user.id)
  }

  return (
    <div className="space-y-10 pb-10">
      <div className="page-shell pt-8 sm:pt-10">
        <PageIntro
          eyebrow="Usage and support"
          title="Free community prompting with clear hosted AI limits."
          description="Use Prompt Expert to build, test, save, share, and fork prompts without payment tiers. Hosted AI is limited; BYO provider keys are available for heavier use."
          align="center"
          aside={
            !!session?.user && (
              <Card className="bg-background/84 md:w-[19rem]">
                <CardContent className="space-y-3 py-5">
                  <p className="section-label">Your account</p>
                  <div className="space-y-1">
                    <p className="font-display text-3xl font-semibold">
                      {credits.total}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      credits currently available
                    </p>
                  </div>
                  <div className="border-border/70 bg-surface-1/70 text-muted-foreground rounded-2xl border px-3 py-3 text-sm">
                    {credits.monthly} monthly + {credits.bonus} bonus on the{' '}
                    <span className="text-foreground font-medium">
                      {currentPlan}
                    </span>{' '}
                    usage tier
                  </div>
                </CardContent>
              </Card>
            )
          }
        />
      </div>

      <section className="page-shell pt-0">
        <StaggerGroup className="grid gap-4 lg:grid-cols-3">
          {usageCards.map((item) => (
            <StaggerItem key={item.title}>
              <Card className="bg-background/84 h-full">
                <CardHeader className="space-y-3">
                  <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="font-display text-xl font-semibold">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm leading-6">
                  {item.description}
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="page-shell pt-0">
        <PricingCards
          currentPlan={currentPlan}
          credits={credits}
          isAuthenticated={!!session?.user}
        />
      </section>

      <section className="page-shell pt-0">
        <FadeIn>
          <div className="mb-5">
            <p className="section-label">FAQ</p>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight">
              Common usage questions
            </h2>
          </div>
        </FadeIn>
        <StaggerGroup className="grid gap-4 md:grid-cols-3">
          {faqs.map((faq) => (
            <StaggerItem key={faq.question}>
              <Card className="bg-background/84 h-full">
                <CardHeader>
                  <CardTitle className="font-display text-lg leading-tight font-semibold">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground text-sm leading-6">
                  {faq.answer}
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>
    </div>
  )
}
