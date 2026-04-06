import type { Metadata } from 'next'
import { Compass, Home } from 'lucide-react'
import { AppLink, appLinkTransitionTypes } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Page Not Found',
}

export default function NotFound() {
  return (
    <div className="page-shell-compact flex min-h-[calc(100vh-10rem)] items-center">
      <Card className="page-frame w-full bg-transparent">
        <CardContent className="flex flex-col items-center gap-5 py-14 text-center">
          <div className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-3xl">
            <Compass className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <p className="section-label">404</p>
            <h1 className="font-display text-4xl font-semibold tracking-tight">
              That page could not be found
            </h1>
            <p className="text-muted-foreground mx-auto max-w-xl text-sm leading-6">
              The link may be outdated, the page may have moved, or the route
              may no longer exist.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant="outline"
              render={
                <AppLink
                  href="/"
                  transitionTypes={appLinkTransitionTypes.back}
                />
              }
              className="rounded-full"
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
              className="rounded-full"
            >
              Open builder
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
