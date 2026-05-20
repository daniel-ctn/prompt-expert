import { ArrowRight, ArrowUpRight, PenLine, Sparkles } from 'lucide-react'
import { BuilderSnapshot } from '@/components/home/builder-snapshot'
import { AppLink, appLinkTransitionTypes } from '@/components/ui/app-link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FadeIn, StaggerGroup, StaggerItem } from '@/components/ui/reveal'

const stats = [
  {
    value: '03',
    label: 'Core workflows',
    detail: 'Build, test, refine — one place.',
    tilt: '-rotate-[2deg]',
  },
  {
    value: '50',
    suffix: '/mo',
    label: 'Free credits',
    detail: 'Enough to validate real iterations.',
    tilt: 'rotate-[1.5deg]',
  },
  {
    value: '1',
    suffix: '-click',
    label: 'Prompt refinement',
    detail: 'Clearer language, same structure.',
    tilt: '-rotate-[1deg]',
  },
]

const workflows = [
  {
    n: '01',
    title: 'From rough idea to usable prompt',
    body: 'Builder defaults, templates, and guided sections start you with structure instead of a blank page.',
    tilt: '-rotate-[1.4deg]',
  },
  {
    n: '02',
    title: 'Chain prompts into repeatable flows',
    body: 'Model step-to-step reasoning, reuse prior outputs, and test multi-stage sequences without leaving the workspace.',
    tilt: 'rotate-[1deg]',
  },
  {
    n: '03',
    title: 'Turn experiments into reusable assets',
    body: 'Save prompts, publish shareable versions, keep a growing library of proven building blocks.',
    tilt: '-rotate-[0.8deg]',
  },
]

const examples = [
  {
    label: 'Code review',
    title: 'From rough intent to review-ready prompt',
    before: 'Review this pull request and tell me what is wrong.',
    after:
      'Review the provided pull request for correctness, security, performance, and maintainability. Prioritize findings by severity, cite the concrete issue, and suggest fixes with code where useful.',
  },
  {
    label: 'Support workflow',
    title: 'A prompt teams can actually reuse',
    before: 'Help the customer with their issue politely.',
    after:
      'Act as a SaaS support specialist. Acknowledge the issue, summarize the likely cause, provide the next 3 actions, and close with a confirmation question. Keep the tone concise and reassuring.',
  },
]

function HandRule({
  className = '',
  width = 'full',
}: {
  className?: string
  width?: 'full' | 'sm'
}) {
  return (
    <div
      aria-hidden
      className={`hand-rule ${width === 'sm' ? 'max-w-[14rem]' : ''} ${className}`}
    />
  )
}

function ChapterMark({ label }: { label: string }) {
  return <p className="chapter-mark">{label}</p>
}

