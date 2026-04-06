'use client'

import { useState } from 'react'
import { ArrowRight, Coins, CreditCard } from 'lucide-react'
import { AppLink } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CREDIT_PACK, PLANS } from '@/config/plans'
import type { PlanId } from '@/config/plans'
import type { CreditInfo } from '@/lib/credits'

interface BillingSectionProps {
  plan: PlanId
  credits: CreditInfo
}

export function BillingSection({ plan, credits }: BillingSectionProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const planInfo = PLANS[plan]

  async function handlePortal() {
    setLoading('portal')
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setLoading(null)
    }
  }

  async function handleBuyCredits() {
    setLoading('credits')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'credit_pack' }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch {
      setLoading(null)
    }
  }

  return (
    <Card className="bg-background/84">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Billing and credits
        </CardTitle>
        <CardDescription>
          Review plan status, remaining balance, and the fastest path to more
          capacity.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="border-border/70 bg-surface-1/75 rounded-3xl border p-4">
          <p className="section-label">Current plan</p>
          <p className="font-display mt-2 text-3xl font-semibold">
            {planInfo.name}
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            {plan === 'free' ? 'Free tier' : `$${planInfo.price}/month`} with{' '}
            {planInfo.credits} monthly credits.
          </p>
          <div className="mt-4">
            {plan === 'free' ? (
              <Button
                render={<AppLink href="/pricing" />}
                size="sm"
                className="rounded-full"
              >
                Upgrade plan
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePortal}
                disabled={loading === 'portal'}
                className="rounded-full"
              >
                {loading === 'portal' ? 'Loading...' : 'Manage subscription'}
              </Button>
            )}
          </div>
        </div>

        <div className="border-border/70 bg-surface-1/75 rounded-3xl border p-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
              <Coins className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="section-label">Credit balance</p>
              <p className="font-display mt-2 text-3xl font-semibold">
                {credits.total}
              </p>
              <p className="text-muted-foreground mt-2 text-sm">
                {credits.monthly} monthly + {credits.bonus} bonus credits
                currently available.
              </p>
              {plan === 'pro' ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBuyCredits}
                  disabled={loading === 'credits'}
                  className="mt-4 rounded-full"
                >
                  {loading === 'credits'
                    ? 'Loading...'
                    : `Buy ${CREDIT_PACK.credits} more credits`}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
