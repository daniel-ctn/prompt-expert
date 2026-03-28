# Design Patterns Audit

This document summarizes the design patterns currently used in the `prompt-expert` codebase and recommends a few additional patterns that would improve maintainability, consistency, and code quality over time.

The goal is not to add patterns for their own sake. The best candidates below are the ones that reduce repeated logic, clarify ownership, and make future features easier to add without growing large files or duplicating workflows.

## Architecture Snapshot

- Framework: Next.js App Router with a mix of server components, client components, server actions, and route handlers.
- State: local React state for component workflows, Zustand for cross-component UI and builder state.
- Validation: Zod schemas with inferred TypeScript types.
- Data access: Drizzle ORM through a shared DB module.
- UI foundation: Base UI / shadcn-style wrapper components plus Tailwind CSS.
- AI integration: centralized provider/model resolution in `src/lib/ai/index.ts`.

## Design Patterns Already Used

### 1. Composition Root / Provider Composition

The app has a clear provider composition root in `src/app/layout.tsx` and `src/components/providers.tsx`.

Used in:

- `src/app/layout.tsx`
- `src/components/providers.tsx`

Why it helps:

- Centralizes app-wide concerns like theming, auth session context, tooltips, upgrade modal, and toaster setup.
- Keeps page and feature components focused on feature logic rather than global wiring.

### 2. Adapter / Facade Pattern for Third-Party UI Primitives

The `src/components/ui/*` layer wraps Base UI and Next.js primitives behind app-specific interfaces and styling.

Used in:

- `src/components/ui/button.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/app-link.tsx`

Why it helps:

- Shields feature components from third-party API details.
- Gives the app a single styling and behavior surface.
- Makes future UI-library changes far easier than using raw primitives everywhere.

### 3. Registry / Factory Pattern for AI Providers

The AI layer uses a small registry plus factory-like resolution to map a logical model to a provider instance and provider-specific model ID.

Used in:

- `src/lib/ai/index.ts`

Why it helps:

- Centralizes provider/model lookup.
- Makes AI route handlers simpler.
- Provides a good extension point for new providers and provider-specific logic.

### 4. Singleton Pattern for Shared Infrastructure

The codebase caches expensive shared resources in module-level/global factories.

Used in:

- `src/lib/db/index.ts`
- `src/lib/stripe.ts`

Why it helps:

- Prevents repeated initialization of DB and Stripe clients.
- Keeps infrastructure setup behind a simple access API.

### 5. Schema-Driven Validation Pattern

Zod schemas act as runtime contracts and a source for inferred input types.

Used in:

- `src/lib/validators/prompt.ts`
- `src/stores/prompt-builder.ts`
- multiple server actions in `src/lib/actions/*`

Why it helps:

- Validates external and user-controlled input.
- Reduces duplication between validation and typing.
- Makes contracts explicit at module boundaries.

### 6. Store Pattern for Shared UI / Workflow State

Zustand is used for state that spans many components or represents a shared workflow.

Used in:

- `src/stores/prompt-builder.ts`
- `src/stores/upgrade-modal.ts`

Why it helps:

- Keeps prompt-builder components small and focused.
- Avoids prop drilling across builder inputs and preview sections.
- Works well for app-wide modal state.

### 7. Container / Presenter Separation

Several routes fetch data on the server, then hand it off to focused client components for interaction-heavy UI.

Used in:

- `src/app/builder/page.tsx`
- `src/app/builder/builder-client.tsx`
- `src/app/prompts/page.tsx`
- `src/app/system-prompts/page.tsx`

Why it helps:

- Keeps data loading close to the route.
- Prevents client-only concerns from leaking into server pages.
- Creates cleaner boundaries between fetching and interaction.

### 8. Config-Driven UI Pattern

Many selectors and recommendation UIs are driven by data structures rather than hard-coded branches.

Used in:

- `src/config/constants.ts`
- `src/config/plans.ts`
- `src/components/prompt-builder/model-selector.tsx`
- `src/components/prompt-builder/category-selector.tsx`
- `src/components/prompt-builder/template-selector.tsx`

Why it helps:

- Makes options and labels easy to update.
- Reduces UI branching.
- Supports feature growth through configuration rather than scattered conditionals.

### 9. Command-Style Mutation Modules

Server actions are used as explicit mutation/query entry points for business operations.

Used in:

- `src/lib/actions/prompt.ts`
- `src/lib/actions/system-prompts.ts`
- `src/lib/actions/api-keys.ts`
- `src/lib/actions/api-tokens.ts`
- `src/lib/actions/prompt-history.ts`

Why it helps:

- Creates clear intent-based entry points like `createPrompt`, `toggleFavorite`, and `deleteCollection`.
- Keeps mutation logic out of page components.

### 10. Decorator-Like Caching Pattern