export default function HomePage() {
  return (
    <div className="pb-16">
      {/* ── № 01 — HERO ─────────────────────────────────────────────── */}
      <section className="page-shell pt-10 sm:pt-14">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] md:items-end">
          <div className="space-y-6">
            <FadeIn delay={0.02}>
              <ChapterMark label="№ 01 — A workspace for prompt work" />
            </FadeIn>
            <FadeIn delay={0.06}>
              <h1 className="font-display text-[2.6rem] leading-[0.96] tracking-[-0.025em] text-balance sm:text-6xl lg:text-[4.5rem]">
                Sharper prompts,
                <br />
                <span className="italic">calmer</span> workflow,
                <br />
                <span className="marker-highlight">better</span> AI output.
              </h1>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="page-copy text-pretty">
                Prompt Expert is a structured workspace for drafting,
                optimizing, testing, and organizing prompts — without the usual
                copy-paste chaos. Built like a notebook, not a chat.
              </p>
            </FadeIn>
            <FadeIn delay={0.14}>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  render={
                    <AppLink
                      href="/builder"
                      transitionTypes={appLinkTransitionTypes.builder}
                    />
                  }
                  size="lg"
                  className="rounded-md px-4 py-2.5 text-[0.95rem]"
                >
                  Open the builder
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  render={<AppLink href="/gallery" />}
                  className="rounded-md px-4 py-2.5 text-[0.95rem]"
                >
                  Browse the gallery
                </Button>
                <div className="text-muted-foreground flex items-center gap-2 pl-1 font-mono text-[12px] tracking-wide">
                  <span>or press</span>
                  <kbd className="border-foreground/70 bg-background rounded-sm border px-1.5 py-0.5 text-[10.5px] shadow-[var(--shadow-paper-sm)]">
                    Ctrl
                  </kbd>
                  <span>+</span>
                  <kbd className="border-foreground/70 bg-background rounded-sm border px-1.5 py-0.5 text-[10.5px] shadow-[var(--shadow-paper-sm)]">
                    K
                  </kbd>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Sticky-note stats stack */}
          <div className="relative grid gap-5 sm:grid-cols-3 md:grid-cols-1">
            {stats.map((stat, i) => (
              <FadeIn key={stat.label} delay={0.16 + i * 0.06}>
                <div
                  className={`paper-edge group bg-card relative px-4 py-4 transition-transform duration-200 hover:-translate-y-0.5 hover:rotate-0 ${stat.tilt}`}
                >
                  <div className="font-display nums flex items-baseline gap-1 text-4xl leading-none font-medium tracking-tight">
                    {stat.value}
                    {stat.suffix ? (
                      <span className="text-muted-foreground font-mono text-[11px] font-normal tracking-[0.18em] uppercase">
                        {stat.suffix}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-2 font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                    {stat.label}
                  </p>
                  <p className="text-muted-foreground mt-1.5 text-[13px] leading-snug">
                    {stat.detail}
                  </p>
                  <span className="bg-foreground absolute -top-1.5 left-4 h-1.5 w-1.5 rounded-full" />
                  <span className="bg-foreground absolute -top-1.5 right-4 h-1.5 w-1.5 rounded-full" />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <div className="text-muted-foreground mt-14 flex items-center gap-6">
          <HandRule className="flex-1 opacity-80" />
          <Sparkles className="text-foreground/70 h-4 w-4" />
          <HandRule className="flex-1 opacity-80" />
        </div>
      </section>

      {/* ── № 02 — BUILDER SNAPSHOT ─────────────────────────────────── */}
      <section className="page-shell pt-2">
        <FadeIn>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-2">
              <ChapterMark label="№ 02 — The workspace" />
              <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
                A notebook for prompts, not a chat window.
              </h2>
            </div>
            <Badge variant="secondary" className="self-start sm:self-end">
              <PenLine className="h-3 w-3" /> live preview
            </Badge>
          </div>
        </FadeIn>
        <BuilderSnapshot />
      </section>

      {/* ── № 03 — WORKFLOWS ─────────────────────────────────────────── */}
      <section className="page-shell">
        <FadeIn>
          <div className="mb-8 max-w-3xl space-y-3">
            <ChapterMark label="№ 03 — How it actually works" />
            <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
              Three habits that make prompt work feel{' '}
              <span className="hand-underline">deliberate</span>.
            </h2>
            <p className="page-copy">
              Instead of jumping between notes, chat windows, and docs — shape
              prompts, test outputs, compare model behavior, and save the
              winners in one flow.
            </p>
          </div>
        </FadeIn>

        <StaggerGroup className="grid gap-7 md:grid-cols-3">
          {workflows.map((wf) => (
            <StaggerItem key={wf.n}>
              <div
                className={`paper-edge group bg-card relative px-5 py-6 transition-transform duration-200 hover:-translate-y-0.5 hover:rotate-0 ${wf.tilt}`}
              >
                <div className="border-foreground/85 bg-background absolute -top-3 left-4 inline-flex h-6 items-center border px-2 font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
                  № {wf.n}
                </div>
                <div className="font-display nums mb-3 text-5xl leading-none font-medium tracking-tight">
                  {wf.n}
                </div>
                <h3 className="font-display text-xl leading-tight font-medium tracking-tight">
                  {wf.title}
                </h3>
                <p className="text-muted-foreground mt-3 text-[14px] leading-6">
                  {wf.body}
                </p>
                <div className="text-foreground/60 group-hover:text-foreground mt-5 flex items-center gap-2 transition-colors">
                  <div className="hand-rule flex-1 opacity-60" />
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ── № 04 — BEFORE / AFTER ────────────────────────────────────── */}
      <section className="page-shell">
        <FadeIn>
          <div className="mb-8 max-w-3xl space-y-3">
            <ChapterMark label="№ 04 — Before / After" />
            <h2 className="font-display text-3xl font-medium tracking-tight sm:text-4xl">
              What “better prompt structure” actually{' '}
              <span className="italic">looks like</span>.
            </h2>
            <p className="page-copy">
              The goal isn’t longer prompts. It’s more precise, reusable,
              testable ones.
            </p>
          </div>
        </FadeIn>

        <StaggerGroup className="grid gap-8 lg:grid-cols-2">
          {examples.map((ex, i) => (
            <StaggerItem key={ex.title}>
              <div className="paper-edge bg-card overflow-hidden">
                <div className="border-foreground/85 flex items-center justify-between border-b px-5 py-3">
                  <Badge>{ex.label}</Badge>
                  <span className="text-muted-foreground font-mono text-[10px] tracking-[0.24em] uppercase">
                    Sample № {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div className="px-5 pt-5">
                  <h3 className="font-display text-[1.35rem] leading-snug font-medium tracking-tight">
                    {ex.title}
                  </h3>
                </div>
                <div className="grid gap-0 px-5 pt-4 pb-5 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
                  <div className="border-foreground/85 bg-background relative border p-4">
                    <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
                      Draft
                    </p>
                    <p className="text-foreground/85 mt-2 font-mono text-[12.5px] leading-6">
                      “{ex.before}”
                    </p>
                  </div>
                  <div className="flex items-center justify-center px-3 py-3 md:px-2">
                    <div className="text-foreground/70 rotate-90 font-mono text-xs tracking-[0.24em] uppercase md:rotate-0">
                      →
                    </div>
                  </div>
                  <div className="border-foreground relative border bg-[color-mix(in_oklch,var(--marigold)_14%,var(--background))] p-4 shadow-[var(--shadow-paper-sm)]">
                    <p className="font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
                      Revised
                    </p>
                    <p className="font-display mt-2 text-[14px] leading-7">
                      {ex.after}
                    </p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ── № 05 — CTA ───────────────────────────────────────────────── */}
      <section className="page-shell">
        <FadeIn>
          <div className="paper-edge bg-card relative overflow-hidden px-6 py-12 sm:px-10 sm:py-16">
            {/* Postcard corner stamp */}
            <div className="border-foreground bg-background absolute top-5 right-5 hidden h-20 w-16 -rotate-3 flex-col items-center justify-center gap-1 border-2 sm:flex">
              <Sparkles className="text-foreground h-3.5 w-3.5" />
              <span className="font-mono text-[8.5px] leading-none tracking-[0.2em] uppercase">
                Prompt
              </span>
              <span className="font-mono text-[8.5px] leading-none tracking-[0.2em] uppercase">
                Expert
              </span>
              <span className="text-muted-foreground font-mono text-[7.5px] leading-none tracking-[0.18em]">
                v · 2026
              </span>
            </div>
            <div className="max-w-2xl space-y-5">
              <ChapterMark label="№ 05 — Get started" />
              <h2 className="font-display text-4xl font-medium tracking-tight sm:text-5xl">
                Build with structure now.{' '}
                <span className="text-muted-foreground block italic">
                  Refine the rest with the product.
                </span>
              </h2>
              <p className="page-copy">
                Start free. Save your best prompts. Test the workflow against
                real work before you scale up.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-3">
                <Button
                  render={
                    <AppLink
                      href="/builder"
                      transitionTypes={appLinkTransitionTypes.builder}
                    />
                  }
                  size="lg"
                  className="rounded-md px-4 py-2.5 text-[0.95rem]"
                >
                  Open the builder
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  render={<AppLink href="/gallery" />}
                  className="rounded-md px-4 py-2.5 text-[0.95rem]"
                >
                  Browse the gallery
                </Button>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </div>
  )
}
