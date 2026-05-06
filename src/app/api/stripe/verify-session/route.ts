import { NextRequest, NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  try {
    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription'],
    });

    if (session.payment_status !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 402 });
    }

    const plan = (session.metadata?.plan as string) ?? request.nextUrl.searchParams.get('plan') ?? 'pro';

    let currentPeriodEnd: string | null = null;
    let subscriptionId: string | null = null;

    if (session.subscription && typeof session.subscription === 'object') {
      const sub = session.subscription as { id: string; current_period_end: number };
      subscriptionId = sub.id;
      currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString();
    } else if (typeof session.subscription === 'string') {
      subscriptionId = session.subscription;
      try {
        const sub = await stripe.subscriptions.retrieve(session.subscription);
        currentPeriodEnd = new Date(sub.current_period_end * 1000).toISOString();
      } catch {
        // non-critical
      }
    }

    return NextResponse.json({
      verified: true,
      plan,
      email: session.customer_details?.email ?? null,
      customerId: typeof session.customer === 'string' ? session.customer : null,
      subscriptionId,
      currentPeriodEnd,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Verification failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
