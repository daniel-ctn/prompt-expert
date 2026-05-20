import type { Metadata } from 'next'
import { getUserApiKeyProviders } from '@/lib/actions/api-keys'
import { getUserApiTokens } from '@/lib/actions/api-tokens'
import { auth } from '@/lib/auth'
import { getUserCredits } from '@/lib/credits'
import { ApiKeyManager } from '@/components/settings/api-key-manager'
import { ApiTokenManager } from '@/components/settings/api-token-manager'

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
    <div className="pb-12">
      <section className="page-shell-narrow pt-10 sm:pt-14">
        <p className="chapter-mark">№ — Settings</p>
        <h1 className="font-display mt-3 text-4xl leading-[1] font-medium tracking-[-0.02em] text-balance sm:text-5xl">
          Provider keys, tokens, <span className="italic">preferences</span>.
        </h1>
        <p className="page-copy mt-4">
          Keep account-level settings clear and secure so your prompt workflows
          stay predictable.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="paper-edge bg-card -rotate-[0.8deg] px-4 py-4 transition-transform hover:rotate-0">
            <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
              Credits
            </p>
            <p className="font-display nums mt-2 text-3xl leading-none font-medium tracking-tight">
              {credits?.total ?? 0}
            </p>
            <p className="text-muted-foreground mt-2 text-[12px] leading-snug">
              Used for AI testing &amp; optimization.
            </p>
          </div>
          <div className="paper-edge bg-card rotate-[0.6deg] px-4 py-4 transition-transform hover:rotate-0">
            <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
              Provider keys
            </p>
            <p className="font-display nums mt-2 text-3xl leading-none font-medium tracking-tight">
              {savedProviders.length}
            </p>
            <p className="text-muted-foreground mt-2 text-[12px] leading-snug">
              Bring your own OpenAI / Anthropic / Google keys.
            </p>
          </div>
          <div className="paper-edge bg-card -rotate-[0.4deg] px-4 py-4 transition-transform hover:rotate-0">
            <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
              API tokens
            </p>
            <p className="font-display nums mt-2 text-3xl leading-none font-medium tracking-tight">
              {tokens.length}
            </p>
            <p className="text-muted-foreground mt-2 text-[12px] leading-snug">
              Programmatic access to your prompts.
            </p>
          </div>
        </div>

        <div className="hand-rule mt-10 opacity-70" />
      </section>

      <section className="page-shell-narrow space-y-6 pt-2">
        <ApiKeyManager savedProviders={savedProviders} />
        <ApiTokenManager initialTokens={tokens} />
      </section>
    </div>
  )
}
