'use client'

import { ArrowUpRight, Command, Sparkles } from 'lucide-react'
import { AppLink } from '@/components/ui/app-link'
import { APP_NAME } from '@/config/constants'
import { Button } from '@/components/ui/button'
import { setCommandPaletteOpen } from '@/lib/command-palette'

export function Footer() {
  return (
    <footer className="px-3 pb-4 sm:px-4 sm:pb-5">
      <div className="surface-subtle mx-auto max-w-7xl rounded-[calc(var(--radius-4xl)+2px)] px-5 py-6 sm:px-6">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/92 border-primary/20 flex h-10 w-10 items-center justify-center rounded-2xl border text-white shadow-[0_18px_60px_-28px_color-mix(in_oklch,var(--primary)_55%,transparent)]">
                <Sparkles className="text-primary-foreground h-4 w-4" />
              </div>
              <div>
                <p className="font-display text-base font-semibold">
                  {APP_NAME}
                </p>
                <p className="text-muted-foreground text-sm">
                  Structured prompting, clearer workflows, stronger outputs.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setCommandPaletteOpen(true)}
              >
                <Command className="h-3.5 w-3.5" />
                Open command palette
              </Button>
              <p className="text-muted-foreground text-xs">
                Press{' '}
                <kbd className="border-border/80 rounded border px-1.5 py-0.5">
                  Ctrl
                </kbd>{' '}
                +{' '}
                <kbd className="border-border/80 rounded border px-1.5 py-0.5">
                  K
                </kbd>{' '}
                any time.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
                Explore
              </p>
              <div className="space-y-2">
                <AppLink href="/builder" className="footer-link">
                  Builder
                </AppLink>
                <AppLink href="/chain" className="footer-link">
                  Chain
                </AppLink>
                <AppLink href="/gallery" className="footer-link">
                  Gallery
                </AppLink>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-muted-foreground text-[11px] font-medium tracking-[0.18em] uppercase">
                Manage
              </p>
              <div className="space-y-2">
                <AppLink href="/prompts" className="footer-link">
                  My prompts
                </AppLink>
                <AppLink href="/pricing" className="footer-link">
                  Pricing
                </AppLink>
                <AppLink href="/settings" className="footer-link">
                  Settings
                </AppLink>
              </div>
            </div>
          </div>
        </div>
        <div className="border-border/70 text-muted-foreground mt-8 flex flex-col gap-3 border-t pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            Designed to help prompt work feel faster, calmer, and more
            deliberate.
          </p>
          <AppLink
            href="/pricing"
            className="hover:text-foreground inline-flex items-center gap-1.5"
          >
            Review plans and credits
            <ArrowUpRight className="h-3.5 w-3.5" />
          </AppLink>
        </div>
      </div>
    </footer>
  )
}
