'use client';

import { LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PROMPT_TEMPLATES } from '@/config/constants';
import { usePromptBuilderStore } from '@/stores/prompt-builder';
import { toast } from 'sonner';

export function TemplateSelector() {
  const { setRole, setContext, setTask, updateSettings, reset } =
    usePromptBuilderStore();

  const applyTemplate = (templateId: string) => {
    const template = PROMPT_TEMPLATES.find((t) => t.id === templateId);
    if (!template) return;

    reset();

    setRole(template.role);
    setContext(template.context);
    setTask(template.task);

    const store = usePromptBuilderStore.getState();
    template.constraints.forEach((c) => store.addConstraint(c));

    updateSettings({
      category: template.category,
      tone: template.tone,
      outputFormat: template.outputFormat,
    });

    toast.success(`Template "${template.label}" applied`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
        <LayoutTemplate className="mr-1.5 h-4 w-4" />
        Templates
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {PROMPT_TEMPLATES.map((template) => (
          <DropdownMenuItem
            key={template.id}
            onClick={() => applyTemplate(template.id)}
          >
            {template.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
