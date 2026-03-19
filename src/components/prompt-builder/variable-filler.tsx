"use client";

import { useMemo } from "react";
import { Variable } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const VARIABLE_REGEX = /\{\{([^}]+)\}\}/g;

export function extractVariables(text: string): string[] {
  const matches = new Set<string>();
  let match;
  while ((match = VARIABLE_REGEX.exec(text)) !== null) {
    matches.add(match[1].trim());
  }
  return Array.from(matches);
}

export function resolveVariables(
  text: string,
  values: Record<string, string>,
): string {
  return text.replace(VARIABLE_REGEX, (_, name) => {
    const key = name.trim();
    return values[key] ?? `{{${key}}}`;
  });
}

interface VariableFillerProps {
  variables: string[];
  values: Record<string, string>;
  onChange: (values: Record<string, string>) => void;
}

export function VariableFiller({
  variables,
  values,
  onChange,
}: VariableFillerProps) {
  if (variables.length === 0) return null;

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <div className="flex items-center gap-2">
        <Variable className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Variables</span>
        <Badge variant="secondary" className="text-xs">
          {variables.length}
        </Badge>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {variables.map((name) => (
          <div key={name} className="space-y-1">
            <Label className="text-xs font-mono">{`{{${name}}}`}</Label>
            <Input
              value={values[name] ?? ""}
              onChange={(e) =>
                onChange({ ...values, [name]: e.target.value })
              }
              placeholder={`Enter ${name}...`}
              className="h-8 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
