"use client";

import { useState } from "react";
import { Copy, Check, GitFork, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { forkPrompt } from "@/lib/actions/prompt";
import { toast } from "sonner";

interface SharedPromptViewProps {
  prompt: {
    id: string;
    title: string;
    description: string | null;
    category: string;
    content: string;
    tags: string[];
    createdAt: Date;
    authorName: string | null;
    authorImage: string | null;
  };
}

export function SharedPromptView({ prompt }: SharedPromptViewProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [forking, setForking] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
    toast.success("Link copied to clipboard");
  };

  const handleFork = async () => {
    setForking(true);
    try {
      await forkPrompt(prompt.id);
      toast.success("Prompt forked to your library");
    } catch {
      toast.error("Sign in to fork prompts");
    } finally {
      setForking(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-xl">{prompt.title}</CardTitle>
            {prompt.description && (
              <CardDescription>{prompt.description}</CardDescription>
            )}
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge variant="secondary">{prompt.category}</Badge>
              {prompt.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={prompt.authorImage ?? ""} />
              <AvatarFallback className="text-xs">
                {prompt.authorName?.charAt(0).toUpperCase() ?? "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">
              {prompt.authorName ?? "Anonymous"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleShareLink}>
              {linkCopied ? (
                <Check className="mr-1.5 h-4 w-4 text-green-500" />
              ) : (
                <Share2 className="mr-1.5 h-4 w-4" />
              )}
              {linkCopied ? "Copied" : "Share"}
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="mr-1.5 h-4 w-4 text-green-500" />
              ) : (
                <Copy className="mr-1.5 h-4 w-4" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button size="sm" onClick={handleFork} disabled={forking}>
              <GitFork className="mr-1.5 h-4 w-4" />
              {forking ? "Forking..." : "Fork"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <ScrollArea className="max-h-[500px] rounded-md border p-4">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {prompt.content}
          </pre>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
