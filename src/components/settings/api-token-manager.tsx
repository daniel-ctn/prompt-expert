'use client'

import { useState } from 'react'
import { Check, Copy, Key, Plus, Trash2 } from 'lucide-react'
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createApiToken, deleteApiToken } from '@/lib/actions/api-tokens'

interface Token {
  id: string
  name: string
  lastUsedAt: Date | null
  createdAt: Date
}

interface Props {
  initialTokens: Token[]
}

export function ApiTokenManager({ initialTokens }: Props) {
  const [tokens, setTokens] = useState<Token[]>(initialTokens)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [name, setName] = useState('')
  const [newToken, setNewToken] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) return
    try {
      const raw = await createApiToken(name.trim())
      setNewToken(raw)
      setTokens((prev) => [
        {
          id: crypto.randomUUID(),
          name: name.trim(),
          lastUsedAt: null,
          createdAt: new Date(),
        },
        ...prev,
      ])
      setName('')
    } catch {
      toast.error('Failed to create token')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteApiToken(id)
      setTokens((prev) => prev.filter((token) => token.id !== id))
      toast.success('Token deleted')
    } catch {
      toast.error('Failed to delete token')
    }
  }

  const handleCopyToken = async () => {
    if (!newToken) return
    await navigator.clipboard.writeText(newToken)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <Card className="bg-background/84">
        <CardHeader className="gap-3">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API access tokens
              </CardTitle>
              <CardDescription className="leading-6">
                Create personal access tokens for the{' '}
                <code className="bg-muted rounded px-1 py-0.5 text-xs">
                  GET /api/v1/prompts
                </code>{' '}
                endpoint. Tokens are shown once when created.
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setNewToken(null)
                setCopied(false)
                setDialogOpen(true)
              }}
              className="rounded-full"
            >
              <Plus className="h-4 w-4" />
              New token
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {tokens.length === 0 ? (
            <div className="border-border/70 bg-surface-1/75 rounded-3xl border border-dashed px-4 py-10 text-center">
              <p className="text-sm font-medium">No API tokens yet.</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Create a token when you are ready to connect the API to your
                internal tools or scripts.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {tokens.map((token) => (
                <div
                  key={token.id}
                  className="border-border/70 bg-surface-1/75 flex flex-col gap-3 rounded-3xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{token.name}</p>
                    <p className="text-muted-foreground text-sm">
                      Created {new Date(token.createdAt).toLocaleDateString()}
                      {token.lastUsedAt
                        ? ` · Last used ${new Date(token.lastUsedAt).toLocaleDateString()}`
                        : ' · Not used yet'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-fit rounded-full"
                    onClick={() => handleDelete(token.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
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
          if (!open) setNewToken(null)
          setDialogOpen(open)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {newToken ? 'Token created' : 'New API token'}
            </DialogTitle>
            {newToken ? (
              <DialogDescription>
                Copy your token now. It will not be shown again after this
                dialog closes.
              </DialogDescription>
            ) : (
              <DialogDescription>
                Name the token by its consuming integration so it is easier to
                revoke later.
              </DialogDescription>
            )}
          </DialogHeader>

          {newToken ? (
            <div className="flex gap-2">
              <Input
                value={newToken}
                readOnly
                className="h-11 rounded-2xl font-mono text-xs"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyToken}
                className="h-11 w-11 rounded-2xl"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="token-name">Token name</Label>
              <Input
                id="token-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Internal dashboard"
                className="h-11 rounded-2xl"
              />
            </div>
          )}

          <DialogFooter>
            {newToken ? (
              <Button
                onClick={() => setDialogOpen(false)}
                className="rounded-full"
              >
                Done
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={!name.trim()}
                  className="rounded-full"
                >
                  Create token
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
