'use client'

import { ArrowRight, Coins, KeyRound } from 'lucide-react'
import { AppLink } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { useUpgradeModal } from '@/stores/upgrade-modal'
import { PLANS } from '@/config/plans'

export function UpgradeModal() {
  const { isOpen, close } = useUpgradeModal()

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
            <Coins className="text-primary h-6 w-6" />
          </div>
          <DialogTitle className="text-center">
            Hosted credit limit reached
          </DialogTitle>
          <DialogDescription className="text-center">
            You&apos;ve used your hosted AI allowance for this period. You can
            keep building prompts or connect your own provider key in Settings.
          </DialogDescription>
        </DialogHeader>

        <div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-2">
            <KeyRound className="text-primary h-4 w-4" />
            <span className="text-sm font-semibold">
              {PLANS.free.credits} hosted credits per month
            </span>
          </div>
          <ul className="text-muted-foreground space-y-1.5 text-sm">
            {[
              'Prompt builder remains available',
              'Saved prompts and public gallery remain available',
              'BYO provider keys can continue AI calls',
              'No payment is required',
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="text-primary">+</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            render={<AppLink href="/pricing" />}
            className="bg-primary w-full gap-2"
            onClick={close}
          >
            Review usage options
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full" onClick={close}>
            Maybe later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
