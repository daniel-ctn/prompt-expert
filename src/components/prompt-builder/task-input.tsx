'use client';

import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { usePromptBuilderStore } from '@/stores/prompt-builder';

export function TaskInput() {
  const { task, setTask } = usePromptBuilderStore();

  return (
    <div className="space-y-2">
      <Label htmlFor="task">
        Task Description <span className="text-destructive">*</span>
      </Label>
      <Textarea
        id="task"
        placeholder="Describe what you want the AI to do..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
        rows={4}
        className="resize-y"
      />
      <p className="text-muted-foreground text-xs">
        {task.length}/2000 characters
      </p>
    </div>
  );
}
