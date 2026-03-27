'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { usePromptBuilderStore } from '@/stores/prompt-builder';
import { createPrompt } from '@/lib/actions/prompt';
import { assemblePrompt } from '@/lib/ai';
import { toast } from 'sonner';

export function SavePromptDialog() {
  const { role, context, task, constraints, settings, optimizedPrompt } =
    usePromptBuilderStore();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [saving, setSaving] = useState(false);

  const assembled = assemblePrompt({
    role,
    context,
    task,
    constraints,
    tone: settings.tone,
    outputFormat: settings.outputFormat,
    includeExamples: settings.includeExamples,
  });

  const content = optimizedPrompt || assembled;

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      await createPrompt({
        title: title.trim(),
        description: description.trim(),
        category: settings.category,
        content,
        settings,
        builderState: {
          role,
          context,
          task,
          constraints,
          settings,
        },
        tags,
        isPublic,
      });

      toast.success('Prompt saved successfully');
      router.refresh();
      setOpen(false);
      setTitle('');
      setDescription('');
      setTagsInput('');
      setIsPublic(false);
    } catch {
      toast.error('Failed to save prompt');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button variant="default" disabled={!task.trim()} />}
      >
        <Save className="mr-1.5 h-4 w-4" />
        Save Prompt
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Prompt</DialogTitle>
          <DialogDescription>
            Save this prompt to your collection so you can reuse it as a preset
            later.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="save-title">Title</Label>
            <Input
              id="save-title"
              placeholder="Give your prompt a name..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="save-description">Description</Label>
            <Textarea
              id="save-description"
              placeholder="Optional description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="save-tags">Tags</Label>
            <Input
              id="save-tags"
              placeholder="Comma-separated tags..."
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="save-public">Make public</Label>
            <Switch
              id="save-public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
