'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useCompletion } from '@ai-sdk/react'
import {
  Check,
  Copy,
  Loader2,
  Play,
  Sparkles,
  TextCursorInput,
  Wand2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { assemblePrompt } from '@/lib/ai'
import { usePromptBuilderStore } from '@/stores/prompt-builder'
import { useUpgradeModal } from '@/stores/upgrade-modal'
import { ModelComparison } from './model-comparison'
import { PromptAnalysis } from './prompt-analysis'
import {
  VariableFiller,
  extractVariables,
  resolveVariables,
} from './variable-filler'

function EmptyPreviewState() {
  const items = [
    'Choose model, category, tone, and format.',
    'Write the task and enough context for the AI to act well.',
    'Test the prompt before you decide to optimize it.',
  ]

  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="max-w-md space-y-4 text-center">
        <div className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-3xl">
          <Wand2 className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <p className="font-display text-2xl font-semibold">
            The live prompt will appear here
          </p>
          <p className="text-muted-foreground text-sm leading-6">
            Once the task is defined, this panel becomes your workspace for
            previewing, testing, copying, and optimizing.
          </p>
        </div>
        <div className="grid gap-2 text-left">
          {items.map((item, index) => (
            <div
              key={item}
              className="border-border/70 bg-surface-1/70 text-muted-foreground flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm"
            >
              <span className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold">
                {index + 1}
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function PromptPreview() {
  const {
    role,
    context,
    task,
    constraints,
    settings,
    optimizedPrompt,
    setOptimizedPrompt,
    isOptimizing,
    setIsOptimizing,
    validate,
  } = usePromptBuilderStore()

  const upgradeModal = useUpgradeModal()
  const [copied, setCopied] = useState<
    'assembled' | 'optimized' | 'test' | null
  >(null)
  const [activeTab, setActiveTab] = useState('assembled')
  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    {},
  )

  const assembledPrompt = useMemo(
    () =>
      task.trim()
        ? assemblePrompt({
            role,
            context,
            task,
            constraints,
            tone: settings.tone,
            outputFormat: settings.outputFormat,
            includeExamples: settings.includeExamples,
          })
        : '',
    [role, context, task, constraints, settings],
  )

  const { complete: completeOptimize, isLoading: isOptimizeLoading } =
    useCompletion({
      api: '/api/ai/optimize',
      id: 'optimize',
      streamProtocol: 'text',
      onFinish: (_prompt, completion) => {
        setOptimizedPrompt(completion)
        setIsOptimizing(false)
        window.dispatchEvent(new Event('credits:updated'))
      },
      onError: (error) => {
        setIsOptimizing(false)
        if (error.message.includes('insufficient_credits')) {
          upgradeModal.open()
        }
      },
    })

  const {
    completion: testOutput,
    complete: completeTest,
    isLoading: isTesting,
  } = useCompletion({
    api: '/api/ai/test',
    id: 'test',
    streamProtocol: 'text',
    onFinish: () => {
      window.dispatchEvent(new Event('credits:updated'))
    },
    onError: (error) => {
      if (error.message.includes('insufficient_credits')) {
        upgradeModal.open()
      }
    },
  })

  const handleOptimize = useCallback(() => {
    if (!validate()) return
    if (!assembledPrompt.trim()) return
    setIsOptimizing(true)
    setOptimizedPrompt('')
    completeOptimize(assembledPrompt, {
      body: { prompt: assembledPrompt, model: settings.model },
    })
  }, [
    assembledPrompt,
    settings.model,
    completeOptimize,
    setIsOptimizing,
    setOptimizedPrompt,
    validate,
  ])

  const currentPrompt = optimizedPrompt || assembledPrompt
  const variables = useMemo(
    () => extractVariables(currentPrompt),
    [currentPrompt],
  )
  const resolvedPrompt = useMemo(
    () =>
      variables.length > 0
        ? resolveVariables(currentPrompt, variableValues)
        : currentPrompt,
    [currentPrompt, variables, variableValues],
  )

  const handleTest = useCallback(() => {
    if (!validate()) return
    if (!resolvedPrompt.trim()) return
    setActiveTab('test')
    const isClaudeModel = settings.model.startsWith('claude-')
    completeTest(resolvedPrompt, {
      body: {
        prompt: resolvedPrompt,
        model: settings.model,
        ...(isClaudeModel ? {} : { temperature: settings.temperature }),
      },
    })
  }, [
    resolvedPrompt,
    settings.model,
    settings.temperature,
    completeTest,
    validate,
  ])

  const handleCopy = useCallback(
    async (text: string, type: 'assembled' | 'optimized' | 'test') => {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    },
    [],
  )

  const hasContent = assembledPrompt.trim().length > 0

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault()
        if (hasContent && !isOptimizeLoading && !isOptimizing) {
          handleOptimize()
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [hasContent, isOptimizeLoading, isOptimizing, handleOptimize])

  return (
    <Card className="surface-raised relative flex h-full flex-col overflow-hidden border-0">
      <CardHeader className="border-border/70 gap-4 border-b pb-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="section-label">Live workstation</p>
            <CardTitle className="font-display text-2xl font-semibold tracking-tight">
              Prompt preview
            </CardTitle>
            <p className="text-muted-foreground text-sm leading-6">
              Assemble the prompt live, test it, and optimize only when the
              brief is stable.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ModelComparison prompt={resolvedPrompt} disabled={!hasContent} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleTest}
              disabled={!hasContent || isTesting}
              className="rounded-full"
            >
              {isTesting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isTesting ? 'Running...' : 'Test'}
            </Button>
            <Button
              size="sm"
              onClick={handleOptimize}
              disabled={!hasContent || isOptimizeLoading || isOptimizing}
              className="rounded-full"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isOptimizeLoading ? 'Optimizing...' : 'Optimize'}
            </Button>
          </div>
        </div>
        <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            {settings.model}
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            {resolvedPrompt.length || 0} characters
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            <TextCursorInput className="mr-1 h-3 w-3" />
            {variables.length} variables
          </Badge>
          <span>
            Shortcut:{' '}
            <kbd className="border-border/80 rounded border px-1.5 py-0.5 text-[11px]">
              Ctrl
            </kbd>{' '}
            +{' '}
            <kbd className="border-border/80 rounded border px-1.5 py-0.5 text-[11px]">
              Enter
            </kbd>{' '}
            optimizes the current prompt.
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-4 py-5">
        {!hasContent ? (
          <EmptyPreviewState />
        ) : (
          <>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex min-h-0 flex-1 flex-col"
            >
              <TabsList className="bg-surface-1/80 w-fit rounded-full p-1">
                <TabsTrigger value="assembled" className="rounded-full">
                  Assembled
                </TabsTrigger>
                <TabsTrigger value="optimized" className="rounded-full">
                  Optimized
                </TabsTrigger>
                <TabsTrigger value="test" className="rounded-full">
                  Test output
                </TabsTrigger>
              </TabsList>

              <TabsContent value="assembled" className="min-h-0 flex-1">
                <div className="border-border/70 bg-background/85 relative flex h-full min-h-0 flex-col rounded-[calc(var(--radius-3xl)+2px)] border p-3">
                  <ScrollArea className="border-border/70 bg-surface-1/75 h-[420px] rounded-[calc(var(--radius-2xl)+2px)] border p-4 xl:h-full">
                    <pre className="text-foreground/88 font-mono text-sm leading-7 whitespace-pre-wrap">
                      {assembledPrompt}
                    </pre>
                  </ScrollArea>
                  <div className="absolute top-5 right-5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => handleCopy(assembledPrompt, 'assembled')}
                    >
                      {copied === 'assembled' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="optimized" className="min-h-0 flex-1">
                <div className="border-border/70 bg-background/85 relative flex h-full min-h-0 flex-col rounded-[calc(var(--radius-3xl)+2px)] border p-3">
                  <ScrollArea className="border-border/70 bg-surface-1/75 h-[420px] rounded-[calc(var(--radius-2xl)+2px)] border p-4 xl:h-full">
                    <pre className="text-foreground/88 font-mono text-sm leading-7 whitespace-pre-wrap">
                      {optimizedPrompt}
                    </pre>
                  </ScrollArea>
                  <div className="absolute top-5 right-5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                      onClick={() => handleCopy(optimizedPrompt, 'optimized')}
                    >
                      {copied === 'optimized' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="test" className="min-h-0 flex-1">
                <div className="border-border/70 bg-background/85 relative flex h-full min-h-0 flex-col rounded-[calc(var(--radius-3xl)+2px)] border p-3">
                  <ScrollArea className="border-border/70 bg-surface-1/75 h-[420px] rounded-[calc(var(--radius-2xl)+2px)] border p-4 xl:h-full">
                    {isTesting && !testOutput ? (
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating response...
                      </div>
                    ) : null}
                    <pre className="text-foreground/88 font-mono text-sm leading-7 whitespace-pre-wrap">
                      {testOutput}
                    </pre>
                  </ScrollArea>
                  {testOutput ? (
                    <div className="absolute top-5 right-5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => handleCopy(testOutput, 'test')}
                      >
                        {copied === 'test' ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </TabsContent>
            </Tabs>

            {variables.length > 0 ? (
              <>
                <Separator />
                <div className="border-border/70 bg-surface-1/70 rounded-[calc(var(--radius-3xl)+2px)] border p-4">
                  <div className="mb-4 space-y-1">
                    <p className="section-label">Runtime variables</p>
                    <p className="text-muted-foreground text-sm">
                      Fill placeholder values before testing the prompt.
                    </p>
                  </div>
                  <VariableFiller
                    variables={variables}
                    values={variableValues}
                    onChange={setVariableValues}
                  />
                </div>
              </>
            ) : null}

            <Separator />
            <div className="border-border/70 bg-surface-1/70 rounded-[calc(var(--radius-3xl)+2px)] border p-4">
              <div className="mb-4 space-y-1">
                <p className="section-label">Quality analysis</p>
                <p className="text-muted-foreground text-sm">
                  Run an analysis pass when the prompt feels close to final.
                </p>
              </div>
              <PromptAnalysis prompt={resolvedPrompt} disabled={!hasContent} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
