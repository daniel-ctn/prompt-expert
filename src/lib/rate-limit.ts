import { sql } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { rateLimits } from '@/lib/db/schema'

export async function rateLimit({
  key,
  limit = 20,
  windowMs = 60_000,
}: {
  key: string
  limit?: number
  windowMs?: number
}): Promise<{ success: boolean; remaining: number }> {
  const db = getDb()
  const now = Date.now()
  const resetAt = new Date(now + windowMs)

  const [entry] = await db
    .insert(rateLimits)
    .values({
      key,
      count: 1,
      resetAt,
      updatedAt: new Date(now),
    })
    .onConflictDoUpdate({
      target: rateLimits.key,
      set: {
        count: sql<number>`case when ${rateLimits.resetAt} < ${new Date(now)} then 1 else ${rateLimits.count} + 1 end`,
        resetAt: sql<Date>`case when ${rateLimits.resetAt} < ${new Date(now)} then ${resetAt} else ${rateLimits.resetAt} end`,
        updatedAt: new Date(now),
      },
    })
    .returning({
      count: rateLimits.count,
    })

  const count = entry?.count ?? limit + 1
  return {
    success: count <= limit,
    remaining: Math.max(limit - count, 0),
  }
}
