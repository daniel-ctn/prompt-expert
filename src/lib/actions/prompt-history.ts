"use server";

import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db";
import { promptHistory } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

export async function savePromptHistory(
  userId: string,
  data: {
    promptContent: string;
    output: string;
    model: string;
    endpoint: string;
  },
) {
  try {
    const db = getDb();
    await db.insert(promptHistory).values({ userId, ...data });
  } catch {
    // Non-blocking
  }
}

export async function getUserPromptHistory(limit = 50) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const db = getDb();
  return db
    .select({
      id: promptHistory.id,
      promptContent: promptHistory.promptContent,
      output: promptHistory.output,
      model: promptHistory.model,
      endpoint: promptHistory.endpoint,
      createdAt: promptHistory.createdAt,
    })
    .from(promptHistory)
    .where(eq(promptHistory.userId, session.user.id))
    .orderBy(desc(promptHistory.createdAt))
    .limit(limit);
}

export async function clearPromptHistory() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const db = getDb();
  await db
    .delete(promptHistory)
    .where(eq(promptHistory.userId, session.user.id));
}
