"use client";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TONE_STYLES } from "@/config/constants";
import { usePromptBuilderStore } from "@/stores/prompt-builder";
import type { ToneStyle } from "@/types";

export function ToneSelector() {
  const { settings, updateSettings } = usePromptBuilderStore();

  return (
    <div className="space-y-2">
      <Label>Tone & Style</Label>
      <div className="flex flex-wrap gap-2">
        {TONE_STYLES.map((tone) => (
          <Badge
            key={tone.value}
            variant={settings.tone === tone.value ? "default" : "outline"}
            className="cursor-pointer transition-colors hover:bg-primary/80 hover:text-primary-foreground"
            onClick={() =>
              updateSettings({ tone: tone.value as ToneStyle })
            }
          >
            {tone.label}
          </Badge>
        ))}
      </div>
    </div>
  );
}
