import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiKeyMocks = vi.hoisted(() => ({
  auth: vi.fn(),
  getDb: vi.fn(),
  revalidatePath: vi.fn(),
  encrypt: vi.fn(),
  decrypt: vi.fn(),
  and: vi.fn(),
  eq: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  auth: apiKeyMocks.auth,
}))

vi.mock('@/lib/db', () => ({
  getDb: apiKeyMocks.getDb,
}))

vi.mock('next/cache', () => ({
  revalidatePath: apiKeyMocks.revalidatePath,
}))

vi.mock('@/lib/crypto', () => ({
  encrypt: apiKeyMocks.encrypt,
  decrypt: apiKeyMocks.decrypt,
}))

vi.mock('drizzle-orm', () => ({
  and: apiKeyMocks.and,
  eq: apiKeyMocks.eq,
}))

vi.mock('@/lib/db/schema', () => ({
  userApiKeys: {
    userId: 'userApiKeys.userId',
    provider: 'userApiKeys.provider',
    encryptedKey: 'userApiKeys.encryptedKey',
  },
}))

import {
  deleteApiKey,
  getUserApiKey,
  getUserApiKeyProviders,
  saveApiKey,
} from '@/lib/actions/api-keys'

function createDbMock() {
  const insertValues = vi.fn().mockResolvedValue(undefined)
  const insert = vi.fn(() => ({ values: insertValues }))
  const updateWhere = vi.fn().mockResolvedValue(undefined)
  const updateSet = vi.fn(() => ({ where: updateWhere }))
  const update = vi.fn(() => ({ set: updateSet }))
  const deleteWhere = vi.fn().mockResolvedValue(undefined)
  const del = vi.fn(() => ({ where: deleteWhere }))
  const limit = vi.fn()
  const where = vi.fn()
  const from = vi.fn(() => ({ where }))
  const select = vi.fn(() => ({ from }))

  return {
    db: {
      select,
      insert,
      update,
      delete: del,
    },
    spies: {
      insert,
      insertValues,
      update,
      updateSet,
      updateWhere,
      del,
      deleteWhere,
      limit,
      where,
      from,
      select,
    },
  }
}

describe('api key actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    apiKeyMocks.auth.mockResolvedValue({ user: { id: 'user-1' } })
    apiKeyMocks.encrypt.mockReturnValue('encrypted-key')
    apiKeyMocks.decrypt.mockReturnValue('plain-key')
    apiKeyMocks.and.mockReturnValue('and-condition')
    apiKeyMocks.eq.mockReturnValue('eq-condition')
  })

  it('inserts a new encrypted key when the provider is not saved yet', async () => {
    const { db, spies } = createDbMock()
    spies.where.mockReturnValue({
      limit: spies.limit.mockResolvedValue([]),
    })
    apiKeyMocks.getDb.mockReturnValue(db)

    await saveApiKey('openai', 'sk-live')

    expect(apiKeyMocks.encrypt).toHaveBeenCalledWith('sk-live')
    expect(spies.insertValues).toHaveBeenCalledWith({
      userId: 'user-1',
      provider: 'openai',
      encryptedKey: 'encrypted-key',
    })
    expect(apiKeyMocks.revalidatePath).toHaveBeenCalledWith('/settings')
  })

  it('updates an existing encrypted key when the provider already exists', async () => {
    const { db, spies } = createDbMock()
    spies.where.mockReturnValue({
      limit: spies.limit.mockResolvedValue([{ id: 'key-1' }]),
    })
    apiKeyMocks.getDb.mockReturnValue(db)

    await saveApiKey('google', 'gk-live')

    expect(spies.update).toHaveBeenCalled()
    expect(spies.updateSet).toHaveBeenCalledWith({
      encryptedKey: 'encrypted-key',
      updatedAt: expect.any(Date),
    })
    expect(spies.insert).not.toHaveBeenCalled()
    expect(apiKeyMocks.revalidatePath).toHaveBeenCalledWith('/settings')
  })

  it('deletes a saved provider key and revalidates settings', async () => {
    const { db, spies } = createDbMock()
    apiKeyMocks.getDb.mockReturnValue(db)

    await deleteApiKey('anthropic')

    expect(spies.del).toHaveBeenCalled()
    expect(spies.deleteWhere).toHaveBeenCalledWith('and-condition')
    expect(apiKeyMocks.revalidatePath).toHaveBeenCalledWith('/settings')
  })

  it('returns the list of saved key providers for the current user', async () => {
    const { db, spies } = createDbMock()
    spies.where.mockResolvedValue([
      { provider: 'openai' },
      { provider: 'google' },
    ])
    apiKeyMocks.getDb.mockReturnValue(db)

    await expect(getUserApiKeyProviders()).resolves.toEqual([
      'openai',
      'google',
    ])
  })

  it('returns the decrypted key when one exists', async () => {
    const { db, spies } = createDbMock()
    spies.where.mockReturnValue({
      limit: spies.limit.mockResolvedValue([{ encryptedKey: 'ciphertext' }]),
    })
    apiKeyMocks.getDb.mockReturnValue(db)

    await expect(getUserApiKey('user-1', 'openai')).resolves.toBe('plain-key')
    expect(apiKeyMocks.decrypt).toHaveBeenCalledWith('ciphertext')
  })

  it('returns null when the key is missing or cannot be decrypted', async () => {
    const { db, spies } = createDbMock()
    spies.where.mockReturnValue({
      limit: spies.limit
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([{ encryptedKey: 'ciphertext' }]),
    })
    apiKeyMocks.getDb.mockReturnValue(db)
    apiKeyMocks.decrypt.mockImplementation(() => {
      throw new Error('bad payload')
    })

    await expect(getUserApiKey('user-1', 'openai')).resolves.toBeNull()
    await expect(getUserApiKey('user-1', 'google')).resolves.toBeNull()
  })
})
