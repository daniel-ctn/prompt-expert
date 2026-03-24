'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import {
  Sparkles,
  LogOut,
  LayoutDashboard,
  Menu,
  FileText,
  Settings,
  History,
  Moon,
  Sun,
  Coins,
  CreditCard,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { APP_NAME } from '@/config/constants';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/builder', label: 'Builder' },
  { href: '/chain', label: 'Chain' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/prompts', label: 'My Prompts' },
  { href: '/pricing', label: 'Pricing' },
];

function NavLinks({
  className,
  mobile,
}: {
  className?: string;
  mobile?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'text-sm font-medium transition-colors',
              mobile ? 'rounded-lg px-3 py-2' : 'relative px-1 py-0.5',
              isActive
                ? 'text-foreground'
                : 'text-muted-foreground hover:text-foreground',
              mobile && isActive && 'bg-primary/10 text-primary',
            )}
          >
            {item.label}
            {!mobile && isActive && (
              <span className="bg-foreground absolute right-0 -bottom-3.5 left-0 h-0.5 rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground h-8 w-8"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
    >
      <Sun className="h-4 w-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
      <Moon className="absolute h-4 w-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function CreditsBadge() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/credits')
      .then((r) => r.json())
      .then((data) => setCredits(data.total))
      .catch(() => {});
  }, []);

  if (credits === null) return <span>...</span>;
  return <span>{credits} credits</span>;
}

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="border-border/50 bg-background/80 sticky top-0 z-50 w-full border-b backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6">
        <Link href="/" className="group mr-8 flex items-center gap-2.5">
          <div className="bg-primary group-hover:glow-sm flex h-7 w-7 items-center justify-center rounded-lg shadow-sm transition-shadow">
            <Sparkles className="text-primary-foreground h-3.5 w-3.5" />
          </div>
          <span className="font-display text-base font-semibold tracking-tight">
            {APP_NAME}
          </span>
        </Link>

        <NavLinks className="hidden items-center gap-5 md:flex" />

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {status === 'loading' ? (
            <div className="bg-muted h-8 w-8 animate-pulse rounded-full" />
          ) : session?.user ? (
            <Link
              href="/pricing"
              className="border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground hidden items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors sm:flex"
            >
              <Coins className="h-3.5 w-3.5" />
              <CreditsBadge />
            </Link>
          ) : null}
          {status === 'loading' ? null : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  />
                }
              >
                <Avatar className="ring-border h-8 w-8 ring-2">
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
                <DropdownMenuItem render={<Link href="/prompts" />}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  My Prompts
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/system-prompts" />}>
                  <FileText className="mr-2 h-4 w-4" />
                  System Prompts
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/history" />}>
                  <History className="mr-2 h-4 w-4" />
                  History
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/settings" />}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/pricing" />}>
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
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4"
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
                  className="h-8 w-8 md:hidden"
                />
              }
            >
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <NavLinks className="mt-8 flex flex-col gap-1" mobile />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
