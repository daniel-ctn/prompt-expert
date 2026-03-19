import type { Metadata } from "next";
import { PromptChainBuilder } from "@/components/prompt-chain/chain-builder";

export const metadata: Metadata = {
  title: "Prompt Chain - Prompt Expert",
  description: "Build multi-step prompt workflows where outputs feed into the next step.",
};

export default function ChainPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Prompt Chain</h1>
        <p className="mt-1 text-muted-foreground">
          Build multi-step workflows where each prompt&apos;s output feeds into
          the next.
        </p>
      </div>
      <PromptChainBuilder />
    </div>
  );
}
