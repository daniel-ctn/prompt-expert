'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePromptBuilderStore } from '@/stores/prompt-builder'

export function ConstraintsInput() {
  const {
    constraints,
    addConstraint,
    removeConstraint,
    updateConstraint,
    errors,
  } = usePromptBuilderStore()
  const error = errors.constraints
  const [newConstraint, setNewConstraint] = useState('')

  const handleAdd = () => {
    const trimmed = newConstraint.trim()
    if (trimmed && constraints.length < 10) {
      addConstraint(trimmed)
      setNewConstraint('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className="space-y-2">
      <Label>Constraints & Rules</Label>
      <div className="space-y-2">
        {constraints.map((constraint, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={constraint}
              onChange={(e) => updateConstraint(index, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => removeConstraint(index)}
              className="shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {constraints.length < 10 && (
          <div className="flex items-center gap-2">
            <Input
              placeholder="Add a constraint or rule..."
              value={newConstraint}
              onChange={(e) => setNewConstraint(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAdd}
              disabled={!newConstraint.trim()}
              className="shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {error ? (
        <p className="text-destructive text-xs">{error}</p>
      ) : (
        <p className="text-muted-foreground text-xs">
          {constraints.length}/10 constraints
        </p>
      )}
    </div>
  )
}