Caching is applied around query logic instead of being hard-coded into all callers.

Used in:

- `src/lib/actions/prompt.ts` via `unstable_cache`

Why it helps:

- Keeps fetch behavior composable.
- Avoids mixing low-level query logic with cache policy everywhere.

### 11. Lightweight Observer Pattern

The codebase already uses a tiny event-driven update path for credits.

Used in:

- `src/components/layout/header.tsx`
- `src/components/prompt-builder/prompt-preview.tsx`
- `src/components/prompt-builder/prompt-analysis.tsx`
- `src/components/prompt-builder/model-comparison.tsx`

Why it helps:

- Allows loose coupling between credit-consuming actions and the header badge.

Tradeoff:

- Right now it is an ad hoc browser event, not a formal shared abstraction.

### 12. Unit Testing for Pure Logic

The existing tests focus on pure utilities and deterministic behavior.

Used in:

- `src/__tests__/assemble-prompt.test.ts`
- `src/__tests__/rate-limit.test.ts`
- `src/__tests__/variables.test.ts`

Why it helps:

- Protects foundational logic without requiring complex UI harnesses.
- Encourages keeping some modules pure and easy to test.

## Main Code Quality Opportunities

The codebase already has good foundations, but a few files and workflows are absorbing too many responsibilities.

The highest-value opportunities are:

1. Large action modules mixing multiple domains.
2. Repeated API route orchestration logic.
3. Repeated client-side async action boilerplate.
4. Repeated list/empty-state/pagination UI patterns.
5. Repeated domain definitions across `types`, `config`, and validation files.
6. Ad hoc event-based global updates.

## Recommended Patterns To Introduce

### 1. Service Layer + Use-Case Modules

Priority: High

Best target:

- `src/lib/actions/prompt.ts`

Current issue:

- `prompt.ts` handles CRUD, public gallery reads, favorites, collections, analytics, versions, presets, and forking.
- This makes it harder to reason about ownership and increases the chance of accidental coupling.

Recommended pattern:

- Split by use case or subdomain:
  - `src/lib/actions/prompt-crud.ts`
  - `src/lib/actions/prompt-public.ts`
  - `src/lib/actions/prompt-favorites.ts`
  - `src/lib/actions/prompt-collections.ts`
  - `src/lib/actions/prompt-analytics.ts`

Why this helps:

- Improves discoverability.
- Keeps files focused.
- Makes testing and future changes less risky.

### 2. Repository Pattern for Data Access

Priority: High

Best targets:

- `src/lib/actions/prompt.ts`
- `src/lib/actions/system-prompts.ts`
- `src/lib/actions/api-keys.ts`
- `src/lib/actions/api-tokens.ts`

Current issue:

- Server actions mix business rules, auth checks, revalidation, and Drizzle queries in the same function bodies.

Recommended pattern:

- Introduce repository/query modules for persistence concerns, then keep action files focused on orchestration.

Example split:

- `src/lib/repositories/prompt-repository.ts`
- `src/lib/repositories/collection-repository.ts`
- `src/lib/repositories/favorite-repository.ts`

Why this helps:

- Separates persistence from use-case logic.
- Makes query reuse easier.
- Gives tests a cleaner seam than the current action files.

### 3. Template Method / Pipeline Pattern for AI Route Handlers

Priority: High

Best targets:

- `src/app/api/ai/optimize/route.ts`
- `src/app/api/ai/test/route.ts`
- `src/app/api/ai/analyze/route.ts`

Current issue:

- These route handlers repeat the same pipeline:
  - authenticate user
  - rate limit
  - verify credits
  - resolve provider key
  - deduct credits
  - track usage
  - call model
  - save history or return parsed output

Recommended pattern:

- Extract a shared AI operation runner with hooks for operation-specific behavior.

Example shape:

- `runAiOperation({ operation, model, cost, buildRequest, onFinish })`

Why this helps:

- Reduces duplicated guard logic.
- Makes policy changes safer.
- Makes it easier to add new AI endpoints without copy/paste.

### 4. Custom Hook for Async Client Mutations

Priority: High

Best targets:

- `src/components/settings/api-key-manager.tsx`
- `src/components/settings/api-token-manager.tsx`
- `src/components/prompts/collection-manager.tsx`
- `src/components/prompts/prompt-card.tsx`
- `src/components/system-prompts/system-prompt-manager.tsx`
- `src/components/prompt-builder/save-prompt-dialog.tsx`

Current issue:

- Many components repeat the same pattern:
  - local loading state
  - try/catch
  - toast success/error
  - optimistic or local state update

Recommended pattern:

- Introduce a hook such as `useAsyncAction` or `useMutationAction`.

Example responsibilities:

- manage loading state
- normalize success/error handling
- centralize toast behavior
- optionally support optimistic updates

Why this helps:

