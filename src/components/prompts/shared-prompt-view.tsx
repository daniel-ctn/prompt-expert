'use client'

import { useState } from 'react'
import { Check, Copy, GitFork, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { forkPrompt } from '@/lib/actions/prompt'
import { trackPromptEvent } from '@/lib/track-event'
import { toast } from 'sonner'

interface SharedPromptViewProps {
  prompt: {
    id: string
    title: string
    description: string | null
    category: string
    content: string
    tags: string[]
    createdAt: Date
    authorName: string | null
    authorImage: string | null
  }
}

export function SharedPromptView({ prompt }: SharedPromptViewProps) {
  const [copied, setCopied] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [forking, setForking] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content)
    trackPromptEvent(prompt.id, 'copy')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShareLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    trackPromptEvent(prompt.id, 'share')
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
    toast.success('Link copied to clipboard')
  }

  const handleFork = async () => {
    setForking(true)
    try {
      await forkPrompt(prompt.id)
      toast.success('Prompt forked to your library')
    } catch {
      toast.error('Sign in to fork prompts')
    } finally {
      setForking(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="page-frame bg-transparent">
        <CardHeader className="gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-3">
              <p className="section-label">Shared prompt</p>
              <div className="space-y-2">
                <CardTitle className="font-display text-3xl font-semibold tracking-tight">
                  {prompt.title}
                </CardTitle>
                {prompt.description ? (
                  <CardDescription className="max-w-2xl text-sm leading-6">
                    {prompt.description}
                  </CardDescription>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="rounded-full px-3 py-1">
                  {prompt.category}
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
                onClick={handleShareLink}
                className="rounded-full"
              >
                {linkCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Share2 className="h-4 w-4" />
                )}
                {linkCopied ? 'Copied' : 'Share'}
              </Button>
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
                onClick={handleFork}
                disabled={forking}
                className="rounded-full"
              >
                <GitFork className="h-4 w-4" />
                {forking ? 'Forking...' : 'Fork prompt'}
              </Button>
            </div>
          </div>

          <div className="border-border/70 bg-background/84 flex flex-wrap items-center justify-between gap-3 rounded-3xl border p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={prompt.authorImage ?? ''} />
                <AvatarFallback>
                  {prompt.authorName?.charAt(0).toUpperCase() ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {prompt.authorName ?? 'Anonymous'}
                </p>
                <p className="text-muted-foreground text-sm">
                  Published {new Date(prompt.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">
              Review the structure, copy it directly, or fork it into your own
              library for editing.
            </p>
          </div>
        </CardHeader>
      </Card>

      <Card className="bg-background/84">
        <CardHeader className="pb-4">
          <CardTitle className="font-display text-xl font-semibold">
            Prompt content
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <ScrollArea className="border-border/70 bg-surface-1/75 max-h-[42rem] rounded-3xl border p-4">
            <pre className="text-foreground/88 font-mono text-sm leading-7 whitespace-pre-wrap">
              {prompt.content}
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
