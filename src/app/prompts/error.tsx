'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function PromptsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="page-shell flex min-h-[60vh] items-center">
      <Card className="page-frame w-full bg-transparent">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <div className="bg-destructive/10 text-destructive flex h-14 w-14 items-center justify-center rounded-3xl">
            <AlertCircle className="h-6 w-6" />
          </div>
          <div className="space-y-2">
            <p className="section-label">Prompt library error</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              We could not load your prompts right now
            </h2>
            <p className="text-muted-foreground mx-auto max-w-xl text-sm leading-6">
              This is usually temporary. Reload the library and we can keep
              going from there.
            </p>
          </div>
          <Button onClick={reset} className="rounded-full">
            <RefreshCcw className="h-4 w-4" />
            Reload prompts
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
