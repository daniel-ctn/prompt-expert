'use client'

import { ChevronDown, RotateCcw, Wand2 } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { PROMPT_TEMPLATES } from '@/config/constants'
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
import { TemplateSelector, templateToPreset } from './template-selector'
import { ToneSelector } from './tone-selector'

const FEATURED_TEMPLATE_IDS = [
  'blog-post',
  'code-review',
  'customer-support',
  'data-analysis',
  'qa-assistant',
]

function BuilderStage({
  eyebrow,
  title,
  description,
  status,
  collapsible = false,
  defaultOpen = true,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  status: string
  collapsible?: boolean
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const eyebrowBadge = (
    <span className="border-foreground/85 bg-card absolute -top-2.5 left-4 inline-flex h-5 items-center border px-1.5 font-mono text-[9.5px] font-medium tracking-[0.22em] uppercase">
      {eyebrow}
    </span>
  )

  const heading = (
    <div className="space-y-1.5">
      <h2 className="font-display text-xl font-medium tracking-tight">
        {title}
      </h2>
      <p className="text-muted-foreground text-[13.5px] leading-6">
        {description}
      </p>
    </div>
  )

  if (collapsible) {
    return (
      <details
        className="border-foreground/85 bg-background relative border shadow-[var(--shadow-paper-sm)]"
        open={defaultOpen}
      >
        {eyebrowBadge}
        <summary className="flex cursor-pointer list-none items-start justify-between gap-3 p-4 sm:p-5 [&::-webkit-details-marker]:hidden">
          {heading}
          <span className="flex shrink-0 items-center gap-2">
            <Badge variant="secondary">{status}</Badge>
            <ChevronDown className="text-muted-foreground h-4 w-4 transition-transform [[open]_&]:rotate-180" />
          </span>
        </summary>
        <div className="px-4 pb-4 sm:px-5 sm:pb-5">{children}</div>
      </details>
    )
  }

  return (
    <section className="border-foreground/85 bg-background relative border p-4 shadow-[var(--shadow-paper-sm)] sm:p-5">
      {eyebrowBadge}
      <div className="mt-1 mb-4 flex flex-wrap items-start justify-between gap-3">
        {heading}
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
  const loadPreset = usePromptBuilderStore((state) => state.loadPreset)
  const task = usePromptBuilderStore((state) => state.task)
  const constraints = usePromptBuilderStore((state) => state.constraints)
  const settings = usePromptBuilderStore((state) => state.settings)

  const taskReady = task.trim().length > 0
  const rulesConfigured =
    constraints.some((value) => value.trim()) || settings.includeExamples

  const featuredTemplates = FEATURED_TEMPLATE_IDS.map((id) =>
    PROMPT_TEMPLATES.find((template) => template.id === id),
  ).filter((template) => template !== undefined)

  const applyExample = (template: (typeof PROMPT_TEMPLATES)[number]) => {
    loadPreset(templateToPreset(template))
    toast.success(`Example "${template.label}" loaded`)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(24rem,1.05fr)]">
      <div className="space-y-4">
        <Card>
          <CardHeader className="border-foreground/40 gap-4 border-b pb-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-1.5">
                <p className="section-label">Builder</p>
                <CardTitle className="font-display text-2xl font-medium tracking-tight">
                  {taskReady
                    ? 'Looking good — refine on the right'
                    : 'Start by describing your task'}
                </CardTitle>
                <p className="text-muted-foreground text-[13px] leading-6">
                  {taskReady
                    ? 'Your prompt is assembling live. Test it or optimize it in the preview.'
                    : 'Write what you want the AI to do — everything else is optional.'}
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
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground inline-flex items-center gap-1.5 text-[12.5px]">
                <Wand2 className="text-foreground/70 h-3.5 w-3.5" />
                New here? Try an example:
              </span>
              {featuredTemplates.map((template) => (
                <Badge
                  key={template.id}
                  variant="outline"
                  className="hover:bg-primary/80 hover:text-primary-foreground cursor-pointer transition-colors"
                  onClick={() => applyExample(template)}
                >
                  {template.label}
                </Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-4 py-5">
            <BuilderStage
              eyebrow="Step 1"
              title="Tell the AI what to do"
              description="The task is the only required part. Add a role and context to sharpen the result."
              status={taskReady ? 'Ready' : 'Required'}
            >
              <div className="grid gap-4">
                <TaskInput />
                <RoleInput />
                <ContextInput />
              </div>
            </BuilderStage>

            <BuilderStage
              eyebrow="Step 2 · optional"
              title="Fine-tune the output"
              description="Pick the model and the kind of answer you want. Sensible defaults are already set."
              status="Defaults set"
              collapsible
              defaultOpen={false}
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
              eyebrow="Step 3 · optional"
              title="Add rules"
              description="Constraints and settings keep answers consistent across runs."
              status={rulesConfigured ? 'Configured' : 'Optional'}
              collapsible
              defaultOpen={false}
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

      <div className="lg:sticky lg:top-24">
        <PromptPreview />
      </div>
    </div>
  )
}
