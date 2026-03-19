"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { APP_NAME } from "@/config/constants";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/builder", label: "Builder" },
  { href: "/chain", label: "Chain" },
  { href: "/gallery", label: "Gallery" },
  { href: "/prompts", label: "My Prompts" },
];

function NavLinks({ className, mobile }: { className?: string; mobile?: boolean }) {
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
              "text-sm font-medium transition-colors",
              mobile
                ? "rounded-lg px-3 py-2"
                : "relative px-1 py-0.5",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
              mobile && isActive && "bg-primary/10 text-primary",
            )}
          >
            {item.label}
            {!mobile && isActive && (
              <span className="absolute -bottom-3.5 left-0 right-0 h-0.5 rounded-full bg-primary" />
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
      className="h-8 w-8 text-muted-foreground"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-transform dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6">
        <Link href="/" className="group mr-8 flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-primary to-primary/70 shadow-sm transition-shadow group-hover:glow-sm">
            <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
          <span className="font-display text-base font-semibold tracking-tight">
            {APP_NAME}
          </span>
        </Link>

        <NavLinks className="hidden items-center gap-5 md:flex" />

        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />

          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  />
                }
              >
                <Avatar className="h-8 w-8 ring-2 ring-border">
                  <AvatarImage
                    src={session.user.image ?? ""}
                    alt={session.user.name ?? ""}
                  />
                  <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                    {session.user.name?.charAt(0).toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{session.user.name}</p>
                    <p className="text-xs text-muted-foreground">
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              size="sm"
              onClick={() => signIn()}
              className="bg-primary px-4 shadow-sm"
            >
              Sign in
            </Button>
          )}

          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" />}
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
