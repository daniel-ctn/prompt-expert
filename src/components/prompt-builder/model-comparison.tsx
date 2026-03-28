'use client'

import { useState, useCallback } from 'react'
import { useCompletion } from '@ai-sdk/react'
import { Play, Loader2, Copy, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AI_MODELS } from '@/config/constants'
import { useUpgradeModal } from '@/stores/upgrade-modal'
import type { AIModel } from '@/types'

interface ModelComparisonProps {
  prompt: string
  disabled?: boolean
}

function ComparisonSlot({
  id,
  model,
  prompt,
}: {
  id: string
  model: AIModel
  prompt: string
}) {
  const [copied, setCopied] = useState(false)
  const upgradeModal = useUpgradeModal()
  const { completion, complete, isLoading } = useCompletion({
    api: '/api/ai/test',
    id: `compare-${id}`,
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

  const handleRun = useCallback(() => {
    complete(prompt, {
      body: { prompt, model },
    })
  }, [prompt, model, complete])

  const modelLabel = AI_MODELS.find((m) => m.value === model)?.label ?? model

  return (
    <div className="flex flex-1 flex-col rounded-lg border">
      <div className="flex items-center justify-between border-b px-3 py-2">
        <Badge variant="secondary" className="text-xs">
          {modelLabel}
        </Badge>
        <div className="flex items-center gap-1">
          {completion && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={async () => {
                await navigator.clipboard.writeText(completion)
                setCopied(true)
                setTimeout(() => setCopied(false), 2000)
              }}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={handleRun}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>
      <ScrollArea className="h-96 p-3">
        {isLoading && !completion && (
          <div className="text-muted-foreground flex items-center gap-2 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating...
          </div>
        )}
        {completion ? (
          <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {completion}
          </pre>
        ) : (
          !isLoading && (
            <p className="text-muted-foreground text-center text-xs">
              Click play to run
            </p>
          )
        )}
      </ScrollArea>
    </div>
  )
}

export function ModelComparison({ prompt, disabled }: ModelComparisonProps) {
  const [open, setOpen] = useState(false)
  const [models, setModels] = useState<[AIModel, AIModel]>([
    'gpt-5.4-mini',
    'gemini-2.5-flash',
  ])
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="outline" size="sm" disabled={disabled} />}
      >
        Compare Models
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]!">
        <DialogHeader>
          <DialogTitle>Multi-Model Comparison</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {models.map((model, i) => (
              <Select
                key={i}
                value={model}
                onValueChange={(val) => {
                  const next = [...models] as [AIModel, AIModel]
                  next[i] = val as AIModel
                  setModels(next)
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {models.map((model, i) => (
              <ComparisonSlot
                key={`${model}-${i}`}
                id={`${i}`}
                model={model}
                prompt={prompt}
              />
            ))}
          </div>
          <p className="text-muted-foreground text-center text-xs">
            Each model receives the same prompt. Click play on each panel to
            generate, or select different models to compare.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
