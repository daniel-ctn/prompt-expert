'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { clearPromptHistory } from '@/lib/actions/prompt-history';
import { toast } from 'sonner';

interface HistoryEntry {
  id: string;
  promptContent: string;
  output: string;
  model: string;
  endpoint: string;
  createdAt: Date;
}

interface Props {
  initialHistory: HistoryEntry[];
}

export function HistoryList({ initialHistory }: Props) {
  const [entries, setEntries] = useState<HistoryEntry[]>(initialHistory);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = async () => {
    try {
      await clearPromptHistory();
      setEntries([]);
      toast.success('History cleared');
    } catch {
      toast.error('Failed to clear history');
    }
    setShowClearDialog(false);
  };

  if (entries.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-2">No history yet.</p>
          <p className="text-muted-foreground text-sm">
            Test or optimize prompts to see your history here.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button
          variant="outline"
          size="sm"
          className="text-destructive"
          onClick={() => setShowClearDialog(true)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All
        </Button>
      </div>

      <div className="space-y-3">
        {entries.map((entry) => {
          const isExpanded = expandedId === entry.id;
          return (
            <Card key={entry.id}>
              <CardHeader
                className="cursor-pointer pb-3"
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-sm font-medium">
                      {entry.endpoint === 'test'
                        ? 'Prompt Test'
                        : 'Optimization'}
                    </CardTitle>
                    <Badge variant="secondary" className="text-xs">
                      {entry.model}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">
                      {new Date(entry.createdAt).toLocaleString()}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="text-muted-foreground h-4 w-4" />
                    ) : (
                      <ChevronDown className="text-muted-foreground h-4 w-4" />
                    )}
                  </div>
                </div>
                {!isExpanded && (
                  <p className="text-muted-foreground line-clamp-1 font-mono text-xs">
                    {entry.promptContent}
                  </p>
                )}
              </CardHeader>
              {isExpanded && (
                <CardContent className="space-y-4 pt-0">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium">Prompt</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(entry.promptContent, `p-${entry.id}`);
                        }}
                      >
                        {copiedId === `p-${entry.id}` ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <ScrollArea className="max-h-40 rounded-md border p-3">
                      <pre className="font-mono text-xs whitespace-pre-wrap">
                        {entry.promptContent}
                      </pre>
                    </ScrollArea>
                  </div>
                  <Separator />
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-medium">Output</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(entry.output, `o-${entry.id}`);
                        }}
                      >
                        {copiedId === `o-${entry.id}` ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                    <ScrollArea className="max-h-60 rounded-md border p-3">
                      <pre className="font-mono text-xs whitespace-pre-wrap">
                        {entry.output}
                      </pre>
                    </ScrollArea>
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all history</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete all your prompt history. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClear}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
