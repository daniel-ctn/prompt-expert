'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { PROMPT_CATEGORIES } from '@/config/constants'
import { usePromptBuilderStore } from '@/stores/prompt-builder'
import type { PromptCategory } from '@/types'

export function CategorySelector() {
  const { settings, updateSettings } = usePromptBuilderStore()

  return (
    <div className="space-y-2">
      <Label htmlFor="category">Prompt Category</Label>
      <Select
        value={settings.category}
        onValueChange={(value) => {
          if (value) updateSettings({ category: value as PromptCategory })
        }}
      >
        <SelectTrigger id="category" className="w-full">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {PROMPT_CATEGORIES.map((cat) => (
            <SelectItem key={cat.value} value={cat.value}>
              <div className="flex flex-col">
                <span>{cat.label}</span>
                <span className="text-muted-foreground text-xs">
                  {cat.description}
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
