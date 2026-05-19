# Prompt Expert Non-Profit Launch Readiness

This document lists the work needed before launching Prompt Expert as a public non-profit product.

Launch goal:

> Prompt Expert should be a free, community-oriented prompt workflow tool that helps builders create, test, improve, save, share, and fork prompts without a paid subscription model.

The product can still enforce usage limits. Non-profit does not mean unlimited AI spend.

## Launch Decision

- [ ] Confirm final positioning: non-profit, community tool, open prompt workflow utility.
- [ ] Confirm whether the project will be open source at launch.
- [ ] Choose a public domain.
- [ ] Decide whether donations or sponsorships are allowed. If yes, keep them separate from feature access.
- [ ] Decide whether hosted AI credits are free-only, BYO-key-first, or a hybrid.

Recommended model:

- Free account with a small monthly hosted AI credit allowance.
- Bring-your-own provider keys for higher usage.
- No paid Pro plan.
- No paid credit packs.
- Optional donation link that does not unlock product features.

## P0 Launch Blockers

### Remove Payment And Subscription Flows

- [x] Remove Stripe checkout routes:
  - `src/app/api/stripe/checkout/route.ts`
  - `src/app/api/stripe/portal/route.ts`
  - `src/app/api/stripe/webhook/route.ts`
- [x] Remove Stripe helper:
  - `src/lib/stripe.ts`
