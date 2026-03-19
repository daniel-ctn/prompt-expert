import type { Metadata } from "next";
import { BuilderClient } from "./builder-client";

export const metadata: Metadata = {
  title: "Prompt Builder",
  description:
    "Build and optimize AI prompts with fine-tuned controls for model, tone, format, and constraints.",
};

export default function BuilderPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold tracking-tight">Prompt Builder</h1>
        <p className="mt-1 text-muted-foreground">
          Configure your prompt parameters and see the result in real-time.
        </p>
      </div>
      <BuilderClient />
    </div>
  );
}
