'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePromptBuilderStore } from '@/stores/prompt-builder'

export function RoleInput() {
  const { role, setRole } = usePromptBuilderStore()

  return (
    <div className="space-y-2">
      <Label htmlFor="role">Role / Persona</Label>
      <Input
        id="role"
        placeholder='e.g. "a senior software engineer specializing in React"'
        value={role}
        onChange={(e) => setRole(e.target.value)}
      />
      <p className="text-muted-foreground text-xs">
        Define who the AI should act as
      </p>
    </div>
  )
}
