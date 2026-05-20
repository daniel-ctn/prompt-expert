'use client'

import { Coins } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useUpgradeModal } from '@/stores/upgrade-modal'

export function UpgradeModal() {
  const { isOpen, close } = useUpgradeModal()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <div className="border-foreground mx-auto mb-2 flex h-12 w-12 items-center justify-center border bg-[color-mix(in_oklch,var(--marigold)_32%,var(--background))] shadow-[var(--shadow-paper-sm)]">
            <Coins className="h-5 w-5" />
          </div>
          <DialogTitle className="font-display text-center text-2xl font-medium tracking-tight">
            You&apos;ve hit the monthly cap
          </DialogTitle>
          <DialogDescription className="text-center text-[14px] leading-6">
            You&apos;ve used all of this period&apos;s free credits. They reset
            at the start of the next month — your saved prompts, history, and
            workspace stay exactly where you left them.
          </DialogDescription>
        </DialogHeader>

        <div className="border-foreground/85 bg-background mt-2 border p-4">
          <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
            What you can still do
          </p>
          <ul className="mt-3 space-y-2 text-[13.5px] leading-6">
            <li className="flex items-start gap-2">
              <span className="font-bold text-[var(--marigold)]">+</span>
              Open and edit prompts in the builder
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[var(--marigold)]">+</span>
              Browse the gallery, fork templates, organize your library
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-[var(--marigold)]">+</span>
              Bring your own provider keys in Settings to bypass the cap
            </li>
          </ul>
        </div>

        <DialogFooter>
          <Button onClick={close} className="w-full">
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
