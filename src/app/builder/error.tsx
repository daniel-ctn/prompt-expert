'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function BuilderError({
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
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <AlertCircle className="text-destructive h-12 w-12" />
        <h2 className="text-2xl font-bold">Builder error</h2>
        <p className="text-muted-foreground max-w-md">
          Something went wrong loading the prompt builder. Please try again.
        </p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
