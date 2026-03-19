"use client";

import dynamic from "next/dynamic";

const PromptChainBuilder = dynamic(
  () =>
    import("@/components/prompt-chain/chain-builder").then(
      (m) => m.PromptChainBuilder,
    ),
  { ssr: false },
);

export function ChainClient() {
  return <PromptChainBuilder />;
}
