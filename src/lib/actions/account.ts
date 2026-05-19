'use server'

import { eq } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import {
  apiTokens,
  promptHistory,
  prompts,
  userApiKeys,
  users,
} from '@/lib/db/schema'
import { auth } from '@/lib/auth'

async function getAuthenticatedUserId(): Promise<string> {
  const session = await auth()
  if (!session?.user?.id) throw new Error('Unauthorized')
  return session.user.id
}

function serializeDate(value: Date | null): string | null {
  return value ? value.toISOString() : null
}

export async function exportAccountData() {
  const userId = await getAuthenticatedUserId()
  const db = getDb()

  const [user, savedPrompts, history, tokens, providerKeys] = await Promise.all(
    [
      db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: {
          id: true,
          name: true,
          email: true,
          image: true,
          createdAt: true,
        },
      }),
      db.query.prompts.findMany({
        where: eq(prompts.userId, userId),
        columns: {
          id: true,
          title: true,
          description: true,
          category: true,
          content: true,
          settings: true,
          builderState: true,
          tags: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      db.query.promptHistory.findMany({
        where: eq(promptHistory.userId, userId),
        columns: {
          id: true,
          promptContent: true,
          output: true,
          model: true,
          endpoint: true,
          createdAt: true,
        },
      }),
      db.query.apiTokens.findMany({
        where: eq(apiTokens.userId, userId),
        columns: {
          id: true,
          name: true,
          lastUsedAt: true,
          createdAt: true,
        },
      }),
      db.query.userApiKeys.findMany({
        where: eq(userApiKeys.userId, userId),
        columns: {
          id: true,
          provider: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ],
  )

  return {
    exportedAt: new Date().toISOString(),
    account: user
      ? {
          ...user,
          createdAt: serializeDate(user.createdAt),
        }
      : null,
    prompts: savedPrompts.map((prompt) => ({
      ...prompt,
      createdAt: serializeDate(prompt.createdAt),
      updatedAt: serializeDate(prompt.updatedAt),
    })),
    publicPrompts: savedPrompts
      .filter((prompt) => prompt.isPublic)
      .map((prompt) => ({
        id: prompt.id,
        title: prompt.title,
        description: prompt.description,
        category: prompt.category,
        tags: prompt.tags,
        createdAt: serializeDate(prompt.createdAt),
        updatedAt: serializeDate(prompt.updatedAt),
      })),
    promptHistory: history.map((entry) => ({
      ...entry,
      createdAt: serializeDate(entry.createdAt),
    })),
    apiTokens: tokens.map((token) => ({
      ...token,
      lastUsedAt: serializeDate(token.lastUsedAt),
      createdAt: serializeDate(token.createdAt),
    })),
    providerKeys: providerKeys.map((key) => ({
      id: key.id,
      provider: key.provider,
      createdAt: serializeDate(key.createdAt),
      updatedAt: serializeDate(key.updatedAt),
    })),
  }
}

export async function deleteAccount() {
  const userId = await getAuthenticatedUserId()
  const db = getDb()

  await db.delete(users).where(eq(users.id, userId))
}
