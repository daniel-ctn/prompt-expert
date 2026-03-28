import type { Metadata } from 'next'
import { getUserApiKeyProviders } from '@/lib/actions/api-keys'
import { getUserApiTokens } from '@/lib/actions/api-tokens'
import { ApiKeyManager } from '@/components/settings/api-key-manager'
import { ApiTokenManager } from '@/components/settings/api-token-manager'
import { BillingSection } from '@/components/settings/billing-section'
import { auth } from '@/lib/auth'
import { getUserCredits } from '@/lib/credits'

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
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage your billing, API keys, and preferences.
        </p>
      </div>
      {credits && (
        <BillingSection plan={session!.user.plan} credits={credits} />
      )}
      <ApiKeyManager savedProviders={savedProviders} />
      <ApiTokenManager initialTokens={tokens} />
    </div>
  )
}
