"use client";

import { useCallback, useMemo } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Copy, RotateCcw, Sparkles, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { assemblePrompt } from "@/lib/ai";
import { usePromptBuilderStore } from "@/stores/prompt-builder";

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

  const [copied, setCopied] = useState<"assembled" | "optimized" | null>(null);

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
        : "",
    [role, context, task, constraints, settings],
  );

  const { complete, isLoading } = useCompletion({
    api: "/api/ai/optimize",
    onFinish: (_prompt, completion) => {
      setOptimizedPrompt(completion);
      setIsOptimizing(false);
    },
    onError: () => {
      setIsOptimizing(false);
    },
  });

  const handleOptimize = useCallback(() => {
    if (!assembledPrompt.trim()) return;
    setIsOptimizing(true);
    setOptimizedPrompt("");
    complete(assembledPrompt, {
      body: { prompt: assembledPrompt, model: settings.model },
    });
  }, [assembledPrompt, settings.model, complete, setIsOptimizing, setOptimizedPrompt]);

  const handleCopy = useCallback(
    async (text: string, type: "assembled" | "optimized") => {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    },
    [],
  );

  const hasContent = assembledPrompt.trim().length > 0;

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Prompt Preview</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleOptimize}
              disabled={!hasContent || isLoading || isOptimizing}
            >
              <Sparkles className="mr-1.5 h-4 w-4" />
              {isLoading ? "Optimizing..." : "Optimize with AI"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex-1 pt-4">
        {!hasContent ? (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <p className="text-center text-sm">
              Fill in the fields on the left to see your prompt preview here.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="assembled" className="flex h-full flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="assembled">Assembled</TabsTrigger>
              <TabsTrigger value="optimized" disabled={!optimizedPrompt}>
                Optimized
              </TabsTrigger>
            </TabsList>
            <TabsContent value="assembled" className="flex-1">
              <div className="relative">
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {assembledPrompt}
                  </pre>
                </ScrollArea>
                <div className="absolute right-2 top-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopy(assembledPrompt, "assembled")}
                  >
                    {copied === "assembled" ? (
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
                  <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                    {optimizedPrompt}
                  </pre>
                </ScrollArea>
                <div className="absolute right-2 top-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleCopy(optimizedPrompt, "optimized")}
                  >
                    {copied === "optimized" ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
