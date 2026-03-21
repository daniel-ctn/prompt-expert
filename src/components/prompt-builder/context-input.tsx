'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { usePromptBuilderStore } from '@/stores/prompt-builder';

export function ContextInput() {
  const { context, setContext } = usePromptBuilderStore();

  return (
    <div className="space-y-2">
      <Label htmlFor="context">Context / Background</Label>
      <Textarea
        id="context"
        placeholder="Provide relevant background information, domain knowledge, or situational context..."
        value={context}
        onChange={(e) => setContext(e.target.value)}
        rows={3}
        className="resize-y"
      />
      <p className="text-muted-foreground text-xs">
        {context.length}/2000 characters
      </p>
    </div>
  );
}
