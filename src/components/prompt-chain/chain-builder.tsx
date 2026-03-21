'use client';

import { useState, useCallback } from 'react';
import {
  Plus,
  Trash2,
  Play,
  Loader2,
  ChevronDown,
  ArrowDown,
  Copy,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AI_MODELS } from '@/config/constants';
import { toast } from 'sonner';
import { useUpgradeModal } from '@/stores/upgrade-modal';
import type { AIModel } from '@/types';

interface ChainStep {
  id: string;
  label: string;
  prompt: string;
  model: AIModel;
  output: string;
  isRunning: boolean;
}

function makeId() {
  return Math.random().toString(36).slice(2, 9);
}

const DEFAULT_STEP: () => ChainStep = () => ({
  id: makeId(),
  label: '',
  prompt: '',
  model: 'gpt-4.1-mini',
  output: '',
  isRunning: false,
});

export function PromptChainBuilder() {
  const [steps, setSteps] = useState<ChainStep[]>([DEFAULT_STEP()]);
  const [isRunningChain, setIsRunningChain] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const upgradeModal = useUpgradeModal();

  const updateStep = useCallback((id: string, patch: Partial<ChainStep>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, []);

  const addStep = useCallback(() => {
    setSteps((prev) => [...prev, DEFAULT_STEP()]);
  }, []);

  const removeStep = useCallback((id: string) => {
    setSteps((prev) =>
      prev.length > 1 ? prev.filter((s) => s.id !== id) : prev,
    );
  }, []);

  const runChain = useCallback(async () => {
    setIsRunningChain(true);
    let previousOutput = '';

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const resolvedPrompt = step.prompt.replace(
        /\{\{previous_output\}\}/g,
        previousOutput,
      );

      updateStep(step.id, { isRunning: true, output: '' });

      try {
        const res = await fetch('/api/ai/test', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: resolvedPrompt,
            model: step.model,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          if (data.error === 'insufficient_credits') {
            upgradeModal.open();
            updateStep(step.id, { isRunning: false });
            setIsRunningChain(false);
            return;
          }
          throw new Error('Request failed');
        }
        if (!res.body) throw new Error('No response body');

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullOutput = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullOutput += chunk;
          updateStep(step.id, { output: fullOutput });
        }

        previousOutput = fullOutput;
        updateStep(step.id, { isRunning: false, output: fullOutput });
      } catch {
        updateStep(step.id, {
          isRunning: false,
          output: 'Error: Failed to generate output',
        });
        toast.error(`Step ${i + 1} failed`);
        break;
      }
    }

    setIsRunningChain(false);
  }, [steps, updateStep]);

  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <div key={step.id}>
          {i > 0 && (
            <div className="flex justify-center py-2">
              <ArrowDown className="text-muted-foreground h-5 w-5" />
            </div>
          )}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    Step {i + 1}
                  </Badge>
                  <Input
                    value={step.label}
                    onChange={(e) =>
                      updateStep(step.id, { label: e.target.value })
                    }
                    placeholder={`Step ${i + 1} label...`}
                    className="h-7 w-48 text-sm"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select
                    value={step.model}
                    onValueChange={(val) =>
                      updateStep(step.id, { model: val as AIModel })
                    }
                  >
                    <SelectTrigger className="h-8 w-40 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {AI_MODELS.map((m) => (
                        <SelectItem key={m.value} value={m.value}>
                          {m.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {steps.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeStep(step.id)}
                      disabled={isRunningChain}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Prompt</Label>
                <Textarea
                  value={step.prompt}
                  onChange={(e) =>
                    updateStep(step.id, { prompt: e.target.value })
                  }
                  placeholder={
                    i === 0
                      ? 'Enter your prompt...'
                      : "Use {{previous_output}} to reference the previous step's output"
                  }
                  rows={3}
                  className="resize-y font-mono text-sm"
                />
                {i > 0 && (
                  <p className="text-muted-foreground text-[11px]">
                    Use{' '}
                    <code className="bg-muted rounded px-1 py-0.5">
                      {'{{previous_output}}'}
                    </code>{' '}
                    to insert the previous step&apos;s output.
                  </p>
                )}
              </div>
              {step.output && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Output</Label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={async () => {
                        await navigator.clipboard.writeText(step.output);
                        setCopiedIdx(i);
                        setTimeout(() => setCopiedIdx(null), 2000);
                      }}
                    >
                      {copiedIdx === i ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <ScrollArea className="bg-muted/30 h-32 rounded-md border p-3">
                    <pre className="font-mono text-xs whitespace-pre-wrap">
                      {step.output}
                    </pre>
                    {step.isRunning && (
                      <Loader2 className="mt-1 inline h-3 w-3 animate-spin" />
                    )}
                  </ScrollArea>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ))}

      <div className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={addStep}
          disabled={isRunningChain}
        >
          <Plus className="mr-1.5 h-4 w-4" />
          Add Step
        </Button>
        <Button
          onClick={runChain}
          disabled={isRunningChain || steps.every((s) => !s.prompt.trim())}
        >
          {isRunningChain ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <Play className="mr-1.5 h-4 w-4" />
          )}
          {isRunningChain ? 'Running chain...' : 'Run Chain'}
        </Button>
      </div>
    </div>
  );
}
