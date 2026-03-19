# Prompt Expert — Enhancement Plan

## Current State

**Prompt Expert** is a Next.js 16 App Router app for building, optimizing, and managing AI prompts.

**Stack:** React 19, Tailwind CSS 4, shadcn/ui, Zustand, Drizzle ORM + Neon PostgreSQL, Auth.js (Google/GitHub OAuth), Vercel AI SDK (GPT-4o, Claude 3.5, Gemini 2.0).

**Core features working:**

- Structured prompt builder (role, context, task, constraints, tone, format, model)
- AI-powered prompt optimization (streaming)
- Save/edit/duplicate/delete prompts
- Version history tracking
- Search and category filters
- OAuth authentication

---

## Phase 1 — Code Quality, Security & Bug Fixes


| #   | Task                                | Details                                                                                       |
| --- | ----------------------------------- | --------------------------------------------------------------------------------------------- |
| 1.1 | Auth-protect AI API routes          | `/api/ai/optimize` and `/api/ai/assemble` have no session check. Add `auth()` guard.          |
| 1.2 | Fix SQL injection risk              | `getUserPrompts` uses `sql.raw()` for tag filtering. Switch to parameterized queries.         |
| 1.3 | Debounce search input               | `PromptFilters` fires `router.push` on every keystroke. Add debounce (300ms).                 |
| 1.4 | Add error boundaries                | Create `error.tsx` for `/prompts`, `/builder`, and app root.                                  |
| 1.5 | Add auth middleware                 | Create `middleware.ts` to protect routes centrally instead of per-page `auth()` checks.       |
| 1.6 | Remove or integrate unused assemble | `/api/ai/assemble` is dead code — wire it up or remove it.                                    |
| 1.7 | Update AI model list                | Update to latest models (GPT-4.1, Claude 4, Gemini 2.5, etc.) and make the list configurable. |


---

## Phase 2 — UX & UI Improvements


| #   | Task                        | Details                                                                                 |
| --- | --------------------------- | --------------------------------------------------------------------------------------- |
| 2.1 | Pagination controls         | `getUserPrompts` already returns `totalPages` — add pagination UI to the prompts list.  |
| 2.2 | Version diff viewer         | Versions are stored but can't be compared. Add side-by-side diff view.                  |
| 2.3 | Prompt templates/starters   | Pre-built templates users can start from (Code Review, Blog Post, Data Analysis, etc.). |
| 2.4 | Keyboard shortcuts          | `Cmd+S` to save, `Cmd+Enter` to optimize, `Cmd+K` for quick search.                     |
| 2.5 | Improved loading states     | Skeleton loaders for builder, prompt detail, and AI streaming. Progress indicator.      |
| 2.6 | Empty states                | Better empty states with illustrations/CTAs for no prompts, no search results.          |
| 2.7 | Confirm destructive actions | Confirmation dialog before delete (currently instant).                                  |


---

## Phase 3 — Advanced AI Features


| #   | Task                        | Details                                                                                |
| --- | --------------------------- | -------------------------------------------------------------------------------------- |
| 3.1 | Prompt testing/playground   | Test prompts against an AI model directly in the app and see output.                   |
| 3.2 | Multi-model comparison      | Run the same prompt against 2–3 models side-by-side and compare outputs.               |
| 3.3 | Prompt scoring/analysis     | AI-powered scoring on clarity, specificity, completeness with improvement suggestions. |
| 3.4 | Prompt chaining             | Multi-step prompt workflows where one prompt's output feeds into the next.             |
| 3.5 | Variable/placeholder system | Support `{{variable}}` placeholders that users can fill in at runtime.                 |
| 3.6 | AI model recommendations    | Suggest the best model based on prompt type/category.                                  |


---

## Phase 4 — Collaboration & Social Features


| #   | Task                  | Details                                                                             |
| --- | --------------------- | ----------------------------------------------------------------------------------- |
| 4.1 | Public prompt gallery | Browse and discover public prompts from all users. `isPublic` field already exists. |
| 4.2 | Fork/clone prompts    | Fork others' public prompts into your own library.                                  |
| 4.3 | Ratings & favorites   | Upvote/downvote and favorite prompts. New `ratings` and `favorites` tables.         |
| 4.4 | Collections/folders   | Organize prompts into collections for better organization.                          |
| 4.5 | Share via link        | Generate shareable URLs for individual prompts.                                     |
| 4.6 | Export/import         | Export prompts as JSON/Markdown, import from files or other tools.                  |


---

## Phase 5 — Infrastructure & Performance


| #   | Task               | Details                                                                                    |
| --- | ------------------ | ------------------------------------------------------------------------------------------ |
| 5.1 | Rate limiting      | Add rate limiting to AI API routes (e.g., upstash/ratelimit).                              |
| 5.2 | Caching layer      | Use `unstable_cache` or Redis for frequently accessed prompts and public gallery.          |
| 5.3 | Image optimization | Replace `<img>` tags with `next/image`.                                                    |
| 5.4 | Dynamic imports    | Lazy-load heavy components (prompt builder sections, diff viewer).                         |
| 5.5 | Testing setup      | Add Vitest for unit tests, Playwright for E2E. Start with critical paths (auth, CRUD, AI). |
| 5.6 | API usage tracking | Track AI API calls per user for analytics and potential billing.                           |
| 5.7 | SEO & metadata     | Proper `metadata` exports for all pages, Open Graph tags, structured data.                 |


---

## Phase 6 — Premium/Advanced Features


| #   | Task                     | Details                                                                   |
| --- | ------------------------ | ------------------------------------------------------------------------- |
| 6.1 | Prompt analytics         | Track usage stats — copies, uses, shares.                                 |
| 6.2 | Custom system prompts    | Reusable system prompt fragments.                                         |
| 6.3 | API key management       | Users bring their own API keys instead of relying on server keys.         |
| 6.4 | Webhook/API access       | Expose user prompts via a personal API endpoint for external integration. |
| 6.5 | Prompt history/usage log | Log when prompts are tested, with outputs, for learning and iteration.    |


---

## Cross-Cutting Concerns (Apply Throughout)

- **Latest versions:** Always use latest stable versions of all packages. Run `pnpm update` before each phase.
- **Best practices:** Server Components by default, `"use client"` only when needed, strict TypeScript, Zod validation on all inputs.
- **Code optimization:** Minimize client-side JS, leverage React Compiler, efficient DB queries, proper memoization.
- **Accessibility:** ARIA labels, keyboard navigation, focus management, screen reader support.
- **Responsive design:** Mobile-first, test on all breakpoints.

---

## Execution Order

1. **Phase 1** — Security and bugs (critical, do first)
2. **Phase 2** — UX polish (immediate user impact)
3. **Phase 3** — AI features (core differentiator)
4. **Phase 4** — Social/collaboration (growth)
5. **Phase 5** — Infrastructure (scale)
6. **Phase 6** — Premium features (monetization)

