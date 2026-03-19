import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { getDb } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { resetMonthlyCredits, addBonusCredits } from "@/lib/credits";
import { CREDIT_PACK } from "@/config/plans";
import type { PlanId } from "@/config/plans";
import type Stripe from "stripe";

function getSubscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  const details = invoice.parent?.subscription_details;
  if (!details) return null;
  return typeof details.subscription === "string"
    ? details.subscription
    : details.subscription?.id ?? null;
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Missing signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return Response.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  const db = getDb();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) break;

      if (session.metadata?.type === "credit_pack") {
        await addBonusCredits(userId, CREDIT_PACK.credits, "Credit pack purchase");
        break;
      }

      if (session.subscription) {
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription.id;

        await db
          .update(subscriptions)
          .set({
            stripeSubscriptionId: subscriptionId,
            plan: "pro",
            status: "active",
            currentPeriodStart: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.userId, userId));

        await resetMonthlyCredits(userId, "pro");
      }
      break;
    }

    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = getSubscriptionIdFromInvoice(invoice);
      if (!subscriptionId) break;

      const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.stripeSubscriptionId, subscriptionId),
      });

      if (sub && invoice.billing_reason === "subscription_cycle") {
        await resetMonthlyCredits(sub.userId, sub.plan as PlanId);
        await db
          .update(subscriptions)
          .set({ currentPeriodStart: new Date(), updatedAt: new Date() })
          .where(eq(subscriptions.userId, sub.userId));
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;

      await db
        .update(subscriptions)
        .set({
          status: subscription.status,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.stripeSubscriptionId, subscription.id),
      });

      await db
        .update(subscriptions)
        .set({
          plan: "free",
          status: "canceled",
          stripeSubscriptionId: null,
          currentPeriodStart: null,
          currentPeriodEnd: null,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));

      if (sub) {
        await resetMonthlyCredits(sub.userId, "free");
      }
      break;
    }
  }

  return Response.json({ received: true });
}
