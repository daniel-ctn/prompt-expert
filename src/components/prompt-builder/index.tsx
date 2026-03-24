'use client';

import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { usePromptBuilderStore } from '@/stores/prompt-builder';
import { ModelSelector } from './model-selector';
import { CategorySelector } from './category-selector';
import { ToneSelector } from './tone-selector';
import { FormatSelector } from './format-selector';
import { RoleInput } from './role-input';
import { ContextInput } from './context-input';
import { TaskInput } from './task-input';
import { ConstraintsInput } from './constraints-input';
import { AdvancedSettings } from './advanced-settings';
import { PromptPreview } from './prompt-preview';
import { SavePromptDialog } from './save-prompt-dialog';
import { TemplateSelector } from './template-selector';

export function PromptBuilder() {
  const reset = usePromptBuilderStore((s) => s.reset);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Left panel: Controls */}
      <div className="space-y-6">
        <Card className="bg-card/80 relative overflow-hidden backdrop-blur-sm">
          <div className="via-primary/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent" />
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-display text-lg">
                Configure Your Prompt
              </CardTitle>
              <div className="flex items-center gap-2">
                <TemplateSelector />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={reset}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Reset
                </Button>
                <SavePromptDialog />
              </div>
            </div>
          </CardHeader>
          <Separator className="opacity-50" />
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <ModelSelector />
              <CategorySelector />
            </div>

            <ToneSelector />

            <FormatSelector />

            <Separator className="opacity-50" />

            <RoleInput />

            <ContextInput />

            <TaskInput />

            <ConstraintsInput />

            <Separator className="opacity-50" />

            <AdvancedSettings />
          </CardContent>
        </Card>
      </div>

      {/* Right panel: Preview */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <PromptPreview />
      </div>
    </div>
  );
}
