'use client';

import Link from 'next/link';
import { Sparkles, Coins, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useUpgradeModal } from '@/stores/upgrade-modal';
import { PLANS } from '@/config/plans';

export function UpgradeModal() {
  const { isOpen, close } = useUpgradeModal();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent>
        <DialogHeader>
          <div className="bg-primary/10 mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full">
            <Coins className="text-primary h-6 w-6" />
          </div>
          <DialogTitle className="text-center">
            You&apos;re out of credits
          </DialogTitle>
          <DialogDescription className="text-center">
            You&apos;ve used all your AI credits for this period. Upgrade to Pro
            for {PLANS.pro.credits.toLocaleString()} credits per month.
          </DialogDescription>
        </DialogHeader>

        <div className="border-primary/20 bg-primary/5 rounded-lg border p-4">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="text-primary h-4 w-4" />
            <span className="text-sm font-semibold">
              Pro Plan — ${PLANS.pro.price}/month
            </span>
          </div>
          <ul className="text-muted-foreground space-y-1.5 text-sm">
            {PLANS.pro.features.slice(0, 4).map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="text-primary">+</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            render={<Link href="/pricing" />}
            className="bg-primary w-full gap-2"
            onClick={close}
          >
            View Plans
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full" onClick={close}>
            Maybe later
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
