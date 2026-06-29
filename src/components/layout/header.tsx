'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import {
  Coins,
  Command,
  FileText,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Search,
  Settings,
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
import { LogoMark } from '@/components/layout/logo-mark'
import { APP_NAME } from '@/config/constants'
import { setCommandPaletteOpen } from '@/lib/command-palette'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/builder', label: 'Builder' },
  { href: '/chain', label: 'Chain' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/prompts', label: 'My Prompts' },
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
              'group/nav relative font-mono text-[11px] font-medium tracking-[0.2em] uppercase transition-colors',
              mobile
                ? 'border-foreground/85 bg-background rounded-sm border px-3 py-3 shadow-[var(--shadow-paper-sm)]'
                : 'px-3 py-2',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {!mobile && isActive ? (
              <motion.span
                layoutId="active-nav-pill"
                className="border-foreground absolute inset-0 -z-10 border bg-[color-mix(in_oklch,var(--marigold)_22%,var(--background))]"
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
      className="text-muted-foreground hover:text-foreground h-9 w-9 rounded-sm"
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

  if (credits === null) return <span className="nums">···</span>
  return <span className="nums">{credits}</span>
}

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="sticky top-0 z-50 w-full px-3 pt-3 sm:px-4">
      <div className="border-foreground bg-card mx-auto flex h-16 max-w-7xl items-center justify-between border px-3 shadow-[var(--shadow-paper-sm)] sm:px-4">
        <AppLink href="/" className="group flex items-center gap-3">
          <LogoMark
            animated
            className="h-10 w-10 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:rotate-[-3deg]"
          />
          <div className="space-y-0.5">
            <span className="font-display block text-base font-medium tracking-tight">
              {APP_NAME}
            </span>
            <span className="text-muted-foreground hidden font-mono text-[10px] tracking-[0.18em] uppercase sm:block">
              Prompt workflows · v2
            </span>
          </div>
        </AppLink>

        <NavLinks className="hidden items-center gap-1 md:flex" />

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCommandPaletteOpen(true)}
            className="text-muted-foreground hidden min-w-[11rem] justify-between rounded-sm md:flex"
          >
            <span className="inline-flex items-center gap-2">
              <Search className="h-3.5 w-3.5" />
              Search
            </span>
            <span className="border-foreground/70 bg-background inline-flex items-center gap-1 border px-1.5 py-0.5 font-mono text-[10px]">
              <Command className="h-2.5 w-2.5" />K
            </span>
          </Button>

          <ThemeToggle />

          {status === 'loading' ? (
            <div className="bg-muted h-9 w-9 animate-pulse rounded-sm" />
          ) : session?.user ? (
            <div className="border-foreground/85 bg-background text-muted-foreground hidden items-center gap-2 border px-2 py-1.5 sm:flex">
              <Coins className="text-foreground/70 h-3.5 w-3.5" />
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase">
                Credits
              </span>
              <span className="text-foreground font-mono text-xs">
                <CreditsBadge />
              </span>
            </div>
          ) : null}
          {status === 'loading' ? null : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="hover:border-foreground/85 relative h-9 w-9 rounded-sm border border-transparent"
                  />
                }
              >
                <Avatar className="border-foreground/85 h-9 w-9 border">
                  <AvatarImage
                    src={session.user.image ?? ''}
                    alt={session.user.name ?? ''}
                  />
                  <AvatarFallback className="text-foreground font-display bg-[color-mix(in_oklch,var(--marigold)_24%,var(--background))] text-xs font-medium">
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => signIn()}
              className="rounded-sm px-4"
            >
              Sign in
            </Button>
          )}

          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-sm md:hidden"
                />
              }
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-foreground bg-card w-[min(24rem,100vw)] border-l px-4"
            >
              <div className="mt-8 space-y-6">
                <div className="space-y-1">
                  <p className="text-muted-foreground font-mono text-[10px] tracking-[0.24em] uppercase">
                    Menu
                  </p>
                  <p className="font-display text-2xl font-medium tracking-tight">
                    {APP_NAME}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    Navigate builders, prompts, and account tools.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-between rounded-sm"
                  onClick={() => setCommandPaletteOpen(true)}
                >
                  <span className="inline-flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Command palette
                  </span>
                  <span className="border-foreground/70 rounded-sm border px-2 py-0.5 font-mono text-[10px]">
                    /
                  </span>
                </Button>
                <NavLinks className="flex flex-col gap-2" mobile />
                {session?.user ? (
                  <div className="border-foreground/85 bg-background flex items-center gap-3 border px-3 py-3 text-sm">
                    <span className="border-foreground flex h-9 w-9 items-center justify-center border bg-[color-mix(in_oklch,var(--marigold)_24%,var(--background))]">
                      <Coins className="h-4 w-4" />
                    </span>
                    <span className="inline-flex flex-col">
                      <span className="text-muted-foreground font-mono text-[10px] tracking-[0.18em] uppercase">
                        Credits
                      </span>
                      <span className="text-foreground font-medium">
                        <CreditsBadge />
                      </span>
                    </span>
                  </div>
                ) : null}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
