import { beforeEach, describe, expect, it, vi } from 'vitest'

const apiRouteMocks = vi.hoisted(() => ({
  auth: vi.fn(),
  getUserCredits: vi.fn(),
  validateApiToken: vi.fn(),
  getDb: vi.fn(),
  eq: vi.fn(),
  desc: vi.fn(),
}))

vi.mock('@/lib/auth', () => ({
  auth: apiRouteMocks.auth,
}))

vi.mock('@/lib/credits', () => ({
  getUserCredits: apiRouteMocks.getUserCredits,
}))

vi.mock('@/lib/actions/api-tokens', () => ({
  validateApiToken: apiRouteMocks.validateApiToken,
}))

vi.mock('@/lib/db', () => ({
  getDb: apiRouteMocks.getDb,
}))

vi.mock('drizzle-orm', () => ({
  eq: apiRouteMocks.eq,
  desc: apiRouteMocks.desc,
}))

vi.mock('@/lib/db/schema', () => ({
  prompts: {
    id: 'id',
    title: 'title',
    description: 'description',
    category: 'category',
    content: 'content',
    tags: 'tags',
    isPublic: 'isPublic',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    userId: 'userId',
  },
}))

import { GET as getCreditsRoute } from '@/app/api/credits/route'
import { GET as getPromptsRoute } from '@/app/api/v1/prompts/route'

describe('API route handlers', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    apiRouteMocks.auth.mockResolvedValue({ user: { id: 'user-1' } })
    apiRouteMocks.getUserCredits.mockResolvedValue({
      monthly: 10,
      bonus: 2,
      total: 12,
      plan: 'pro',
    })
    apiRouteMocks.validateApiToken.mockResolvedValue('user-1')
    apiRouteMocks.eq.mockReturnValue('eq-condition')
    apiRouteMocks.desc.mockReturnValue('desc-condition')
  })

  describe('credits route', () => {
    it('returns 401 when the user is not authenticated', async () => {
      apiRouteMocks.auth.mockResolvedValue(null)

      const response = await getCreditsRoute()

      expect(response.status).toBe(401)
      expect(await response.json()).toEqual({ error: 'Unauthorized' })
      expect(apiRouteMocks.getUserCredits).not.toHaveBeenCalled()
    })

    it('returns the current credit balance for the signed-in user', async () => {
      const response = await getCreditsRoute()

      expect(apiRouteMocks.getUserCredits).toHaveBeenCalledWith('user-1')
      expect(response.status).toBe(200)
      expect(await response.json()).toEqual({
        monthly: 10,
        bonus: 2,
        total: 12,
        plan: 'pro',
      })
    })
  })

  describe('v1 prompts route', () => {
    it('returns 401 when the authorization header is missing', async () => {
      const response = await getPromptsRoute(
        new Request('http://localhost/api/v1/prompts'),
      )

      expect(response.status).toBe(401)
      expect(await response.json()).toEqual({
        error: 'Missing Authorization header. Use: Bearer pe_...',
      })
      expect(apiRouteMocks.validateApiToken).not.toHaveBeenCalled()
    })

    it('returns 401 when the API token is invalid', async () => {
      apiRouteMocks.validateApiToken.mockResolvedValue(null)

      const response = await getPromptsRoute(
        new Request('http://localhost/api/v1/prompts', {
          headers: {
            authorization: 'Bearer pe_invalid',
          },
        }),
      )

      expect(apiRouteMocks.validateApiToken).toHaveBeenCalledWith('pe_invalid')
      expect(response.status).toBe(401)
      expect(await response.json()).toEqual({ error: 'Invalid API token' })
    })

    it('returns prompts for a valid API token', async () => {
      const results = [
        {
          id: 'prompt-1',
          title: 'Support assistant',
          description: 'Handles support requests',
          category: 'instruction',
          content: 'Help the user solve the issue.',
          tags: ['support'],
          isPublic: false,
          createdAt: new Date('2026-03-01T00:00:00.000Z'),
          updatedAt: new Date('2026-03-02T00:00:00.000Z'),
        },
      ]

      const orderBy = vi.fn().mockResolvedValue(results)
      const where = vi.fn(() => ({ orderBy }))
      const from = vi.fn(() => ({ where }))
      const select = vi.fn(() => ({ from }))

      apiRouteMocks.getDb.mockReturnValue({ select })

      const response = await getPromptsRoute(
        new Request('http://localhost/api/v1/prompts', {
          headers: {
            authorization: 'Bearer pe_valid',
          },
        }),
      )

      expect(apiRouteMocks.validateApiToken).toHaveBeenCalledWith('pe_valid')
      expect(apiRouteMocks.getDb).toHaveBeenCalled()
      expect(apiRouteMocks.eq).toHaveBeenCalledWith('userId', 'user-1')
      expect(apiRouteMocks.desc).toHaveBeenCalledWith('updatedAt')
      expect(response.status).toBe(200)
      expect(await response.json()).toEqual({
        prompts: [
          {
            ...results[0],
            createdAt: '2026-03-01T00:00:00.000Z',
            updatedAt: '2026-03-02T00:00:00.000Z',
          },
        ],
      })
    })
  })
})
