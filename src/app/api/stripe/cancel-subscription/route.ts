import { NextRequest, NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

export async function POST(request: NextRequest) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 });
  }

  try {
    const { subscriptionId } = await request.json();

    if (!subscriptionId) {
      return NextResponse.json({ error: 'Missing subscriptionId' }, { status: 400 });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

    // Cancel at period end so the user keeps access until their billing cycle ends
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
    });

    const cancelAt = new Date(subscription.current_period_end * 1000).toISOString();

    return NextResponse.json({ canceled: true, accessUntil: cancelAt });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Cancellation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
