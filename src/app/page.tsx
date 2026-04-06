import {
  ArrowRight,
  CheckCircle2,
  Command,
  FileStack,
  Orbit,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { BuilderSnapshot } from '@/components/home/builder-snapshot'
import { PageIntro } from '@/components/layout/page-intro'
import { AppLink, appLinkTransitionTypes } from '@/components/ui/app-link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  FadeIn,
  HoverScale,
  StaggerGroup,
  StaggerItem,
} from '@/components/ui/reveal'

const stats = [
  {
    value: '3',
    label: 'Core workflows',
    detail: 'Build, test, and refine in one place.',
  },
  {
    value: '50+',
    label: 'Free monthly credits',
    detail: 'Enough to validate real prompt iterations.',
  },
  {
    value: '1 click',
    label: 'Prompt optimization',
    detail: 'Improve clarity without rebuilding the structure.',
  },
]

const workflows = [
  {
    icon: Orbit,
    title: 'Move from idea to usable prompt quickly',
    description:
      'Builder defaults, templates, and guided sections help you start with structure instead of a blank page.',
  },
  {
    icon: Workflow,
    title: 'Chain prompts into repeatable flows',
    description:
      'Model step-to-step reasoning, reuse prior outputs, and test multi-stage prompt sequences without leaving the workspace.',
  },
  {
    icon: FileStack,
    title: 'Turn experiments into reusable assets',
    description:
      'Save prompts, publish shareable versions, and keep a growing library of proven building blocks.',
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
    title: 'Give teams a prompt they can actually reuse',
    before: 'Help the customer with their issue politely.',
    after:
      'Act as a SaaS support specialist. Acknowledge the issue, summarize the likely cause, provide the next 3 actions, and close with a confirmation question. Keep the tone concise and reassuring.',
  },
]

const trustPoints = [
  'Built on a modern Next.js and React stack with fast route transitions.',
  'Supports prompt drafting, testing, versioning, sharing, and chained workflows.',
  'Balances polish with restraint so the UI feels sharp without getting in the way.',
]

export default function HomePage() {
  return (
    <div className="pb-10">
      <div className="page-shell space-y-8 pt-8 sm:pt-10">
        <PageIntro
          eyebrow="Refined prompt workflows"
          title="Sharper prompts, calmer workflow, better AI output."
          description="Prompt Expert gives you a structured workspace for drafting, optimizing, testing, and organizing prompts without the usual copy-paste chaos."
          actions={
            <>
              <Button
                render={
                  <AppLink
                    href="/builder"
                    transitionTypes={appLinkTransitionTypes.builder}
                  />
                }
                size="lg"
                className="rounded-full px-5"
              >
                Open builder
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                render={<AppLink href="/gallery" />}
                className="rounded-full px-5"
              >
                Explore gallery
              </Button>
            </>
          }
          aside={
            <div className="grid gap-3 sm:grid-cols-3 md:w-[22rem] md:grid-cols-1">
              {stats.map((stat, index) => (
                <FadeIn key={stat.label} delay={0.12 + index * 0.05}>
                  <Card className="bg-background/86">
                    <CardContent className="space-y-2 py-4">
                      <p className="font-display text-foreground text-2xl font-semibold">
                        {stat.value}
                      </p>
                      <p className="text-sm font-medium">{stat.label}</p>
                      <p className="text-muted-foreground text-sm">
                        {stat.detail}
                      </p>
                    </CardContent>
                  </Card>
                </FadeIn>
              ))}
            </div>
          }
        />

        <FadeIn delay={0.16}>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="secondary" className="rounded-full px-3 py-1">
              <Command className="mr-1.5 h-3.5 w-3.5" />
              Command palette included
            </Badge>
            <p className="text-muted-foreground text-sm">
              Use{' '}
              <kbd className="border-border/80 rounded border px-1.5 py-0.5 text-[11px]">
                Ctrl
              </kbd>{' '}
              +{' '}
              <kbd className="border-border/80 rounded border px-1.5 py-0.5 text-[11px]">
                K
              </kbd>{' '}
              to jump anywhere.
            </p>
          </div>
        </FadeIn>
      </div>

      <section className="page-shell pt-2">
        <BuilderSnapshot />
      </section>

      <section className="page-shell">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <FadeIn>
            <Card className="page-frame bg-transparent">
              <CardHeader className="space-y-3">
                <p className="section-label">Why it feels faster</p>
                <CardTitle className="font-display text-2xl font-semibold tracking-tight">
                  A single workspace for the full prompt loop
                </CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground space-y-4 text-sm">
                <p>
                  Instead of jumping between notes, chat windows, and docs, you
                  can shape prompts, test outputs, compare model behavior, and
                  save the winners in one flow.
                </p>
                <ul className="space-y-3">
                  {trustPoints.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="text-primary mt-0.5 h-4 w-4" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </FadeIn>

          <StaggerGroup className="grid gap-4 sm:grid-cols-3">
            {workflows.map((workflow) => (
              <StaggerItem key={workflow.title}>
                <HoverScale className="h-full">
                  <Card className="bg-background/82 h-full">
                    <CardHeader className="space-y-3">
                      <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-2xl">
                        <workflow.icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="font-display text-lg leading-tight font-semibold">
                        {workflow.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground text-sm">
                      {workflow.description}
                    </CardContent>
                  </Card>
                </HoverScale>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="page-shell">
        <FadeIn>
          <div className="mb-6">
            <p className="section-label">Prompt transformations</p>
            <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight">
              Examples of what “better prompt structure” actually looks like
            </h2>
            <p className="page-copy mt-3">
              The goal is not to make prompts longer. It is to make them more
              precise, reusable, and testable.
            </p>
          </div>
        </FadeIn>

        <StaggerGroup className="grid gap-4 lg:grid-cols-2">
          {examples.map((example) => (
            <StaggerItem key={example.title}>
              <Card className="overflow-hidden">
                <CardHeader className="border-border/70 space-y-3 border-b">
                  <Badge
                    variant="secondary"
                    className="w-fit rounded-full px-3 py-1"
                  >
                    {example.label}
                  </Badge>
                  <CardTitle className="font-display text-xl font-semibold">
                    {example.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 py-5 md:grid-cols-2">
                  <div className="border-border/70 bg-surface-1/70 rounded-2xl border p-4">
                    <p className="section-label">Before</p>
                    <p className="text-muted-foreground mt-3 text-sm">
                      {example.before}
                    </p>
                  </div>
                  <div className="border-primary/18 bg-primary/6 rounded-2xl border p-4">
                    <p className="section-label text-primary">After</p>
                    <p className="text-foreground/92 mt-3 text-sm leading-6">
                      {example.after}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </section>

      <section className="page-shell">
        <FadeIn>
          <Card className="page-frame bg-transparent">
            <CardContent className="flex flex-col gap-5 py-8 text-center">
              <div className="bg-primary/10 text-primary mx-auto flex h-14 w-14 items-center justify-center rounded-3xl">
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <p className="section-label">Start with the builder</p>
                <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
                  Build with structure now, refine the rest with the product.
                </h2>
                <p className="text-muted-foreground mx-auto max-w-2xl text-sm leading-6 sm:text-base">
                  Start free, save your best prompts, and verify the experience
                  against real workflow use before you scale up.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  render={
                    <AppLink
                      href="/builder"
                      transitionTypes={appLinkTransitionTypes.builder}
                    />
                  }
                  size="lg"
                  className="rounded-full px-5"
                >
                  Open builder
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  render={<AppLink href="/pricing" />}
                  className="rounded-full px-5"
                >
                  Review pricing
                </Button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </section>
    </div>
  )
}
