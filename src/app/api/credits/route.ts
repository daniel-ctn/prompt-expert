import { auth } from '@/lib/auth';
import { getUserCredits } from '@/lib/credits';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const credits = await getUserCredits(session.user.id);
  return Response.json(credits);
}
