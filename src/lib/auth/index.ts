import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import GitHub from 'next-auth/providers/github'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { getDb } from '@/lib/db'
import {
  accounts,
  sessions,
  subscriptions,
  users,
  verificationTokens,
} from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import type { PlanId } from '@/config/plans'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      plan: PlanId
    }
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  adapter: DrizzleAdapter(getDb(), {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  providers: [Google, GitHub],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, user }) {
      session.user.id = user.id

      const db = getDb()
      const sub = await db.query.subscriptions.findFirst({
        where: eq(subscriptions.userId, user.id),
      })
      session.user.plan = (sub?.plan as PlanId) || 'free'

      return session
    },
  },
}))
