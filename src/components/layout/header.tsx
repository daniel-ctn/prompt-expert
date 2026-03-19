"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Sparkles, LogOut, LayoutDashboard, Menu, FileText, Settings, History } from "lucide-react";
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

function NavLinks({ className }: { className?: string }) {
  return (
    <nav className={className}>
      <Link
        href="/builder"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Builder
      </Link>
      <Link
        href="/chain"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Chain
      </Link>
      <Link
        href="/gallery"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        Gallery
      </Link>
      <Link
        href="/prompts"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        My Prompts
      </Link>
    </nav>
  );
}

export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-4 sm:px-6">
        <Link href="/" className="mr-6 flex items-center gap-2 font-semibold">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>{APP_NAME}</span>
        </Link>

        <NavLinks className="hidden items-center gap-6 md:flex" />

        <div className="ml-auto flex items-center gap-3">
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
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={session.user.image ?? ""}
                    alt={session.user.name ?? ""}
                  />
                  <AvatarFallback>
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
            <Button size="sm" onClick={() => signIn()}>
              Sign in
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={<Button variant="ghost" size="icon" className="md:hidden" />}
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <NavLinks className="mt-8 flex flex-col gap-4" />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
