'use client'

import { useMemo, useState } from 'react'
import { Check, Copy, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
import {
  createSystemPrompt,
  deleteSystemPrompt,
  updateSystemPrompt,
} from '@/lib/actions/system-prompts'

interface SystemPrompt {
  id: string
  name: string
  content: string
  updatedAt: Date
}

interface Props {
  initialPrompts: SystemPrompt[]
}

export function SystemPromptManager({ initialPrompts }: Props) {
  const [items, setItems] = useState<SystemPrompt[]>(initialPrompts)
  const [search, setSearch] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return items
    return items.filter((item) => {
      const haystack = `${item.name} ${item.content}`.toLowerCase()
      return haystack.includes(query)
    })
  }, [items, search])

  const resetForm = () => {
    setEditingId(null)
    setName('')
    setContent('')
  }

  const openCreate = () => {
    resetForm()
    setDialogOpen(true)
  }

  const openEdit = (item: SystemPrompt) => {
    setEditingId(item.id)
    setName(item.name)
    setContent(item.content)
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!name.trim() || !content.trim()) return

    try {
      if (editingId) {
        const updated = await updateSystemPrompt(editingId, { name, content })
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingId ? { ...item, ...updated } : item,
          ),
        )
        toast.success('System prompt updated')
      } else {
        const created = await createSystemPrompt(name, content)
        setItems((prev) => [created, ...prev])
        toast.success('System prompt created')
      }
      setDialogOpen(false)
      resetForm()
    } catch {
      toast.error('Failed to save system prompt')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteSystemPrompt(deleteId)
      setItems((prev) => prev.filter((item) => item.id !== deleteId))
      toast.success('System prompt deleted')
    } catch {
      toast.error('Failed to delete system prompt')
    }
    setDeleteId(null)
  }

  const handleCopy = async (item: SystemPrompt) => {
    await navigator.clipboard.writeText(item.content)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success('Copied to clipboard')
  }

  return (
    <>
      <div className="space-y-4">
        <div className="page-frame flex flex-col gap-4 rounded-[calc(var(--radius-3xl)+2px)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="section-label">Find fragments</p>
            <div className="relative mt-2">
              <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search names or content..."
                className="border-border/70 bg-background/84 h-11 rounded-full pl-9"
              />
            </div>
          </div>
          <Button onClick={openCreate} className="rounded-full">
            <Plus className="h-4 w-4" />
            New system prompt
          </Button>
        </div>

        {filteredItems.length === 0 ? (
          <Card className="bg-background/84">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm font-medium">
                {items.length === 0
                  ? 'No system prompts yet.'
                  : 'No prompts match this search.'}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {items.length === 0
                  ? 'Create reusable personas, formatting rules, or domain context snippets.'
                  : 'Try a broader term or clear the search.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredItems.map((item) => (
              <Card key={item.id} className="bg-background/84">
                <CardHeader className="border-border/70 gap-3 border-b pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <CardTitle className="font-display text-xl font-semibold">
                        {item.name}
                      </CardTitle>
                      <CardDescription>
                        Updated {new Date(item.updatedAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => handleCopy(item)}
                      >
                        {copiedId === item.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                        onClick={() => openEdit(item)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive rounded-full"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-5">
                  <pre className="border-border/70 bg-surface-1/75 text-foreground/80 line-clamp-8 rounded-3xl border p-4 font-mono text-xs leading-6 whitespace-pre-wrap">
                    {item.content}
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit system prompt' : 'New system prompt'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sp-name">Name</Label>
              <Input
                id="sp-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Code reviewer persona"
                className="h-11 rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sp-content">Content</Label>
              <Textarea
                id="sp-content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder="You are a senior code reviewer..."
                rows={10}
                className="rounded-3xl font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || !content.trim()}
              className="rounded-full"
            >
              {editingId ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete system prompt</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Remove it only if you are sure it is
              no longer useful.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
