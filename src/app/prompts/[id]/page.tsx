import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getPromptById, getPromptVersions } from "@/lib/actions/prompt";
import { PromptDetail } from "@/components/prompts/prompt-detail";

export const metadata: Metadata = {
  title: "Edit Prompt - Prompt Expert",
};

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const prompt = await getPromptById(id);
  if (!prompt) {
    notFound();
  }

  const versions = await getPromptVersions(id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PromptDetail prompt={prompt} versions={versions} />
    </div>
  );
}
