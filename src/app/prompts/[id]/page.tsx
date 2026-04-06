import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPromptById, getPromptVersions } from '@/lib/actions/prompt'
import { PromptDetail } from '@/components/prompts/prompt-detail'

export const metadata: Metadata = {
  title: 'Edit Prompt',
  description: 'Edit your prompt content, settings, tags, and version history.',
}

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const prompt = await getPromptById(id)
  if (!prompt) {
    notFound()
  }

  const versions = await getPromptVersions(id)

  return (
    <div className="page-shell-narrow">
      <PromptDetail prompt={prompt} versions={versions} />
    </div>
  )
}
