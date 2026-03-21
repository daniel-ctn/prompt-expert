'use server';

import { and, desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/db';
import { systemPrompts } from '@/lib/db/schema';
import { auth } from '@/lib/auth';

async function getAuthenticatedUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session.user.id;
}

export async function createSystemPrompt(name: string, content: string) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  const [created] = await db
    .insert(systemPrompts)
    .values({ userId, name, content })
    .returning();

  revalidatePath('/system-prompts');
  return created;
}

export async function getUserSystemPrompts() {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  return db
    .select()
    .from(systemPrompts)
    .where(eq(systemPrompts.userId, userId))
    .orderBy(desc(systemPrompts.updatedAt));
}

export async function updateSystemPrompt(
  id: string,
  data: { name?: string; content?: string },
) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  const [updated] = await db
    .update(systemPrompts)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(systemPrompts.id, id), eq(systemPrompts.userId, userId)))
    .returning();

  revalidatePath('/system-prompts');
  return updated;
}

export async function deleteSystemPrompt(id: string) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  await db
    .delete(systemPrompts)
    .where(and(eq(systemPrompts.id, id), eq(systemPrompts.userId, userId)));

  revalidatePath('/system-prompts');
}
