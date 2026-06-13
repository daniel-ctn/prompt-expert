import {
  ArrowRight,
  BookMarked,
  Boxes,
  Check,
  FlaskConical,
  GitFork,
  History,
  KeyRound,
  Sparkles,
  Wand2,
  Workflow,
} from 'lucide-react'
import { AppLink, appLinkTransitionTypes } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'
import { FadeIn, StaggerGroup, StaggerItem } from '@/components/ui/reveal'

const models = ['Claude', 'GPT-4o', 'Gemini']

const stats = [
  { value: '50', label: 'free credits / month' },
  { value: '3', label: 'model providers' },
  { value: '1-click', label: 'optimize · test · analyze' },
  { value: '$0', label: 'to start — BYO keys' },
]

const heroPrompt = [
  { label: 'ROLE', text: 'Senior staff engineer reviewing a pull request.' },
  { label: 'TASK', text: 'Audit the diff for correctness, security, and perf.' },
  { label: 'RULES', text: 'Rank findings by severity · cite the exact line.' },
  { label: 'FORMAT', text: 'Markdown table — issue · severity · fix.' },
]

const steps = [
  {
    n: '01',
    icon: Boxes,
    title: 'Build with structure',
    body: 'Structured controls for model, role, context, constraints, tone, and output format. Start from templates instead of a blank chat box.',
  },
  {
    n: '02',
    icon: Wand2,
    title: 'Optimize & test',
    body: 'One click rewrites for clarity, then runs the prompt against real models and scores its quality — so you ship on evidence, not vibes.',
  },
  {
    n: '03',
    icon: GitFork,
    title: 'Save, version & share',
    body: 'Keep a searchable library, track every revision, publish to the public gallery, and fork the community’s best into your own.',
  },
]

type DiffLine =
  | { kind: 'del'; text: string }
  | { kind: 'add'; text: string }
  | { kind: 'gap' }

const diff: DiffLine[] = [
  { kind: 'del', text: 'Write a blog post about our new feature.' },
  { kind: 'gap' },
  { kind: 'add', text: '## Role' },
  { kind: 'add', text: 'Product marketing writer for a developer tool.' },
  { kind: 'add', text: '' },
  { kind: 'add', text: '## Task' },
  { kind: 'add', text: 'Write a 600-word launch post for prompt versioning.' },
  { kind: 'add', text: '' },
  { kind: 'add', text: '## Audience' },
  { kind: 'add', text: 'Senior engineers. Skeptical, time-poor.' },
  { kind: 'add', text: '' },
  { kind: 'add', text: '## Must include' },
  { kind: 'add', text: '- A concrete before / after example' },
  { kind: 'add', text: '- One code snippet · a clear call to action' },
  { kind: 'add', text: '' },
  { kind: 'add', text: '## Tone' },
  { kind: 'add', text: 'Direct, technical, no hype.' },
]

const features = [
  {
    icon: Boxes,
    title: 'Multi-model',
    body: 'Target OpenAI, Anthropic, and Google models from one place.',
  },
  {
    icon: BookMarked,
    title: 'Prompt library',
    body: 'Save, tag, search, and organize everything you write.',
  },
  {
    icon: GitFork,
    title: 'Public gallery',
    body: 'Publish prompts and fork the community’s best into yours.',
  },
  {
    icon: History,
    title: 'Version history',
    body: 'Track every change across iterations and roll back safely.',
  },
  {
    icon: Workflow,
    title: 'Prompt chains',
    body: 'Pipe outputs into repeatable, multi-step reasoning flows.',
  },
  {
    icon: KeyRound,
    title: 'Bring your own keys',
    body: 'Use your own provider keys, encrypted, for heavier runs.',
  },
]

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-muted-foreground inline-flex items-center gap-2.5 font-mono text-[11px] font-medium tracking-[0.3em] uppercase">
      <span className="bg-signal h-1.5 w-1.5 rounded-full" />
      {children}
    </span>
  )
}

