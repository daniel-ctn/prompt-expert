'use client'

import { useState } from 'react'
import { Check, Copy, Eye, GitFork, Heart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { AppLink, appLinkTransitionTypes } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { forkPrompt, toggleFavorite } from '@/lib/actions/prompt'
import { trackPromptEvent } from '@/lib/track-event'
import { toast } from 'sonner'

interface GalleryCardProps {
  prompt: {
    id: string
    title: string
    description: string | null
    category: string
    content: string
    tags: string[]
    authorName: string | null
    authorImage: string | null
  }
  isFavorited?: boolean
  featured?: boolean
}

export function GalleryCard({
  prompt,
  isFavorited = false,
  featured = false,
}: GalleryCardProps) {
  const [copied, setCopied] = useState(false)
  const [forking, setForking] = useState(false)
  const [favorited, setFavorited] = useState(isFavorited)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content)
    trackPromptEvent(prompt.id, 'copy')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast.success('Prompt copied to clipboard')
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
    <Card
      className={
        featured
          ? 'bg-[color-mix(in_oklch,var(--marigold)_14%,var(--background))]'
          : ''
      }
    >
      <CardHeader className="border-foreground/40 gap-4 border-b pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{prompt.category}</Badge>
              {featured ? <Badge>★ Featured</Badge> : null}
            </div>
            <div className="space-y-1">
              <CardTitle className="font-display text-xl leading-tight font-medium tracking-tight">
                {prompt.title}
              </CardTitle>
              {prompt.description ? (
                <CardDescription className="line-clamp-2 text-[13px] leading-6">
                  {prompt.description}
                </CardDescription>
              ) : null}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-sm"
            onClick={async () => {
              try {
                const result = await toggleFavorite(prompt.id)
                setFavorited(result.favorited)
              } catch {
                toast.error('Sign in to favorite prompts')
              }
            }}
          >
            <Heart
              className={`h-4 w-4 ${favorited ? 'fill-[var(--rust)] text-[var(--rust)]' : ''}`}
            />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="border-foreground/85 h-8 w-8 border">
            <AvatarImage src={prompt.authorImage ?? ''} />
            <AvatarFallback className="text-foreground font-display bg-[color-mix(in_oklch,var(--marigold)_24%,var(--background))] text-xs">
              {prompt.authorName?.charAt(0).toUpperCase() ?? '?'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium">
              {prompt.authorName ?? 'Anonymous'}
            </p>
            <p className="text-muted-foreground font-mono text-[10px] tracking-[0.18em] uppercase">
              Community author
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 py-5">
        <pre className="border-foreground/80 bg-background text-foreground/85 line-clamp-6 border p-4 font-mono text-[11.5px] leading-6 whitespace-pre-wrap">
          {prompt.content}
        </pre>

        <div className="flex flex-wrap gap-2">
          {prompt.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
          {prompt.tags.length > 3 ? (
            <Badge variant="outline">+{prompt.tags.length - 3} more</Badge>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            render={
              <AppLink
                href={`/share/${prompt.id}`}
                transitionTypes={appLinkTransitionTypes.promptDetail}
              />
            }
            className="rounded-sm"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-sm"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            size="sm"
            className="rounded-sm"
            onClick={handleFork}
            disabled={forking}
          >
            <GitFork className="h-3.5 w-3.5" />
            {forking ? 'Forking…' : 'Fork prompt'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
