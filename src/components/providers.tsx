'use client'

import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { UpgradeModal } from '@/components/upgrade-modal'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <TooltipProvider>
          {children}
          <UpgradeModal />
          <Toaster richColors position="bottom-right" />
        </TooltipProvider>
      </SessionProvider>
    </ThemeProvider>
  )
}
