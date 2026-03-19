"use server";

import { randomBytes, createHash } from "crypto";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/db";
import { apiTokens } from "@/lib/db/schema";
import { auth } from "@/lib/auth";

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function getAuthenticatedUserId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createApiToken(name: string) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  const raw = `pe_${randomBytes(32).toString("hex")}`;
  const tokenHash = hashToken(raw);

  await db.insert(apiTokens).values({ userId, name, tokenHash });

  revalidatePath("/settings");
  return raw;
}

export async function getUserApiTokens() {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  return db
    .select({
      id: apiTokens.id,
      name: apiTokens.name,
      lastUsedAt: apiTokens.lastUsedAt,
      createdAt: apiTokens.createdAt,
    })
    .from(apiTokens)
    .where(eq(apiTokens.userId, userId));
}

export async function deleteApiToken(id: string) {
  const userId = await getAuthenticatedUserId();
  const db = getDb();

  await db
    .delete(apiTokens)
    .where(and(eq(apiTokens.id, id), eq(apiTokens.userId, userId)));

  revalidatePath("/settings");
}

export async function validateApiToken(
  token: string,
): Promise<string | null> {
  const db = getDb();
  const tokenHash = hashToken(token);

  const result = await db
    .select({ userId: apiTokens.userId, id: apiTokens.id })
    .from(apiTokens)
    .where(eq(apiTokens.tokenHash, tokenHash))
    .limit(1);

  if (result.length === 0) return null;

  db.update(apiTokens)
    .set({ lastUsedAt: new Date() })
    .where(eq(apiTokens.id, result[0].id))
    .then(() => {});

  return result[0].userId;
}
