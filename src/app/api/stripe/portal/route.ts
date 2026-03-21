import { auth } from '@/lib/auth';
import { createPortalSession } from '@/lib/stripe';

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const url = await createPortalSession(session.user.id);
    return Response.json({ url });
  } catch (error) {
    console.error('Portal error:', error);
    return Response.json(
      { error: 'Failed to create portal session' },
      { status: 500 },
    );
  }
}
