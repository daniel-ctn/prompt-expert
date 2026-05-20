import type { Metadata } from 'next'
import { Home } from 'lucide-react'
import { AppLink, appLinkTransitionTypes } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Page Not Found',
}

export default function NotFound() {
  return (
    <div className="page-shell-compact flex min-h-[calc(100vh-10rem)] items-center">
      <div className="paper-edge bg-card relative w-full overflow-hidden px-6 py-14 text-center sm:px-10">
        {/* Big editorial 404 */}
        <p className="font-display nums text-foreground/15 absolute -top-3 -right-2 text-[12rem] leading-none font-medium tracking-tighter select-none sm:text-[16rem]">
          404
        </p>
        <div className="relative space-y-4">
          <p className="chapter-mark justify-center">№ — Page not found</p>
          <h1 className="font-display text-4xl leading-[1] font-medium tracking-[-0.02em] text-balance sm:text-6xl">
            This page got <span className="italic">lost</span> in the margin.
          </h1>
          <p className="text-muted-foreground mx-auto max-w-xl text-[14.5px] leading-7">
            The link may be outdated, the page may have moved, or the route may
            no longer exist.
          </p>
          <div className="hand-rule mx-auto mt-6 max-w-[14rem] opacity-70" />
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              render={
                <AppLink
                  href="/"
                  transitionTypes={appLinkTransitionTypes.back}
                />
              }
              className="rounded-sm"
            >
              <Home className="h-4 w-4" />
              Go home
            </Button>
            <Button
              render={
                <AppLink
                  href="/builder"
                  transitionTypes={appLinkTransitionTypes.builder}
                />
              }
              className="rounded-sm"
            >
              Open the builder
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
