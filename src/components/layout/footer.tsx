import { Sparkles } from "lucide-react";
import { APP_NAME } from "@/config/constants";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4" />
          <span>{APP_NAME}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Build better prompts, get better results.
        </p>
      </div>
    </footer>
  );
}
