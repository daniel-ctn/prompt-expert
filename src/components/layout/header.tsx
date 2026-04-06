'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import {
  Coins,
  Command,
  CreditCard,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
  Sparkles,
  Sun,
} from 'lucide-react'
import { motion } from 'motion/react'
import { AppLink } from '@/components/ui/app-link'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { APP_NAME } from '@/config/constants'
import { setCommandPaletteOpen } from '@/lib/command-palette'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/builder', label: 'Builder' },
  { href: '/chain', label: 'Chain' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/prompts', label: 'My Prompts' },
  { href: '/pricing', label: 'Pricing' },
]

function NavLinks({
  className,
  mobile,
}: {
  className?: string
  mobile?: boolean
}) {
  const pathname = usePathname()

  return (
    <nav className={className}>
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <AppLink
            key={item.href}
            href={item.href}
            className={cn(
              'group/nav relative text-sm font-medium transition-colors',
              mobile
                ? 'rounded-2xl border border-transparent px-3 py-3'
                : 'rounded-full px-3 py-2',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
              mobile &&
                isActive &&
                'border-primary/25 bg-primary/8 text-foreground',
            )}
          >
            {!mobile && isActive ? (
              <motion.span
                layoutId="active-nav-pill"
                className="border-primary/20 bg-primary/8 absolute inset-0 -z-10 rounded-full border"
                transition={{ type: 'spring', stiffness: 340, damping: 32 }}
              />
            ) : null}
            {item.label}
          </AppLink>
        )
      })}
    </nav>
  )
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground h-9 w-9 rounded-full"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-4 w-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}

function CreditsBadge() {
  const [credits, setCredits] = useState<number | null>(null)

  const fetchCredits = useCallback(() => {
    fetch('/api/credits')
      .then((r) => r.json())
      .then((data) => setCredits(data.total))
      .catch(() => {})
  }, [])

  useEffect(() => {
    fetchCredits()

    const handler = () => fetchCredits()
    window.addEventListener('credits:updated', handler)
    return () => window.removeEventListener('credits:updated', handler)
  }, [fetchCredits])

  if (credits === null) return <span>...</span>
  return <span>{credits} credits</span>
}

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-4">
      <div className="surface-raised mx-auto flex h-16 max-w-7xl items-center justify-between rounded-[calc(var(--radius-3xl)+2px)] px-3 sm:px-4">
        <AppLink href="/" className="group flex items-center gap-3">
          <div className="bg-primary/92 shadow-soft border-primary/20 flex h-9 w-9 items-center justify-center rounded-2xl border text-white transition-transform group-hover:-translate-y-0.5">
            <Sparkles className="h-3.5 w-3.5 text-white" />
          </div>
          <div className="space-y-0.5">
            <span className="font-display block text-base font-semibold tracking-tight">
              {APP_NAME}
            </span>
            <span className="text-muted-foreground hidden text-[11px] sm:block">
              Prompt workflows with sharper control
            </span>
          </div>
        </AppLink>

        <NavLinks className="bg-surface-1/75 hidden items-center gap-1.5 rounded-full p-1 md:flex" />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCommandPaletteOpen(true)}
            className="border-border/70 bg-surface-1/80 text-muted-foreground hidden min-w-[11rem] justify-between rounded-full px-3 md:flex"
          >
            <span className="inline-flex items-center gap-2">
              <Search className="h-3.5 w-3.5" />
              Search
            </span>
            <span className="border-border/70 bg-background/85 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px]">
              <Command className="h-3 w-3" />K
            </span>
          </Button>

          <ThemeToggle />

          {status === 'loading' ? (
            <div className="bg-muted h-9 w-9 animate-pulse rounded-full" />
          ) : session?.user ? (
            <AppLink
              href="/pricing"
              className="border-border/70 bg-surface-1/80 text-muted-foreground hover:border-primary/35 hover:text-foreground hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:flex"
            >
              <span className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full">
                <Coins className="h-3.5 w-3.5" />
              </span>
              <span className="inline-flex flex-col">
                <span className="text-[10px] tracking-[0.18em] uppercase">
                  Credits
                </span>
                <span className="text-foreground text-xs">
                  <CreditsBadge />
                </span>
              </span>
            </AppLink>
          ) : null}
          {status === 'loading' ? null : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  />
                }
              >
                <Avatar className="ring-border h-9 w-9 ring-2">
                  <AvatarImage
                    src={session.user.image ?? ''}
                    alt={session.user.name ?? ''}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                    {session.user.name?.charAt(0).toUpperCase() ?? 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-muted-foreground text-xs">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<AppLink href="/prompts" />}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  My Prompts
                </DropdownMenuItem>
                <DropdownMenuItem render={<AppLink href="/system-prompts" />}>
                  <FileText className="mr-2 h-4 w-4" />
                  System Prompts
                </DropdownMenuItem>
                <DropdownMenuItem render={<AppLink href="/history" />}>
                  <History className="mr-2 h-4 w-4" />
                  History
                </DropdownMenuItem>
                <DropdownMenuItem render={<AppLink href="/settings" />}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem render={<AppLink href="/pricing" />}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Pricing & Credits
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => signIn()}
              className="border-primary/35 bg-primary/8 text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-4"
            >
              Sign in
            </Button>
          )}

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full md:hidden"
                />
              }
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-border/80 bg-background/96 w-[min(24rem,100vw)] border-l px-4"
            >
              <div className="mt-8 space-y-6">
                <div className="space-y-1">
                  <p className="font-display text-lg font-semibold">
                    {APP_NAME}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Navigate builders, prompts, and account tools quickly.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-between rounded-full"
                  onClick={() => setCommandPaletteOpen(true)}
                >
                  <span className="inline-flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Open command palette
                  </span>
                  <span className="border-border/70 rounded-full border px-2 py-0.5 text-[11px]">
                    /
                  </span>
                </Button>
                <NavLinks className="flex flex-col gap-2" mobile />
                {session?.user ? (
                  <AppLink
                    href="/pricing"
                    className="border-border/80 bg-surface-1 flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm"
                  >
                    <span className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-2xl">
                      <Coins className="h-4 w-4" />
                    </span>
                    <span className="inline-flex flex-col">
                      <span className="text-muted-foreground text-[11px] tracking-[0.18em] uppercase">
                        Credits
                      </span>
                      <span className="text-foreground font-medium">
                        <CreditsBadge />
                      </span>
                    </span>
                  </AppLink>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