function TerminalChrome({ label }: { label: string }) {
  return (
    <div className="term-bar flex items-center gap-2 px-4 py-3">
      <span className="h-3 w-3 rounded-full bg-[oklch(0.64_0.17_28)]" />
      <span className="h-3 w-3 rounded-full bg-[oklch(0.82_0.15_85)]" />
      <span className="h-3 w-3 rounded-full bg-[oklch(0.82_0.17_140)]" />
      <span className="ml-2 font-mono text-[11px] text-[var(--t-muted)]">
        {label}
      </span>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="relative overflow-clip pb-24">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative">
        <div
          aria-hidden
          className="tech-grid grid-mask-fade pointer-events-none absolute inset-0 -z-10 opacity-70"
        />
        <div className="mx-auto w-full max-w-6xl px-5 pt-12 sm:px-6 sm:pt-16 lg:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.94fr)]">
            {/* Left: pitch */}
            <div>
              <FadeIn>
                <Eyebrow>Prompt workflow · free &amp; open</Eyebrow>
              </FadeIn>
              <FadeIn delay={0.05}>
                <h1 className="font-display mt-6 text-[clamp(2.7rem,6.2vw,4.7rem)] leading-[0.97] font-semibold tracking-[-0.035em] text-balance">
                  The workbench for{' '}
                  <span className="signal-underline">serious prompting.</span>
                </h1>
              </FadeIn>
              <FadeIn delay={0.1}>
                <p className="text-muted-foreground mt-6 max-w-xl text-[15.5px] leading-7 text-pretty sm:text-[17px]">
                  Draft, optimize, test, and version your prompts in one
                  structured workspace — then publish or fork the best from the
                  community. Multi-model, free to start, no copy-paste chaos.
                </p>
              </FadeIn>
              <FadeIn delay={0.14}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Button
                    render={
                      <AppLink
                        href="/builder"
                        transitionTypes={appLinkTransitionTypes.builder}
                      />
                    }
                    size="lg"
                    className="h-11 rounded-lg px-5 text-[0.95rem]"
                  >
                    Open the builder
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    render={<AppLink href="/gallery" />}
                    className="h-11 rounded-lg px-5 text-[0.95rem]"
                  >
                    Explore the gallery
                  </Button>
                  <span className="text-muted-foreground ml-1 hidden items-center gap-1.5 font-mono text-[11px] tracking-wide sm:flex">
                    or press
                    <kbd className="border-border-strong bg-card rounded-[5px] border px-1.5 py-0.5 text-[10px]">
                      Ctrl
                    </kbd>
                    <kbd className="border-border-strong bg-card rounded-[5px] border px-1.5 py-0.5 text-[10px]">
                      K
                    </kbd>
                  </span>
                </div>
              </FadeIn>
              <FadeIn delay={0.18}>
                <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2">
                  <span className="text-muted-foreground font-mono text-[10px] tracking-[0.24em] uppercase">
                    Runs on
                  </span>
                  {models.map((m) => (
                    <span
                      key={m}
                      className="text-foreground/80 inline-flex items-center gap-1.5 font-mono text-[12.5px]"
                    >
                      <span className="bg-foreground/30 h-1 w-1 rounded-full" />
                      {m}
                    </span>
                  ))}
                </div>
              </FadeIn>
            </div>

            {/* Right: live instrument panel */}
            <FadeIn delay={0.12} className="lg:pl-2">
              <div className="term overflow-hidden">
                <TerminalChrome label="prompt-expert / optimize" />
                <div className="px-4 py-4 font-mono text-[12.5px] leading-6 sm:px-5 sm:py-5">
                  <p className="text-[var(--t-muted)]">
                    <span className="select-none opacity-50">$ </span>
                    draft “review this PR and tell me what’s wrong”
                  </p>
                  <div className="my-3.5 flex items-center gap-3 text-[var(--t-muted)]">
                    <span className="h-px flex-1 bg-[var(--t-border)]" />
                    <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.18em] uppercase">
                      <Sparkles className="h-3 w-3 text-[var(--t-signal)]" />
                      optimizing
                    </span>
                    <span className="h-px flex-1 bg-[var(--t-border)]" />
                  </div>
                  <div className="space-y-1.5">
                    {heroPrompt.map((line, i) => (
                      <div key={line.label} className="flex gap-3">
                        <span className="w-4 shrink-0 text-right text-[var(--t-muted)] opacity-40 select-none">
                          {i + 1}
                        </span>
                        <span className="text-[10.5px] font-semibold tracking-[0.1em] text-[var(--t-signal)]">
                          {line.label}
                        </span>
                        <span
                          className={`text-[var(--t-fg)] ${i === heroPrompt.length - 1 ? 'caret-blink' : ''}`}
                        >
                          {line.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Stat strip */}
          <FadeIn delay={0.2}>
            <div className="border-border bg-border mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label} className="bg-background px-5 py-5">
                  <div className="font-display nums text-3xl leading-none font-semibold tracking-tight">
                    {s.value}
                  </div>
                  <p className="text-muted-foreground mt-2 text-[12.5px] leading-snug">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-24 sm:px-6">
        <FadeIn>
          <Eyebrow>How it works</Eyebrow>
          <h2 className="font-display mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-[2.6rem] sm:leading-[1.05]">
            Three moves, one workspace.
          </h2>
        </FadeIn>
        <StaggerGroup className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step) => (
            <StaggerItem key={step.n}>
              <div className="group border-border bg-card hover:border-border-strong relative flex h-full flex-col rounded-2xl border p-6 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="border-border bg-background flex h-10 w-10 items-center justify-center rounded-xl border">
                    <step.icon className="text-foreground h-[18px] w-[18px]" />
                  </span>
                  <span className="text-muted-foreground/60 font-mono text-xs tracking-[0.2em]">
                    {step.n}
                  </span>
                </div>
                <h3 className="font-display mt-5 text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground mt-2.5 text-[14px] leading-6">
                  {step.body}
                </p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ── BEFORE / AFTER DIFF ──────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-24 sm:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)]">
          <FadeIn>
            <Eyebrow>Before / after</Eyebrow>
            <h2 className="font-display mt-4 text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-[2.6rem] sm:leading-[1.05]">
              Watch a vague ask <br className="hidden sm:block" />
              become a <span className="signal-underline">spec.</span>
            </h2>
            <p className="text-muted-foreground mt-5 max-w-md text-[15px] leading-7">
              The goal isn’t longer prompts — it’s precise, reusable, testable
              ones. Prompt Expert turns a one-liner into a structured brief a
              model can follow every time.
            </p>
            <div className="mt-6 space-y-2.5">
              {[
                'Roles and constraints made explicit',
                'Output format defined up front',
                'Reusable across models and projects',
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm">
                  <span className="bg-signal/15 flex h-5 w-5 items-center justify-center rounded-full">
                    <Check className="text-signal h-3 w-3" />
                  </span>
                  <span className="text-foreground/85">{item}</span>
                </div>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.08}>
            <div className="term overflow-hidden">
              <TerminalChrome label="launch-post.prompt · diff" />
              <div className="px-3 py-4 font-mono text-[12.5px] leading-[1.55] sm:px-4">
                {diff.map((line, i) => {
                  if (line.kind === 'gap') {
                    return <div key={i} className="h-3" />
                  }
                  const isDel = line.kind === 'del'
                  return (
                    <div
                      key={i}
                      className={`flex gap-3 rounded px-2 py-0.5 ${
                        isDel
                          ? 'bg-[oklch(0.72_0.13_22/0.1)]'
                          : 'bg-[oklch(0.86_0.18_130/0.08)]'
                      }`}
                    >
                      <span
                        className={`w-3 shrink-0 select-none ${
                          isDel
                            ? 'text-[var(--t-del)]'
                            : 'text-[var(--t-add)]'
                        }`}
                      >
                        {isDel ? '−' : '+'}
                      </span>
                      <span
                        className={
                          isDel
                            ? 'text-[var(--t-del)] line-through opacity-80'
                            : line.text.startsWith('##')
                              ? 'font-semibold text-[var(--t-add)]'
                              : 'text-[var(--t-fg)]'
                        }
                      >
                        {line.text || ' '}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── TOOLKIT ──────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-24 sm:px-6">
        <FadeIn>
          <Eyebrow>The toolkit</Eyebrow>
          <h2 className="font-display mt-4 max-w-2xl text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-[2.6rem] sm:leading-[1.05]">
            Everything that lives around the prompt.
          </h2>
        </FadeIn>
        <StaggerGroup className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <div className="group border-border bg-card hover:border-border-strong flex h-full items-start gap-4 rounded-2xl border p-5 transition-colors">
                <span className="border-border bg-background flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors group-hover:border-[color-mix(in_oklch,var(--signal)_55%,var(--border))]">
                  <f.icon className="text-foreground h-[18px] w-[18px]" />
                </span>
                <div>
                  <h3 className="text-[15px] font-semibold tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-[13.5px] leading-6">
                    {f.body}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="mx-auto w-full max-w-6xl px-5 pt-24 sm:px-6">
        <FadeIn>
          <div className="term relative overflow-hidden px-6 py-14 sm:px-12 sm:py-20">
            <div
              aria-hidden
              className="tech-grid pointer-events-none absolute inset-0 opacity-[0.18]"
            />
            <div className="relative max-w-2xl">
              <span className="inline-flex items-center gap-2.5 font-mono text-[11px] font-medium tracking-[0.3em] text-[var(--t-muted)] uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--t-signal)]" />
                Get started
              </span>
              <h2 className="font-display mt-5 text-[clamp(2rem,4.5vw,3.2rem)] leading-[1.02] font-semibold tracking-[-0.03em] text-balance text-[var(--t-fg)]">
                Start building.{' '}
                <span className="text-[var(--t-signal)]">It’s free.</span>
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-7 text-[var(--t-muted)]">
                Open the builder, save your best work, and test the workflow
                against real prompts before you scale. No card, no paywall.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button
                  render={
                    <AppLink
                      href="/builder"
                      transitionTypes={appLinkTransitionTypes.builder}
                    />
                  }
                  size="lg"
                  className="bg-signal h-11 rounded-lg border-transparent px-5 text-[0.95rem] font-semibold text-[oklch(0.2_0.04_140)] shadow-none hover:bg-[oklch(0.84_0.2_128)] hover:text-[oklch(0.2_0.04_140)]"
                >
                  Open the builder
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  render={<AppLink href="/gallery" />}
                  className="h-11 rounded-lg border-[var(--t-border)] bg-transparent px-5 text-[0.95rem] text-[var(--t-fg)] shadow-none hover:bg-[oklch(1_0_0/0.06)] hover:text-[var(--t-fg)]"
                >
                  <FlaskConical className="h-4 w-4" />
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
