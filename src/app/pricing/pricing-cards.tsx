'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Coins, Sparkles, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HoverScale } from '@/components/ui/reveal'
import { CREDIT_PACK, PLANS } from '@/config/plans'
import type { CreditInfo } from '@/lib/credits'

interface PricingCardsProps {
  currentPlan: 'free' | 'pro'
  credits: CreditInfo
  isAuthenticated: boolean
}

export function PricingCards({
  currentPlan,
  credits,
  isAuthenticated,
}: PricingCardsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCheckout(type: 'pro' | 'credit_pack') {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    setLoading(type)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoading(null)
    }
  }

  async function handleManage() {
    setLoading('manage')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch {
      setLoading(null)
    }
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      <HoverScale>
        <Card className="bg-background/84 h-full">
          <CardHeader className="border-border/70 space-y-4 border-b pb-5">
            <div className="flex items-center gap-3">
              <div className="bg-muted text-muted-foreground flex h-11 w-11 items-center justify-center rounded-2xl">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="section-label">Starter plan</p>
                <CardTitle className="font-display text-2xl font-semibold">
                  {PLANS.free.name}
                </CardTitle>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-display text-5xl font-semibold">$0</span>
              <span className="text-muted-foreground pb-1 text-sm">
                per month
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-6">
              Ideal for solo exploration, first prompt libraries, and validating
              whether the workflow fits your team.
            </p>
          </CardHeader>
          <CardContent className="space-y-5 py-5">
            <div className="border-border/70 bg-surface-1/75 rounded-3xl border p-4">
              <p className="section-label">Included usage</p>
              <p className="mt-2 text-sm font-medium">
                {PLANS.free.credits} credits each month with core builder
                access.
              </p>
            </div>
            <ul className="space-y-3">
              {PLANS.free.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className="text-primary mt-0.5 h-4 w-4" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button variant="outline" disabled className="w-full rounded-full">
              {currentPlan === 'free' ? 'Current plan' : 'Included baseline'}
            </Button>
          </CardContent>
        </Card>
      </HoverScale>

      <HoverScale>
        <Card className="border-primary/22 bg-primary/6 relative h-full">
          <div className="border-primary/20 bg-background/92 text-primary absolute top-4 right-4 rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase">
            Recommended
          </div>
          <CardHeader className="border-border/70 space-y-4 border-b pb-5">
            <div className="flex items-center gap-3">
              <div className="bg-primary/12 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="section-label text-primary">Operational plan</p>
                <CardTitle className="font-display text-2xl font-semibold">
                  {PLANS.pro.name}
                </CardTitle>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-display text-5xl font-semibold">
                ${PLANS.pro.price}
              </span>
              <span className="text-muted-foreground pb-1 text-sm">
                per month
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-6">
              For prompt-heavy teams and power users who test frequently, build
              internal libraries, and need headroom for repeated iteration.
            </p>
          </CardHeader>
          <CardContent className="space-y-5 py-5">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="border-primary/18 bg-background/90 rounded-3xl border p-4">
                <p className="section-label">Monthly credits</p>
                <p className="font-display mt-2 text-3xl font-semibold">
                  {PLANS.pro.credits}
                </p>
              </div>
              <div className="border-primary/18 bg-background/90 rounded-3xl border p-4">
                <p className="section-label">Extra pack</p>
                <p className="mt-2 text-sm font-medium">
                  {CREDIT_PACK.credits} credits for ${CREDIT_PACK.price}
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {PLANS.pro.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className="text-primary mt-0.5 h-4 w-4" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            {currentPlan === 'pro' ? (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full rounded-full"
                  onClick={handleManage}
                  disabled={loading === 'manage'}
                >
                  {loading === 'manage' ? 'Loading...' : 'Manage subscription'}
                </Button>
                <Button
                  className="w-full rounded-full"
                  onClick={() => handleCheckout('credit_pack')}
                  disabled={loading === 'credit_pack'}
                >
                  <Coins className="h-4 w-4" />
                  {loading === 'credit_pack'
                    ? 'Loading...'
                    : `Buy ${CREDIT_PACK.credits} extra credits`}
                </Button>
              </div>
            ) : (
              <Button
                className="w-full rounded-full"
                onClick={() => handleCheckout('pro')}
                disabled={loading === 'pro'}
              >
                {loading === 'pro' ? 'Loading...' : 'Upgrade to Pro'}
              </Button>
            )}
          </CardContent>
        </Card>
      </HoverScale>

      {isAuthenticated ? (
        <Card className="bg-background/84 xl:col-span-2">
          <CardContent className="flex flex-col gap-4 py-5 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="section-label">Current balance</p>
              <p className="text-muted-foreground text-sm">
                You currently have{' '}
                <span className="text-foreground font-medium">
                  {credits.total}
                </span>{' '}
                credits available across monthly and bonus balance.
              </p>
            </div>
            <div className="border-border/70 bg-surface-1/75 text-muted-foreground rounded-2xl border px-4 py-3 text-sm">
              {credits.monthly} monthly + {credits.bonus} bonus
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
