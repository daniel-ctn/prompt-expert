'use client'

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  ArrowRight,
  Clock3,
  CreditCard,
  FileText,
  LayoutDashboard,
  Library,
  Search,
  Settings,
  Sparkles,
  Workflow,
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  COMMAND_PALETTE_EVENT,
  setCommandPaletteOpen,
} from '@/lib/command-palette'

type PaletteItem = {
  id: string
  label: string
  description: string
  href: string
  keywords: string[]
  icon: React.ComponentType<{ className?: string }>
}

const BASE_ITEMS: PaletteItem[] = [
  {
    id: 'new-prompt',
    label: 'New prompt',
    description: 'Open the builder and start with a clean canvas.',
    href: '/builder',
    keywords: ['builder', 'create', 'new', 'prompt'],
    icon: Sparkles,
  },
  {
    id: 'prompt-chain',
    label: 'Prompt chain',
    description: 'Build multi-step prompt workflows.',
    href: '/chain',
    keywords: ['workflow', 'chain', 'steps', 'automation'],
    icon: Workflow,
  },
  {
    id: 'gallery',
    label: 'Gallery',
    description: 'Browse community prompts and fork them.',
    href: '/gallery',
    keywords: ['explore', 'browse', 'community', 'templates'],
    icon: Library,
  },
  {
    id: 'my-prompts',
    label: 'My prompts',
    description: 'Manage saved prompts and collections.',
    href: '/prompts',
    keywords: ['library', 'saved', 'manage', 'prompts'],
    icon: LayoutDashboard,
  },
  {
    id: 'system-prompts',
    label: 'System prompts',
    description: 'Maintain reusable system prompt fragments.',
    href: '/system-prompts',
    keywords: ['persona', 'fragments', 'system'],
    icon: FileText,
  },
  {
    id: 'history',
    label: 'History',
    description: 'Review prompt tests and optimizations.',
    href: '/history',
    keywords: ['history', 'runs', 'tests', 'optimize'],
    icon: Clock3,
  },
  {
    id: 'settings',
    label: 'Settings',
    description: 'Manage keys, tokens, billing, and preferences.',
    href: '/settings',
    keywords: ['preferences', 'keys', 'billing', 'account'],
    icon: Settings,
  },
  {
    id: 'pricing',
    label: 'Pricing',
    description: 'Review plans, credits, and upgrade paths.',
    href: '/pricing',
    keywords: ['billing', 'plan', 'credits', 'upgrade'],
    icon: CreditCard,
  },
]

export function CommandPalette() {
  const router = useRouter()
  const pathname = usePathname()
  const { status } = useSession()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const deferredQuery = useDeferredValue(query)

  const items = useMemo(() => {
    return BASE_ITEMS.filter((item) => {
      if (
        status !== 'authenticated' &&
        ['/prompts', '/settings', '/history'].includes(item.href)
      ) {
        return false
      }

      return true
    })
  }, [status])

  const filteredItems = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase()

    if (!normalizedQuery) {
      return items
    }

    return items.filter((item) => {
      const haystack = [item.label, item.description, ...item.keywords]
        .join(' ')
        .toLowerCase()

      return haystack.includes(normalizedQuery)
    })
  }, [deferredQuery, items])

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)

    if (!nextOpen) {
      setQuery('')
    }
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTypingTarget =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        handleOpenChange(!open)
        return
      }

      if (!isTypingTarget && event.key === '/') {
        event.preventDefault()
        handleOpenChange(true)
      }
    }

    const onToggle = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail
      handleOpenChange(detail?.open ?? !open)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener(COMMAND_PALETTE_EVENT, onToggle as EventListener)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener(
        COMMAND_PALETTE_EVENT,
        onToggle as EventListener,
      )
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    const timer = window.setTimeout(() => {
      inputRef.current?.focus()
    }, 20)

    return () => window.clearTimeout(timer)
  }, [open])

  function handleSelect(href: string) {
    setOpen(false)
    startTransition(() => {
      router.push(href)
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="surface-raised w-full max-w-2xl gap-0 overflow-hidden border-0 p-0 shadow-[0_32px_120px_-40px_color-mix(in_oklch,var(--foreground)_45%,transparent)] sm:max-w-2xl"
        showCloseButton={false}
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Command palette</DialogTitle>
          <DialogDescription>
            Search pages and jump through the app.
          </DialogDescription>
        </DialogHeader>
        <div className="border-border/80 flex items-center gap-3 border-b px-4 py-3">
          <Search className="text-muted-foreground h-4 w-4" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pages, tools, and flows..."
            className="h-auto border-0 bg-transparent px-0 py-0 text-sm shadow-none focus-visible:ring-0"
          />
          <kbd className="border-border/80 bg-background/80 text-muted-foreground rounded-md border px-2 py-1 text-[11px]">
            esc
          </kbd>
        </div>
        <div className="max-h-[28rem] overflow-y-auto p-3">
          <div className="text-muted-foreground mb-3 flex items-center justify-between px-1 text-[11px] font-medium tracking-[0.18em] uppercase">
            <span>Jump to</span>
            <span>{filteredItems.length} results</span>
          </div>
          <div className="space-y-1.5">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => {
                const isActive = pathname === item.href

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.href)}
                    className={cn(
                      'group flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all',
                      isActive
                        ? 'border-primary/35 bg-primary/8'
                        : 'bg-surface-1/70 hover:border-border/80 hover:bg-surface-2 border-transparent',
                    )}
                  >
                    <div className="border-border/70 bg-background/85 flex h-10 w-10 items-center justify-center rounded-2xl border">
                      <item.icon className="text-primary h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-muted-foreground line-clamp-1 text-sm">
                        {item.description}
                      </p>
                    </div>
                    <ArrowRight className="text-muted-foreground h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                )
              })
            ) : (
              <div className="border-border/80 bg-surface-1/70 rounded-2xl border border-dashed px-4 py-10 text-center">
                <p className="text-sm font-medium">No matching results</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Try searching for builder, pricing, gallery, or settings.
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="border-border/80 text-muted-foreground flex items-center justify-between border-t px-4 py-3 text-xs">
          <p>
            Press{' '}
            <kbd className="border-border/80 rounded border px-1.5 py-0.5">
              /
            </kbd>{' '}
            anywhere to open.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCommandPaletteOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
