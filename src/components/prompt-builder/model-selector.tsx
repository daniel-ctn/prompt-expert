'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lightbulb } from 'lucide-react'
import { AI_MODELS, MODEL_RECOMMENDATIONS } from '@/config/constants'
import { usePromptBuilderStore } from '@/stores/prompt-builder'
import type { AIModel } from '@/types'

export function ModelSelector() {
  const { settings, updateSettings } = usePromptBuilderStore()
  const recommendation = MODEL_RECOMMENDATIONS[settings.category]
  const isRecommended = settings.model === recommendation?.model

  return (
    <div className="space-y-2">
      <Label htmlFor="model">Target AI Model</Label>
      <Select
        value={settings.model}
        onValueChange={(value) => {
          if (value) updateSettings({ model: value as AIModel })
        }}
      >
        <SelectTrigger id="model" className="w-full">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {AI_MODELS.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              <span className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs uppercase">
                  {model.provider}
                </span>
                <span>{model.label}</span>
                {model.value === recommendation?.model && (
                  <Badge
                    variant="outline"
                    className="ml-1 px-1 py-0 text-[10px]"
                  >
                    Recommended
                  </Badge>
                )}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {recommendation && !isRecommended && (
        <Button
          variant="ghost"
          size="sm"
          className="h-auto w-full justify-start gap-1.5 px-2 py-1 text-left"
          onClick={() => updateSettings({ model: recommendation.model })}
        >
          <Lightbulb className="h-3 w-3 shrink-0 text-yellow-500" />
          <span className="text-muted-foreground text-xs">
            {recommendation.reason}
            {' — '}
            <span className="text-foreground font-medium">
              Use{' '}
              {AI_MODELS.find((m) => m.value === recommendation.model)?.label}
            </span>
          </span>
        </Button>
      )}
    </div>
  )
}
