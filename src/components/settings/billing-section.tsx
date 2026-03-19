"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Coins, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PLANS, CREDIT_PACK } from "@/config/plans";
import type { PlanId } from "@/config/plans";
import type { CreditInfo } from "@/lib/credits";

interface BillingSectionProps {
  plan: PlanId;
  credits: CreditInfo;
}

export function BillingSection({ plan, credits }: BillingSectionProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const planInfo = PLANS[plan];

  async function handlePortal() {
    setLoading("portal");
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(null);
    }
  }

  async function handleBuyCredits() {
    setLoading("credits");
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "credit_pack" }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      setLoading(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Billing & Credits
        </CardTitle>
        <CardDescription>
          Manage your subscription and credit balance.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
          <div>
            <p className="text-sm font-medium">Current Plan</p>
            <p className="text-2xl font-bold">
              {planInfo.name}
              <span className="ml-1.5 text-sm font-normal text-muted-foreground">
                {plan === "free" ? "— Free" : `— $${planInfo.price}/mo`}
              </span>
            </p>
          </div>
          {plan === "free" ? (
            <Button
              render={<Link href="/pricing" />}
              size="sm"
              className="gap-1.5 bg-primary"
            >
              Upgrade
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePortal}
              disabled={loading === "portal"}
            >
              {loading === "portal" ? "Loading..." : "Manage Subscription"}
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border/50 p-4">
          <div className="flex items-center gap-3">
            <Coins className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm font-medium">Credits Remaining</p>
              <p className="text-sm text-muted-foreground">
                {credits.monthly} monthly + {credits.bonus} bonus = {credits.total} total
              </p>
            </div>
          </div>
          {plan === "pro" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleBuyCredits}
              disabled={loading === "credits"}
            >
              {loading === "credits"
                ? "Loading..."
                : `+${CREDIT_PACK.credits} for $${CREDIT_PACK.price}`}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
