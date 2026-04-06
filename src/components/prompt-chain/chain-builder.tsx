'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  ArrowDown,
  Check,
  Copy,
  Loader2,
  Play,
  Plus,
  Sparkles,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { AI_MODELS } from '@/config/constants'
import { useUpgradeModal } from '@/stores/upgrade-modal'
import type { AIModel } from '@/types'

type ChainStatus = 'idle' | 'running' | 'success' | 'error'

interface ChainStep {
  id: string
  label: string
  prompt: string
  model: AIModel
  output: string
  status: ChainStatus
}

type StarterStep = Pick<ChainStep, 'label' | 'prompt'> & Partial<ChainStep>

function makeId() {
  return Math.random().toString(36).slice(2, 9)
}

function createStep(step?: Partial<ChainStep>): ChainStep {
  return {
    id: makeId(),
    label: '',
    prompt: '',
    model: 'gpt-5.4-mini',
    output: '',
    status: 'idle',
    ...step,
  }
}

const STARTER_TEMPLATES = [
  {
    id: 'research-to-answer',
    label: 'Research synthesis',
    description: 'Extract facts, organize them, then draft the final response.',
    steps: [
      {
        label: 'Extract source facts',
        prompt:
          'Read the provided material and extract the most important factual claims, dates, metrics, and constraints as a concise bullet list.',
      },
      {
        label: 'Build structured outline',
        prompt:
          'Use {{previous_output}} to create a structured outline with key sections, priorities, and open questions.',
      },
      {
        label: 'Draft final answer',
        prompt:
          'Using {{previous_output}}, write the final answer in a polished, concise style suitable for the target audience.',
      },
    ] satisfies StarterStep[],
  },
  {
    id: 'support-triage',
    label: 'Support triage',
    description:
      'Classify the issue, determine next steps, and draft the customer reply.',
    steps: [
      {
        label: 'Classify issue',
        prompt:
          'Review the customer message and classify the issue, likely cause, urgency, and missing information.',
      },
      {
        label: 'Plan resolution',
        prompt:
          'Use {{previous_output}} to create a support resolution plan with next actions and escalation needs.',
      },
      {
        label: 'Draft response',
        prompt:
          'Using {{previous_output}}, write a concise customer response that is empathetic, clear, and action-oriented.',
      },
    ] satisfies StarterStep[],
  },
  {
    id: 'content-pipeline',
    label: 'Content pipeline',
    description:
      'Generate an outline first, then expand it into publishable copy.',
    steps: [
      {
        label: 'Angle and audience',
        prompt:
          'Identify the audience, angle, and strongest narrative hook for the topic.',
      },
      {
        label: 'Create outline',
        prompt:
          'Use {{previous_output}} to generate a structured outline with major sections and proof points.',
      },
      {
        label: 'Write polished draft',
        prompt:
          'Turn {{previous_output}} into a polished draft with strong transitions and a clear conclusion.',
      },
    ] satisfies StarterStep[],
  },
] as const

function getStatusLabel(status: ChainStatus) {
  switch (status) {
    case 'running':
      return 'Running'
    case 'success':
      return 'Done'
    case 'error':
      return 'Needs attention'
    default:
      return 'Ready'
  }
}

