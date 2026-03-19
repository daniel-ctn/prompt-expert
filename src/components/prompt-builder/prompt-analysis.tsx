"use client";

import { useState, useCallback } from "react";
import { BarChart3, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useUpgradeModal } from "@/stores/upgrade-modal";

interface AnalysisResult {
  scores: {
    clarity: number;
    specificity: number;
    structure: number;
    completeness: number;
    effectiveness: number;
  };
  overall: number;
  strengths: string[];
  improvements: string[];
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const color =
    score >= 8
      ? "bg-green-500"
      : score >= 5
        ? "bg-yellow-500"
        : "bg-red-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs capitalize">{label}</span>
        <span className="text-xs font-medium">{score}/10</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full transition-all duration-500 ${color}`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  );
}

interface PromptAnalysisProps {
  prompt: string;
  disabled?: boolean;
}

export function PromptAnalysis({ prompt, disabled }: PromptAnalysisProps) {
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const upgradeModal = useUpgradeModal();

  const handleAnalyze = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (data.error === "insufficient_credits") {
          upgradeModal.open();
          return;
        }
        throw new Error("Analysis failed");
      }
      const data = await res.json();
      setAnalysis(data);
      setExpanded(true);
    } catch {
      toast.error("Failed to analyze prompt");
    } finally {
      setIsAnalyzing(false);
    }
  }, [prompt, upgradeModal]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalyze}
          disabled={disabled || isAnalyzing}
        >
          {isAnalyzing ? (
            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
          ) : (
            <BarChart3 className="mr-1.5 h-4 w-4" />
          )}
          {isAnalyzing ? "Analyzing..." : "Analyze Quality"}
        </Button>
        {analysis && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {analysis && expanded && (
        <div className="space-y-4 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Score</span>
            <Badge
              variant={analysis.overall >= 7 ? "default" : "secondary"}
              className="text-sm"
            >
              {analysis.overall}/10
            </Badge>
          </div>

          <div className="space-y-2">
            {Object.entries(analysis.scores).map(([key, val]) => (
              <ScoreBar key={key} label={key} score={val} />
            ))}
          </div>

          {analysis.strengths.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-green-600 dark:text-green-400">
                Strengths
              </span>
              <ul className="space-y-1">
                {analysis.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    + {s}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.improvements.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-medium text-yellow-600 dark:text-yellow-400">
                Improvements
              </span>
              <ul className="space-y-1">
                {analysis.improvements.map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground">
                    - {s}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
