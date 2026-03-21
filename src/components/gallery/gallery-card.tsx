'use client';

import { useState } from 'react';
import { Copy, GitFork, Check, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { forkPrompt, toggleFavorite } from '@/lib/actions/prompt';
import { trackPromptEvent } from '@/lib/track-event';
import { toast } from 'sonner';

interface GalleryCardProps {
  prompt: {
    id: string;
    title: string;
    description: string | null;
    category: string;
    content: string;
    tags: string[];
    authorName: string | null;
    authorImage: string | null;
  };
  isFavorited?: boolean;
}

export function GalleryCard({ prompt, isFavorited = false }: GalleryCardProps) {
  const [copied, setCopied] = useState(false);
  const [forking, setForking] = useState(false);
  const [favorited, setFavorited] = useState(isFavorited);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content);
    trackPromptEvent(prompt.id, 'copy');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Prompt copied to clipboard');
  };

  const handleFork = async () => {
    setForking(true);
    try {
      await forkPrompt(prompt.id);
      toast.success('Prompt forked to your library');
    } catch {
      toast.error('Sign in to fork prompts');
    } finally {
      setForking(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="space-y-1">
          <CardTitle className="line-clamp-1 text-base">
            {prompt.title}
          </CardTitle>
          {prompt.description && (
            <CardDescription className="line-clamp-2">
              {prompt.description}
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-3 line-clamp-3 font-mono text-xs">
          {prompt.content}
        </p>
        <div className="mb-3 flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-xs">
            {prompt.category}
          </Badge>
          {prompt.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {prompt.tags.length > 2 && (
            <span className="text-muted-foreground text-xs">
              +{prompt.tags.length - 2}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={prompt.authorImage ?? ''} />
              <AvatarFallback className="text-[10px]">
                {prompt.authorName?.charAt(0).toUpperCase() ?? '?'}
              </AvatarFallback>
            </Avatar>
            <span className="text-muted-foreground text-xs">
              {prompt.authorName ?? 'Anonymous'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={async () => {
                try {
                  const result = await toggleFavorite(prompt.id);
                  setFavorited(result.favorited);
                } catch {
                  toast.error('Sign in to favorite prompts');
                }
              }}
            >
              <Heart
                className={`h-3.5 w-3.5 ${favorited ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleCopy}
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-green-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={handleFork}
              disabled={forking}
            >
              <GitFork className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
