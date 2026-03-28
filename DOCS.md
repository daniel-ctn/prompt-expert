# Prompt Expert — Developer Documentation

A comprehensive guide for developers joining the project. Covers setup, architecture, conventions, and how every part of the system works.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Getting Started](#3-getting-started)
4. [Project Structure](#4-project-structure)
5. [Architecture Overview](#5-architecture-overview)
6. [Database](#6-database)
7. [Authentication](#7-authentication)
8. [Routing & Pages](#8-routing--pages)
9. [API Routes](#9-api-routes)
10. [Server Actions](#10-server-actions)
11. [State Management](#11-state-management)
12. [Components](#12-components)
13. [AI Integration](#13-ai-integration)
14. [Payments & Credits](#14-payments--credits)
15. [Security](#15-security)
16. [Styling](#16-styling)
17. [Testing](#17-testing)
18. [Deployment](#18-deployment)
19. [How-To Guides](#19-how-to-guides)
20. [Coding Conventions](#20-coding-conventions)
21. [Troubleshooting](#21-troubleshooting)

---

## 1. Project Overview

**Prompt Expert** is a web application for building, optimizing, testing, and managing AI prompts. Users can:

- Build prompts with structured controls (role, context, task, constraints, tone, format)
- Optimize prompts with AI assistance
- Test prompts against multiple AI models and compare outputs
- Save, version, organize, and share prompts
- Fork community prompts from a public gallery
- Chain multiple prompts into multi-step workflows
- Manage their own API keys for AI providers
- Subscribe to Pro for more credits, or purchase credit packs
- Access their prompts via a REST API

---

## 2. Tech Stack

| Layer             | Technology                    | Version         |
| ----------------- | ----------------------------- | --------------- |
| Framework         | Next.js (App Router)          | 16.2.0          |
| UI Library        | React                         | 19.2.3          |
| Language          | TypeScript                    | 5.x             |
| Styling           | Tailwind CSS                  | 4.x             |
| Component Library | shadcn/ui (base-nova style)   | 4.0.8           |
| State Management  | Zustand                       | 5.0.12          |
| Database          | PostgreSQL (Neon serverless)  | —               |
| ORM               | Drizzle ORM                   | 0.45.x          |
| Authentication    | Auth.js (NextAuth v5)         | 5.0.0-beta.30   |
| AI SDK            | Vercel AI SDK                 | 6.0.x           |
| AI Providers      | OpenAI, Anthropic, Google     | via `@ai-sdk/*` |
| Validation        | Zod                           | 4.3.6           |
| Testing           | Vitest + Testing Library      | 4.1.0           |
| Package Manager   | pnpm                          | 10.26.0         |
| Payments          | Stripe                        | 20.4.x          |
| Analytics         | Vercel Analytics              | 2.x             |
| Compiler          | React Compiler (babel plugin) | 1.0.0           |

---

## 3. Getting Started

### Prerequisites

- **Node.js** 20+ (LTS recommended)
- **pnpm** 10+ (`corepack enable && corepack prepare pnpm@latest --activate`)
- A **Neon** PostgreSQL database ([neon.tech](https://neon.tech) — free tier works)
- OAuth credentials for **Google** and/or **GitHub** ([console.cloud.google.com](https://console.cloud.google.com), [github.com/settings/developers](https://github.com/settings/developers))
- At least one AI API key: **OpenAI**, **Anthropic**, or **Google AI**

### Setup Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd prompt-expert

# 2. Install dependencies
pnpm install

# 3. Create environment file
cp .env.example .env
# Then fill in the values (see Environment Variables below)

# 4. Push database schema (creates tables)
pnpm db:push

# 5. Start the dev server
pnpm dev
```

The app will be running at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the project root with these values:

```env
# ── Database ──────────────────────────────────────
DATABASE_URL="postgresql://user:password@host.neon.tech/dbname?sslmode=require"

# ── Auth.js ───────────────────────────────────────
AUTH_SECRET="generate-with: openssl rand -base64 32"
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# ── AI Providers (at least one required) ──────────
OPENAI_API_KEY="sk-..."
ANTHROPIC_API_KEY="sk-ant-..."
GOOGLE_GENERATIVE_AI_API_KEY="AIza..."

# ── Encryption (for user API key storage) ─────────
ENCRYPTION_KEY="at-least-32-characters-long-secret-key"

# ── Stripe (payments) ─────────────────────────────
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_..."
STRIPE_PRO_MONTHLY_PRICE_ID="price_..."
STRIPE_CREDIT_PACK_PRICE_ID="price_..."

# ── Optional ──────────────────────────────────────
NEXT_PUBLIC_APP_URL="https://your-domain.com"
```

### NPM Scripts

| Command            | Description                                  |
| ------------------ | -------------------------------------------- |
| `pnpm dev`         | Start development server                     |
| `pnpm build`       | Production build                             |
| `pnpm start`       | Start production server                      |
| `pnpm lint`        | Run ESLint                                   |
| `pnpm test`        | Run Vitest tests                             |
| `pnpm test:watch`  | Run tests in watch mode                      |
| `pnpm db:generate` | Generate a new migration from schema changes |
| `pnpm db:migrate`  | Apply pending migrations                     |
| `pnpm db:push`     | Push schema directly (skip migration files)  |
| `pnpm db:studio`   | Open Drizzle Studio (database GUI)           |

---

## 4. Project Structure

```
prompt-expert/
├── drizzle/                    # Generated SQL migration files
├── public/                     # Static assets
├── src/
│   ├── __tests__/              # Vitest unit tests
│   ├── app/                    # Next.js App Router (pages + API routes)
│   │   ├── api/
│   │   │   ├── ai/             # AI endpoints (optimize, test, analyze)
│   │   │   ├── auth/           # NextAuth route handler
│   │   │   ├── credits/        # Credits balance endpoint
│   │   │   ├── stripe/         # Stripe checkout, portal, webhook
│   │   │   └── v1/             # Public REST API (token-authenticated)
│   │   ├── builder/            # Prompt builder page
│   │   ├── chain/              # Prompt chaining page
│   │   ├── gallery/            # Public prompt gallery
│   │   ├── history/            # Prompt test/optimize history
│   │   ├── login/              # Login page
│   │   ├── pricing/            # Pricing page + plan cards
│   │   ├── prompts/            # User's saved prompts (list + detail)
│   │   ├── settings/           # API keys + tokens management
│   │   ├── share/[id]/         # Public prompt share view
│   │   ├── system-prompts/     # Custom system prompt management
│   │   ├── layout.tsx          # Root layout (fonts, providers, header/footer)
│   │   ├── page.tsx            # Landing page
│   │   ├── error.tsx           # Global error boundary
│   │   ├── not-found.tsx       # 404 page
│   │   └── globals.css         # Tailwind + shadcn CSS imports
│   ├── components/
│   │   ├── gallery/            # Gallery cards, filters, list
│   │   ├── history/            # History viewer
│   │   ├── layout/             # Header + Footer
│   │   ├── prompt-builder/     # Builder controls + preview (16 components)
│   │   ├── prompt-chain/       # Chain builder
│   │   ├── prompts/            # Prompt CRUD components (cards, detail, filters)
│   │   ├── settings/           # API key + token + billing managers
│   │   ├── system-prompts/     # System prompt manager
│   │   ├── ui/                 # shadcn/ui primitives (do not edit manually)
│   │   ├── upgrade-modal.tsx   # Out-of-credits upgrade dialog
│   │   └── providers.tsx       # SessionProvider + Toaster + TooltipProvider
│   ├── config/
│   │   ├── constants.ts        # Models, categories, tones, templates, defaults
│   │   ├── plans.ts            # Plan definitions, credit costs, pricing
│   │   └── prompts.ts          # System prompts for AI optimizer + analyzer
│   ├── lib/
│   │   ├── actions/            # Server Actions (prompt CRUD, API keys, etc.)
│   │   ├── ai/index.ts         # AI model factory (getModel, assemblePrompt)
│   │   ├── auth/index.ts       # Auth.js configuration (includes plan in session)
│   │   ├── db/
│   │   │   ├── index.ts        # Database connection (Neon + Drizzle)
│   │   │   └── schema.ts       # All table definitions
│   │   ├── validators/         # Zod schemas
│   │   ├── credits.ts          # Credit balance management + transactions
│   │   ├── crypto.ts           # AES-256-GCM encrypt/decrypt for API keys
│   │   ├── rate-limit.ts       # In-memory rate limiter
│   │   ├── stripe.ts           # Stripe SDK, checkout, portal, customer mgmt
│   │   ├── track-event.ts      # Prompt event tracking (copy, fork, share)
│   │   ├── track-usage.ts      # AI API usage tracking
│   │   └── utils.ts            # cn() utility (clsx + tailwind-merge)
│   ├── stores/
│   │   ├── prompt-builder.ts   # Zustand store for builder state
│   │   └── upgrade-modal.ts    # Zustand store for upgrade modal
│   ├── types/
│   │   └── index.ts            # Shared TypeScript types
│   └── middleware.ts           # Auth middleware for protected routes
├── .env.example                # Template for environment variables
├── components.json             # shadcn/ui configuration
├── drizzle.config.ts           # Drizzle Kit configuration
├── next.config.ts              # Next.js configuration
├── package.json
├── tsconfig.json
├── vitest.config.ts            # Vitest configuration
├── PLAN.md                     # Enhancement plan & progress tracker
└── DOCS.md                     # This file
```

---

## 5. Architecture Overview

### Request Flow

```
Browser
  │
  ├─ Server Components (pages) ──► Server Actions ──► Drizzle ORM ──► Neon PostgreSQL
  │
  ├─ Client Components ──► API Routes (/api/ai/*) ──► Credits check ──► Vercel AI SDK ──► AI Provider APIs
  │
  ├─ Client Components ──► API Routes (/api/stripe/*) ──► Stripe API (checkout, portal)
  │
  ├─ Stripe Webhooks ──► /api/stripe/webhook ──► Subscription + credit updates ──► Database
  │
  └─ REST API clients ──► /api/v1/prompts (Bearer token auth) ──► Database
```

### Key Architectural Decisions

1. **Server Components by default.** Pages are server components that fetch data directly. Only components that need interactivity (forms, dropdowns, state) use `"use client"`.

2. **Server Actions for mutations.** All database writes go through server actions in `src/lib/actions/`. These are called directly from client components without manual API routes.

3. **API Routes only for AI streaming.** The `/api/ai/*` routes exist because streaming responses require the Web Streams API, which server actions don't support well.

4. **Zustand for builder state.** The prompt builder has complex cross-component state (role, context, task, constraints, settings). Zustand provides a lightweight global store without prop drilling.

5. **Dynamic imports for heavy components.** `PromptBuilder` and `PromptChainBuilder` are loaded with `next/dynamic` + `ssr: false` to reduce initial page load JS.

---

## 6. Database

### Connection

The app uses **Neon** (serverless PostgreSQL) via the `@neondatabase/serverless` driver and **Drizzle ORM**.

The connection is managed in `src/lib/db/index.ts` with a singleton pattern using `globalThis` to avoid creating multiple connections in development (hot reload).

### Schema

All tables are defined in `src/lib/db/schema.ts`. Here's the full entity map:

#### Auth Tables (managed by Auth.js)

| Table                 | Purpose                                 |
| --------------------- | --------------------------------------- |
| `users`               | User accounts (id, name, email, image)  |
| `accounts`            | OAuth provider accounts linked to users |
| `sessions`            | Active sessions                         |
| `verification_tokens` | Email verification tokens               |

#### Application Tables

| Table                | Purpose                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| `prompts`            | User's saved prompts (title, content, category, settings, tags, isPublic) |
| `prompt_versions`    | Version history for each prompt                                           |
| `collections`        | User-created folders/collections                                          |
| `collection_prompts` | Many-to-many join: which prompts are in which collections                 |
| `favorites`          | User favorites on prompts                                                 |
| `prompt_events`      | Analytics events (copy, fork, share, test, optimize)                      |
| `prompt_history`     | Logged prompt test/optimize runs with full input/output                   |
| `system_prompts`     | User's custom reusable system prompt fragments                            |
| `user_api_keys`      | Encrypted user-provided API keys (AES-256-GCM)                            |
| `api_tokens`         | Personal access tokens for the REST API (SHA-256 hashed)                  |
| `api_usage`          | Per-user AI API call tracking                                             |

#### Payment Tables

| Table                 | Purpose                                                            |
| --------------------- | ------------------------------------------------------------------ |
| `subscriptions`       | Stripe subscription state (plan, status, period dates, stripe IDs) |
| `credit_balances`     | Per-user credit balance (monthly + bonus credits, reset date)      |
| `credit_transactions` | Credit ledger (deductions, monthly resets, top-ups)                |

### Working with Migrations

```bash
# After changing schema.ts, generate a migration:
pnpm db:generate

# Apply migrations to the database:
pnpm db:migrate

# Or push directly (skips migration files, good for dev):
pnpm db:push

# Browse data visually:
pnpm db:studio
```

### Querying

Drizzle ORM supports two query styles:

```typescript
// 1. Query API (simpler, for basic queries)
const prompt = await db.query.prompts.findFirst({
  where: eq(prompts.id, id),
})

// 2. Select API (for joins, aggregates, complex queries)
const results = await db
  .select({ id: prompts.id, authorName: users.name })
  .from(prompts)
  .leftJoin(users, eq(prompts.userId, users.id))
  .where(eq(prompts.isPublic, true))
```

---

## 7. Authentication

### Provider Setup

Auth.js (NextAuth v5) is configured in `src/lib/auth/index.ts` with:

- **Google OAuth** provider
- **GitHub OAuth** provider
- **Drizzle adapter** for database-backed sessions
- Custom `/login` sign-in page

### How It Works

1. **Route handler** at `src/app/api/auth/[...nextauth]/route.ts` handles all auth endpoints (`/api/auth/signin`, `/api/auth/callback/*`, etc.)

2. **Middleware** at `src/middleware.ts` protects routes. Currently protected:
   - `/prompts/*`
   - `/system-prompts/*`
   - `/settings/*`
   - `/history/*`

   Unauthenticated users are redirected to `/login?callbackUrl=<original-path>`.

3. **Server-side auth check** — In server components and server actions:

   ```typescript
   import { auth } from '@/lib/auth'
   const session = await auth()
   // session.user.id is available
   ```

4. **Client-side auth** — In client components:

   ```typescript
   import { useSession, signIn, signOut } from 'next-auth/react'
   const { data: session, status } = useSession()
   ```

5. **API route auth** — Each `/api/ai/*` route manually calls `auth()` and returns 401 if unauthorized. The middleware does NOT protect API routes (they need JSON responses, not redirects).

---

## 8. Routing & Pages

### Page Map

| Route             | Auth      | Type   | Description                                    |
| ----------------- | --------- | ------ | ---------------------------------------------- |
| `/`               | Public    | Server | Landing page with hero + features              |
| `/login`          | Public    | Client | OAuth sign-in (Google + GitHub)                |
| `/builder`        | Public    | Client | Prompt builder (dynamic import)                |
| `/chain`          | Public    | Client | Multi-step prompt chaining (dynamic import)    |
| `/pricing`        | Public    | Server | Pricing plans + credit purchase                |
| `/gallery`        | Public    | Server | Public prompt gallery with search/filters      |
| `/share/[id]`     | Public    | Server | Read-only view of a shared public prompt       |
| `/prompts`        | Protected | Server | User's saved prompts with filters + pagination |
| `/prompts/[id]`   | Protected | Server | Edit prompt detail + version history           |
| `/system-prompts` | Protected | Server | Manage custom system prompt fragments          |
| `/settings`       | Protected | Server | API key + token + billing management           |
| `/history`        | Protected | Server | Prompt test/optimize history log               |

### Special Files

| File            | Purpose                                                          |
| --------------- | ---------------------------------------------------------------- |
| `layout.tsx`    | Root layout: fonts, metadata, providers, header/footer           |
| `error.tsx`     | Global error boundary (also per-route in `/builder`, `/prompts`) |
| `not-found.tsx` | Custom 404 page                                                  |
| `loading.tsx`   | Skeleton loaders (per-route)                                     |

### SEO

The root layout defines a metadata `title.template` of `"%s | Prompt Expert"`. Each page exports its own `title` which gets inserted into the template. Open Graph and Twitter Card tags are set globally.

---

## 9. API Routes

### AI Endpoints

All three AI routes share the same pattern: auth check → rate limit → parse body → resolve user API keys → call AI SDK → stream response.

| Endpoint           | Method | Purpose                                | Response       |
| ------------------ | ------ | -------------------------------------- | -------------- |
| `/api/ai/optimize` | POST   | Optimize a prompt using AI             | Streaming text |
| `/api/ai/test`     | POST   | Test a prompt directly against a model | Streaming text |
| `/api/ai/analyze`  | POST   | Analyze prompt quality and get scores  | JSON           |

**Request body format (optimize/test):**

```json
{
  "prompt": "Your prompt text...",
  "model": "gpt-4.1-mini",
  "temperature": 0.7
}
```

**Security layers on every AI route:**

1. `auth()` — 401 if not logged in
2. `rateLimit()` — 429 if over 20 requests/minute
3. `hasCredits()` — 403 with `insufficient_credits` error if out of credits
4. User API keys are checked — user's own key is used if available, otherwise falls back to server key
5. `deductCredit()` — deducts 1 credit per call
6. `trackUsage()` — logs the call to `api_usage` table
7. `savePromptHistory()` — logs prompt + output to `prompt_history` (on `onFinish` callback)

### Stripe Endpoints

| Endpoint               | Method | Purpose                                                            | Response  |
| ---------------------- | ------ | ------------------------------------------------------------------ | --------- |
| `/api/stripe/checkout` | POST   | Create Stripe checkout session for Pro subscription or credit pack | `{ url }` |
| `/api/stripe/portal`   | POST   | Create Stripe billing portal session for managing subscription     | `{ url }` |
| `/api/stripe/webhook`  | POST   | Handle Stripe webhook events (signature-verified)                  | 200       |

**Webhook events handled:**

- `checkout.session.completed` — Upgrades plan to Pro or adds bonus credits for credit pack purchase
- `invoice.paid` — Resets monthly credits on subscription renewal
- `customer.subscription.updated` — Syncs subscription status changes
- `customer.subscription.deleted` — Downgrades to Free plan and resets credits

### Credits Endpoint

| Endpoint       | Method | Auth    | Purpose                                                     |
| -------------- | ------ | ------- | ----------------------------------------------------------- |
| `/api/credits` | GET    | Session | Returns user's credit balance (monthly, bonus, total, plan) |

### REST API

| Endpoint          | Method | Auth         | Purpose                          |
| ----------------- | ------ | ------------ | -------------------------------- |
| `/api/v1/prompts` | GET    | Bearer token | Fetch all user's prompts as JSON |

**Usage:**

```bash
curl -H "Authorization: Bearer pe_abc123..." https://your-app.com/api/v1/prompts
```

Tokens are created in the Settings page and stored as SHA-256 hashes.

### Auth Routes

`/api/auth/[...nextauth]` — Handled entirely by Auth.js. Do not modify.

---

## 10. Server Actions

Server actions are in `src/lib/actions/`. They run on the server and can be called directly from client components.

### `prompt.ts` — Core prompt operations

| Action                            | Description                                     |
| --------------------------------- | ----------------------------------------------- |
| `createPrompt(input)`             | Create a new prompt + version 1                 |
| `updatePrompt(input)`             | Update prompt + create new version              |
| `deletePrompt(id)`                | Delete a prompt and all versions                |
| `duplicatePrompt(id)`             | Clone a prompt with "(copy)" suffix             |
| `getUserPrompts(filters)`         | Paginated list with search/category/tag filters |
| `getPublicPrompts(filters)`       | Cached public gallery query (60s TTL)           |
| `getPromptById(id)`               | Get single prompt (owner only)                  |
| `getPublicPromptById(id)`         | Get single public prompt with author info       |
| `getPromptVersions(promptId)`     | Get all versions for a prompt                   |
| `forkPrompt(id)`                  | Clone a public prompt into user's library       |
| `toggleFavorite(promptId)`        | Add/remove from favorites                       |
| `getUserFavoriteIds()`            | Get set of favorite prompt IDs                  |
| `getFavoriteCount(promptId)`      | Count total favorites for a prompt              |
| `createCollection(name)`          | Create a collection/folder                      |
| `getUserCollections()`            | List user's collections                         |
| `addPromptToCollection(...)`      | Add prompt to collection                        |
| `removePromptFromCollection(...)` | Remove prompt from collection                   |
| `deleteCollection(id)`            | Delete a collection                             |
| `getPromptAnalytics(promptId)`    | Get event counts (copies, forks, shares, etc.)  |

### `system-prompts.ts`

| Action                              | Description                            |
| ----------------------------------- | -------------------------------------- |
| `createSystemPrompt(name, content)` | Create reusable system prompt fragment |
| `getUserSystemPrompts()`            | List all user's system prompts         |
| `updateSystemPrompt(id, data)`      | Update name/content                    |
| `deleteSystemPrompt(id)`            | Delete a system prompt                 |

### `api-keys.ts`

| Action                            | Description                               |
| --------------------------------- | ----------------------------------------- |
| `saveApiKey(provider, key)`       | Encrypt and store user's API key          |
| `deleteApiKey(provider)`          | Remove stored API key                     |
| `getUserApiKeyProviders()`        | List which providers have keys configured |
| `getUserApiKey(userId, provider)` | Decrypt and return key (internal use)     |

### `api-tokens.ts`

| Action                    | Description                               |
| ------------------------- | ----------------------------------------- |
| `createApiToken(name)`    | Generate a `pe_...` token, store hash     |
| `getUserApiTokens()`      | List tokens (without the raw value)       |
| `deleteApiToken(id)`      | Delete a token                            |
| `validateApiToken(token)` | Hash and look up — returns userId or null |

### `prompt-history.ts`

| Action                            | Description                    |
| --------------------------------- | ------------------------------ |
| `savePromptHistory(userId, data)` | Log a prompt test/optimize run |
| `getUserPromptHistory(limit)`     | Get recent history entries     |
| `clearPromptHistory()`            | Delete all history for user    |

---

## 11. State Management

### Zustand Store (`src/stores/prompt-builder.ts`)

The prompt builder uses a single Zustand store for all builder state:

```typescript
interface PromptBuilderStore {
  // State
  role: string;
  context: string;
  task: string;
  constraints: string[];
  settings: PromptSettings;   // model, category, tone, outputFormat, etc.
  generatedPrompt: string;
  optimizedPrompt: string;
  isOptimizing: boolean;

  // Actions
  setRole, setContext, setTask: (value: string) => void;
  addConstraint, removeConstraint, updateConstraint: (...)
  updateSettings: (partial: Partial<PromptSettings>) => void;
  reset: () => void;
}
```

**Usage in components:**

```typescript
const { role, setRole } = usePromptBuilderStore()
// or select specific slices to avoid re-renders:
const task = usePromptBuilderStore((s) => s.task)
```

### Why Zustand?

The builder has ~15 input components that all need to read/write shared state. Zustand avoids prop drilling through deeply nested components while being simpler than React Context with reducers.

### Local State

For everything else (forms, dialogs, loading states), components use regular `useState`. URL state (`search`, `category`, `page`) is managed via `useSearchParams` + `router.push`.

---

## 12. Components

### Directory Layout

Components are organized by feature:

| Directory         | Contents                                                                     |
| ----------------- | ---------------------------------------------------------------------------- |
| `ui/`             | shadcn/ui primitives — **do not edit manually**, use `npx shadcn add <name>` |
| `layout/`         | Header (nav + auth dropdown) and Footer                                      |
| `prompt-builder/` | All builder controls: inputs, selectors, preview, analysis, comparison       |
| `prompt-chain/`   | Chain builder for multi-step workflows                                       |
| `prompts/`        | Prompt CRUD: cards, list, detail, filters, export/import, share view         |
| `gallery/`        | Public gallery: cards, filters, list                                         |
| `history/`        | History list with expandable entries                                         |
| `settings/`       | API key manager + API token manager + billing section                        |
| `system-prompts/` | System prompt CRUD manager                                                   |

### Key Components

#### Prompt Builder (`prompt-builder/index.tsx`)

Two-column layout:

- **Left:** Controls card with ModelSelector, CategorySelector, ToneSelector, FormatSelector, RoleInput, ContextInput, TaskInput, ConstraintsInput, AdvancedSettings, TemplateSelector, SavePromptDialog
- **Right:** PromptPreview (sticky, shows assembled/optimized/test tabs)

#### Prompt Preview (`prompt-builder/prompt-preview.tsx`)

The main output panel. Key features:

- Assembles prompt in real-time from builder state
- "Optimize" button streams optimized version from AI
- "Test" button runs the prompt against the selected model
- "Compare Models" opens side-by-side model comparison dialog
- "Analyze Quality" runs AI-powered scoring
- Variable filler appears when `{{variable}}` placeholders are detected
- Keyboard shortcuts: `Cmd+Enter` to optimize

#### Prompt Card (`prompts/prompt-card.tsx`)

Displays a saved prompt with:

- Title, description, category badge, tags
- Public/private indicator
- Dropdown menu: Copy, Duplicate, Share Link, Edit, Delete (with confirmation)
- Event tracking on copy/share actions

---

## 13. AI Integration

### Model Configuration

Models are defined in three places that must stay in sync:

1. **Types** (`src/types/index.ts`): `AIModel` union type
2. **Constants** (`src/config/constants.ts`): `AI_MODELS` array with labels + providers
3. **AI Utility** (`src/lib/ai/index.ts`): `MODEL_MAP` mapping model names to provider instances
4. **Validators** (`src/lib/validators/prompt.ts`): `aiModels` Zod enum

### Currently Supported Models

| Model               | Provider  |
| ------------------- | --------- |
| `gpt-4.1`           | OpenAI    |
| `gpt-4.1-mini`      | OpenAI    |
| `claude-opus-4-6`   | Anthropic |
| `claude-sonnet-4-6` | Anthropic |
| `gemini-2.5-pro`    | Google    |
| `gemini-2.5-flash`  | Google    |

### How AI Calls Work

```
Client Component
  → fetch("/api/ai/test", { body: { prompt, model } })
    → API Route:
      1. auth() check
      2. rateLimit() check
      3. hasCredits() check — 403 if insufficient
      4. Look up user's API key for the model's provider
      5. getModel(model, userKeys) — creates provider instance
      6. deductCredit() — 1 credit per call
      7. streamText({ model, prompt }) — Vercel AI SDK
      8. return result.toTextStreamResponse()
    → Client receives streaming text via useCompletion()
    → On 403 insufficient_credits: opens upgrade modal
```

### Adding a New Model

1. Add the model name to the `AIModel` type in `src/types/index.ts`
2. Add it to `AI_MODELS` in `src/config/constants.ts`
3. Add it to `MODEL_MAP` in `src/lib/ai/index.ts`
4. Add it to `aiModels` in `src/lib/validators/prompt.ts`

### User API Keys

Users can bring their own API keys (Settings page). When a user has a key for a provider, it's used instead of the server's key. Keys are encrypted at rest with AES-256-GCM (`src/lib/crypto.ts`).

### System Prompts

Two built-in system prompts in `src/config/prompts.ts`:

- `SYSTEM_PROMPT_OPTIMIZER` — used by `/api/ai/optimize` to improve prompts
- `SYSTEM_PROMPT_ANALYZER` — used by `/api/ai/analyze` to score prompts

Users can also create their own reusable system prompt fragments via the System Prompts page.

---

## 14. Payments & Credits

### Plans

Defined in `src/config/plans.ts`:

| Plan | Credits/Month | Price  | Key Limits                                           |
| ---- | ------------- | ------ | ---------------------------------------------------- |
| Free | 50            | $0     | Save up to 10 prompts, no REST API access            |
| Pro  | 1,000         | $15/mo | Unlimited prompts, REST API access, buy credit packs |

**Credit pack:** 200 additional credits for $5 (Pro plan only).

**Credit costs:** All AI operations (optimize, test, analyze) cost 1 credit each.

### Stripe Integration

Payment processing uses **Stripe** (`src/lib/stripe.ts`):

- **`getOrCreateStripeCustomer(userId, email)`** — Creates or retrieves a Stripe customer, stores the ID in the `subscriptions` table
- **`createCheckoutSession(userId, email, mode)`** — Creates a Stripe Checkout session for Pro subscription (`"subscription"` mode) or credit pack (`"payment"` mode)
- **`createPortalSession(userId)`** — Opens the Stripe billing portal for subscription management

### Credits System

Credit logic lives in `src/lib/credits.ts`:

| Function                                       | Purpose                                                  |
| ---------------------------------------------- | -------------------------------------------------------- |
| `getUserCredits(userId)`                       | Returns `{ monthly, bonus, total, plan }`                |
| `hasCredits(userId, cost)`                     | Boolean check for sufficient balance                     |
| `deductCredit(userId, cost, description)`      | Deducts from monthly first, then bonus; logs transaction |
| `resetMonthlyCredits(userId, plan)`            | Resets monthly credits to plan amount on renewal         |
| `addBonusCredits(userId, amount, description)` | Adds bonus credits from credit pack purchases            |
| `ensureCreditBalance(userId)`                  | Initializes credit balance row for new users             |

### Payment Flows

**Pro subscription:**

1. User clicks "Upgrade to Pro" → `POST /api/stripe/checkout` with `type: "pro"`
2. Redirected to Stripe Checkout → completes payment
3. Stripe fires `checkout.session.completed` webhook
4. Webhook updates subscription to Pro, resets credits to 1,000

**Credit pack purchase (Pro only):**

1. User clicks "Buy 200 Credits" → `POST /api/stripe/checkout` with `type: "credit_pack"`
2. One-time Stripe Checkout → completes payment
3. Webhook fires → `addBonusCredits(userId, 200)` adds bonus credits

**Monthly renewal:**

1. Stripe fires `invoice.paid` on subscription renewal
2. Webhook calls `resetMonthlyCredits()` → monthly credits reset to 1,000

**Downgrade/cancellation:**

1. Stripe fires `customer.subscription.deleted`
2. Webhook sets plan to Free, resets credits to 50

### UI Components

| Component        | Location                                      | Purpose                                           |
| ---------------- | --------------------------------------------- | ------------------------------------------------- |
| `PricingCards`   | `src/app/pricing/pricing-cards.tsx`           | Plan comparison cards with upgrade/manage buttons |
| `BillingSection` | `src/components/settings/billing-section.tsx` | Plan + credits display on Settings page           |
| `UpgradeModal`   | `src/components/upgrade-modal.tsx`            | Dialog shown when user runs out of credits        |
| `CreditsBadge`   | `src/components/layout/header.tsx`            | Credits count in the header nav                   |

The upgrade modal is managed by a Zustand store (`src/stores/upgrade-modal.ts`) and opens automatically when any AI endpoint returns `insufficient_credits`.

### Auth Session Extension

The Auth.js session includes the user's plan (`session.user.plan`). The session callback in `src/lib/auth/index.ts` queries the `subscriptions` table and defaults to `"free"` if no subscription exists.

---

## 15. Security

### Authentication

- OAuth only (Google + GitHub) — no password storage
- Session-based auth via Auth.js with database sessions
- Middleware protects page routes; API routes check auth individually

### Authorization

- All server actions call `getAuthenticatedUserId()` which throws if no session
- Prompt queries always filter by `userId` — users can only see their own data
- Public prompts are explicitly filtered by `isPublic = true`

### Rate Limiting

In-memory rate limiter (`src/lib/rate-limit.ts`): 20 requests per minute per user on all AI routes. Returns 429 status when exceeded.

### Input Validation

- All prompt create/update inputs are validated with Zod schemas
- SQL injection prevented: uses Drizzle's parameterized queries (never `sql.raw()`)
- API route bodies are validated before processing

### Secrets

- User API keys encrypted with AES-256-GCM before storage
- API tokens stored as SHA-256 hashes (raw token shown only once at creation)
- `ENCRYPTION_KEY` env var required (at least 32 characters)
- Never commit `.env` files

---

## 16. Styling

### Tailwind CSS v4

The project uses Tailwind v4 with CSS-based configuration (no `tailwind.config.js`). Tailwind is loaded via PostCSS:

```javascript
// postcss.config.mjs
const config = {
  plugins: { '@tailwindcss/postcss': {} },
}
```

Global CSS is in `src/app/globals.css` which imports:

```css
@import 'tailwindcss';
@import 'shadcn/tailwind.css';
```

### shadcn/ui

Components are in `src/components/ui/`. Configuration is in `components.json`:

- Style: `base-nova`
- Base color: `neutral`
- Icons: `lucide-react`

**To add a new shadcn component:**

```bash
npx shadcn@latest add <component-name>
```

**Do not manually edit files in `src/components/ui/`.** They are generated.

### Utility Function

```typescript
import { cn } from '@/lib/utils'
// Combines clsx + tailwind-merge for conditional + conflict-free class names
cn('px-4 py-2', isActive && 'bg-primary', className)
```

### Responsive Design

- Mobile-first approach
- Breakpoints: `sm:`, `md:`, `lg:` (standard Tailwind)
- Header collapses to hamburger menu on mobile (`md:hidden`)
- Grids use `sm:grid-cols-2 lg:grid-cols-3` pattern

### Dark Mode

Supported via `next-themes` (included in shadcn setup). CSS variables in `globals.css` define light and dark palettes.

---

## 17. Testing

### Setup

- **Vitest** for unit tests with `jsdom` environment
- **@testing-library/react** for component testing
- **@testing-library/jest-dom** for DOM matchers

Config is in `vitest.config.ts`. Test setup file: `src/__tests__/setup.ts`.

### Running Tests

```bash
pnpm test          # Run all tests once
pnpm test:watch    # Watch mode
```

### Existing Tests

| File                      | Tests | What's Covered                                      |
| ------------------------- | ----- | --------------------------------------------------- |
| `rate-limit.test.ts`      | 4     | Rate limiter: allows, blocks, resets, key isolation |
| `variables.test.ts`       | 5     | Variable extraction + resolution from prompt text   |
| `assemble-prompt.test.ts` | 4     | Prompt assembly with different parameters           |

### Writing New Tests

```typescript
import { describe, it, expect } from 'vitest'

describe('myFunction', () => {
  it('does the expected thing', () => {
    const result = myFunction('input')
    expect(result).toBe('output')
  })
})
```

For testing server actions that use the database, you'll need to mock `getDb()`:

```typescript
vi.mock('@/lib/db', () => ({
  getDb: () => mockDb,
}))
```

---

## 18. Deployment

### Vercel (Recommended)

1. Connect your repository to [Vercel](https://vercel.com)
2. Set all environment variables in Vercel's dashboard
3. Vercel auto-detects Next.js and deploys

### Database

Use [Neon](https://neon.tech) for serverless PostgreSQL. The connection string goes in `DATABASE_URL`.

After deploying, run migrations:

```bash
pnpm db:migrate
```

Or use `pnpm db:push` for initial setup.

### Stripe

1. Create products and prices in the [Stripe Dashboard](https://dashboard.stripe.com)
2. Set `STRIPE_PRO_MONTHLY_PRICE_ID` and `STRIPE_CREDIT_PACK_PRICE_ID` to the price IDs
3. Set up a webhook endpoint pointing to `https://your-domain.com/api/stripe/webhook` with events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Set `STRIPE_WEBHOOK_SECRET` to the webhook signing secret

For local development, use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhooks:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### Build Verification

```bash
pnpm build   # Ensure production build succeeds
pnpm start   # Test locally in production mode
```

---

## 19. How-To Guides

### Add a New Page

1. Create `src/app/<route>/page.tsx`
2. Export a `metadata` object for SEO
3. If the page needs auth protection, add the route to `PROTECTED_ROUTES` in `src/middleware.ts` and to the `matcher` array

### Add a New Database Table

1. Define the table in `src/lib/db/schema.ts`
2. Run `pnpm db:generate` to create a migration
3. Run `pnpm db:migrate` to apply it
4. Create server actions in `src/lib/actions/`

### Add a New shadcn/ui Component

```bash
npx shadcn@latest add dialog    # example
```

This auto-installs the component to `src/components/ui/`.

### Add a New AI Model

1. Add to `AIModel` type in `src/types/index.ts`
2. Add to `AI_MODELS` in `src/config/constants.ts`
3. Add to `MODEL_MAP` in `src/lib/ai/index.ts`
4. Add to `aiModels` in `src/lib/validators/prompt.ts`

### Create a Server Action

1. Create or edit a file in `src/lib/actions/`
2. Add `"use server"` at the top of the file
3. Export async functions that call `getAuthenticatedUserId()` and interact with the database

```typescript
'use server'

import { getDb } from '@/lib/db'
import { myTable } from '@/lib/db/schema'
import { auth } from '@/lib/auth'

export async function myAction(input: string) {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')

  const db = getDb()
  // ... do database work
  revalidatePath('/my-page')
}
```

### Use the REST API

1. Go to Settings → API Tokens → New Token
2. Copy the token (shown only once)
3. Make requests:

```bash
curl -H "Authorization: Bearer pe_your_token_here" \
  https://your-app.com/api/v1/prompts
```

---

## 20. Coding Conventions

### TypeScript

- Strict mode enabled
- Use `type` imports where possible: `import type { Foo } from "..."`
- Define types in `src/types/index.ts` for shared types
- Validate external input with Zod schemas

### React

- **Server Components** by default — only add `"use client"` when you need hooks, event handlers, or browser APIs
- Prefer server actions over manual API routes for data mutations
- Use `useCallback` / `useMemo` for expensive computations or stable references passed to children
- Avoid adding `"use client"` to pages — extract the interactive part to a child component instead

### File Naming

- Components: `PascalCase` function names, `kebab-case` file names
  - `prompt-card.tsx` → `export function PromptCard()`
- Server actions: `camelCase` function names
- Types: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`

### Imports

Use the `@/` path alias for all imports:

```typescript
import { Button } from '@/components/ui/button'
import { getDb } from '@/lib/db'
```

### Comments

Only add comments that explain _why_, not _what_. The code should be self-documenting.

### Error Handling

- Server actions: Throw errors (caller handles with try/catch)
- API routes: Return `Response.json({ error: "..." }, { status: 4xx })`
- Non-critical operations (tracking, analytics): Wrap in try/catch and silently fail

---

## 21. Troubleshooting

### "DATABASE_URL is not set"

Make sure your `.env` file exists and has a valid `DATABASE_URL`. Restart the dev server after changes.

### "Unauthorized" errors

- Check that your Google/GitHub OAuth credentials are correct
- Make sure `AUTH_SECRET` is set
- Clear cookies and sign in again

### "Too many requests" (429)

The rate limiter allows 20 AI requests per minute. Wait 60 seconds and try again. The limit resets automatically.

### Drizzle migration errors

If you get "relation does not exist" errors, your database schema is out of date:

```bash
pnpm db:push    # Quick fix: push current schema
# or
pnpm db:migrate # Apply pending migrations
```

### shadcn/ui component errors

If a component import fails after a shadcn update:

```bash
npx shadcn@latest add <component-name> --overwrite
```

### Build failures

```bash
pnpm lint       # Check for linting errors
pnpm test       # Check for test failures
pnpm build      # Full production build
```

### AI API errors

- Verify your API keys are correct in `.env`
- Check the AI provider's status page for outages
- If using user API keys, verify the key in Settings page

### Stripe / payment issues

- **Webhooks not firing locally:** Use `stripe listen --forward-to localhost:3000/api/stripe/webhook` with the Stripe CLI
- **"Webhook signature verification failed":** Ensure `STRIPE_WEBHOOK_SECRET` matches the signing secret from Stripe (use the CLI secret for local dev, the dashboard secret for production)
- **Credits not updating after purchase:** Check the Stripe webhook logs in the dashboard for failed deliveries
- **Plan not reflecting after upgrade:** The session callback reads from the `subscriptions` table — verify the row was updated by checking `pnpm db:studio`

---

_Last updated: March 2026_
