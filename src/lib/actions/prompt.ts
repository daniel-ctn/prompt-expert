"use server";

import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { revalidatePath, unstable_cache } from "next/cache";
import { getDb } from "@/lib/db";
import {
  prompts,
  promptVersions,
  promptEvents,
  users,
  favorites,
  collections,
  collectionPrompts,
} from "@/lib/db/schema";
import { trackPromptEvent } from "@/lib/track-event";
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

async function fetchPublicPrompts(
  search: string,
  category: string,
  page: number,
  pageSize: number,
) {
  const db = getDb();

  const conditions = [eq(prompts.isPublic, true)];

  if (search) {
    conditions.push(ilike(prompts.title, `%${search}%`));
  }

  if (category) {
    conditions.push(eq(prompts.category, category));
  }

  const offset = (page - 1) * pageSize;

  const [results, countResult] = await Promise.all([
    db
      .select({
        id: prompts.id,
        title: prompts.title,
        description: prompts.description,
        category: prompts.category,
        content: prompts.content,
        tags: prompts.tags,
        isPublic: prompts.isPublic,
        updatedAt: prompts.updatedAt,
        userId: prompts.userId,
        authorName: users.name,
        authorImage: users.image,
      })
      .from(prompts)
      .leftJoin(users, eq(prompts.userId, users.id))
      .where(and(...conditions))
      .orderBy(desc(prompts.updatedAt))
      .limit(pageSize)
      .offset(offset),
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

export async function getPublicPrompts({
  search = "",
  category = "",
  page = 1,
  pageSize = 12,
}: {
  search?: string;
  category?: string;
  page?: number;
  pageSize?: number;
} = {}) {
  const cached = unstable_cache(
    () => fetchPublicPrompts(search, category, page, pageSize),
    ["public-prompts", search, category, String(page)],
    { revalidate: 60 },
  );
  return cached();
}

export async function forkPrompt(id: string) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  const original = await db.query.prompts.findFirst({
    where: and(eq(prompts.id, id), eq(prompts.isPublic, true)),
  });

  if (!original) {
    throw new Error("Public prompt not found");
  }

  const [forked] = await db
    .insert(prompts)
    .values({
      userId,
      title: `${original.title} (fork)`,
      description: original.description,
      category: original.category,
      content: original.content,
      settings: original.settings,
      tags: original.tags,
      isPublic: false,
    })
    .returning();

  trackPromptEvent(id, "fork");
  revalidatePath("/prompts");
  return forked;
}

export async function getPublicPromptById(id: string) {
  const db = getDb();

  const results = await db
    .select({
      id: prompts.id,
      title: prompts.title,
      description: prompts.description,
      category: prompts.category,
      content: prompts.content,
      settings: prompts.settings,
      tags: prompts.tags,
      isPublic: prompts.isPublic,
      createdAt: prompts.createdAt,
      updatedAt: prompts.updatedAt,
      authorName: users.name,
      authorImage: users.image,
    })
    .from(prompts)
    .leftJoin(users, eq(prompts.userId, users.id))
    .where(and(eq(prompts.id, id), eq(prompts.isPublic, true)))
    .limit(1);

  return results[0] ?? null;
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

export async function toggleFavorite(promptId: string) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  const existing = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.promptId, promptId)))
    .limit(1);

  if (existing.length > 0) {
    await db
      .delete(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.promptId, promptId)),
      );
    return { favorited: false };
  }

  await db.insert(favorites).values({ userId, promptId });
  return { favorited: true };
}

export async function getUserFavoriteIds(): Promise<Set<string>> {
  const session = await auth();
  if (!session?.user?.id) return new Set();

  const db = getDb();
  const result = await db
    .select({ promptId: favorites.promptId })
    .from(favorites)
    .where(eq(favorites.userId, session.user.id));

  return new Set(result.map((r) => r.promptId));
}

export async function getFavoriteCount(promptId: string): Promise<number> {
  const db = getDb();
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(favorites)
    .where(eq(favorites.promptId, promptId));

  return Number(result[0].count);
}

export async function createCollection(name: string, description = "") {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  const [collection] = await db
    .insert(collections)
    .values({ userId, name, description })
    .returning();

  revalidatePath("/prompts");
  return collection;
}

export async function getUserCollections() {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  return db
    .select()
    .from(collections)
    .where(eq(collections.userId, userId))
    .orderBy(desc(collections.createdAt));
}

export async function addPromptToCollection(
  collectionId: string,
  promptId: string,
) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  const collection = await db.query.collections.findFirst({
    where: and(eq(collections.id, collectionId), eq(collections.userId, userId)),
  });
  if (!collection) throw new Error("Collection not found");

  await db
    .insert(collectionPrompts)
    .values({ collectionId, promptId })
    .onConflictDoNothing();

  revalidatePath("/prompts");
}

export async function removePromptFromCollection(
  collectionId: string,
  promptId: string,
) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  const collection = await db.query.collections.findFirst({
    where: and(eq(collections.id, collectionId), eq(collections.userId, userId)),
  });
  if (!collection) throw new Error("Collection not found");

  await db
    .delete(collectionPrompts)
    .where(
      and(
        eq(collectionPrompts.collectionId, collectionId),
        eq(collectionPrompts.promptId, promptId),
      ),
    );

  revalidatePath("/prompts");
}

export async function deleteCollection(id: string) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  await db
    .delete(collections)
    .where(and(eq(collections.id, id), eq(collections.userId, userId)));

  revalidatePath("/prompts");
}

export async function getPromptAnalytics(promptId: string) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  const prompt = await db.query.prompts.findFirst({
    where: and(eq(prompts.id, promptId), eq(prompts.userId, userId)),
  });
  if (!prompt) throw new Error("Prompt not found");

  const events = await db
    .select({
      event: promptEvents.event,
      count: sql<number>`count(*)`,
    })
    .from(promptEvents)
    .where(eq(promptEvents.promptId, promptId))
    .groupBy(promptEvents.event);

  const favoriteCount = await getFavoriteCount(promptId);

  const stats: Record<string, number> = {
    copy: 0,
    fork: 0,
    share: 0,
    test: 0,
    optimize: 0,
    favorites: favoriteCount,
  };

  for (const row of events) {
    stats[row.event] = Number(row.count);
  }

  return stats;
}
