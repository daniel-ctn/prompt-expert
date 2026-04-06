'use client'

import { signIn } from 'next-auth/react'
import {
  ArrowRight,
  CheckCircle2,
  Github,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FadeIn, StaggerGroup, StaggerItem } from '@/components/ui/reveal'

const benefits = [
  'Save prompts and versions across projects',
  'Fork community prompts into your own library',
  'Store system prompts, keys, and workflow history in one place',
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
    <Button
      variant="outline"
      className="h-11 w-full justify-between rounded-2xl px-4 text-sm"
      onClick={() => signIn(provider, { callbackUrl })}
    >
      <span className="inline-flex items-center gap-3">
        <span className="bg-background flex h-8 w-8 items-center justify-center rounded-full">
          {icon}
        </span>
        {label}
      </span>
      <ArrowRight className="text-muted-foreground h-4 w-4" />
    </Button>
  )
}

export default function LoginPage() {
  return (
    <div className="page-shell flex min-h-[calc(100dvh-9rem)] items-center py-8">
      <div className="grid w-full gap-5 lg:grid-cols-[1.02fr_0.98fr]">
        <FadeIn>
          <Card className="page-frame bg-transparent">
            <CardContent className="space-y-6 py-8">
              <div className="space-y-4">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-3xl">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="space-y-3">
                  <p className="section-label">Welcome back</p>
                  <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
                    Sign in and keep your best prompt workflows close.
                  </h1>
                  <p className="page-copy">
                    Your saved prompts, system fragments, tests, and settings
                    are all here. Sign in once and keep moving.
                  </p>
                </div>
              </div>

              <div className="border-border/70 bg-background/84 rounded-3xl border p-5">
                <div className="border-border/70 bg-surface-1/75 text-muted-foreground mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                  <ShieldCheck className="text-primary h-3.5 w-3.5" />
                  Secure account access via OAuth
                </div>
                <StaggerGroup className="space-y-3">
                  {benefits.map((benefit) => (
                    <StaggerItem key={benefit}>
                      <div className="text-muted-foreground flex items-start gap-3 text-sm">
                        <CheckCircle2 className="text-primary mt-0.5 h-4 w-4" />
                        <span>{benefit}</span>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerGroup>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        <FadeIn delay={0.08}>
          <Card className="bg-background/88">
            <CardHeader className="border-border/70 border-b pb-5">
              <p className="section-label">Choose a provider</p>
              <CardTitle className="font-display text-2xl font-semibold">
                Continue in under a minute
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 py-5">
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
              <div className="border-border/70 bg-surface-1/75 text-muted-foreground rounded-2xl border p-4 text-sm">
                New here? Signing in creates your account and unlocks prompt
                saving, gallery forking, history, and settings sync
                automatically.
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </div>
  )
}
