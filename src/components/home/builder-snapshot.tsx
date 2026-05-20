import { ChevronDown, Copy, Play, Sparkles, Wand2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const output = `Role
You are a senior software engineer performing a production-focused code review.

Task
Review the pull request for correctness, security, performance, and maintainability.

Output format
- Severity-ranked findings
- Concrete fixes with examples
- Residual risks or missing tests`

const sections = [
  { label: 'Model', value: 'GPT-5.4 Mini' },
  { label: 'Category', value: 'Code review' },
  { label: 'Tone', value: 'Technical' },
  { label: 'Format', value: 'Markdown' },
]

const checks = [
  'Role & context',
  'Task instructions',
  'Constraints',
  'Test output',
]

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-foreground/85 bg-background relative border px-3 py-2.5">
      <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
        {label}
      </p>
      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium">{value}</p>
        <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
      </div>
    </div>
  )
}

export function BuilderSnapshot() {
  return (
    <section className="relative">
      <div className="paper-edge bg-card relative overflow-hidden p-3 sm:p-4">
        {/* Notebook punch-holes / margin */}
        <div className="absolute top-0 left-0 hidden h-full w-6 flex-col items-center justify-around py-6 sm:flex">
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="border-foreground/50 bg-background h-2.5 w-2.5 rounded-full border"
            />
          ))}
        </div>

        <div className="grid gap-3 sm:pl-7 xl:grid-cols-[0.88fr_1.12fr]">
          {/* LEFT — composer */}
          <div className="paper-edge-sm bg-card relative p-4 sm:p-5">
            <div className="border-foreground/80 mb-4 flex items-center justify-between gap-3 border-b pb-3">
              <div className="space-y-1">
                <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
                  Composer
                </p>
                <h3 className="font-display text-lg leading-tight font-medium tracking-tight">
                  Guided prompt structure
                </h3>
              </div>
              <Badge variant="secondary">Live</Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {sections.map((item) => (
                <FieldRow key={item.label} {...item} />
              ))}
            </div>

            <div className="border-foreground/85 bg-background mt-4 border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
                    Task
                  </p>
                  <p className="mt-1.5 text-[13.5px] leading-snug font-medium">
                    Review the pull request for bugs, regressions, and missing
                    tests.
                  </p>
                </div>
                <div className="border-foreground flex h-8 w-8 shrink-0 items-center justify-center border bg-[color-mix(in_oklch,var(--marigold)_38%,var(--background))] shadow-[var(--shadow-paper-sm)]">
                  <Wand2 className="h-3.5 w-3.5" />
                </div>
              </div>
              <p className="text-muted-foreground mt-3 text-[12.5px] leading-6">
                Add sharper constraints, choose a stronger output format, keep
                the prompt reusable for future code reviews.
              </p>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {checks.map((item) => (
                <div
                  key={item}
                  className="border-foreground/80 bg-background flex items-center justify-between border px-3 py-2"
                >
                  <span className="text-[12.5px]">{item}</span>
                  <span className="border-foreground flex h-4 w-4 items-center justify-center border bg-[color-mix(in_oklch,var(--marigold)_50%,var(--background))]">
                    <span className="text-[9px] leading-none font-bold">✓</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — preview */}
          <div className="paper-edge-sm bg-card relative overflow-hidden p-4 sm:p-5">
            <div className="border-foreground/80 mb-4 flex items-center justify-between gap-3 border-b pb-3">
              <div className="space-y-1">
                <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
                  Preview
                </p>
                <h3 className="font-display text-lg leading-tight font-medium tracking-tight">
                  Test &amp; refine in-flow
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="pointer-events-none rounded-sm"
                >
                  <Play className="h-3 w-3" />
                  Test
                </Button>
                <Button size="sm" className="pointer-events-none rounded-sm">
                  <Sparkles className="h-3 w-3" />
                  Optimize
                </Button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_14rem]">
              <div className="border-foreground/85 bg-background border">
                <div className="border-foreground/80 flex items-center justify-between gap-3 border-b bg-[color-mix(in_oklch,var(--muted)_60%,var(--background))] px-3 py-2">
                  <div className="border-foreground/80 bg-background inline-flex items-center gap-0 border">
                    {['Assembled', 'Optimized', 'Test'].map((tab, i) => (
                      <span
                        key={tab}
                        className={
                          i === 0
                            ? 'bg-foreground text-background px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase'
                            : 'text-muted-foreground border-foreground/40 border-l px-2.5 py-1 font-mono text-[10px] tracking-[0.18em] uppercase'
                        }
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                  <button
                    type="button"
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Copy"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <pre className="text-foreground/90 max-h-[18rem] overflow-hidden p-4 font-mono text-[11.5px] leading-6 whitespace-pre-wrap">
                  {output}
                </pre>
              </div>

              <div className="grid gap-3">
                <div className="border-foreground/85 bg-background border p-3">
                  <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
                    Quality
                  </p>
                  <p className="font-display nums mt-1.5 text-3xl leading-none font-medium tracking-tight">
                    92
                    <span className="text-muted-foreground text-base">%</span>
                  </p>
                  <p className="text-muted-foreground mt-2 text-[12px] leading-snug">
                    Clear role, scoped task, useful output format.
                  </p>
                  {/* Mini bar chart */}
                  <div className="mt-3 flex h-6 items-end gap-1">
                    {[40, 65, 80, 70, 92, 88].map((h, i) => (
                      <span
                        key={i}
                        className="bg-foreground border-foreground flex-1 border"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="border-foreground border bg-[color-mix(in_oklch,var(--marigold)_18%,var(--background))] p-3 shadow-[var(--shadow-paper-sm)]">
                  <p className="font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
                    Next refinement
                  </p>
                  <p className="mt-1.5 text-[13px] leading-snug font-medium">
                    Add acceptance criteria for missing tests.
                  </p>
                  <p className="text-muted-foreground mt-1.5 text-[11.5px] leading-snug">
                    Better constraints improve repeatability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
