import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PLANS } from '@/config/plans'

const creditMocks = vi.hoisted(() => ({
  getDb: vi.fn(),
  eq: vi.fn(),
  sql: vi.fn((strings: TemplateStringsArray, ...values: unknown[]) => ({
    strings,
    values,
  })),
}))

vi.mock('@/lib/db', () => ({
  getDb: creditMocks.getDb,
}))

vi.mock('drizzle-orm', () => ({
  eq: creditMocks.eq,
  sql: creditMocks.sql,
}))

vi.mock('@/lib/db/schema', () => ({
  creditBalances: {
    userId: 'creditBalances.userId',
    monthlyCredits: 'creditBalances.monthlyCredits',
    bonusCredits: 'creditBalances.bonusCredits',
  },
  creditTransactions: 'creditTransactions',
  subscriptions: {
    userId: 'subscriptions.userId',
  },
}))

import {
  addBonusCredits,
  deductCredit,
  getUserCredits,
  hasCredits,
  resetMonthlyCredits,
} from '@/lib/credits'

function createDbMock() {
  const findCreditBalance = vi.fn()
  const findSubscription = vi.fn()
  const insertValues = vi.fn().mockResolvedValue(undefined)
  const insert = vi.fn(() => ({ values: insertValues }))
  const updateWhere = vi.fn().mockResolvedValue(undefined)
  const updateSet = vi.fn(() => ({ where: updateWhere }))
  const update = vi.fn(() => ({ set: updateSet }))

  return {
    db: {
      query: {
        creditBalances: {
          findFirst: findCreditBalance,
        },
        subscriptions: {
          findFirst: findSubscription,
        },
      },
      insert,
      update,
    },
    spies: {
      findCreditBalance,
      findSubscription,
      insert,
      insertValues,
      update,
      updateSet,
      updateWhere,
    },
  }
}

describe('credits helpers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    creditMocks.eq.mockReturnValue('eq-condition')
  })

  it('creates a default balance when one does not exist and returns free credits', async () => {
    const { db, spies } = createDbMock()
    spies.findCreditBalance
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({
        monthlyCredits: PLANS.free.credits,
        bonusCredits: 0,
      })
    spies.findSubscription.mockResolvedValue(undefined)
    creditMocks.getDb.mockReturnValue(db)

    const result = await getUserCredits('user-1')

    expect(spies.insert).toHaveBeenCalled()
    expect(spies.insertValues).toHaveBeenCalledWith({
      userId: 'user-1',
      monthlyCredits: PLANS.free.credits,
      bonusCredits: 0,
      resetAt: expect.any(Date),
    })
    expect(result).toEqual({
      monthly: PLANS.free.credits,
      bonus: 0,
      total: PLANS.free.credits,
      plan: 'free',
    })
  })

  it('returns whether the user has enough credits for a cost', async () => {
    const { db, spies } = createDbMock()
    spies.findCreditBalance
      .mockResolvedValueOnce({
        monthlyCredits: 2,
        bonusCredits: 1,
      })
      .mockResolvedValueOnce({
        monthlyCredits: 2,
        bonusCredits: 1,
      })
      .mockResolvedValueOnce({
        monthlyCredits: 2,
        bonusCredits: 1,
      })
      .mockResolvedValueOnce({
        monthlyCredits: 2,
        bonusCredits: 1,
      })
    spies.findSubscription.mockResolvedValue(undefined)
    creditMocks.getDb.mockReturnValue(db)

    await expect(hasCredits('user-1', 3)).resolves.toBe(true)
    await expect(hasCredits('user-1', 4)).resolves.toBe(false)
  })

  it('does not deduct credits when the user has insufficient balance', async () => {
    const { db, spies } = createDbMock()
    spies.findCreditBalance
      .mockResolvedValueOnce({
        monthlyCredits: 1,
        bonusCredits: 0,
      })
      .mockResolvedValueOnce({
        monthlyCredits: 1,
        bonusCredits: 0,
      })
    creditMocks.getDb.mockReturnValue(db)

    const result = await deductCredit('user-1', 2, 'Optimize prompt')

    expect(result).toBe(false)
    expect(spies.update).not.toHaveBeenCalled()
    expect(spies.insertValues).not.toHaveBeenCalled()
  })

  it('deducts monthly credits before bonus credits and records the transaction', async () => {
    const { db, spies } = createDbMock()
    spies.findCreditBalance
      .mockResolvedValueOnce({
        monthlyCredits: 2,
        bonusCredits: 3,
      })
      .mockResolvedValueOnce({
        monthlyCredits: 2,
        bonusCredits: 3,
      })
    creditMocks.getDb.mockReturnValue(db)

    const result = await deductCredit('user-1', 4, 'Optimize prompt')

    expect(result).toBe(true)
    expect(creditMocks.sql).toHaveBeenNthCalledWith(
      1,
      expect.any(Array),
      'creditBalances.monthlyCredits',
      2,
    )
    expect(creditMocks.sql).toHaveBeenNthCalledWith(
      2,
      expect.any(Array),
      'creditBalances.bonusCredits',
      2,
    )
    expect(spies.updateSet).toHaveBeenCalledWith({
      monthlyCredits: expect.any(Object),
      bonusCredits: expect.any(Object),
      updatedAt: expect.any(Date),
    })
    expect(spies.insertValues).toHaveBeenCalledWith({
      userId: 'user-1',
      amount: -4,
      type: 'deduction',
      description: 'Optimize prompt',
    })
  })

  it('resets monthly credits for an existing balance and records the reset', async () => {
    const { db, spies } = createDbMock()
    spies.findCreditBalance.mockResolvedValue({ userId: 'user-1' })
    creditMocks.getDb.mockReturnValue(db)

    await resetMonthlyCredits('user-1', 'pro')

    expect(spies.updateSet).toHaveBeenCalledWith({
      monthlyCredits: PLANS.pro.credits,
      resetAt: expect.any(Date),
      updatedAt: expect.any(Date),
    })
    expect(spies.insertValues).toHaveBeenCalledWith({
      userId: 'user-1',
      amount: PLANS.pro.credits,
      type: 'monthly_reset',
      description: 'Monthly credit reset (pro plan)',
    })
  })

  it('creates a balance before adding bonus credits and records the top-up', async () => {
    const { db, spies } = createDbMock()
    spies.findCreditBalance
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce({
        monthlyCredits: PLANS.free.credits,
        bonusCredits: 0,
      })
    creditMocks.getDb.mockReturnValue(db)

    await addBonusCredits('user-1', 25, 'Promotion')

    expect(spies.insertValues).toHaveBeenNthCalledWith(1, {
      userId: 'user-1',
      monthlyCredits: PLANS.free.credits,
      bonusCredits: 0,
      resetAt: expect.any(Date),
    })
    expect(creditMocks.sql).toHaveBeenLastCalledWith(
      expect.any(Array),
      'creditBalances.bonusCredits',
      25,
    )
    expect(spies.insertValues).toHaveBeenLastCalledWith({
      userId: 'user-1',
      amount: 25,
      type: 'top_up',
      description: 'Promotion',
    })
  })
})
