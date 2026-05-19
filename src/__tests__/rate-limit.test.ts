import { beforeEach, describe, expect, it, vi } from 'vitest'

const rateLimitMocks = vi.hoisted(() => ({
  getDb: vi.fn(),
  sql: vi.fn((strings: TemplateStringsArray, ...values: unknown[]) => ({
    strings,
    values,
  })),
}))

vi.mock('@/lib/db', () => ({
  getDb: rateLimitMocks.getDb,
}))

vi.mock('drizzle-orm', () => ({
  sql: rateLimitMocks.sql,
}))

vi.mock('@/lib/db/schema', () => ({
  rateLimits: {
    key: 'rateLimits.key',
    count: 'rateLimits.count',
    resetAt: 'rateLimits.resetAt',
  },
}))

import { rateLimit } from '@/lib/rate-limit'

function createDbMock(returnedCounts: number[]) {
  const returning = vi.fn(async () => [{ count: returnedCounts.shift() ?? 1 }])
  const onConflictDoUpdate = vi.fn(() => ({ returning }))
  const values = vi.fn(() => ({ onConflictDoUpdate }))
  const insert = vi.fn(() => ({ values }))

  return {
    db: { insert },
    spies: {
      insert,
      values,
      onConflictDoUpdate,
      returning,
    },
  }
}

describe('rateLimit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('allows requests under the limit', async () => {
    const { db } = createDbMock([1])
    rateLimitMocks.getDb.mockReturnValue(db)

    const result = await rateLimit({
      key: 'user-1',
      limit: 3,
      windowMs: 10_000,
    })

    expect(result).toEqual({ success: true, remaining: 2 })
  })

  it('blocks requests over the limit', async () => {
    const { db } = createDbMock([4])
    rateLimitMocks.getDb.mockReturnValue(db)

    const result = await rateLimit({
      key: 'user-block',
      limit: 3,
      windowMs: 10_000,
    })

    expect(result).toEqual({ success: false, remaining: 0 })
  })

  it('tracks different keys through durable upserts', async () => {
    const { db, spies } = createDbMock([1, 1])
    rateLimitMocks.getDb.mockReturnValue(db)

    await rateLimit({ key: 'a', limit: 1, windowMs: 10_000 })
    await rateLimit({ key: 'b', limit: 1, windowMs: 10_000 })

    expect(spies.values).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ key: 'a', count: 1 }),
    )
    expect(spies.values).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ key: 'b', count: 1 }),
    )
  })

  it('uses a Postgres conflict update for atomic increments and window resets', async () => {
    const { db, spies } = createDbMock([2])
    rateLimitMocks.getDb.mockReturnValue(db)

    await rateLimit({ key: 'atomic', limit: 3, windowMs: 10_000 })

    expect(spies.onConflictDoUpdate).toHaveBeenCalledWith({
      target: 'rateLimits.key',
      set: {
        count: expect.any(Object),
        resetAt: expect.any(Object),
        updatedAt: expect.any(Date),
      },
    })
    expect(spies.returning).toHaveBeenCalledWith({
      count: 'rateLimits.count',
    })
  })
})
