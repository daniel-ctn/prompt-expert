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
        featured ? 'border-primary/20 bg-primary/5' : 'bg-background/84'
      }
    >
      <CardHeader className="border-border/70 gap-4 border-b pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {prompt.category}
              </Badge>
              {featured ? (
                <Badge
                  variant="outline"
                  className="text-primary rounded-full px-3 py-1"
                >
                  Featured
                </Badge>
              ) : null}
            </div>
            <div className="space-y-1">
              <CardTitle className="font-display text-xl leading-tight font-semibold">
                {prompt.title}
              </CardTitle>
              {prompt.description ? (
                <CardDescription className="line-clamp-2 text-sm leading-6">
                  {prompt.description}
                </CardDescription>
              ) : null}
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
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
              className={`h-4 w-4 ${favorited ? 'fill-red-500 text-red-500' : ''}`}
            />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={prompt.authorImage ?? ''} />
            <AvatarFallback className="text-xs">
              {prompt.authorName?.charAt(0).toUpperCase() ?? '?'}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-sm font-medium">
              {prompt.authorName ?? 'Anonymous'}
            </p>
            <p className="text-muted-foreground text-xs">Community author</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 py-5">
        <pre className="border-border/70 bg-surface-1/75 text-foreground/80 line-clamp-6 rounded-3xl border p-4 font-mono text-xs leading-6 whitespace-pre-wrap">
          {prompt.content}
        </pre>

        <div className="flex flex-wrap gap-2">
          {prompt.tags.slice(0, 3).map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full px-3 py-1"
            >
              {tag}
            </Badge>
          ))}
          {prompt.tags.length > 3 ? (
            <Badge variant="outline" className="rounded-full px-3 py-1">
              +{prompt.tags.length - 3} more
            </Badge>
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
            className="rounded-full"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={handleCopy}
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
            className="rounded-full"
            onClick={handleFork}
            disabled={forking}
          >
            <GitFork className="h-4 w-4" />
            {forking ? 'Forking...' : 'Fork prompt'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
