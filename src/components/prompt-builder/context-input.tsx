'use client'

import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { usePromptBuilderStore } from '@/stores/prompt-builder'

export function ContextInput() {
  const { context, setContext, errors } = usePromptBuilderStore()
  const error = errors.context

  return (
    <div className="space-y-2">
      <Label htmlFor="context">Context / Background</Label>
      <Textarea
        id="context"
        placeholder="Provide relevant background information, domain knowledge, or situational context..."
        value={context}
        onChange={(e) => setContext(e.target.value)}
        rows={3}
        className={`resize-y ${error ? 'border-destructive focus-visible:ring-destructive' : ''}`}
      />
      {error ? (
        <p className="text-destructive text-xs">{error}</p>
      ) : (
        <p className="text-muted-foreground text-xs">
          {context.length}/2000 characters
        </p>
      )}
    </div>
  )
}