- Cuts repetitive boilerplate.
- Makes client mutation flows more consistent.
- Reduces tiny implementation differences between similar components.

### 5. Shared Resource List / Empty State Pattern

Priority: Medium

Best targets:

- `src/components/prompts/prompt-list.tsx`
- `src/components/gallery/gallery-list.tsx`

Current issue:

- These components share a very similar structure:
  - empty state when filtered
  - empty state when not filtered
  - card grid
  - pagination footer

Recommended pattern:

- Extract a reusable list shell or slot-based component for:
  - header/count
  - empty state
  - grid
  - pagination

Why this helps:

- Keeps gallery and prompt-list behavior aligned.
- Prevents style and UX drift.
- Makes future list-based features faster to build.

### 6. Single Source of Truth Registry for Domain Options

Priority: Medium

Best targets:

- `src/types/index.ts`
- `src/config/constants.ts`
- `src/lib/validators/prompt.ts`
- `src/lib/ai/index.ts`

Current issue:

- Models, providers, categories, tones, and formats are represented in multiple places.
- The code is mostly aligned today, but the structure still allows drift when adding or renaming options.

Recommended pattern:

- Define canonical const tuples/registries once, then derive:
  - TypeScript unions
  - Zod enums
  - labels/descriptions
  - provider metadata

Why this helps:

- Reduces mismatch risk.
- Makes adding a new model or category a single-flow change.
- Improves confidence in refactors.

### 7. State Machine / Reducer Pattern for Complex UI Flows

Priority: Medium

Best targets:

- `src/components/prompt-builder/prompt-preview.tsx`
- `src/components/prompt-chain/chain-builder.tsx`
- `src/components/system-prompts/system-prompt-manager.tsx`

Current issue:

- Some components coordinate several related booleans and parallel UI phases.
- This is manageable now, but complexity will rise quickly as features grow.

Recommended pattern:

- Use `useReducer` or a small state machine for multi-step flows and mutually exclusive states.

Examples:

- preview operation states: idle, optimizing, testing, analyzing, error
- chain execution: idle, running, failed, completed
- system prompt editor: creating, editing, deleting, copying

Why this helps:

- Makes transitions explicit.
- Prevents impossible state combinations.
- Improves maintainability as workflows grow.

### 8. Formal Observer Pattern for Global Credits State

Priority: Medium

Best targets:

- `src/components/layout/header.tsx`
- components dispatching `credits:updated`

Current issue:

- Global credit refresh uses `window.dispatchEvent(new Event('credits:updated'))`.

Recommended pattern:

- Move credits into a shared store or a dedicated query/cache abstraction.
- If you want to stay lightweight, a dedicated Zustand credits slice is enough.

Why this helps:

- Replaces stringly typed global browser events.
- Makes updates explicit and testable.
- Removes a hidden dependency between unrelated components.

### 9. Result Object Pattern for Actions and Routes

Priority: Medium

Best targets:

- server actions in `src/lib/actions/*`
- route handlers in `src/app/api/*`

Current issue:

- Many paths throw generic errors or return different response shapes.
- UI code often converts any failure into a generic toast.

Recommended pattern:

- Standardize on typed result objects such as:
  - `{ ok: true, data }`
  - `{ ok: false, code, message }`

Why this helps:

- Makes client-side handling more predictable.
- Improves error granularity without scattering string checks.
- Helps when adding richer UI states later.

## Suggested Refactor Order

If you want to improve code quality incrementally, this is the order I would recommend:

1. Split `src/lib/actions/prompt.ts` into smaller use-case modules.
2. Extract a shared AI route pipeline for optimize/test/analyze.
3. Create a `useAsyncAction` hook and migrate 2-3 components first.
4. Replace the credits browser event with a shared credits store.
5. Create a shared list shell for prompt/gallery list pages.
6. Consolidate domain registries so config, types, and validation derive from one place.

This order keeps each step small and gives the team immediate cleanup value without forcing a full rewrite.

## What Not To Over-Engineer Yet

These patterns are probably not worth adding right now:

- Full-blown dependency injection container
- Heavy event bus
- CQRS/event sourcing
- Overly generic repository abstractions that hide Drizzle too much
- State machines for every component

The codebase is still small enough that lightweight, file-level patterns are the right next step.

## Summary

The codebase already shows strong instincts:

- clear provider composition
- a solid UI abstraction layer
- centralized model/provider lookup
- schema-driven validation
- shared store usage where it matters
- good separation between route-level loading and interactive UI

The biggest improvement now is not “more abstraction everywhere.” It is introducing a few targeted patterns in the places where repetition and file growth are already visible:

- service/repository boundaries
- shared AI endpoint orchestration
- reusable async mutation hooks
- shared list shells
- a single source of truth for domain options

Those changes would make the project easier to evolve while staying consistent with the style it already uses well.
