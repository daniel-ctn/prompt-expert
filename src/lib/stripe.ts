import Stripe from "stripe";
import { getDb } from "@/lib/db";
import { subscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const globalForStripe = globalThis as unknown as {
  stripe: Stripe | undefined;
};

export function getStripe(): Stripe {
  if (!globalForStripe.stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    globalForStripe.stripe = new Stripe(key);
  }
  return globalForStripe.stripe;
}

export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
): Promise<string> {
  const db = getDb();
  const stripe = getStripe();

  const existing = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  });

  if (existing?.stripeCustomerId) {
    return existing.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { userId },
  });

  if (existing) {
    await db
      .update(subscriptions)
      .set({ stripeCustomerId: customer.id, updatedAt: new Date() })
      .where(eq(subscriptions.userId, userId));
  } else {
    await db.insert(subscriptions).values({
      userId,
      stripeCustomerId: customer.id,
      plan: "free",
      status: "active",
    });
  }

  return customer.id;
}

export async function createCheckoutSession(
  userId: string,
  email: string,
  mode: "subscription" | "payment",
): Promise<string> {
  const stripe = getStripe();
  const customerId = await getOrCreateStripeCustomer(userId, email);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const priceId =
    mode === "subscription"
      ? process.env.STRIPE_PRO_MONTHLY_PRICE_ID
      : process.env.STRIPE_CREDIT_PACK_PRICE_ID;

  if (!priceId) {
    throw new Error(
      mode === "subscription"
        ? "STRIPE_PRO_MONTHLY_PRICE_ID is not set"
        : "STRIPE_CREDIT_PACK_PRICE_ID is not set",
    );
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/settings?billing=success`,
    cancel_url: `${appUrl}/pricing`,
    metadata: { userId, type: mode === "subscription" ? "pro" : "credit_pack" },
  });

  if (!session.url) throw new Error("Failed to create checkout session");
  return session.url;
}

export async function createPortalSession(
  userId: string,
): Promise<string> {
  const stripe = getStripe();
  const db = getDb();

  const sub = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  });

  if (!sub?.stripeCustomerId) {
    throw new Error("No Stripe customer found for this user");
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripeCustomerId,
    return_url: `${appUrl}/settings`,
  });

  return session.url;
}