export function PromptChainBuilder() {
  const [steps, setSteps] = useState<ChainStep[]>([createStep()])
  const [isRunningChain, setIsRunningChain] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const upgradeModal = useUpgradeModal()

  const completedSteps = steps.filter(
    (step) => step.status === 'success',
  ).length
  const progressPercent =
    steps.length > 0 ? Math.round((completedSteps / steps.length) * 100) : 0

  const canRun = useMemo(
    () => steps.some((step) => step.prompt.trim()),
    [steps],
  )

  const updateStep = useCallback((id: string, patch: Partial<ChainStep>) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, ...patch } : step)),
    )
  }, [])

  const addStep = useCallback(() => {
    setSteps((prev) => [...prev, createStep()])
  }, [])

  const removeStep = useCallback((id: string) => {
    setSteps((prev) =>
      prev.length > 1 ? prev.filter((step) => step.id !== id) : prev,
    )
  }, [])

  const applyStarter = useCallback((templateId: string) => {
    const template = STARTER_TEMPLATES.find((item) => item.id === templateId)
    if (!template) return
    setSteps(template.steps.map((step) => createStep(step)))
    toast.success(`Loaded ${template.label.toLowerCase()} starter`)
  }, [])

  const copyOutput = useCallback(async (id: string, output: string) => {
    await navigator.clipboard.writeText(output)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }, [])

  const runChain = useCallback(async () => {
    const workingSteps = steps.map((step) => ({
      ...step,
      output: '',
      status: 'idle' as ChainStatus,
    }))

    setSteps(workingSteps)
    setIsRunningChain(true)
    let previousOutput = ''

    for (let index = 0; index < workingSteps.length; index++) {
      const step = workingSteps[index]
      const resolvedPrompt = step.prompt.replace(
        /\{\{previous_output\}\}/g,
        previousOutput,
      )

      updateStep(step.id, { status: 'running', output: '' })

      try {
        const res = await fetch('/api/ai/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: resolvedPrompt,
            model: step.model,
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          if (data.error === 'insufficient_credits') {
            upgradeModal.open()
            updateStep(step.id, { status: 'idle' })
            setIsRunningChain(false)
            return
          }
          throw new Error('Request failed')
        }

        if (!res.body) {
          throw new Error('No response body')
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let fullOutput = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          fullOutput += chunk
          updateStep(step.id, { output: fullOutput })
        }

        previousOutput = fullOutput
        updateStep(step.id, { output: fullOutput, status: 'success' })
      } catch {
        updateStep(step.id, {
          output: 'Error: Failed to generate output',
          status: 'error',
        })
        toast.error(`Step ${index + 1} failed`)
        break
      }
    }

    setIsRunningChain(false)
  }, [steps, updateStep, upgradeModal])

  return (
    <div className="space-y-5">
      <Card className="bg-background/84">
        <CardHeader className="border-border/70 gap-4 border-b pb-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="section-label">Workflow composer</p>
              <CardTitle className="font-display text-2xl font-semibold tracking-tight">
                Plan the chain before you run it
              </CardTitle>
              <p className="text-muted-foreground text-sm leading-6">
                Keep each step narrow and pass output forward only when it
                materially improves the next stage.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={addStep}
                disabled={isRunningChain}
                className="rounded-full"
              >
                <Plus className="h-4 w-4" />
                Add step
              </Button>
              <Button
                onClick={runChain}
                disabled={isRunningChain || !canRun}
                className="rounded-full"
              >
                {isRunningChain ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isRunningChain ? 'Running chain...' : 'Run chain'}
              </Button>
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="space-y-3">
              <p className="section-label">Starter workflows</p>
              <div className="flex flex-wrap gap-2">
                {STARTER_TEMPLATES.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => applyStarter(template.id)}
                    disabled={isRunningChain}
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    {template.label}
                  </Button>
                ))}
              </div>
              <p className="text-muted-foreground text-sm">
                Research, support, and content templates help you start with a
                useful handoff pattern instead of a blank stack.
              </p>
            </div>
            <div className="border-border/70 bg-surface-1/75 rounded-3xl border p-4">
              <p className="section-label">Run progress</p>
              <p className="font-display mt-2 text-3xl font-semibold">
                {progressPercent}%
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {completedSteps}/{steps.length} steps complete
              </p>
              <div className="bg-background/80 mt-4 h-2 rounded-full">
                <div
                  className="bg-primary h-full rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {steps.map((step, index) => {
          const usesPreviousOutput = step.prompt.includes('{{previous_output}}')

          return (
            <div key={step.id}>
              {index > 0 ? (
                <div className="flex justify-center py-2">
                  <div className="border-border/70 bg-background/85 text-muted-foreground flex items-center gap-2 rounded-full border px-3 py-1 text-xs">
                    <ArrowDown className="h-3.5 w-3.5" />
                    Receives previous output
                  </div>
                </div>
              ) : null}

              <Card className="bg-background/84">
                <CardHeader className="border-border/70 gap-4 border-b pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1"
                      >
                        Step {index + 1}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-full px-3 py-1"
                      >
                        {getStatusLabel(step.status)}
                      </Badge>
                      {usesPreviousOutput ? (
                        <Badge
                          variant="outline"
                          className="text-primary rounded-full px-3 py-1"
                        >
                          Uses {'{{previous_output}}'}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Select
                        value={step.model}
                        onValueChange={(value) =>
                          updateStep(step.id, { model: value as AIModel })
                        }
                      >
                        <SelectTrigger className="h-9 w-44 rounded-full text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AI_MODELS.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {steps.length > 1 ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => removeStep(step.id)}
                          disabled={isRunningChain}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`chain-step-${step.id}`}>Step label</Label>
                    <Input
                      id={`chain-step-${step.id}`}
                      value={step.label}
                      onChange={(event) =>
                        updateStep(step.id, { label: event.target.value })
                      }
                      placeholder={`Name the goal of step ${index + 1}`}
                      className="rounded-2xl"
                    />
                  </div>
                </CardHeader>

                <CardContent className="grid gap-4 py-5 xl:grid-cols-[minmax(0,1fr)_minmax(17rem,0.9fr)]">
                  <div className="space-y-2">
                    <Label>Prompt</Label>
                    <Textarea
                      value={step.prompt}
                      onChange={(event) =>
                        updateStep(step.id, { prompt: event.target.value })
                      }
                      placeholder={
                        index === 0
                          ? 'Describe the exact job for this first step...'
                          : 'Use {{previous_output}} to guide how this step transforms the previous result.'
                      }
                      rows={7}
                      className="border-border/70 bg-surface-1/75 resize-y rounded-3xl font-mono text-sm leading-6"
                    />
                    <p className="text-muted-foreground text-sm">
                      {index === 0
                        ? 'Keep the first step focused on extracting or classifying information.'
                        : "Reference {{previous_output}} when this step genuinely depends on the prior step's result."}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Output</Label>
                      {step.output ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                          onClick={() => copyOutput(step.id, step.output)}
                        >
                          {copiedId === step.id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      ) : null}
                    </div>
                    <ScrollArea className="border-border/70 bg-surface-1/75 h-[15.5rem] rounded-3xl border p-4">
                      {step.output ? (
                        <pre className="text-foreground/88 font-mono text-xs leading-6 whitespace-pre-wrap">
                          {step.output}
                        </pre>
                      ) : (
                        <div className="text-muted-foreground flex h-full items-center justify-center text-center text-sm">
                          {step.status === 'running'
                            ? 'Generating output...'
                            : 'This panel will show the result produced by this step.'}
                        </div>
                      )}
                      {step.status === 'running' ? (
                        <Loader2 className="text-primary mt-3 h-4 w-4 animate-spin" />
                      ) : null}
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>
            </div>
          )
        })}
      </div>
    </div>
  )
}
