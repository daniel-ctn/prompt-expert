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
    <section className="border-border/70 bg-surface-1/75 rounded-[calc(var(--radius-3xl)+2px)] border p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="section-label">{eyebrow}</p>
          <h2 className="font-display text-xl font-semibold tracking-tight">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm leading-6">
            {description}
          </p>
        </div>
        <Badge variant="secondary" className="rounded-full px-3 py-1">
          {status}
        </Badge>
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
  const { reset, role, context, task, constraints, settings } =
    usePromptBuilderStore((state) => ({
      reset: state.reset,
      role: state.role,
      context: state.context,
      task: state.task,
      constraints: state.constraints,
      settings: state.settings,
    }))

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
          <Card className="bg-background/84">
            <CardContent className="space-y-2 py-4">
              <p className="section-label">Setup</p>
              <p className="font-display text-2xl font-semibold">Ready</p>
              <p className="text-muted-foreground text-sm">
                Model, category, tone, and output format have sensible defaults.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/84">
            <CardContent className="space-y-2 py-4">
              <p className="section-label">Briefing</p>
              <p className="font-display text-2xl font-semibold">
                {briefingCount}/3
              </p>
              <p className="text-muted-foreground text-sm">
                Role, context, and task shape the core of the prompt.
              </p>
            </CardContent>
          </Card>
          <Card className="bg-background/84">
            <CardContent className="space-y-2 py-4">
              <p className="section-label">Guardrails</p>
              <p className="font-display text-2xl font-semibold">
                {guardrailCount}
              </p>
              <p className="text-muted-foreground text-sm">
                Constraints and advanced settings keep responses consistent.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-background/84">
          <CardHeader className="border-border/70 gap-4 border-b pb-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="section-label">Builder workflow</p>
                <CardTitle className="font-display text-2xl font-semibold tracking-tight">
                  Draft the brief, then refine the output
                </CardTitle>
                <p className="text-muted-foreground text-sm leading-6">
                  Progress: {completedStages}/3 stages meaningfully configured.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <TemplateSelector savedPresets={savedPresets} />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  className="text-muted-foreground hover:text-foreground rounded-full"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset
                </Button>
                <SavePromptDialog />
              </div>
            </div>
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
              <Wand2 className="text-primary h-4 w-4" />
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
