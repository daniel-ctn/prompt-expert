'use client'

import { signIn } from 'next-auth/react'
import { ArrowRight, Github, ShieldCheck } from 'lucide-react'
import { FadeIn, StaggerGroup, StaggerItem } from '@/components/ui/reveal'

const benefits = [
  'Save prompts and versions across projects',
  'Fork community prompts into your own library',
  'Store system prompts, keys, and history in one place',
]

function ProviderButton({
  provider,
  label,
  callbackUrl,
  icon,
}: {
  provider: 'google' | 'github'
  label: string
  callbackUrl: string
  icon: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={() => signIn(provider, { callbackUrl })}
      className="group border-foreground bg-background flex h-12 w-full items-center justify-between border px-4 text-sm font-medium shadow-[var(--shadow-paper-sm)] transition-[transform,box-shadow] hover:-translate-y-px hover:bg-[color-mix(in_oklch,var(--marigold)_14%,var(--background))] hover:shadow-[var(--shadow-paper)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
    >
      <span className="inline-flex items-center gap-3">
        <span className="border-foreground/85 bg-card flex h-7 w-7 items-center justify-center border">
          {icon}
        </span>
        {label}
      </span>
      <ArrowRight className="text-muted-foreground group-hover:text-foreground h-4 w-4" />
    </button>
  )
}

export default function LoginPage() {
  return (
    <div className="page-shell flex min-h-[calc(100dvh-9rem)] items-center py-10">
      <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <FadeIn>
          <div className="space-y-6">
            <p className="chapter-mark">Sign in</p>
            <h1 className="font-display text-5xl leading-[0.96] font-medium tracking-[-0.025em] text-balance sm:text-6xl">
              Welcome <span className="italic">back</span>. Pick up where you{' '}
              <span className="marker-highlight">left off</span>.
            </h1>
            <p className="page-copy">
              Your saved prompts, system fragments, tests, and settings are all
              here. Sign in once and keep moving.
            </p>

            <div className="paper-edge bg-card p-5">
              <div className="border-foreground/80 bg-background text-muted-foreground inline-flex items-center gap-2 border px-2 py-1 font-mono text-[10px] tracking-[0.18em] uppercase">
                <ShieldCheck className="text-foreground/70 h-3 w-3" />
                Secure OAuth
              </div>
              <StaggerGroup className="mt-4 space-y-2.5">
                {benefits.map((b) => (
                  <StaggerItem key={b}>
                    <div className="text-foreground/85 flex items-start gap-3 text-[13.5px] leading-6">
                      <span className="mt-0.5 leading-none font-bold text-[var(--marigold)]">
                        +
                      </span>
                      <span>{b}</span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="paper-edge bg-card  p-6 transition-transform hover:rotate-0 sm:p-8">
            <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
              Choose a provider
            </p>
            <h2 className="font-display mt-2 text-2xl font-medium tracking-tight">
              Continue in under a <span className="italic">minute</span>.
            </h2>

            <div className="mt-6 space-y-3">
              <ProviderButton
                provider="google"
                label="Continue with Google"
                callbackUrl="/prompts"
                icon={
                  <svg className="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                }
              />
              <ProviderButton
                provider="github"
                label="Continue with GitHub"
                callbackUrl="/prompts"
                icon={<Github className="h-4 w-4" />}
              />
            </div>

            <div className="border-foreground/40 text-muted-foreground mt-6 border-t pt-4 text-[12.5px] leading-6">
              New here? Signing in creates your account and unlocks prompt
              saving, gallery forking, history, and settings sync.
            </div>

            <div className="hand-rule mt-4 opacity-50" />
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
