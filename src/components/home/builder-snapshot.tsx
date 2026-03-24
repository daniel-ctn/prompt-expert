import { Sparkles, ChevronDown, Copy } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const FAKE_PROMPT_OUTPUT = `You are a senior software engineer specializing in code review.

## Context
The user will provide code snippets that need thorough review for bugs, performance issues, and best practices.

## Task
Review the provided code and return:
1. A list of identified issues with severity levels
2. Suggested fixes with code examples
3. Performance optimization opportunities

## Constraints
- Focus on correctness first, then performance
- Use the same programming language for fixes
- Keep explanations concise and actionable`;

const tones = ['Professional', 'Technical', 'Casual', 'Academic', 'Creative'];

export function BuilderSnapshot() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
      <div className="mb-10 text-center">
        <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          See your prompts take shape
        </p>
      </div>

      <div
        className="relative"
        style={{
          perspective: '2000px',
        }}
      >
        {/* Glow behind the snapshot */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 rounded-2xl opacity-60 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse at center, oklch(0.55 0.17 185 / 20%) 0%, transparent 70%)',
          }}
        />

        <div
          className="gradient-border animate-fade-in-up overflow-hidden rounded-2xl"
          style={{
            transform: 'rotateX(2deg)',
            transformOrigin: 'center bottom',
          }}
        >
          <div className="bg-card/95 border-border/50 rounded-2xl border p-3 backdrop-blur-sm sm:p-4">
            <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
              {/* Left Panel — Configure */}
              <Card className="border-border/30 bg-background/60 shadow-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold">
                    Configure Your Prompt
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Model & Category row */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-[11px] font-medium">
                        Model
                      </span>
                      <div className="border-input bg-background flex h-8 items-center justify-between rounded-lg border px-2.5 text-xs">
                        <span>GPT-4.1</span>
                        <ChevronDown className="text-muted-foreground h-3 w-3" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-[11px] font-medium">
                        Category
                      </span>
                      <div className="border-input bg-background flex h-8 items-center justify-between rounded-lg border px-2.5 text-xs">
                        <span>Code Review</span>
                        <ChevronDown className="text-muted-foreground h-3 w-3" />
                      </div>
                    </div>
                  </div>

                  {/* Tone */}
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[11px] font-medium">
                      Tone
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {tones.map((tone) => (
                        <Badge
                          key={tone}
                          variant={tone === 'Technical' ? 'default' : 'outline'}
                          className="cursor-default text-[10px]"
                        >
                          {tone}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Task textarea */}
                  <div className="space-y-1">
                    <span className="text-muted-foreground text-[11px] font-medium">
                      Task
                    </span>
                    <div className="border-input bg-background text-muted-foreground min-h-[60px] rounded-lg border px-2.5 py-2 text-xs leading-relaxed">
                      Review the provided code for bugs, performance issues, and
                      best practices. Return actionable feedback...
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Right Panel — Preview */}
              <Card className="border-border/30 bg-background/60 shadow-none">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">
                      Prompt Preview
                    </CardTitle>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="text-muted-foreground pointer-events-none"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Fake tab bar */}
                  <div className="bg-muted/80 flex h-7 items-center gap-0.5 rounded-lg p-[3px]">
                    {['Assembled', 'Optimized', 'Test'].map((tab, i) => (
                      <div
                        key={tab}
                        className={`flex-1 rounded-md px-2 py-0.5 text-center text-[11px] font-medium ${
                          i === 0
                            ? 'bg-background text-foreground shadow-sm'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {tab}
                      </div>
                    ))}
                  </div>

                  {/* Prompt output */}
                  <div className="bg-muted/40 border-border/30 max-h-[180px] overflow-hidden rounded-lg border p-2.5">
                    <pre className="text-foreground/80 font-mono text-[10px] leading-relaxed whitespace-pre-wrap">
                      {FAKE_PROMPT_OUTPUT}
                    </pre>
                  </div>

                  {/* Optimize button */}
                  <Button
                    size="sm"
                    className="pointer-events-none w-full gap-1.5 text-xs"
                  >
                    <Sparkles className="h-3 w-3" />
                    Optimize with AI
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Shimmer overlay */}
          <div className="animate-shimmer pointer-events-none absolute inset-0 rounded-2xl" />
        </div>
      </div>
    </section>
  );
}
