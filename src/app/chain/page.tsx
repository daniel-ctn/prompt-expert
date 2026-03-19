import type { Metadata } from "next";
import dynamic from "next/dynamic";

const PromptChainBuilder = dynamic(
  () =>
    import("@/components/prompt-chain/chain-builder").then(
      (m) => m.PromptChainBuilder,
    ),
  { ssr: false },
);

export const metadata: Metadata = {
  title: "Prompt Chain",
  description:
    "Build multi-step prompt workflows where each step's output feeds into the next.",
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
