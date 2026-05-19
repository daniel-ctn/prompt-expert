ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_stripe_customer_id_unique";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_stripe_subscription_id_unique";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "stripe_customer_id";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "stripe_subscription_id";