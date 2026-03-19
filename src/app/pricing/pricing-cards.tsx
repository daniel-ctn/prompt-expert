"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS, CREDIT_PACK } from "@/config/plans";
import type { CreditInfo } from "@/lib/credits";

interface PricingCardsProps {
  currentPlan: "free" | "pro";
  credits: CreditInfo;
  isAuthenticated: boolean;
}

export function PricingCards({
  currentPlan,
  credits,
  isAuthenticated,
}: PricingCardsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleCheckout(type: "pro" | "credit_pack") {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setLoading(type);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(null);
    }
  }

  async function handleManage() {
    setLoading("manage");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoading(null);
    }
  }

  return (
    <div className="mt-14 grid w-full max-w-4xl gap-6 md:grid-cols-2">
      {/* Free Plan */}
      <div className="flex flex-col rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-display text-lg font-semibold">{PLANS.free.name}</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-4xl font-bold">$0</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Perfect for trying things out and casual use.
          </p>
        </div>

        <ul className="mb-8 flex-1 space-y-3">
          {PLANS.free.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {currentPlan === "free" ? (
          <Button variant="outline" disabled className="w-full">
            Current Plan
          </Button>
        ) : (
          <Button variant="outline" className="w-full" disabled>
            Included
          </Button>
        )}
      </div>

      {/* Pro Plan */}
      <div className="relative flex flex-col rounded-xl border-2 border-primary/40 bg-card/50 p-6 backdrop-blur-sm">
        <div className="absolute -top-3 right-4 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
          Recommended
        </div>

        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-display text-lg font-semibold">{PLANS.pro.name}</h3>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-4xl font-bold">${PLANS.pro.price}</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            For power users who rely on AI prompt engineering daily.
          </p>
        </div>

        <ul className="mb-8 flex-1 space-y-3">
          {PLANS.pro.features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {currentPlan === "pro" ? (
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleManage}
              disabled={loading === "manage"}
            >
              {loading === "manage" ? "Loading..." : "Manage Subscription"}
            </Button>
            <Button
              className="w-full bg-primary"
              onClick={() => handleCheckout("credit_pack")}
              disabled={loading === "credit_pack"}
            >
              {loading === "credit_pack"
                ? "Loading..."
                : `Buy ${CREDIT_PACK.credits} Credits — $${CREDIT_PACK.price}`}
            </Button>
          </div>
        ) : (
          <Button
            className="w-full bg-primary shadow-md transition-all hover:glow-sm"
            onClick={() => handleCheckout("pro")}
            disabled={loading === "pro"}
          >
            {loading === "pro" ? "Loading..." : "Upgrade to Pro"}
          </Button>
        )}
      </div>

      {/* Credits info for authenticated users */}
      {isAuthenticated && (
        <div className="col-span-full rounded-xl border border-border/50 bg-card/50 p-5 text-center backdrop-blur-sm">
          <p className="text-sm text-muted-foreground">
            You have{" "}
            <span className="font-semibold text-foreground">{credits.total} credits</span>{" "}
            remaining ({credits.monthly} monthly + {credits.bonus} bonus)
          </p>
        </div>
      )}
    </div>
  );
}
