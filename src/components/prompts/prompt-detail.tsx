"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Copy, Check, Save } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { updatePrompt } from "@/lib/actions/prompt";
import { toast } from "sonner";

interface PromptDetailProps {
  prompt: {
    id: string;
    title: string;
    description: string | null;
    category: string;
    content: string;
    settings: unknown;
    tags: string[];
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  versions: {
    id: string;
    content: string;
    versionNumber: number;
    createdAt: Date;
  }[];
}

export function PromptDetail({ prompt, versions }: PromptDetailProps) {
  const router = useRouter();
  const [title, setTitle] = useState(prompt.title);
  const [description, setDescription] = useState(prompt.description ?? "");
  const [content, setContent] = useState(prompt.content);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePrompt({
        id: prompt.id,
        title,
        description,
        content,
      });
      toast.success("Prompt updated");
      router.refresh();
    } catch {
      toast.error("Failed to update prompt");
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" render={<Link href="/prompts" />}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{prompt.title}</h1>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary">{prompt.category}</Badge>
            {prompt.tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy}>
            {copied ? (
              <Check className="mr-1.5 h-4 w-4 text-green-500" />
            ) : (
              <Copy className="mr-1.5 h-4 w-4" />
            )}
            {copied ? "Copied" : "Copy"}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving}>
            <Save className="mr-1.5 h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="edit">
        <TabsList>
          <TabsTrigger value="edit">Edit</TabsTrigger>
          <TabsTrigger value="versions">
            Versions ({versions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="edit" className="mt-4">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input
                  id="edit-description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-content">Prompt Content</Label>
                <Textarea
                  id="edit-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={12}
                  className="resize-y font-mono text-sm"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="versions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Version History</CardTitle>
            </CardHeader>
            <CardContent>
              {versions.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No versions recorded yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {versions.map((version, i) => (
                    <div key={version.id}>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Version {version.versionNumber}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {version.createdAt.toLocaleDateString()}
                        </span>
                      </div>
                      <ScrollArea className="mt-2 h-32 rounded-md border p-3">
                        <pre className="whitespace-pre-wrap font-mono text-xs">
                          {version.content}
                        </pre>
                      </ScrollArea>
                      {i < versions.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
