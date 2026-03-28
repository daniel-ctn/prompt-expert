import { ArrowRight, Settings2, Brain, Layers, Sparkles } from 'lucide-react'
import { AppLink, appLinkTransitionTypes } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'
import { BuilderSnapshot } from '@/components/home/builder-snapshot'

const features = [
  {
    icon: Settings2,
    title: 'Fine-Tuned Controls',
    description:
      'Adjust model, tone, format, constraints, and more to craft the perfect prompt.',
  },
  {
    icon: Brain,
    title: 'AI Optimization',
    description:
      'Let AI analyze and enhance your prompts for clarity, specificity, and effectiveness.',
  },
  {
    icon: Layers,
    title: 'Multi-Model Support',
    description:
      'Target GPT-5.4, Gemini, and more — each prompt optimized for your chosen model.',
  },
  {
    icon: Sparkles,
    title: 'Live Preview',
    description:
      'See your prompt assemble in real-time as you adjust each parameter.',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-20 text-center sm:px-6 md:pt-36">
        {/* Single ambient gradient */}
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 30%, oklch(0.55 0.17 185 / 8%) 0%, transparent 70%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 -z-10 hidden dark:block"
          style={{
            background:
              'radial-gradient(ellipse 80% 50% at 50% 30%, oklch(0.72 0.16 185 / 10%) 0%, transparent 70%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl space-y-8">
          {/* Headline */}
          <h1 className="animate-fade-in-up animate-delay-100 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Craft precise prompts.
            <br />
            <span className="text-gradient">Get precise results.</span>
          </h1>

          {/* Subheading */}
          <p className="animate-fade-in-up animate-delay-200 text-muted-foreground mx-auto max-w-lg text-base sm:text-lg">
            A structured builder that turns your intent into optimized prompts
            for any AI model.
          </p>

          {/* Single CTA */}
          <div className="animate-fade-in-up animate-delay-300">
            <Button
              render={
                <AppLink
                  href="/builder"
                  transitionTypes={appLinkTransitionTypes.builder}
                />
              }
              size="lg"
              className="hover:glow-sm gap-2 px-8 shadow-md transition-all"
            >
              Open Builder
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Builder Snapshot */}
      <section className="px-4 py-16 sm:px-6 lg:py-20">
        <BuilderSnapshot />
      </section>

      {/* Features */}
      <section className="border-border/50 relative border-t px-4 py-20 sm:px-6 lg:py-24">
        <div className="via-primary/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent" />
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Built for <span className="text-gradient">prompt engineers</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-lg text-sm sm:text-base">
              A complete toolkit for prompt engineering — from ideation to
              optimization.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`animate-fade-in-up group border-border/50 bg-card hover:border-primary/20 relative rounded-xl border p-6 transition-all hover:shadow-sm ${
                  i < 2 ? 'animate-delay-100' : 'animate-delay-200'
                }`}
              >
                <div className="border-primary/20 bg-primary/5 group-hover:bg-primary/10 mb-4 inline-flex rounded-full border p-2.5 transition-colors">
                  <feature.icon className="text-primary h-5 w-5" />
                </div>
                <h3 className="font-display mb-2 font-semibold">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 py-20 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Start building <span className="text-gradient">better prompts</span>
          </h2>
          <p className="text-muted-foreground mt-4 mb-8 text-sm sm:text-base">
            Free to start. No credit card required.
          </p>
          <Button
            render={
              <AppLink
                href="/builder"
                transitionTypes={appLinkTransitionTypes.builder}
              />
            }
            size="lg"
            className="hover:glow-sm gap-2 px-8 shadow-md transition-all"
          >
            Open Builder
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}
