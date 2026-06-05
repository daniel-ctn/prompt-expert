'use client'

import { ArrowUpRight, Command } from 'lucide-react'
import { AppLink } from '@/components/ui/app-link'
import { LogoMark } from '@/components/layout/logo-mark'
import { APP_NAME } from '@/config/constants'
import { Button } from '@/components/ui/button'
import { setCommandPaletteOpen } from '@/lib/command-palette'

export function Footer() {
  return (
    <footer className="px-3 pb-4 sm:px-4 sm:pb-5">
      <div className="border-foreground bg-card mx-auto max-w-7xl border px-5 py-7 shadow-[var(--shadow-paper-sm)] sm:px-7">
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="border-foreground bg-foreground text-background flex h-11 w-11 items-center justify-center border shadow-[var(--shadow-paper-sm)]">
                <LogoMark className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-lg font-medium">{APP_NAME}</p>
                <p className="text-muted-foreground font-mono text-[10px] tracking-[0.2em] uppercase">
                  Structured prompting · stronger outputs
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="rounded-sm"
                onClick={() => setCommandPaletteOpen(true)}
              >
                <Command className="h-3.5 w-3.5" />
                Open command palette
              </Button>
              <p className="text-muted-foreground font-mono text-[10px] tracking-wider uppercase">
                Press{' '}
                <kbd className="border-foreground/70 bg-background rounded-sm border px-1.5 py-0.5 normal-case">
                  Ctrl
                </kbd>{' '}
                +{' '}
                <kbd className="border-foreground/70 bg-background rounded-sm border px-1.5 py-0.5 normal-case">
                  K
                </kbd>{' '}
                any time.
              </p>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
                — Explore
              </p>
              <div className="space-y-1">
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
              <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
                — Manage
              </p>
              <div className="space-y-1">
                <AppLink href="/prompts" className="footer-link">
                  My prompts
                </AppLink>
                <AppLink href="/history" className="footer-link">
                  History
                </AppLink>
                <AppLink href="/settings" className="footer-link">
                  Settings
                </AppLink>
              </div>
            </div>
          </div>
        </div>
        <div className="border-foreground/40 text-muted-foreground mt-8 flex flex-col gap-3 border-t pt-4 font-mono text-[10px] tracking-wider uppercase sm:flex-row sm:items-center sm:justify-between">
          <a
            href="https://daniel-tsx.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground group inline-flex items-center gap-1.5"
          >
            — Designed &amp; built by{' '}
            <span className="text-foreground font-medium tracking-normal normal-case decoration-[var(--marigold)] decoration-2 underline-offset-4 group-hover:underline">
              Daniel
            </span>
            <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <AppLink
            href="/gallery"
            className="hover:text-foreground inline-flex items-center gap-1.5"
          >
            Browse the gallery
            <ArrowUpRight className="h-3.5 w-3.5" />
          </AppLink>
        </div>
      </div>
    </footer>
  )
}
