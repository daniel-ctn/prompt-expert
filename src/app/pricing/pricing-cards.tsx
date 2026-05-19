import { Check, KeyRound, Zap } from 'lucide-react'
import { AppLink } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HoverScale } from '@/components/ui/reveal'
import { HOSTED_AI_LIMITS, PLANS } from '@/config/plans'
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
                <p className="section-label">Hosted allowance</p>
                <CardTitle className="font-display text-2xl font-semibold">
                  {PLANS.free.name}
                </CardTitle>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-display text-5xl font-semibold">
                {PLANS.free.credits}
              </span>
              <span className="text-muted-foreground pb-1 text-sm">
                credits per month
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-6">
              {PLANS.free.description} Credits apply only to hosted AI calls.
            </p>
          </CardHeader>
          <CardContent className="space-y-5 py-5">
            <div className="border-border/70 bg-surface-1/75 rounded-3xl border p-4">
              <p className="section-label">Safety limits</p>
              <p className="mt-2 text-sm font-medium">
                {HOSTED_AI_LIMITS.perMinuteRequests} AI requests per minute and{' '}
                {HOSTED_AI_LIMITS.maxPromptInputLength.toLocaleString()} input
                characters per request.
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
              {currentPlan === 'free'
                ? 'Current allowance'
                : 'Included baseline'}
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
                <KeyRound className="h-5 w-5" />
              </div>
              <div>
                <p className="section-label text-primary">Higher usage</p>
                <CardTitle className="font-display text-2xl font-semibold">
                  Bring your own key
                </CardTitle>
              </div>
            </div>
            <div className="flex items-end gap-2">
              <span className="font-display text-5xl font-semibold">BYO</span>
              <span className="text-muted-foreground pb-1 text-sm">
                provider billing
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-6">
              Use your own provider account when you need more AI calls or want
              direct control over spend, data handling, and model access.
            </p>
          </CardHeader>
          <CardContent className="space-y-5 py-5">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="border-primary/18 bg-background/90 rounded-3xl border p-4">
                <p className="section-label">Supported keys</p>
                <p className="font-display mt-2 text-3xl font-semibold">3</p>
              </div>
              <div className="border-primary/18 bg-background/90 rounded-3xl border p-4">
                <p className="section-label">Feature access</p>
                <p className="mt-2 text-sm font-medium">
                  Saving, sharing, gallery, and API tokens remain free.
                </p>
              </div>
            </div>
            <ul className="space-y-3">
              {[
                'OpenAI, Google, and Anthropic key storage',
                'Hosted credit deduction is skipped for BYO-key calls',
                'Public gallery and sharing remain available',
                'No payment is required',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className="text-primary mt-0.5 h-4 w-4" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              render={
                <AppLink href={isAuthenticated ? '/settings' : '/login'} />
              }
              className="w-full rounded-full"
            >
              <KeyRound className="h-4 w-4" />
              {isAuthenticated ? 'Manage provider keys' : 'Sign in to add keys'}
            </Button>
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
                hosted credits available across monthly and bonus balance.
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
