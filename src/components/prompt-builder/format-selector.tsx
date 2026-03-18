"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { OUTPUT_FORMATS } from "@/config/constants";
import { usePromptBuilderStore } from "@/stores/prompt-builder";
import type { OutputFormat } from "@/types";

export function FormatSelector() {
  const { settings, updateSettings } = usePromptBuilderStore();

  return (
    <div className="space-y-2">
      <Label htmlFor="format">Output Format</Label>
      <Select
        value={settings.outputFormat}
        onValueChange={(value) => {
          if (value) updateSettings({ outputFormat: value as OutputFormat });
        }}
      >
        <SelectTrigger id="format" className="w-full">
          <SelectValue placeholder="Select output format" />
        </SelectTrigger>
        <SelectContent>
          {OUTPUT_FORMATS.map((format) => (
            <SelectItem key={format.value} value={format.value}>
              {format.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
