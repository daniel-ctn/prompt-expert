"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, MoreVertical, Pencil, Trash2, Globe, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { deletePrompt, duplicatePrompt } from "@/lib/actions/prompt";
import { toast } from "sonner";

interface PromptCardProps {
  prompt: {
    id: string;
    title: string;
    description: string | null;
    category: string;
    content: string;
    tags: string[];
    isPublic: boolean;
    updatedAt: Date;
  };
}

export function PromptCard({ prompt }: PromptCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt.content);
    toast.success("Prompt copied to clipboard");
  };

  const handleDuplicate = async () => {
    try {
      await duplicatePrompt(prompt.id);
      toast.success("Prompt duplicated");
    } catch {
      toast.error("Failed to duplicate prompt");
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deletePrompt(prompt.id);
      toast.success("Prompt deleted");
    } catch {
      toast.error("Failed to delete prompt");
      setIsDeleting(false);
    }
  };

  return (
    <Card className={isDeleting ? "opacity-50" : ""}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 pr-2">
            <CardTitle className="line-clamp-1 text-base">
              {prompt.title}
            </CardTitle>
            {prompt.description && (
              <CardDescription className="line-clamp-2">
                {prompt.description}
              </CardDescription>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" />}
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                Copy prompt
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href={`/prompts/${prompt.id}`} />}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete prompt</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete &ldquo;{prompt.title}&rdquo;?
                  This action cannot be undone and all version history will be
                  lost.
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
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 line-clamp-3 font-mono text-xs text-muted-foreground">
          {prompt.content}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="secondary" className="text-xs">
              {prompt.category}
            </Badge>
            {prompt.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {prompt.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">
                +{prompt.tags.length - 2}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            {prompt.isPublic ? (
              <Globe className="h-3.5 w-3.5" />
            ) : (
              <Lock className="h-3.5 w-3.5" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
