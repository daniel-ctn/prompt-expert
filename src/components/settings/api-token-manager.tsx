'use client';

import { useState } from 'react';
import { Plus, Trash2, Copy, Check, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { createApiToken, deleteApiToken } from '@/lib/actions/api-tokens';
import { toast } from 'sonner';

interface Token {
  id: string;
  name: string;
  lastUsedAt: Date | null;
  createdAt: Date;
}

interface Props {
  initialTokens: Token[];
}

export function ApiTokenManager({ initialTokens }: Props) {
  const [tokens, setTokens] = useState<Token[]>(initialTokens);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [name, setName] = useState('');
  const [newToken, setNewToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      const raw = await createApiToken(name.trim());
      setNewToken(raw);
      setTokens((prev) => [
        {
          id: crypto.randomUUID(),
          name: name.trim(),
          lastUsedAt: null,
          createdAt: new Date(),
        },
        ...prev,
      ]);
      setName('');
    } catch {
      toast.error('Failed to create token');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteApiToken(id);
      setTokens((prev) => prev.filter((t) => t.id !== id));
      toast.success('Token deleted');
    } catch {
      toast.error('Failed to delete token');
    }
  };

  const handleCopyToken = async () => {
    if (!newToken) return;
    await navigator.clipboard.writeText(newToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Tokens
          </CardTitle>
          <CardDescription>
            Create personal access tokens to use the{' '}
            <code className="bg-muted rounded px-1 py-0.5 text-xs">
              GET /api/v1/prompts
            </code>{' '}
            endpoint.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setNewToken(null);
              setCopied(false);
              setDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Token
          </Button>

          {tokens.length === 0 ? (
            <p className="text-muted-foreground text-sm">No API tokens yet.</p>
          ) : (
            <div className="divide-y rounded-md border">
              {tokens.map((token) => (
                <div
                  key={token.id}
                  className="flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium">{token.name}</p>
                    <p className="text-muted-foreground text-xs">
                      Created {new Date(token.createdAt).toLocaleDateString()}
                      {token.lastUsedAt &&
                        ` · Last used ${new Date(token.lastUsedAt).toLocaleDateString()}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive h-8 w-8"
                    onClick={() => handleDelete(token.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) setNewToken(null);
          setDialogOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {newToken ? 'Token Created' : 'New API Token'}
            </DialogTitle>
            {newToken && (
              <DialogDescription>
                Copy your token now. It won&apos;t be shown again.
              </DialogDescription>
            )}
          </DialogHeader>

          {newToken ? (
            <div className="flex gap-2">
              <Input value={newToken} readOnly className="font-mono text-xs" />
              <Button variant="outline" size="icon" onClick={handleCopyToken}>
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="token-name">Token Name</Label>
              <Input
                id="token-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My Integration"
              />
            </div>
          )}

          <DialogFooter>
            {newToken ? (
              <Button onClick={() => setDialogOpen(false)}>Done</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={!name.trim()}>
                  Create
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
