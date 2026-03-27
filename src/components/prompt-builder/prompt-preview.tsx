'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useCompletion } from '@ai-sdk/react';
import { Copy, Sparkles, Check, Play, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { assemblePrompt } from '@/lib/ai';
import { usePromptBuilderStore } from '@/stores/prompt-builder';
import { useUpgradeModal } from '@/stores/upgrade-modal';
import { ModelComparison } from './model-comparison';
import { PromptAnalysis } from './prompt-analysis';
import {
  VariableFiller,
  extractVariables,
  resolveVariables,
} from './variable-filler';

export function PromptPreview() {
  const {
    role,
    context,
    task,
    constraints,
    settings,
    optimizedPrompt,
    setOptimizedPrompt,
    isOptimizing,
    setIsOptimizing,
  } = usePromptBuilderStore();

  const upgradeModal = useUpgradeModal();
  const [copied, setCopied] = useState<
    'assembled' | 'optimized' | 'test' | null
  >(null);
  const [activeTab, setActiveTab] = useState('assembled');
  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    {},
  );

  const assembledPrompt = useMemo(
    () =>
      task.trim()
        ? assemblePrompt({
            role,
            context,
            task,
            constraints,
            tone: settings.tone,
            outputFormat: settings.outputFormat,
            includeExamples: settings.includeExamples,
          })
        : '',
    [role, context, task, constraints, settings],
  );

  const { complete: completeOptimize, isLoading: isOptimizeLoading } =
    useCompletion({
      api: '/api/ai/optimize',
      id: 'optimize',
      onFinish: (_prompt, completion) => {
        setOptimizedPrompt(completion);
        setIsOptimizing(false);
      },
      onError: (error) => {
        setIsOptimizing(false);
        if (error.message.includes('insufficient_credits')) {
          upgradeModal.open();
        }
      },
    });

  const {
    completion: testOutput,
    complete: completeTest,
    isLoading: isTesting,
  } = useCompletion({
    api: '/api/ai/test',
    id: 'test',
    onError: (error) => {
      if (error.message.includes('insufficient_credits')) {
        upgradeModal.open();
      }
    },
  });

  const handleOptimize = useCallback(() => {
    if (!assembledPrompt.trim()) return;
    setIsOptimizing(true);
    setOptimizedPrompt('');
    completeOptimize(assembledPrompt, {
      body: { prompt: assembledPrompt, model: settings.model },
    });
  }, [
    assembledPrompt,
    settings.model,
    completeOptimize,
    setIsOptimizing,
    setOptimizedPrompt,
  ]);

  const currentPrompt = optimizedPrompt || assembledPrompt;
  const variables = useMemo(
    () => extractVariables(currentPrompt),
    [currentPrompt],
  );
  const resolvedPrompt = useMemo(
    () =>
      variables.length > 0
        ? resolveVariables(currentPrompt, variableValues)
        : currentPrompt,
    [currentPrompt, variables, variableValues],
  );

  const handleTest = useCallback(() => {
    if (!resolvedPrompt.trim()) return;
    setActiveTab('test');
    completeTest(resolvedPrompt, {
      body: {
        prompt: resolvedPrompt,
        model: settings.model,
        temperature: settings.temperature,
      },
    });
  }, [resolvedPrompt, settings.model, settings.temperature, completeTest]);

  const handleCopy = useCallback(
    async (text: string, type: 'assembled' | 'optimized' | 'test') => {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    },
    [],
  );

  const hasContent = assembledPrompt.trim().length > 0;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (hasContent && !isOptimizeLoading && !isOptimizing) {
          handleOptimize();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [hasContent, isOptimizeLoading, isOptimizing, handleOptimize]);

  return (
    <Card className="border-border/50 bg-card/80 relative flex h-full flex-col overflow-hidden backdrop-blur-sm">
      <div className="via-primary/20 absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent to-transparent" />
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg">Prompt Preview</CardTitle>
          <div className="flex items-center gap-2">
            <ModelComparison prompt={resolvedPrompt} disabled={!hasContent} />
            <Button
              variant="outline"
              size="sm"
              onClick={handleTest}
              disabled={!hasContent || isTesting}
              className="border-border/60"
            >
              {isTesting ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <Play className="mr-1.5 h-4 w-4" />
              )}
              {isTesting ? 'Running...' : 'Test'}
            </Button>
            <Button
              size="sm"
              onClick={handleOptimize}
              disabled={!hasContent || isOptimizeLoading || isOptimizing}
              className="bg-primary hover:glow-sm gap-1.5 shadow-sm transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              {isOptimizeLoading ? 'Optimizing...' : 'Optimize'}
              {!isOptimizeLoading && (
                <kbd className="border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground/70 ml-1 hidden rounded border px-1 py-0.5 font-mono text-[10px] sm:inline-block">
                  ⌘↵
                </kbd>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator className="opacity-50" />
      <CardContent className="flex-1 pt-4">
        {!hasContent ? (
          <div className="text-muted-foreground flex h-full items-center justify-center">
            <div className="text-center">
              <Sparkles className="mx-auto mb-3 h-8 w-8 opacity-20" />
              <p className="text-sm">
                Fill in the fields on the left to see your prompt preview here.
              </p>
            </div>
          </div>
        ) : (
          <>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="flex flex-1 flex-col"
            >
              <TabsList>
                <TabsTrigger value="assembled">Assembled</TabsTrigger>
                <TabsTrigger value="optimized">Optimized</TabsTrigger>
                <TabsTrigger value="test">Test</TabsTrigger>
              </TabsList>
              <TabsContent value="assembled" className="flex-1">
                <div className="relative">
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                      {assembledPrompt}
                    </pre>
                  </ScrollArea>
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopy(assembledPrompt, 'assembled')}
                    >
                      {copied === 'assembled' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="optimized" className="flex-1">
                <div className="relative">
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                      {optimizedPrompt}
                    </pre>
                  </ScrollArea>
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopy(optimizedPrompt, 'optimized')}
                    >
                      {copied === 'optimized' ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="test" className="flex-1">
                <div className="relative">
                  <ScrollArea className="h-[400px] rounded-md border p-4">
                    {isTesting && !testOutput && (
                      <div className="text-muted-foreground flex items-center gap-2 text-sm">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Generating response...
                      </div>
                    )}
                    <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
                      {testOutput}
                    </pre>
                  </ScrollArea>
                  {testOutput && (
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleCopy(testOutput, 'test')}
                      >
                        {copied === 'test' ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            {variables.length > 0 && (
              <>
                <Separator className="my-4" />
                <VariableFiller
                  variables={variables}
                  values={variableValues}
                  onChange={setVariableValues}
                />
              </>
            )}
            <Separator className="my-4" />
            <PromptAnalysis prompt={resolvedPrompt} disabled={!hasContent} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
