'use client'

import { useState } from 'react'
import { FolderPlus, Trash2, Folder } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { createCollection, deleteCollection } from '@/lib/actions/prompt'
import { toast } from 'sonner'

interface Collection {
  id: string
  name: string
  description: string | null
}

interface CollectionManagerProps {
  collections: Collection[]
  activeCollection?: string | null
  onSelect: (id: string | null) => void
}

export function CollectionManager({
  collections,
  activeCollection,
  onSelect,
}: CollectionManagerProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) return
    setCreating(true)
    try {
      await createCollection(name.trim())
      toast.success('Collection created')
      setName('')
      setOpen(false)
    } catch {
      toast.error('Failed to create collection')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteCollection(id)
      if (activeCollection === id) onSelect(null)
      toast.success('Collection deleted')
    } catch {
      toast.error('Failed to delete collection')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={activeCollection === null ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onSelect(null)}
      >
        All
      </Button>
      {collections.map((c) => (
        <div key={c.id} className="group flex items-center">
          <Button
            variant={activeCollection === c.id ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onSelect(c.id)}
          >
            <Folder className="mr-1.5 h-3.5 w-3.5" />
            {c.name}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="hidden h-6 w-6 group-hover:flex"
            onClick={() => handleDelete(c.id)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      ))}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" size="sm" />}>
          <FolderPlus className="mr-1.5 h-3.5 w-3.5" />
          New
        </DialogTrigger>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>New Collection</DialogTitle>
          </DialogHeader>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Collection name..."
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreate()
            }}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!name.trim() || creating}>
              {creating ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
