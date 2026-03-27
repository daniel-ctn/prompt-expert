'use client';

import dynamic from 'next/dynamic';
import type { SavedPromptPreset } from '@/types';

const PromptBuilder = dynamic(
  () => import('@/components/prompt-builder').then((m) => m.PromptBuilder),
  { ssr: false },
);

export function BuilderClient({
  savedPresets,
}: {
  savedPresets: SavedPromptPreset[];
}) {
  return <PromptBuilder savedPresets={savedPresets} />;
}
