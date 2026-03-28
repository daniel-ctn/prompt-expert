import { auth } from '@/lib/auth'
import { getUserCredits } from '@/lib/credits'
import { PricingCards } from './pricing-cards'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pricing — Prompt Expert',
  description: 'Choose a plan that fits your prompt engineering needs.',
}

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
    <div className="flex flex-col items-center px-4 py-20 sm:px-6">
      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Simple, transparent
          <span className="text-gradient"> pricing</span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-4 max-w-xl">
          Start free with 50 AI credits per month. Upgrade when you need more
          power.
        </p>
      </div>

      <PricingCards
        currentPlan={currentPlan}
        credits={credits}
        isAuthenticated={!!session?.user}
      />
    </div>
  )
}
