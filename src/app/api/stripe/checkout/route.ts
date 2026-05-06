import { NextRequest, NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const PRICE_IDS: Record<string, string> = {
  pro: process.env.STRIPE_PRICE_PRO ?? '',
  investor: process.env.STRIPE_PRICE_INVESTOR ?? '',
};

export async function POST(request: NextRequest) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Add STRIPE_SECRET_KEY to your environment variables.' },
      { status: 503 },
    );
  }

  try {
    const { plan, successUrl, cancelUrl } = await request.json();
    const priceId = PRICE_IDS[plan as string];

    if (!priceId) {
      return NextResponse.json({ error: `Unknown plan: ${plan}` }, { status: 400 });
    }

    const Stripe = (await import('stripe')).default;
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: successUrl ?? `${request.nextUrl.origin}/upgrade/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl ?? `${request.nextUrl.origin}/pricing`,
      allow_promotion_codes: true,
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create checkout session';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
