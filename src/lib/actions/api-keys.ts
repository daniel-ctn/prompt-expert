'use server'

import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { getDb } from '@/lib/db'
import { userApiKeys } from '@/lib/db/schema'
import { auth } from '@/lib/auth'
import { encrypt, decrypt } from '@/lib/crypto'

async function getAuthenticatedUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  return session.user.id
}

export async function saveApiKey(provider: string, key: string) {
  const userId = await getAuthenticatedUserId()
  const db = getDb()
  const encryptedKey = encrypt(key)

  const existing = await db
    .select()
    .from(userApiKeys)
    .where(
      and(eq(userApiKeys.userId, userId), eq(userApiKeys.provider, provider)),
    )
    .limit(1)

  if (existing.length > 0) {
    await db
      .update(userApiKeys)
      .set({ encryptedKey, updatedAt: new Date() })
      .where(
        and(eq(userApiKeys.userId, userId), eq(userApiKeys.provider, provider)),
      )
  } else {
    await db.insert(userApiKeys).values({ userId, provider, encryptedKey })
  }

  revalidatePath('/settings')
}

export async function deleteApiKey(provider: string) {
  const userId = await getAuthenticatedUserId()
  const db = getDb()

  await db
    .delete(userApiKeys)
    .where(
      and(eq(userApiKeys.userId, userId), eq(userApiKeys.provider, provider)),
    )

  revalidatePath('/settings')
}

export async function getUserApiKeyProviders(): Promise<string[]> {
  const userId = await getAuthenticatedUserId()
  const db = getDb()

  const keys = await db
    .select({ provider: userApiKeys.provider })
    .from(userApiKeys)
    .where(eq(userApiKeys.userId, userId))

  return keys.map((k) => k.provider)
}

export async function getUserApiKey(
  userId: string,
  provider: string,
): Promise<string | null> {
  const db = getDb()

  const result = await db
    .select({ encryptedKey: userApiKeys.encryptedKey })
    .from(userApiKeys)
    .where(
      and(eq(userApiKeys.userId, userId), eq(userApiKeys.provider, provider)),
    )
    .limit(1)

  if (result.length === 0) return null

  try {
    return decrypt(result[0].encryptedKey)
  } catch {
    return null
  }
}
