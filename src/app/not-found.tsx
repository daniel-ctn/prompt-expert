import type { Metadata } from 'next'
import { Home } from 'lucide-react'
import { AppLink, appLinkTransitionTypes } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Page Not Found',
}

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 text-center">
      <p className="text-muted-foreground text-sm font-medium">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground mt-2 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Button
          variant="outline"
          render={
            <AppLink href="/" transitionTypes={appLinkTransitionTypes.back} />
          }
        >
          <Home className="mr-2 h-4 w-4" />
          Home
        </Button>
        <Button
          render={
            <AppLink
              href="/builder"
              transitionTypes={appLinkTransitionTypes.builder}
            />
          }
        >
          Go to Builder
        </Button>
      </div>
    </div>
  )
}
