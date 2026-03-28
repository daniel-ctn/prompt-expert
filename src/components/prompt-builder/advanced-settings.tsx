'use client'

import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { usePromptBuilderStore } from '@/stores/prompt-builder'

export function AdvancedSettings() {
  const { settings, updateSettings } = usePromptBuilderStore()

  const isClaudeModel = settings.model.startsWith('claude-')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="examples">Include Examples</Label>
          <p className="text-muted-foreground text-xs">
            Ask the AI to provide examples in the response
          </p>
        </div>
        <Switch
          id="examples"
          checked={settings.includeExamples}
          onCheckedChange={(checked) =>
            updateSettings({ includeExamples: checked })
          }
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className={isClaudeModel ? 'text-muted-foreground' : ''}>
            Temperature
          </Label>
          <span className="text-muted-foreground text-sm">
            {isClaudeModel
              ? 'N/A'
              : (settings.temperature?.toFixed(1) ?? '0.7')}
          </span>
        </div>
        <Slider
          value={[settings.temperature ?? 0.7]}
          onValueChange={(value) =>
            updateSettings({
              temperature: Array.isArray(value) ? value[0] : value,
            })
          }
          min={0}
          max={2}
          step={0.1}
          className="w-full"
          disabled={isClaudeModel}
        />
        <div className="text-muted-foreground flex justify-between text-xs">
          <span>Precise</span>
          <span>Balanced</span>
          <span>Creative</span>
        </div>
      </div>
    </div>
  )
}
