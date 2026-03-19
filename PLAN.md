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

## Phase 1 — Code Quality, Security & Bug Fixes ✅


| #   | Task                                | Status | Details                                                                                       |
| --- | ----------------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| 1.1 | Auth-protect AI API routes          | ✅     | Added `auth()` guard to `/api/ai/optimize` and `/api/ai/assemble`.                            |
| 1.2 | Fix SQL injection risk              | ✅     | Replaced `sql.raw()` with parameterized array query in `getUserPrompts`.                      |
| 1.3 | Debounce search input               | ✅     | Added 300ms debounce to `PromptFilters` search input.                                         |
| 1.4 | Add error boundaries                | ✅     | Created `error.tsx` for `/prompts`, `/builder`, and app root.                                 |
| 1.5 | Add auth middleware                 | ✅     | Created `middleware.ts` for centralized route protection.                                     |
| 1.6 | Remove or integrate unused assemble | ✅     | Removed dead `/api/ai/assemble` route.                                                        |
| 1.7 | Update AI model list                | ✅     | Updated to GPT-4.1, Claude Opus/Sonnet 4-6, Gemini 2.5 Pro/Flash.                            |


---

## Phase 2 — UX & UI Improvements ✅


| #   | Task                        | Status | Details                                                                                 |
| --- | --------------------------- | ------ | --------------------------------------------------------------------------------------- |
| 2.1 | Pagination controls         | ✅     | Added Previous/Next pagination UI to the prompts list.                                  |
| 2.2 | Version diff viewer         | ✅     | Added side-by-side diff view with color-coded lines in the Versions tab.                |
| 2.3 | Prompt templates/starters   | ✅     | Added `TemplateSelector` with pre-built templates (Code Review, Blog Post, etc.).       |
| 2.4 | Keyboard shortcuts          | ✅     | `Cmd+S` to save, `Cmd+Enter` to optimize.                                               |
| 2.5 | Improved loading states     | ✅     | Enhanced skeleton loaders for builder, prompt detail, and prompts list.                  |
| 2.6 | Empty states                | ✅     | Distinct empty states with CTAs for "no prompts" vs "no search results".                |
| 2.7 | Confirm destructive actions | ✅     | Added `AlertDialog` confirmation before prompt deletion.                                |


---

## Phase 3 — Advanced AI Features ✅


| #   | Task                        | Status | Details                                                                                |
| --- | --------------------------- | ------ | -------------------------------------------------------------------------------------- |
| 3.1 | Prompt testing/playground   | ✅     | Added `/api/ai/test` route and "Test" tab in prompt preview with streaming output.     |
| 3.2 | Multi-model comparison      | ✅     | Side-by-side model comparison dialog with independent streaming slots.                 |
| 3.3 | Prompt scoring/analysis     | ✅     | AI-powered analysis via `/api/ai/analyze` with scores, strengths, and improvements.    |
| 3.4 | Prompt chaining             | ✅     | New `/chain` page with multi-step workflows using `{{previous_output}}` placeholders.  |
| 3.5 | Variable/placeholder system | ✅     | `{{variable}}` extraction and resolution with `VariableFiller` UI component.           |
| 3.6 | AI model recommendations    | ✅     | Model recommendations per category with suggestion badge in `ModelSelector`.           |


---

## Phase 4 — Collaboration & Social Features ✅


| #   | Task                  | Status | Details                                                                             |
| --- | --------------------- | ------ | ----------------------------------------------------------------------------------- |
| 4.1 | Public prompt gallery | ✅     | New `/gallery` page with search, filters, author info, and pagination.              |
| 4.2 | Fork/clone prompts    | ✅     | `forkPrompt` server action with fork buttons in gallery and shared views.           |
| 4.3 | Ratings & favorites   | ✅     | `favorites` table with toggle, count, and heart button on gallery cards.            |
| 4.4 | Collections/folders   | ✅     | `collections` + `collectionPrompts` tables with `CollectionManager` component.      |
| 4.5 | Share via link        | ✅     | `/share/[id]` route with `SharedPromptView`, SEO metadata, and copy-link action.   |
| 4.6 | Export/import         | ✅     | `ExportImport` component — download as JSON/Markdown, upload JSON to import.       |


---

## Phase 5 — Infrastructure & Performance ✅


| #   | Task               | Status | Details                                                                                    |
| --- | ------------------ | ------ | ------------------------------------------------------------------------------------------ |
| 5.1 | Rate limiting      | ✅     | In-memory rate limiter (20 req/min per user) on all AI API routes.                         |
| 5.2 | Caching layer      | ✅     | `unstable_cache` with 60s revalidation on public gallery queries.                          |
| 5.3 | Image optimization | ✅     | Already clean — no raw `<img>` tags found, using shadcn Avatar + `next/font`.              |
| 5.4 | Dynamic imports    | ✅     | `PromptBuilder` and `PromptChainBuilder` lazy-loaded with `next/dynamic`.                  |
| 5.5 | Testing setup      | ✅     | Vitest + @testing-library/react. 13 unit tests covering rate-limiter, variables, assembler. |
| 5.6 | API usage tracking | ✅     | New `api_usage` table + `trackUsage()` helper called in all AI routes.                     |
| 5.7 | SEO & metadata     | ✅     | Metadata template in root layout, OG/Twitter tags, metadata on all pages.                  |


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

