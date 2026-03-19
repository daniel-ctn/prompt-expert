"use server";

import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { prompts, promptVersions } from "@/lib/db/schema";
import { auth } from "@/lib/auth";
import {
  createPromptSchema,
  updatePromptSchema,
} from "@/lib/validators/prompt";
import type {
  CreatePromptInput,
  UpdatePromptInput,
} from "@/lib/validators/prompt";

async function getAuthenticatedUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

export async function createPrompt(input: CreatePromptInput) {
  const userId = await getAuthenticatedUserId();
  const validated = createPromptSchema.parse(input);
  const db = getDb();

  const [prompt] = await db
    .insert(prompts)
    .values({
      ...validated,
      userId,
      settings: validated.settings,
    })
    .returning();

  await db.insert(promptVersions).values({
    promptId: prompt.id,
    content: validated.content,
    settings: validated.settings,
    versionNumber: 1,
  });

  revalidatePath("/prompts");
  return prompt;
}

export async function updatePrompt(input: UpdatePromptInput) {
  const userId = await getAuthenticatedUserId();
  const validated = updatePromptSchema.parse(input);
  const { id, ...data } = validated;
  const db = getDb();

  const existing = await db.query.prompts.findFirst({
    where: and(eq(prompts.id, id), eq(prompts.userId, userId)),
  });

  if (!existing) {
    throw new Error("Prompt not found");
  }

  const [updated] = await db
    .update(prompts)
    .set({ ...data, settings: data.settings, updatedAt: new Date() })
    .where(and(eq(prompts.id, id), eq(prompts.userId, userId)))
    .returning();

  if (data.content || data.settings) {
    const latestVersion = await db.query.promptVersions.findFirst({
      where: eq(promptVersions.promptId, id),
      orderBy: desc(promptVersions.versionNumber),
    });

    await db.insert(promptVersions).values({
      promptId: id,
      content: data.content ?? existing.content,
      settings: data.settings ?? existing.settings,
      versionNumber: (latestVersion?.versionNumber ?? 0) + 1,
    });
  }

  revalidatePath("/prompts");
  return updated;
}

export async function deletePrompt(id: string) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  await db
    .delete(prompts)
    .where(and(eq(prompts.id, id), eq(prompts.userId, userId)));

  revalidatePath("/prompts");
}

export async function duplicatePrompt(id: string) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  const original = await db.query.prompts.findFirst({
    where: and(eq(prompts.id, id), eq(prompts.userId, userId)),
  });

  if (!original) {
    throw new Error("Prompt not found");
  }

  const [duplicated] = await db
    .insert(prompts)
    .values({
      userId,
      title: `${original.title} (copy)`,
      description: original.description,
      category: original.category,
      content: original.content,
      settings: original.settings,
      tags: original.tags,
      isPublic: false,
    })
    .returning();

  revalidatePath("/prompts");
  return duplicated;
}

export async function getUserPrompts({
  search,
  category,
  tags,
  page = 1,
  pageSize = 12,
}: {
  search?: string;
  category?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
} = {}) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  const conditions = [eq(prompts.userId, userId)];

  if (search) {
    conditions.push(ilike(prompts.title, `%${search}%`));
  }

  if (category) {
    conditions.push(eq(prompts.category, category));
  }

  if (tags && tags.length > 0) {
    conditions.push(sql`${prompts.tags} && ${tags}::text[]`);
  }

  const offset = (page - 1) * pageSize;

  const [results, countResult] = await Promise.all([
    db.query.prompts.findMany({
      where: and(...conditions),
      orderBy: desc(prompts.updatedAt),
      limit: pageSize,
      offset,
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(prompts)
      .where(and(...conditions)),
  ]);

  return {
    prompts: results,
    total: Number(countResult[0].count),
    page,
    pageSize,
    totalPages: Math.ceil(Number(countResult[0].count) / pageSize),
  };
}

export async function getPromptById(id: string) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  return db.query.prompts.findFirst({
    where: and(eq(prompts.id, id), eq(prompts.userId, userId)),
  });
}

export async function getPromptVersions(promptId: string) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  const prompt = await db.query.prompts.findFirst({
    where: and(eq(prompts.id, promptId), eq(prompts.userId, userId)),
  });

  if (!prompt) {
    throw new Error("Prompt not found");
  }

  return db.query.promptVersions.findMany({
    where: eq(promptVersions.promptId, promptId),
    orderBy: desc(promptVersions.versionNumber),
  });
}