- [x] Remove `stripe` from `package.json`.
- [x] Remove Stripe env vars from `.env.example`:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_PRO_MONTHLY_PRICE_ID`
  - `STRIPE_CREDIT_PACK_PRICE_ID`
- [x] Remove paid pricing UI from:
  - `src/app/pricing/page.tsx`
  - `src/app/pricing/pricing-cards.tsx`
  - `src/components/settings/billing-section.tsx`
  - `src/components/upgrade-modal.tsx`
- [x] Replace "Pricing" navigation labels with "Usage", "Limits", or "Support".
- [x] Remove "Upgrade", "Pro", "subscription", and "buy credits" copy from the app.
- [x] Update `src/config/plans.ts` so plans represent usage tiers, not paid subscriptions.
- [x] Remove or repurpose subscription fields in the database schema if not needed:
  - `subscriptions`
  - `stripeCustomerId`
  - `stripeSubscriptionId`
- [ ] Generate and commit a Drizzle migration for schema changes.

### Keep Usage Limits

- [x] Keep credit accounting for hosted AI calls.
- [x] Rename credit language if needed:
  - "credits" is fine for usage accounting.
  - Avoid copy that implies a paid credit economy.
- [x] Define free hosted limits:
  - Monthly hosted AI calls.
  - Per-minute burst limit.
  - Maximum prompt input length.
  - Maximum output token budget per request.
- [x] Make credit deduction atomic so concurrent requests cannot overspend the allowance.
- [x] Use a durable rate limiter instead of the current in-memory limiter:
  - Preferred: Upstash Redis.
  - Acceptable for low scale: Postgres-backed rate limit table.
- [x] Rate limit by user ID for signed-in users.
- [x] Rate limit by IP for unauthenticated/public routes.
- [x] Add a global emergency switch for hosted AI:
  - Example: `ENABLE_HOSTED_AI=false`.
- [x] Add provider-level fallback behavior when hosted AI is disabled:
  - Let users continue building prompts locally.
  - Allow BYO keys if configured.
  - Show clear non-alarming copy.
- [x] Keep usage history visible in settings.
- [x] Add tests for:
  - Credit exhaustion.
  - Atomic credit deduction.
  - Rate-limit rejection.
  - BYO key path.
  - Hosted AI disabled path.

### Legal, Privacy, And Trust

- [ ] Add `LICENSE` if the project is open source.
- [x] Update `README.md` license section. It currently says the project is private.
- [x] Add Privacy Policy page.
- [x] Add Terms of Use page.
- [x] Add footer links to Privacy, Terms, GitHub, and support/contact.
- [x] Privacy policy must disclose:
  - OAuth profile data.
  - Saved prompts and public prompts.
  - Prompt history and model outputs.
  - User-provided provider API keys.
  - API tokens.
  - Database provider.
  - AI providers.
  - Vercel Analytics.
  - Data deletion/export behavior.
- [x] Terms must clarify:
  - The product is provided as-is.
  - AI output may be wrong.
  - Users are responsible for prompts they publish.
  - Public gallery content may be visible to everyone.
  - Abuse, spam, harassment, and sensitive data misuse are prohibited.
- [x] Add a clear support/security contact.

## P1 Launch Readiness

### Product Repositioning

- [x] Rewrite homepage copy for non-profit positioning.
- [x] Replace pricing CTA with usage/support CTA.
- [x] Explain the usage model clearly:
  - Free hosted allowance.
  - BYO keys for heavier use.
  - Public gallery and sharing are free.
- [x] Add a "Why non-profit?" section or docs note.
- [x] Remove "teams and power users" paid-plan framing unless it remains relevant without payment.
- [x] Update metadata and Open Graph copy.
- [ ] Update screenshots/demo data if existing screenshots imply paid plans.

### Data And Account Controls

- [x] Add account deletion.
- [x] Add export user data:
  - Saved prompts.
  - Prompt history.
  - Public prompts.
  - API token metadata.
  - Provider key metadata, not raw keys.
- [x] Add delete prompt history action.
- [x] Add delete all API tokens action.
- [x] Add delete all provider keys action.
- [x] Add public prompt visibility review:
  - Make "public" opt-in.
  - Warn users before publishing.
  - Make unpublish easy.
- [ ] Consider admin/moderation tools for public gallery abuse.

### Security And Abuse Prevention

- [x] Validate AI route request bodies with Zod.
- [x] Add maximum body size protections for AI routes.
- [x] Add input length caps before model calls.
- [x] Add output token caps for each model call.
- [x] Add structured logging for AI requests without logging raw prompts by default.
- [x] Redact secrets, API keys, cookies, and auth headers from logs.
- [x] Ensure BYO provider keys are encrypted with a strong production `ENCRYPTION_KEY`.
- [x] Document key rotation behavior. Changing `ENCRYPTION_KEY` will make existing stored provider keys unreadable.
- [ ] Consider disabling saved BYO keys for launch and requiring paste-per-session if risk feels too high.
- [x] Add basic security headers if not provided by hosting.

### Deployment And Environment

- [ ] Create production Neon database.
- [ ] Apply migrations to production with `pnpm db:migrate`.
- [ ] Configure production OAuth apps:
  - Google callback.
  - GitHub callback.
- [ ] Set production env vars:
  - `DATABASE_URL`
  - `AUTH_SECRET`
  - `AUTH_GOOGLE_ID`
  - `AUTH_GOOGLE_SECRET`
  - `AUTH_GITHUB_ID`
  - `AUTH_GITHUB_SECRET`
  - `ENCRYPTION_KEY`
  - `NEXT_PUBLIC_APP_URL`
  - Hosted AI provider keys if hosted AI is enabled.
  - Durable rate limit store credentials.
- [ ] Remove payment env vars from production.
- [ ] Verify build on Vercel preview.
- [ ] Verify production OAuth redirects.
- [ ] Verify protected routes redirect correctly.
- [ ] Verify public gallery and shared prompt routes.
- [ ] Verify hosted AI credit limits.
- [ ] Verify BYO key flow.

## P2 Nice-To-Have Before Wider Launch

- [ ] Add public changelog.
- [ ] Add docs page for BYO provider keys.
- [ ] Add docs page for prompt sharing and public gallery behavior.
- [ ] Add lightweight admin dashboard for:
  - Total users.
  - Hosted AI usage.
  - Public prompt count.
  - Abuse reports.
- [ ] Add "report prompt" action for public prompts.
- [ ] Add seed prompts for the gallery.
- [ ] Add email-free GitHub-only auth option if the project should avoid collecting extra identity data.
- [ ] Add OpenGraph image specific to non-profit positioning.

## Verification Checklist

Run before public launch:

```bash
pnpm lint
pnpm test
pnpm build
```

Manual smoke test:

- [ ] Open homepage.
- [ ] Sign in with GitHub.
- [ ] Sign in with Google, if enabled.
- [ ] Open builder.
- [ ] Assemble a prompt without AI.
- [ ] Run hosted optimize/test/analyze within limit.
- [ ] Exhaust credits and confirm graceful limit state.
- [ ] Add BYO provider key.
- [ ] Run optimize/test/analyze through BYO key.
- [ ] Save a prompt.
- [ ] Publish a prompt.
- [ ] Unpublish a prompt.
- [ ] Fork a public prompt.
- [ ] Create and revoke an API token.
- [ ] Export/delete account data if implemented.

## Recommended Launch Scope

Launch only these capabilities first:

- Prompt builder.
- Prompt testing.
- Prompt optimization.
- Prompt analysis.
- Saved prompt library.
- Public gallery.
- Share/fork prompts.
- BYO provider keys.
- Small hosted AI allowance.

Defer:

- Paid subscriptions.
- Paid credit packs.
- Team workspaces.
- Advanced analytics.
- Admin moderation automation.

## Go / No-Go

Go when:

- [ ] Payment/subscription UI and routes are removed or fully replaced by donation-only support.
- [ ] Hosted AI usage is durably limited.
- [ ] Credit deduction cannot overspend under concurrency.
- [ ] Privacy and terms pages are live.
- [ ] License and README match non-profit/open-source positioning.
- [ ] Production OAuth, database, and AI flows pass smoke tests.

No-go when:

- [ ] Paid Pro/credit pack copy is still visible.
- [ ] Hosted AI can be abused across serverless instances.
- [ ] Users cannot understand what data is stored or sent to AI providers.
- [ ] Public prompts can be published without clear user consent.
- [ ] Production environment depends on local-only assumptions.
