"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AI_MODELS } from "@/config/constants";
import { usePromptBuilderStore } from "@/stores/prompt-builder";
import type { AIModel } from "@/types";

export function ModelSelector() {
  const { settings, updateSettings } = usePromptBuilderStore();

  return (
    <div className="space-y-2">
      <Label htmlFor="model">Target AI Model</Label>
      <Select
        value={settings.model}
        onValueChange={(value) => {
          if (value) updateSettings({ model: value as AIModel });
        }}
      >
        <SelectTrigger id="model" className="w-full">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {AI_MODELS.map((model) => (
            <SelectItem key={model.value} value={model.value}>
              <span className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground uppercase">
                  {model.provider}
                </span>
                <span>{model.label}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
