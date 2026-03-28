import { Sparkles } from 'lucide-react'
import { AppLink } from '@/components/ui/app-link'
import { APP_NAME } from '@/config/constants'

export function Footer() {
  return (
    <footer className="border-border/50 relative border-t">
      <div className="via-primary/30 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-md">
              <Sparkles className="text-primary-foreground h-3 w-3" />
            </div>
            <span className="font-display text-sm font-medium">{APP_NAME}</span>
          </div>

          <nav className="flex items-center gap-6">
            <AppLink
              href="/builder"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Builder
            </AppLink>
            <AppLink
              href="/gallery"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Gallery
            </AppLink>
            <AppLink
              href="/chain"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Chain
            </AppLink>
            <AppLink
              href="/pricing"
              className="text-muted-foreground hover:text-foreground text-xs transition-colors"
            >
              Pricing
            </AppLink>
          </nav>

          <p className="text-muted-foreground/70 text-xs">
            Build better prompts, get better results.
          </p>
        </div>
      </div>
    </footer>
  )
}
