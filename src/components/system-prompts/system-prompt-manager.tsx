'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import {
  createSystemPrompt,
  updateSystemPrompt,
  deleteSystemPrompt,
} from '@/lib/actions/system-prompts';
import { toast } from 'sonner';

interface SystemPrompt {
  id: string;
  name: string;
  content: string;
  updatedAt: Date;
}

interface Props {
  initialPrompts: SystemPrompt[];
}

export function SystemPromptManager({ initialPrompts }: Props) {
  const [items, setItems] = useState<SystemPrompt[]>(initialPrompts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setContent('');
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (item: SystemPrompt) => {
    setEditingId(item.id);
    setName(item.name);
    setContent(item.content);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !content.trim()) return;

    try {
      if (editingId) {
        const updated = await updateSystemPrompt(editingId, { name, content });
        setItems((prev) =>
          prev.map((p) => (p.id === editingId ? { ...p, ...updated } : p)),
        );
        toast.success('System prompt updated');
      } else {
        const created = await createSystemPrompt(name, content);
        setItems((prev) => [created, ...prev]);
        toast.success('System prompt created');
      }
      setDialogOpen(false);
      resetForm();
    } catch {
      toast.error('Failed to save system prompt');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteSystemPrompt(deleteId);
      setItems((prev) => prev.filter((p) => p.id !== deleteId));
      toast.success('System prompt deleted');
    } catch {
      toast.error('Failed to delete');
    }
    setDeleteId(null);
  };

  const handleCopy = async (item: SystemPrompt) => {
    await navigator.clipboard.writeText(item.content);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success('Copied to clipboard');
  };

  return (
    <>
      <div className="mb-6">
        <Button onClick={openCreate}>
          <Plus className="mr-2 h-4 w-4" />
          New System Prompt
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-2">No system prompts yet.</p>
            <p className="text-muted-foreground mb-4 text-sm">
              Create reusable fragments like personas, formatting rules, or
              domain context.
            </p>
            <Button variant="outline" onClick={openCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create your first
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{item.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => handleCopy(item)}
                    >
                      {copiedId === item.id ? (
                        <Check className="h-3.5 w-3.5 text-green-500" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => openEdit(item)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive h-7 w-7"
                      onClick={() => setDeleteId(item.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
                <CardDescription className="text-xs">
                  Updated {new Date(item.updatedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-muted-foreground line-clamp-4 font-mono text-xs whitespace-pre-wrap">
                  {item.content}
                </pre>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingId ? 'Edit System Prompt' : 'New System Prompt'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sp-name">Name</Label>
              <Input
                id="sp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Code Reviewer Persona"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sp-content">Content</Label>
              <Textarea
                id="sp-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="You are a senior code reviewer..."
                rows={8}
                className="font-mono text-sm"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!name.trim() || !content.trim()}
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
              This action cannot be undone.
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
  );
}
