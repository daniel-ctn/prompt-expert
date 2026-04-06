'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Copy, GitCompareArrows, Save } from 'lucide-react'
import { AppLink, appLinkTransitionTypes } from '@/components/ui/app-link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { updatePrompt } from '@/lib/actions/prompt'
import { toast } from 'sonner'

function computeDiff(oldText: string, newText: string) {
  const oldLines = oldText.split('\n')
  const newLines = newText.split('\n')
  const result: { type: 'same' | 'added' | 'removed'; text: string }[] = []

  let oi = 0
  let ni = 0

  while (oi < oldLines.length || ni < newLines.length) {
    if (oi < oldLines.length && ni < newLines.length) {
      if (oldLines[oi] === newLines[ni]) {
        result.push({ type: 'same', text: oldLines[oi] })
        oi++
        ni++
      } else {
        result.push({ type: 'removed', text: oldLines[oi] })
        oi++
        if (ni < newLines.length) {
          result.push({ type: 'added', text: newLines[ni] })
          ni++
        }
      }
    } else if (oi < oldLines.length) {
      result.push({ type: 'removed', text: oldLines[oi] })
      oi++
    } else {
      result.push({ type: 'added', text: newLines[ni] })
      ni++
    }
  }

  return result
}

interface PromptDetailProps {
  prompt: {
    id: string
    title: string
    description: string | null
    category: string
    content: string
    settings: unknown
    tags: string[]
    isPublic: boolean
    createdAt: Date
    updatedAt: Date
  }
  versions: {
    id: string
    content: string
    versionNumber: number
    createdAt: Date
  }[]
}

