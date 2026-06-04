'use client'

import { useMemo, useState } from 'react'
import {
  Check,
  ChevronDown,
  ChevronUp,
  Copy,
  History as HistoryIcon,
  Search,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { AppLink, appLinkTransitionTypes } from '@/components/ui/app-link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { clearPromptHistory } from '@/lib/actions/prompt-history'

interface HistoryEntry {
  id: string
  promptContent: string
  output: string
  model: string
  endpoint: string
  createdAt: Date
}

interface Props {
  initialHistory: HistoryEntry[]
}

export function HistoryList({ initialHistory }: Props) {
  const [entries, setEntries] = useState<HistoryEntry[]>(initialHistory)
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showClearDialog, setShowClearDialog] = useState(false)

  const filteredEntries = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return entries
    return entries.filter((entry) => {
      const haystack =
        `${entry.promptContent} ${entry.output} ${entry.model}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [entries, search])

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleClear = async () => {
    try {
      await clearPromptHistory()
      setEntries([])
      toast.success('History cleared')
    } catch {
      toast.error('Failed to clear history')
    }
    setShowClearDialog(false)
  }

  if (entries.length === 0) {
    return (
      <div className="page-frame flex flex-col items-center justify-center rounded-[calc(var(--radius-3xl)+2px)] border-dashed p-12 text-center">
        <HistoryIcon className="text-muted-foreground/50 mb-4 h-10 w-10" />
        <h3 className="mb-2 text-lg font-semibold">No history yet</h3>
        <p className="text-muted-foreground mb-4 max-w-sm text-sm">
          Test or optimize a prompt in the builder and your runs will show up
          here so you can compare them later.
        </p>
        <Button
          render={
            <AppLink
              href="/builder"
              transitionTypes={appLinkTransitionTypes.builder}
            />
          }
        >
          Go to the builder
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="page-frame flex flex-col gap-4 rounded-[calc(var(--radius-3xl)+2px)] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <p className="section-label">Search history</p>
          <div className="relative mt-2">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search prompts, output, or model..."
              className="border-border/70 bg-background/84 h-11 rounded-full pl-9"
            />
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive rounded-full"
          onClick={() => setShowClearDialog(true)}
        >
          <Trash2 className="h-4 w-4" />
          Clear all
        </Button>
      </div>

      <div className="space-y-3">
        {filteredEntries.map((entry) => {
          const isExpanded = expandedId === entry.id
          return (
            <Card key={entry.id} className="bg-background/84">
              <CardHeader
                className="cursor-pointer gap-3 pb-4"
                onClick={() => setExpandedId(isExpanded ? null : entry.id)}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-sm font-medium">
                      {entry.endpoint === 'test'
                        ? 'Prompt test'
                        : 'Prompt optimization'}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="rounded-full px-3 py-1"
                    >
                      {entry.model}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
                    <span>{new Date(entry.createdAt).toLocaleString()}</span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>
                {!isExpanded ? (
                  <p className="border-border/70 bg-surface-1/75 text-muted-foreground line-clamp-2 rounded-2xl border px-3 py-3 font-mono text-xs leading-6">
                    {entry.promptContent}
                  </p>
                ) : null}
              </CardHeader>
              {isExpanded ? (
                <CardContent className="space-y-4 pt-0">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium">Prompt</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleCopy(entry.promptContent, `p-${entry.id}`)
                        }}
                      >
                        {copiedId === `p-${entry.id}` ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <ScrollArea className="border-border/70 bg-surface-1/75 max-h-44 rounded-3xl border p-4">
                      <pre className="font-mono text-xs leading-6 whitespace-pre-wrap">
                        {entry.promptContent}
                      </pre>
                    </ScrollArea>
                  </div>
                  <Separator />
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-medium">Output</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={(event) => {
                          event.stopPropagation()
                          handleCopy(entry.output, `o-${entry.id}`)
                        }}
                      >
                        {copiedId === `o-${entry.id}` ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <ScrollArea className="border-border/70 bg-surface-1/75 max-h-72 rounded-3xl border p-4">
                      <pre className="font-mono text-xs leading-6 whitespace-pre-wrap">
                        {entry.output}
                      </pre>
                    </ScrollArea>
                  </div>
                </CardContent>
              ) : null}
            </Card>
          )
        })}
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all history</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes your recorded prompt tests and
              optimizations. Use it only if you do not need these references.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClear}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
