import { NextResponse } from 'next/server';

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

const PRICE_IDS = {
  plan: {
    pro: process.env.STRIPE_PRICE_PRO || 'price_pro_placeholder',
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE || 'price_enterprise_placeholder',
  },
  pack: {
    starter: process.env.STRIPE_PRICE_STARTER_PACK || 'price_starter_pack_placeholder',
    growth: process.env.STRIPE_PRICE_GROWTH_PACK || 'price_growth_pack_placeholder',
    pro: process.env.STRIPE_PRICE_PRO_PACK || 'price_pro_pack_placeholder',
  },
};

export async function GET(request) {
  if (!STRIPE_SECRET_KEY) {
    return NextResponse.json({ error: 'Stripe not configured. Set STRIPE_SECRET_KEY env var.' }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const plan = searchParams.get('plan');
  const pack = searchParams.get('pack');

  let priceId;
  let mode;

  if (plan && plan !== 'free') {
    priceId = PRICE_IDS.plan[plan];
    mode = 'subscription';
  } else if (pack) {
    priceId = PRICE_IDS.pack[pack];
    mode = 'payment';
  } else if (plan === 'free') {
    return NextResponse.redirect(new URL('/', request.url));
  } else {
    return NextResponse.json({ error: 'Missing plan or pack parameter' }, { status: 400 });
  }

  try {
    const stripe = await import('stripe').then(m => new m.default(STRIPE_SECRET_KEY));
    const session = await stripe.checkout.sessions.create({
      mode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/pricing?success=1`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/pricing`,
    });
    return NextResponse.redirect(session.url);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
