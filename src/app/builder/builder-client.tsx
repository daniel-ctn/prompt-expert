'use client';

import dynamic from 'next/dynamic';

const PromptBuilder = dynamic(
  () => import('@/components/prompt-builder').then((m) => m.PromptBuilder),
  { ssr: false },
);

export function BuilderClient() {
  return <PromptBuilder />;
}
