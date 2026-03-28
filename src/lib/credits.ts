'use server'

import { getDb } from '@/lib/db'
import {
  creditBalances,
  creditTransactions,
  subscriptions,
} from '@/lib/db/schema'
import { eq, sql } from 'drizzle-orm'
import { PLANS, type PlanId } from '@/config/plans'

export interface CreditInfo {
  monthly: number
  bonus: number
  total: number
  plan: PlanId
}

async function ensureCreditBalance(userId: string): Promise<void> {
  const db = getDb()

  const existing = await db.query.creditBalances.findFirst({
    where: eq(creditBalances.userId, userId),
  })

  if (!existing) {
    const now = new Date()
    const resetAt = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    await db.insert(creditBalances).values({
      userId,
      monthlyCredits: PLANS.free.credits,
      bonusCredits: 0,
      resetAt,
    })
  }
}

export async function getUserCredits(userId: string): Promise<CreditInfo> {
  const db = getDb()
  await ensureCreditBalance(userId)

  const balance = await db.query.creditBalances.findFirst({
    where: eq(creditBalances.userId, userId),
  })

  const sub = await db.query.subscriptions.findFirst({
    where: eq(subscriptions.userId, userId),
  })

  const plan: PlanId = (sub?.plan as PlanId) || 'free'
  const monthly = balance?.monthlyCredits ?? PLANS[plan].credits
  const bonus = balance?.bonusCredits ?? 0

  return {
    monthly,
    bonus,
    total: monthly + bonus,
    plan,
  }
}

export async function hasCredits(
  userId: string,
  cost: number,
): Promise<boolean> {
  const credits = await getUserCredits(userId)
  return credits.total >= cost
}

export async function deductCredit(
  userId: string,
  cost: number,
  description: string,
): Promise<boolean> {
  const db = getDb()
  await ensureCreditBalance(userId)

  const balance = await db.query.creditBalances.findFirst({
    where: eq(creditBalances.userId, userId),
  })

  if (!balance) return false

  const total = balance.monthlyCredits + balance.bonusCredits
  if (total < cost) return false

  const monthlyDeduction = Math.min(balance.monthlyCredits, cost)
  const bonusDeduction = cost - monthlyDeduction

  await db
    .update(creditBalances)
    .set({
      monthlyCredits: sql`${creditBalances.monthlyCredits} - ${monthlyDeduction}`,
      bonusCredits: sql`${creditBalances.bonusCredits} - ${bonusDeduction}`,
      updatedAt: new Date(),
    })
    .where(eq(creditBalances.userId, userId))

  await db.insert(creditTransactions).values({
    userId,
    amount: -cost,
    type: 'deduction',
    description,
  })

  return true
}

export async function resetMonthlyCredits(
  userId: string,
  plan: PlanId,
): Promise<void> {
  const db = getDb()
  const resetAt = new Date()
  resetAt.setMonth(resetAt.getMonth() + 1)
  resetAt.setDate(1)

  const credits = PLANS[plan].credits

  const existing = await db.query.creditBalances.findFirst({
    where: eq(creditBalances.userId, userId),
  })

  if (existing) {
    await db
      .update(creditBalances)
      .set({ monthlyCredits: credits, resetAt, updatedAt: new Date() })
      .where(eq(creditBalances.userId, userId))
  } else {
    await db.insert(creditBalances).values({
      userId,
      monthlyCredits: credits,
      bonusCredits: 0,
      resetAt,
    })
  }

  await db.insert(creditTransactions).values({
    userId,
    amount: credits,
    type: 'monthly_reset',
    description: `Monthly credit reset (${plan} plan)`,
  })
}

export async function addBonusCredits(
  userId: string,
  amount: number,
  description: string,
): Promise<void> {
  const db = getDb()
  await ensureCreditBalance(userId)

  await db
    .update(creditBalances)
    .set({
      bonusCredits: sql`${creditBalances.bonusCredits} + ${amount}`,
      updatedAt: new Date(),
    })
    .where(eq(creditBalances.userId, userId))

  await db.insert(creditTransactions).values({
    userId,
    amount,
    type: 'top_up',
    description,
  })
}
