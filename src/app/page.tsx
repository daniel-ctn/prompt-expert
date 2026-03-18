import Link from "next/link";
import {
  Sparkles,
  Zap,
  Settings2,
  Copy,
  ArrowRight,
  Brain,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Settings2,
    title: "Fine-Tuned Controls",
    description:
      "Adjust model, tone, format, constraints, and more to craft the perfect prompt.",
  },
  {
    icon: Brain,
    title: "AI Optimization",
    description:
      "Let AI analyze and enhance your prompts for clarity, specificity, and effectiveness.",
  },
  {
    icon: Layers,
    title: "Multi-Model Support",
    description:
      "Target GPT-4o, Claude, Gemini, and more -- each prompt optimized for your chosen model.",
  },
  {
    icon: Copy,
    title: "One-Click Copy",
    description:
      "Copy your finalized prompt instantly and paste it into any AI interface.",
  },
  {
    icon: Zap,
    title: "Save & Organize",
    description:
      "Build a library of reusable prompts with tags, categories, and version history.",
  },
  {
    icon: Sparkles,
    title: "Live Preview",
    description:
      "See your prompt assemble in real-time as you adjust each parameter.",
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-4 pb-16 pt-24 text-center sm:px-6 md:pt-32">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI-powered prompt engineering</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Build Better Prompts,
            <br />
            <span className="text-primary">Get Better Results</span>
          </h1>

          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Stop guessing. Use structured controls and AI optimization to create
            prompts that deliver exactly what you need, every time.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Button render={<Link href="/builder" />} size="lg">
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button render={<Link href="/login" />} variant="outline" size="lg">
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight">
            Everything you need to craft perfect prompts
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 bg-background">
                <CardContent className="pt-6">
                  <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-2.5">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight">
            Ready to level up your prompts?
          </h2>
          <p className="mb-8 text-muted-foreground">
            Create your first optimized prompt in under a minute.
          </p>
          <Button render={<Link href="/builder" />} size="lg">
            Get Started Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  );
}
