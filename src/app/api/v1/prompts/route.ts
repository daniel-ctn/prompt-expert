import { eq, desc } from 'drizzle-orm'
import { getDb } from '@/lib/db'
import { prompts } from '@/lib/db/schema'
import { validateApiToken } from '@/lib/actions/api-tokens'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.replace('Bearer ', '')

  if (!token) {
    return Response.json(
      { error: 'Missing Authorization header. Use: Bearer pe_...' },
      { status: 401 },
    )
  }

  const userId = await validateApiToken(token)
  if (!userId) {
    return Response.json({ error: 'Invalid API token' }, { status: 401 })
  }

  const db = getDb()
  const results = await db
    .select({
      id: prompts.id,
      title: prompts.title,
      description: prompts.description,
      category: prompts.category,
      content: prompts.content,
      tags: prompts.tags,
      isPublic: prompts.isPublic,
      createdAt: prompts.createdAt,
      updatedAt: prompts.updatedAt,
    })
    .from(prompts)
    .where(eq(prompts.userId, userId))
    .orderBy(desc(prompts.updatedAt))

  return Response.json({ prompts: results })
}
