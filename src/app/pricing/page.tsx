import type { Metadata } from 'next'
import { CreditCard, Sparkles, Zap } from 'lucide-react'
import { auth } from '@/lib/auth'
import { getUserCredits } from '@/lib/credits'
import { PageIntro } from '@/components/layout/page-intro'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn, StaggerGroup, StaggerItem } from '@/components/ui/reveal'
import { PricingCards } from './pricing-cards'

export const metadata: Metadata = {
  title: 'Pricing — Prompt Expert',
  description: 'Choose a plan that fits your prompt engineering needs.',
}

const usageCards = [
  {
    icon: Zap,
    title: 'Start free',
    description:
      'Use the builder, save prompts, explore the gallery, and validate the workflow before you commit.',
  },
  {
    icon: Sparkles,
    title: 'Upgrade when prompting becomes operational',
    description:
      'Pro is built for teams and power users who test, optimize, and save prompts as part of regular delivery.',
  },
  {
    icon: CreditCard,
    title: 'Keep costs predictable',
    description:
      'Credits are simple to reason about, and additional packs are available when you need temporary headroom.',
  },
]

const faqs = [
  {
    question: 'How do credits work?',
    answer:
      'Testing, optimizing, and analysis consume credits. The free plan includes a monthly allocation, and Pro expands that allowance significantly.',
  },
  {
    question: 'Can I bring my own provider keys?',
    answer:
      'Yes. Settings already supports connecting your own OpenAI, Google, and Anthropic keys if you want more direct control.',
  },
  {
    question: 'What happens when I need more credits?',
    answer:
      'Pro users can buy additional credit packs without changing plans. Free users can upgrade whenever they hit the ceiling.',
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
          eyebrow="Pricing and credits"
          title="Plans that match how serious your prompt workflow has become."
          description="Start free while you build habits. Upgrade when prompt testing, optimization, and reusable workflows become part of your day-to-day delivery."
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
                    plan
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
              Common pricing questions
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
