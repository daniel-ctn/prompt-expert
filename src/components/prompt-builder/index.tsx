'use client'

import { RotateCcw, Wand2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { usePromptBuilderStore } from '@/stores/prompt-builder'
import type { SavedPromptPreset } from '@/types'
import { AdvancedSettings } from './advanced-settings'
import { CategorySelector } from './category-selector'
import { ConstraintsInput } from './constraints-input'
import { ContextInput } from './context-input'
import { FormatSelector } from './format-selector'
import { ModelSelector } from './model-selector'
import { PromptPreview } from './prompt-preview'
import { RoleInput } from './role-input'
import { SavePromptDialog } from './save-prompt-dialog'
import { TaskInput } from './task-input'
import { TemplateSelector } from './template-selector'
import { ToneSelector } from './tone-selector'

function BuilderStage({
  eyebrow,
  title,
  description,
  status,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  status: string
  children: React.ReactNode
}) {
  return (
    <section className="border-foreground/85 bg-background relative border p-4 shadow-[var(--shadow-paper-sm)] sm:p-5">
      <span className="border-foreground/85 bg-card absolute -top-2.5 left-4 inline-flex h-5 items-center border px-1.5 font-mono text-[9.5px] font-medium tracking-[0.22em] uppercase">
        {eyebrow}
      </span>
      <div className="mt-1 mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1.5">
          <h2 className="font-display text-xl font-medium tracking-tight">
            {title}
          </h2>
          <p className="text-muted-foreground text-[13.5px] leading-6">
            {description}
          </p>
        </div>
        <Badge variant="secondary">{status}</Badge>
      </div>
      {children}
    </section>
  )
}

export function PromptBuilder({
  savedPresets = [],
}: {
  savedPresets?: SavedPromptPreset[]
}) {
  const reset = usePromptBuilderStore((state) => state.reset)
  const role = usePromptBuilderStore((state) => state.role)
  const context = usePromptBuilderStore((state) => state.context)
  const task = usePromptBuilderStore((state) => state.task)
  const constraints = usePromptBuilderStore((state) => state.constraints)
  const settings = usePromptBuilderStore((state) => state.settings)

  const briefingCount = [role, context, task].filter((value) =>
    value.trim(),
  ).length
  const guardrailCount =
    constraints.filter((value) => value.trim()).length +
    (settings.includeExamples ? 1 : 0)
  const completedStages =
    1 +
    (task.trim() ? 1 : 0) +
    (constraints.length > 0 || settings.includeExamples ? 1 : 0)

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(24rem,1.05fr)]">
      <div className="space-y-4">
        <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardContent className="space-y-2 py-4">
              <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                01 · Setup
              </p>
              <p className="font-display nums text-2xl font-medium tracking-tight">
                Ready
              </p>
              <p className="text-muted-foreground text-[12.5px] leading-snug">
                Model, category, tone, and output format have sensible defaults.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 py-4">
              <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                02 · Briefing
              </p>
              <p className="font-display nums text-2xl font-medium tracking-tight">
                {briefingCount}
                <span className="text-muted-foreground">/3</span>
              </p>
              <p className="text-muted-foreground text-[12.5px] leading-snug">
                Role, context, and task shape the core of the prompt.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 py-4">
              <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.22em] uppercase">
                03 · Guardrails
              </p>
              <p className="font-display nums text-2xl font-medium tracking-tight">
                {guardrailCount}
              </p>
              <p className="text-muted-foreground text-[12.5px] leading-snug">
                Constraints and settings keep responses consistent.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="border-foreground/40 gap-4 border-b pb-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1.5">
                <p className="text-muted-foreground font-mono text-[10px] font-medium tracking-[0.24em] uppercase">
                  Builder workflow
                </p>
                <CardTitle className="font-display text-2xl font-medium tracking-tight">
                  Draft the brief, then refine.
                </CardTitle>
                <p className="text-muted-foreground text-[13px] leading-6">
                  Progress:{' '}
                  <span className="nums text-foreground font-medium">
                    {completedStages}/3
                  </span>{' '}
                  stages meaningfully configured.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <TemplateSelector savedPresets={savedPresets} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  className="text-muted-foreground hover:text-foreground rounded-sm"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
                <SavePromptDialog />
              </div>
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-[12.5px]">
              <Wand2 className="text-foreground/70 h-3.5 w-3.5" />
              Fill the task first. Save polished prompts after you test or
              optimize.
            </div>
          </CardHeader>
          <CardContent className="space-y-4 py-5">
            <BuilderStage
              eyebrow="Stage 1"
              title="Setup the output target"
              description="Choose the model and the kind of answer you want before you start writing the prompt brief."
              status="Ready"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <ModelSelector />
                <CategorySelector />
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <ToneSelector />
                <FormatSelector />
              </div>
            </BuilderStage>

            <BuilderStage
              eyebrow="Stage 2"
              title="Write the brief"
              description="Define who the AI should be, the context it should know, and the exact task it should complete."
              status={task.trim() ? 'In progress' : 'Needs task'}
            >
              <div className="grid gap-4">
                <RoleInput />
                <ContextInput />
                <TaskInput />
              </div>
            </BuilderStage>

            <BuilderStage
              eyebrow="Stage 3"
              title="Add guardrails"
              description="Use constraints and advanced settings to improve repeatability without making the prompt bloated."
              status={
                constraints.length > 0 || settings.includeExamples
                  ? 'Configured'
                  : 'Optional'
              }
            >
              <div className="grid gap-4">
                <ConstraintsInput />
                <Separator className="opacity-60" />
                <AdvancedSettings />
              </div>
            </BuilderStage>
          </CardContent>
        </Card>
      </div>

      <div className="xl:sticky xl:top-24">
        <PromptPreview />
      </div>
    </div>
  )
}
