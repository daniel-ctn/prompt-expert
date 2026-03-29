import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiTokenMocks = vi.hoisted(() => ({
  randomBytes: vi.fn(),
  createHash: vi.fn(),
  auth: vi.fn(),
  getDb: vi.fn(),
  revalidatePath: vi.fn(),
  and: vi.fn(),
  eq: vi.fn(),
}))

vi.mock('crypto', async (importOriginal) => {
  const actual = await importOriginal<typeof import('crypto')>()

  return {
    ...actual,
    randomBytes: apiTokenMocks.randomBytes,
    createHash: apiTokenMocks.createHash,
  }
})

vi.mock('@/lib/auth', () => ({
  auth: apiTokenMocks.auth,
}))

vi.mock('@/lib/db', () => ({
  getDb: apiTokenMocks.getDb,
}))

vi.mock('next/cache', () => ({
  revalidatePath: apiTokenMocks.revalidatePath,
}))

vi.mock('drizzle-orm', () => ({
  and: apiTokenMocks.and,
  eq: apiTokenMocks.eq,
}))

vi.mock('@/lib/db/schema', () => ({
  apiTokens: {
    id: 'apiTokens.id',
    name: 'apiTokens.name',
    lastUsedAt: 'apiTokens.lastUsedAt',
    createdAt: 'apiTokens.createdAt',
    userId: 'apiTokens.userId',
    tokenHash: 'apiTokens.tokenHash',
  },
}))

import {
  createApiToken,
  deleteApiToken,
  getUserApiTokens,
  validateApiToken,
} from '@/lib/actions/api-tokens'

function createDbMock() {
  const insertValues = vi.fn().mockResolvedValue(undefined)
  const insert = vi.fn(() => ({ values: insertValues }))
  const deleteWhere = vi.fn().mockResolvedValue(undefined)
  const del = vi.fn(() => ({ where: deleteWhere }))
  const updateWhere = vi.fn().mockResolvedValue(undefined)
  const updateSet = vi.fn(() => ({ where: updateWhere }))
  const update = vi.fn(() => ({ set: updateSet }))
  const limit = vi.fn()
  const where = vi.fn()
  const from = vi.fn(() => ({ where }))
  const select = vi.fn(() => ({ from }))

  return {
    db: {
      insert,
      delete: del,
      update,
      select,
    },
    spies: {
      insert,
      insertValues,
      del,
      deleteWhere,
      update,
      updateSet,
      updateWhere,
      limit,
      where,
      from,
      select,
    },
  }
}

describe('api token actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiTokenMocks.auth.mockResolvedValue({ user: { id: 'user-1' } })
    apiTokenMocks.randomBytes.mockReturnValue(Buffer.from('abcd'))
    apiTokenMocks.createHash.mockReturnValue({
      update: vi.fn().mockReturnValue({
        digest: vi.fn().mockReturnValue('hashed-token'),
      }),
    })
    apiTokenMocks.and.mockReturnValue('and-condition')
    apiTokenMocks.eq.mockReturnValue('eq-condition')
  })

  it('creates an API token, stores its hash, and returns the raw token', async () => {
    const { db, spies } = createDbMock()
    apiTokenMocks.getDb.mockReturnValue(db)

    const token = await createApiToken('CLI access')

    expect(token).toMatch(/^pe_[a-f0-9]{64}$/)
    expect(spies.insertValues).toHaveBeenCalledWith({
      userId: 'user-1',
      name: 'CLI access',
      tokenHash: expect.stringMatching(/^[a-f0-9]{64}$/),
    })
    expect(apiTokenMocks.revalidatePath).toHaveBeenCalledWith('/settings')
  })

  it('returns the current user API tokens', async () => {
    const { db, spies } = createDbMock()
    spies.where.mockResolvedValue([
      {
        id: 'token-1',
        name: 'CLI access',
        lastUsedAt: null,
        createdAt: new Date('2026-03-01T00:00:00.000Z'),
      },
    ])
    apiTokenMocks.getDb.mockReturnValue(db)

    await expect(getUserApiTokens()).resolves.toEqual([
      {
        id: 'token-1',
        name: 'CLI access',
        lastUsedAt: null,
        createdAt: new Date('2026-03-01T00:00:00.000Z'),
      },
    ])
  })

  it('deletes an API token and revalidates settings', async () => {
    const { db, spies } = createDbMock()
    apiTokenMocks.getDb.mockReturnValue(db)

    await deleteApiToken('token-1')

    expect(spies.del).toHaveBeenCalled()
    expect(spies.deleteWhere).toHaveBeenCalledWith('and-condition')
    expect(apiTokenMocks.revalidatePath).toHaveBeenCalledWith('/settings')
  })

  it('returns null when an API token does not exist', async () => {
    const { db, spies } = createDbMock()
    spies.where.mockReturnValue({
      limit: spies.limit.mockResolvedValue([]),
    })
    apiTokenMocks.getDb.mockReturnValue(db)

    await expect(validateApiToken('pe_missing')).resolves.toBeNull()
    expect(spies.update).not.toHaveBeenCalled()
  })

  it('returns the user id and records last-used time for a valid token', async () => {
    const { db, spies } = createDbMock()
    spies.where.mockReturnValue({
      limit: spies.limit.mockResolvedValue([
        { userId: 'user-1', id: 'token-1' },
      ]),
    })
    apiTokenMocks.getDb.mockReturnValue(db)

    await expect(validateApiToken('pe_valid')).resolves.toBe('user-1')
    expect(spies.update).toHaveBeenCalled()
    expect(spies.updateSet).toHaveBeenCalledWith({
      lastUsedAt: expect.any(Date),
    })
  })
})
