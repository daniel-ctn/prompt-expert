import { auth } from '@/lib/auth';
import { createCheckoutSession } from '@/lib/stripe';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type }: { type: 'pro' | 'credit_pack' } = await req.json();

  if (!type || !['pro', 'credit_pack'].includes(type)) {
    return Response.json({ error: 'Invalid checkout type' }, { status: 400 });
  }

  try {
    const mode = type === 'pro' ? 'subscription' : 'payment';
    const url = await createCheckoutSession(
      session.user.id,
      session.user.email,
      mode,
    );
    return Response.json({ url });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    );
  }
}
