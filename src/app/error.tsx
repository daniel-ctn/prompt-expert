'use client'

import { useEffect } from 'react'
import { RefreshCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
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
    <div className="page-shell-compact flex min-h-[60vh] items-center">
      <div className="paper-edge bg-card relative w-full overflow-hidden px-6 py-12 text-center sm:px-10">
        <p className="font-display nums text-foreground/12 absolute -top-1 -right-2 text-[10rem] leading-none font-medium tracking-tighter select-none sm:text-[14rem]">
          !
        </p>
        <div className="relative space-y-4">
          <p className="chapter-mark justify-center">№ — Unexpected error</p>
          <h2 className="font-display text-3xl leading-[1] font-medium tracking-[-0.02em] text-balance sm:text-5xl">
            Something <span className="italic">slipped</span> while loading.
          </h2>
          <p className="text-muted-foreground mx-auto max-w-xl text-[14.5px] leading-7">
            The app hit an unexpected error. Try reloading this section — if it
            happens again, we can trace it from here.
          </p>
          <div className="hand-rule mx-auto mt-4 max-w-[12rem] opacity-70" />
          <div className="pt-2">
            <Button onClick={reset} className="rounded-sm">
              <RefreshCcw className="h-4 w-4" />
              Try again
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
