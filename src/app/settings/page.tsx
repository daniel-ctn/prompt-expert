import type { Metadata } from 'next'
import { KeyRound, ShieldCheck, Wallet } from 'lucide-react'
import { getUserApiKeyProviders } from '@/lib/actions/api-keys'
import { getUserApiTokens } from '@/lib/actions/api-tokens'
import { auth } from '@/lib/auth'
import { getUserCredits } from '@/lib/credits'
import { PageIntro } from '@/components/layout/page-intro'
import { Card, CardContent } from '@/components/ui/card'
import { ApiKeyManager } from '@/components/settings/api-key-manager'
import { ApiTokenManager } from '@/components/settings/api-token-manager'
import { BillingSection } from '@/components/settings/billing-section'

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your API keys and account settings.',
}

export default async function SettingsPage() {
  const [savedProviders, tokens, session] = await Promise.all([
    getUserApiKeyProviders(),
    getUserApiTokens(),
    auth(),
  ])

  const credits = session?.user?.id
    ? await getUserCredits(session.user.id)
    : null

  return (
    <div className="space-y-8 pb-8">
      <div className="page-shell-compact pt-8 sm:pt-10">
        <PageIntro
          eyebrow="Account settings"
          title="Control billing, provider access, and API credentials."
          description="Keep account-level settings clear and secure so your prompt workflows stay predictable."
          aside={
            <div className="grid gap-3 md:w-[22rem]">
              <Card className="bg-background/84">
                <CardContent className="space-y-2 py-4">
                  <Wallet className="text-primary h-4 w-4" />
                  <p className="text-sm font-medium">Current credits</p>
                  <p className="font-display text-2xl font-semibold">
                    {credits?.total ?? 0}
                  </p>
                </CardContent>
              </Card>
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1">
                <Card className="bg-background/84">
                  <CardContent className="space-y-2 py-4">
                    <KeyRound className="text-primary h-4 w-4" />
                    <p className="text-muted-foreground text-sm">
                      {savedProviders.length} provider key
                      {savedProviders.length !== 1 ? 's' : ''} configured
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-background/84">
                  <CardContent className="space-y-2 py-4">
                    <ShieldCheck className="text-primary h-4 w-4" />
                    <p className="text-muted-foreground text-sm">
                      {tokens.length} API token
                      {tokens.length !== 1 ? 's' : ''} available
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          }
        />
      </div>
      <section className="page-shell-compact space-y-5 pt-0">
        {credits ? (
          <BillingSection plan={session!.user.plan} credits={credits} />
        ) : null}
        <ApiKeyManager savedProviders={savedProviders} />
        <ApiTokenManager initialTokens={tokens} />
      </section>
    </div>
  )
}