export function PromptDetail({ prompt, versions }: PromptDetailProps) {
  const router = useRouter()
  const [title, setTitle] = useState(prompt.title)
  const [description, setDescription] = useState(prompt.description ?? '')
  const [content, setContent] = useState(prompt.content)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [diffLeft, setDiffLeft] = useState<string | null>(null)
  const [diffRight, setDiffRight] = useState<string | null>(null)

  const diffResult = useMemo(() => {
    if (!diffLeft || !diffRight || diffLeft === diffRight) return null
    const left = versions.find((version) => version.id === diffLeft)
    const right = versions.find((version) => version.id === diffRight)
    if (!left || !right) return null
    return computeDiff(left.content, right.content)
  }, [diffLeft, diffRight, versions])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await updatePrompt({
        id: prompt.id,
        title,
        description,
        content,
      })
      toast.success('Prompt updated')
      router.refresh()
    } catch {
      toast.error('Failed to update prompt')
    } finally {
      setSaving(false)
    }
  }, [prompt.id, title, description, content, router])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 's') {
        event.preventDefault()
        if (!saving) handleSave()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [saving, handleSave])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-4">
      <Card className="page-frame bg-transparent">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                size="sm"
                render={
                  <AppLink
                    href="/prompts"
                    transitionTypes={appLinkTransitionTypes.back}
                  />
                }
                className="w-fit rounded-full"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to library
              </Button>
              <div className="space-y-2">
                <p className="section-label">Prompt editor</p>
                <h1 className="font-display text-3xl font-semibold tracking-tight">
                  {prompt.title}
                </h1>
                <p className="text-muted-foreground text-sm">
                  Updated {new Date(prompt.updatedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {prompt.category}
                </Badge>
                <Badge variant="outline" className="rounded-full px-3 py-1">
                  {prompt.isPublic ? 'Public' : 'Private'}
                </Badge>
                {prompt.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="rounded-full px-3 py-1"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="rounded-full"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                disabled={saving}
                className="rounded-full"
              >
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save changes'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="edit">
        <TabsList className="bg-surface-1/80 rounded-full p-1">
          <TabsTrigger value="edit" className="rounded-full">
            Edit
          </TabsTrigger>
          <TabsTrigger value="versions" className="rounded-full">
            Versions ({versions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-4">
          <Card className="bg-background/84">
            <CardContent className="grid gap-4 py-5">
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Title</Label>
                    <Input
                      id="edit-title"
                      value={title}
                      onChange={(event) => setTitle(event.target.value)}
                      className="rounded-2xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Input
                      id="edit-description"
                      value={description}
                      onChange={(event) => setDescription(event.target.value)}
                      className="rounded-2xl"
                    />
                  </div>
                </div>

                <div className="border-border/70 bg-surface-1/75 rounded-3xl border p-4">
                  <p className="section-label">Editing notes</p>
                  <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
                    <li>Use concise titles that describe the intended job.</li>
                    <li>Keep description and tags focused on reuse context.</li>
                    <li>Press Ctrl/Cmd + S to save quickly.</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-content">Prompt content</Label>
                <Textarea
                  id="edit-content"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={16}
                  className="border-border/70 bg-surface-1/75 resize-y rounded-3xl font-mono text-sm leading-7"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="mt-4 space-y-4">
          <Card className="bg-background/84">
            <CardHeader>
              <CardTitle className="font-display text-xl font-semibold">
                Version history
              </CardTitle>
            </CardHeader>
            <CardContent>
              {versions.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  No versions recorded yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {versions.map((version, index) => (
                    <div
                      key={version.id}
                      className="border-border/70 bg-surface-1/75 rounded-3xl border p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium">
                            Version {version.versionNumber}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Saved {version.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className="rounded-full px-3 py-1"
                        >
                          Snapshot {versions.length - index}
                        </Badge>
                      </div>
                      <ScrollArea className="border-border/70 bg-background/84 mt-3 h-36 rounded-2xl border p-3">
                        <pre className="font-mono text-xs leading-6 whitespace-pre-wrap">
                          {version.content}
                        </pre>
                      </ScrollArea>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {versions.length >= 2 ? (
            <Card className="bg-background/84">
              <CardHeader className="gap-4">
                <div className="flex items-center gap-2">
                  <GitCompareArrows className="text-primary h-4 w-4" />
                  <CardTitle className="font-display text-xl font-semibold">
                    Compare versions
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Older version</Label>
                    <Select
                      value={diffLeft ?? undefined}
                      onValueChange={setDiffLeft}
                    >
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue placeholder="Select version..." />
                      </SelectTrigger>
                      <SelectContent>
                        {versions.map((version) => (
                          <SelectItem key={version.id} value={version.id}>
                            Version {version.versionNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Newer version</Label>
                    <Select
                      value={diffRight ?? undefined}
                      onValueChange={setDiffRight}
                    >
                      <SelectTrigger className="rounded-2xl">
                        <SelectValue placeholder="Select version..." />
                      </SelectTrigger>
                      <SelectContent>
                        {versions.map((version) => (
                          <SelectItem key={version.id} value={version.id}>
                            Version {version.versionNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {diffLeft && diffRight && diffLeft === diffRight ? (
                  <p className="text-muted-foreground text-sm">
                    Select two different versions to compare changes.
                  </p>
                ) : null}

                {diffResult ? (
                  <ScrollArea className="border-border/70 bg-surface-1/75 h-72 rounded-3xl border">
                    <div className="p-4 font-mono text-xs">
                      {diffResult.map((line, index) => (
                        <div
                          key={`${line.text}-${index}`}
                          className={
                            line.type === 'added'
                              ? 'bg-green-500/15 text-green-700 dark:text-green-400'
                              : line.type === 'removed'
                                ? 'bg-red-500/15 text-red-700 dark:text-red-400'
                                : 'text-muted-foreground'
                          }
                        >
                          <span className="mr-2 inline-block w-4 text-right opacity-60 select-none">
                            {line.type === 'added'
                              ? '+'
                              : line.type === 'removed'
                                ? '-'
                                : ' '}
                          </span>
                          {line.text || '\u00A0'}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                ) : null}
              </CardContent>
            </Card>
          ) : null}
        </TabsContent>
      </Tabs>
    </div>
  )
}
