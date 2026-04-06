import { ChevronDown, Copy, Play, Sparkles, Wand2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

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

export function BuilderSnapshot() {
  return (
    <section className="relative">
      <div className="bg-primary/8 pointer-events-none absolute inset-x-8 -top-8 -z-10 h-52 rounded-full blur-3xl" />
      <div className="page-frame overflow-hidden rounded-[calc(var(--radius-4xl)+2px)] p-3 sm:p-4">
        <div className="grid gap-3 xl:grid-cols-[0.88fr_1.12fr]">
          <Card className="bg-background/84">
            <CardHeader className="border-border/70 border-b pb-4">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="section-label">Builder workspace</p>
                  <CardTitle className="font-display text-xl font-semibold">
                    Compose prompts with guided structure
                  </CardTitle>
                </div>
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  Live preview
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 py-5">
              <div className="grid gap-3 sm:grid-cols-2">
                {sections.map((item) => (
                  <div
                    key={item.label}
                    className="border-border/70 bg-surface-1/75 rounded-2xl border p-3"
                  >
                    <p className="section-label">{item.label}</p>
                    <div className="mt-2 flex items-center justify-between gap-3">
                      <p className="text-sm font-medium">{item.value}</p>
                      <ChevronDown className="text-muted-foreground h-3.5 w-3.5" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-border/70 bg-surface-1/75 rounded-3xl border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="section-label">Task</p>
                    <p className="mt-2 text-sm font-medium">
                      Review the pull request for bugs, regressions, and missing
                      tests.
                    </p>
                  </div>
                  <div className="bg-primary/10 text-primary rounded-full p-2">
                    <Wand2 className="h-4 w-4" />
                  </div>
                </div>
                <p className="text-muted-foreground mt-3 text-sm leading-6">
                  Add sharper constraints, choose a stronger output format, and
                  keep the prompt reusable for future code reviews.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {checks.map((item) => (
                  <div
                    key={item}
                    className="border-border/70 bg-background/86 flex items-center justify-between rounded-2xl border px-3 py-3"
                  >
                    <span className="text-muted-foreground text-sm">
                      {item}
                    </span>
                    <span className="bg-primary h-2.5 w-2.5 rounded-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/88 overflow-hidden">
            <CardHeader className="border-border/70 border-b pb-4">
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="section-label">Preview panel</p>
                  <CardTitle className="font-display text-xl font-semibold">
                    Test and refine without leaving the flow
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="pointer-events-none rounded-full"
                  >
                    <Play className="h-3.5 w-3.5" />
                    Test
                  </Button>
                  <Button
                    size="sm"
                    className="pointer-events-none rounded-full"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    Optimize
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 py-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
              <div className="border-border/70 bg-surface-1/70 rounded-3xl border p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="bg-background/90 flex items-center gap-1 rounded-full p-1">
                    {['Assembled', 'Optimized', 'Test'].map((tab, index) => (
                      <span
                        key={tab}
                        className={
                          index === 0
                            ? 'bg-primary rounded-full px-3 py-1 text-[11px] font-medium text-white'
                            : 'text-muted-foreground rounded-full px-3 py-1 text-[11px]'
                        }
                      >
                        {tab}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    className="pointer-events-none rounded-full"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <pre className="border-border/70 bg-background/90 text-foreground/88 max-h-[22rem] overflow-hidden rounded-2xl border p-4 font-mono text-xs leading-6 whitespace-pre-wrap">
                  {output}
                </pre>
              </div>

              <div className="grid gap-3">
                <div className="border-border/70 bg-surface-1/70 rounded-3xl border p-4">
                  <p className="section-label">Prompt quality</p>
                  <p className="font-display mt-3 text-3xl font-semibold">
                    92%
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm">
                    Clear role, scoped task, useful output format.
                  </p>
                </div>
                <div className="border-primary/18 bg-primary/6 rounded-3xl border p-4">
                  <p className="section-label text-primary">Next refinement</p>
                  <p className="mt-2 text-sm font-medium">
                    Add acceptance criteria for missing tests.
                  </p>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    Better constraints improve repeatability and make the output
                    easier to compare across runs.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
