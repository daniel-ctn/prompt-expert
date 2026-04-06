'use client'

import { useState } from 'react'
import {
  Copy,
  Globe,
  Lock,
  MoreVertical,
  Pencil,
  Share2,
  Trash2,
} from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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
import { deletePrompt, duplicatePrompt } from '@/lib/actions/prompt'
import { trackPromptEvent } from '@/lib/track-event'
import { toast } from 'sonner'

interface PromptCardProps {
  prompt: {
    id: string
    title: string
    description: string | null
    category: string
    content: string
    tags: string[]
    isPublic: boolean
    updatedAt: Date
  }
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content)
    trackPromptEvent(prompt.id, 'copy')
    toast.success('Prompt copied to clipboard')
  }

  const handleDuplicate = async () => {
    try {
      await duplicatePrompt(prompt.id)
      toast.success('Prompt duplicated')
    } catch {
      toast.error('Failed to duplicate prompt')
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deletePrompt(prompt.id)
      toast.success('Prompt deleted')
    } catch {
      toast.error('Failed to delete prompt')
      setIsDeleting(false)
    }
  }

  return (
    <Card className={isDeleting ? 'opacity-50' : 'bg-background/84'}>
      <CardHeader className="border-border/70 gap-4 border-b pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {prompt.category}
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1">
                {prompt.isPublic ? (
                  <>
                    <Globe className="mr-1 h-3.5 w-3.5" />
                    Public
                  </>
                ) : (
                  <>
                    <Lock className="mr-1 h-3.5 w-3.5" />
                    Private
                  </>
                )}
              </Badge>
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

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 rounded-full"
                />
              }
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopy}>
                Copy prompt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                Duplicate
              </DropdownMenuItem>
              {prompt.isPublic ? (
                <DropdownMenuItem
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      `${window.location.origin}/share/${prompt.id}`,
                    )
                    trackPromptEvent(prompt.id, 'share')
                    toast.success('Share link copied')
                  }}
                >
                  Copy share link
                </DropdownMenuItem>
              ) : null}
              <DropdownMenuItem
                render={
                  <AppLink
                    href={`/prompts/${prompt.id}`}
                    transitionTypes={appLinkTransitionTypes.promptDetail}
                  />
                }
              >
                Edit prompt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                Delete prompt
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="text-muted-foreground flex items-center justify-between gap-3 text-sm">
          <span>Updated {new Date(prompt.updatedAt).toLocaleDateString()}</span>
          <span>
            {prompt.tags.length} tag{prompt.tags.length !== 1 ? 's' : ''}
          </span>
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
            size="sm"
            render={
              <AppLink
                href={`/prompts/${prompt.id}`}
                transitionTypes={appLinkTransitionTypes.promptDetail}
              />
            }
            className="rounded-full"
          >
            <Pencil className="h-4 w-4" />
            Open editor
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full"
            onClick={handleCopy}
          >
            <Copy className="h-4 w-4" />
            Copy
          </Button>
          {prompt.isPublic ? (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `${window.location.origin}/share/${prompt.id}`,
                )
                trackPromptEvent(prompt.id, 'share')
                toast.success('Share link copied')
              }}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          ) : null}
        </div>
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete prompt</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete “{prompt.title}”? This action
              cannot be undone and all version history will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
