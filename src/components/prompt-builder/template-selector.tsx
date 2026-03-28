'use client'

import { LayoutTemplate } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DEFAULT_PROMPT_SETTINGS, PROMPT_TEMPLATES } from '@/config/constants'
import { usePromptBuilderStore } from '@/stores/prompt-builder'
import type { SavedPromptPreset } from '@/types'
import { toast } from 'sonner'

export function TemplateSelector({
  savedPresets = [],
}: {
  savedPresets?: SavedPromptPreset[]
}) {
  const loadPreset = usePromptBuilderStore((s) => s.loadPreset)

  const applyTemplate = (templateId: string) => {
    const template = PROMPT_TEMPLATES.find((t) => t.id === templateId)
    if (!template) return

    loadPreset({
      role: template.role,
      context: template.context,
      task: template.task,
      constraints: template.constraints,
      settings: {
        ...DEFAULT_PROMPT_SETTINGS,
        category: template.category,
        tone: template.tone,
        outputFormat: template.outputFormat,
      },
    })

    toast.success(`Template "${template.label}" applied`)
  }

  const applySavedPreset = (preset: SavedPromptPreset) => {
    loadPreset(preset.builderState)
    toast.success(`Preset "${preset.title}" loaded`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        <LayoutTemplate className="mr-1.5 h-4 w-4" />
        Templates
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {savedPresets.length > 0 && (
          <>
            <DropdownMenuGroup>
              <DropdownMenuLabel>My presets</DropdownMenuLabel>
              {savedPresets.map((preset) => (
                <DropdownMenuItem
                  key={preset.id}
                  onClick={() => applySavedPreset(preset)}
                >
                  {preset.title}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuGroup>
          <DropdownMenuLabel>Built-in templates</DropdownMenuLabel>
          {PROMPT_TEMPLATES.map((template) => (
            <DropdownMenuItem
              key={template.id}
              onClick={() => applyTemplate(template.id)}
            >
              {template.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
