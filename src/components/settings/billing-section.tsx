import { ArrowRight, Coins, Gauge } from 'lucide-react'
import { AppLink } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { HOSTED_AI_LIMITS, PLANS } from '@/config/plans'
import type { PlanId } from '@/config/plans'
import type { CreditInfo } from '@/lib/credits'

interface BillingSectionProps {
  plan: PlanId
  credits: CreditInfo
}

export function BillingSection({ plan, credits }: BillingSectionProps) {
  const planInfo = PLANS[plan]

  return (
    <Card className="bg-background/84">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gauge className="h-5 w-5" />
          Usage and credits
        </CardTitle>
        <CardDescription>
          Review hosted AI allowance, remaining balance, and BYO-key options.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="border-border/70 bg-surface-1/75 rounded-3xl border p-4">
          <p className="section-label">Current allowance</p>
          <p className="font-display mt-2 text-3xl font-semibold">
            {planInfo.name}
          </p>
          <p className="text-muted-foreground mt-2 text-sm">
            {planInfo.credits} monthly hosted credits. BYO-key calls use your
            provider account instead.
          </p>
          <div className="mt-4">
            <Button
              render={<AppLink href="/pricing" />}
              size="sm"
              className="rounded-full"
            >
              Review usage model
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
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
              <p className="text-muted-foreground mt-3 text-xs">
                Hosted requests are capped at{' '}
                {HOSTED_AI_LIMITS.perMinuteRequests} per minute.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
