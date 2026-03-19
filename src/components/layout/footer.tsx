import Link from "next/link";
import { Sparkles } from "lucide-react";
import { APP_NAME } from "@/config/constants";

export function Footer() {
  return (
    <footer className="relative border-t border-border/50">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent" />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-linear-to-br from-[#0E7490] to-[#0D9488]">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span className="font-display text-sm font-medium">{APP_NAME}</span>
          </div>

          <nav className="flex items-center gap-6">
            <Link href="/builder" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Builder
            </Link>
            <Link href="/gallery" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Gallery
            </Link>
            <Link href="/chain" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Chain
            </Link>
            <Link href="/pricing" className="text-xs text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </Link>
          </nav>

          <p className="text-xs text-muted-foreground/70">
            Build better prompts, get better results.
          </p>
        </div>
      </div>
    </footer>
  );
}
