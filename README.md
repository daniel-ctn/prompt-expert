# Prompt Expert

Build better prompts, get better results. An AI-powered prompt engineering tool that helps you create efficient, optimized prompts for any AI model.

## Features

- **Prompt Builder** -- Structured controls for model, category, tone, output format, role, context, constraints, and more
- **AI Optimization** -- One-click prompt refinement powered by GPT-4o, Claude, or Gemini with streaming output
- **Live Preview** -- See your prompt assemble in real-time as you adjust parameters
- **Multi-Model Support** -- Target OpenAI, Anthropic, and Google AI models
- **Prompt Library** -- Save, organize, search, and manage your prompts with tags and categories
- **Version History** -- Track changes across prompt iterations
- **Authentication** -- Google and GitHub OAuth via Auth.js

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.1 |
| Language | TypeScript | 5.9 |
| Styling | Tailwind CSS | 4.2 |
| UI Components | shadcn/ui | 4.0 |
| State Management | Zustand | 5.0 |
| AI Integration | Vercel AI SDK | 6.0 |
| Authentication | Auth.js (NextAuth) | 5.0 |
| Database | Neon PostgreSQL | -- |
| ORM | Drizzle ORM | 0.45 |
| Validation | Zod | 4.3 |
| Deployment | Vercel | -- |

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 10+
- A [Neon](https://neon.tech) PostgreSQL database
- OAuth credentials for Google and/or GitHub
- At least one AI provider API key (OpenAI, Anthropic, or Google)

### Installation

```bash
git clone <repo-url>
cd prompt-expert
pnpm install
```

### Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_SECRET` | Random secret for Auth.js (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `AUTH_GITHUB_ID` | GitHub OAuth client ID |
| `AUTH_GITHUB_SECRET` | GitHub OAuth client secret |
| `OPENAI_API_KEY` | OpenAI API key (optional) |
| `ANTHROPIC_API_KEY` | Anthropic API key (optional) |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI API key (optional) |

### Database Setup

Push the schema to your Neon database:

```bash
pnpm db:push
```

Or generate and run migrations:

```bash
pnpm db:generate
pnpm db:migrate
```

### Development

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
pnpm build
pnpm start
```

## Project Structure

```
src/
  app/                        # Next.js App Router pages and API routes
    api/ai/                   # AI optimization and assembly endpoints
    api/auth/                 # Auth.js route handler
    builder/                  # Prompt builder page
    login/                    # Authentication page
    prompts/                  # Prompt management (list + detail)
  components/
    layout/                   # Header, footer
    prompt-builder/           # Builder UI components (10 modules)
    prompts/                  # Prompt card, list, filters, detail
    ui/                       # shadcn/ui components
  config/                     # Constants, AI system prompts
  lib/
    actions/                  # Server Actions (prompt CRUD)
    ai/                       # Vercel AI SDK provider config
    auth/                     # Auth.js configuration
    db/                       # Drizzle ORM schema and connection
    validators/               # Zod schemas
  stores/                     # Zustand stores
  types/                      # Shared TypeScript types
```

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:push` | Push schema to database |
| `pnpm db:generate` | Generate SQL migrations |
| `pnpm db:migrate` | Run migrations |
| `pnpm db:studio` | Open Drizzle Studio |

## Deployment

Deploy to Vercel with one click. Set all environment variables in the Vercel dashboard.

```bash
vercel deploy
```

## License

Private project.
