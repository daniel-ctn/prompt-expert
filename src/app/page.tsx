import Link from 'next/link';
import {
  Sparkles,
  Zap,
  Settings2,
  Copy,
  ArrowRight,
  Brain,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

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
      'Target GPT-4, Claude, Gemini, and more — each prompt optimized for your chosen model.',
  },
  {
    icon: Copy,
    title: 'One-Click Copy',
    description:
      'Copy your finalized prompt instantly and paste it into any AI interface.',
  },
  {
    icon: Zap,
    title: 'Save & Organize',
    description:
      'Build a library of reusable prompts with tags, categories, and version history.',
  },
  {
    icon: Sparkles,
    title: 'Live Preview',
    description:
      'See your prompt assemble in real-time as you adjust each parameter.',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative flex flex-col items-center justify-center overflow-hidden px-4 pt-28 pb-24 text-center sm:px-6 md:pt-36 lg:pb-32">
        {/* Ambient background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-pulse-glow bg-primary/10 absolute top-0 -left-32 h-[500px] w-[500px] rounded-full blur-[120px]" />
          <div
            className="animate-pulse-glow absolute top-20 -right-32 h-[400px] w-[400px] rounded-full bg-[oklch(0.55_0.25_290/0.08)] blur-[100px]"
            style={{ animationDelay: '1.5s' }}
          />
          <div
            className="animate-pulse-glow absolute -bottom-20 left-1/3 h-[350px] w-[350px] rounded-full bg-[oklch(0.7_0.15_195/0.06)] blur-[100px]"
            style={{ animationDelay: '3s' }}
          />
        </div>

        {/* Dot grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(circle, currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-3xl space-y-8">
          <div className="animate-fade-in-up border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="font-medium">AI-powered prompt engineering</span>
            <ChevronRight className="h-3.5 w-3.5 opacity-50" />
          </div>

          <h1 className="animate-fade-in-up animate-delay-100 font-display text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Build Better Prompts,
            <br />
            <span className="text-gradient">Get Better Results</span>
          </h1>

          <p className="animate-fade-in-up animate-delay-200 text-muted-foreground mx-auto max-w-xl text-base sm:text-lg">
            Stop guessing. Use structured controls and AI optimization to create
            prompts that deliver exactly what you need, every time.
          </p>

          <div className="animate-fade-in-up animate-delay-300 flex items-center justify-center gap-4">
            <Button
              render={<Link href="/builder" />}
              size="lg"
              className="bg-primary hover:glow-sm gap-2 px-6 shadow-md transition-all"
            >
              Start Building
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button
              render={<Link href="/gallery" />}
              variant="outline"
              size="lg"
              className="border-border/60 px-6"
            >
              Explore Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-border/50 relative border-t px-4 py-24 sm:px-6">
        <div className="via-primary/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent" />
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to craft
              <span className="text-gradient"> perfect prompts</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-4 max-w-xl">
              A complete toolkit for prompt engineering — from ideation to
              optimization.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`animate-fade-in-up group border-border/50 bg-card/50 hover:border-primary/30 hover:bg-card/80 relative rounded-xl border p-6 backdrop-blur-sm transition-all ${
                  i === 0
                    ? 'animate-delay-100'
                    : i === 1
                      ? 'animate-delay-200'
                      : i === 2
                        ? 'animate-delay-300'
                        : i === 3
                          ? 'animate-delay-100'
                          : i === 4
                            ? 'animate-delay-200'
                            : 'animate-delay-300'
                }`}
              >
                <div className="bg-primary/10 group-hover:bg-primary/15 mb-4 inline-flex rounded-lg p-2.5 transition-colors">
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

      {/* CTA */}
      <section className="relative px-4 py-24 sm:px-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-pulse-glow bg-primary/8 absolute top-1/2 left-1/2 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to level up
            <span className="text-gradient"> your prompts?</span>
          </h2>
          <p className="text-muted-foreground mt-4 mb-8">
            Create your first optimized prompt in under a minute — no credit
            card required.
          </p>
          <Button
            render={<Link href="/builder" />}
            size="lg"
            className="bg-primary hover:glow-sm gap-2 px-8 shadow-md transition-all"
          >
            Get Started Free
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
