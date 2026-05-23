import { NextResponse } from 'next/server';

const PAYDUNYA_MASTER_KEY = process.env.PAYDUNYA_MASTER_KEY;
const PAYDUNYA_PRIVATE_KEY = process.env.PAYDUNYA_PRIVATE_KEY;
const PAYDUNYA_TOKEN = process.env.PAYDUNYA_TOKEN;
const PAYDUNYA_MODE = process.env.PAYDUNYA_MODE || 'test'; // 'test' or 'live'

const BASE_URL = PAYDUNYA_MODE === 'live'
  ? 'https://app.paydunya.com/api/v1'
  : 'https://app.paydunya.com/sandbox-api/v1';

const CHECKOUT_URL = PAYDUNYA_MODE === 'live'
  ? 'https://app.paydunya.com/checkout-invoice'
  : 'https://app.paydunya.com/sandbox-checkout-invoice';

const APP_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

const PLANS = {
  pro: { label: 'Kalivid Pro — 1 mois', amount: 2900, credits: 1000 },
  enterprise: { label: 'Kalivid Enterprise — 1 mois', amount: 9900, credits: 5000 },
};

const PACKS = {
  starter: { label: 'Kalivid Starter Pack — 200 crédits', amount: 900, credits: 200 },
  growth: { label: 'Kalivid Growth Pack — 750 crédits', amount: 2900, credits: 750 },
  pro: { label: 'Kalivid Pro Pack — 2500 crédits', amount: 7900, credits: 2500 },
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plan = searchParams.get('plan');
  const pack = searchParams.get('pack');
  const userId = searchParams.get('userId') || 'anonymous';

  if (plan === 'free') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!PAYDUNYA_MASTER_KEY) {
    return NextResponse.json(
      { error: 'PayDunya not configured. Set PAYDUNYA_MASTER_KEY, PAYDUNYA_PRIVATE_KEY, PAYDUNYA_TOKEN in .env' },
      { status: 503 }
    );
  }

  let item, itemType, itemKey;
  if (plan && PLANS[plan]) {
    item = PLANS[plan];
    itemType = 'plan';
    itemKey = plan;
  } else if (pack && PACKS[pack]) {
    item = PACKS[pack];
    itemType = 'pack';
    itemKey = pack;
  } else {
    return NextResponse.json({ error: 'Invalid plan or pack parameter' }, { status: 400 });
  }

  const payload = {
    invoice: {
      total_amount: item.amount,
      description: item.label,
    },
    store: {
      name: 'Kalivid',
      tagline: 'AI Faceless Reels Studio',
    },
    actions: {
      cancel_url: `${APP_URL}/pricing`,
      return_url: `${APP_URL}/pricing?success=1&type=${itemType}&key=${itemKey}`,
      callback_url: `${APP_URL}/api/billing/callback`,
    },
    custom_data: {
      user_id: userId,
      type: itemType,
      key: itemKey,
      credits: item.credits,
    },
  };

  try {
    const res = await fetch(`${BASE_URL}/checkout-invoice/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PAYDUNYA-MASTER-KEY': PAYDUNYA_MASTER_KEY,
        'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
        'PAYDUNYA-TOKEN': PAYDUNYA_TOKEN,
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok || data.response_code !== '00') {
      console.error('PayDunya error:', data);
      return NextResponse.json(
        { error: data.description || 'PayDunya checkout creation failed' },
        { status: 502 }
      );
    }

    const token = data.response_text?.token || data.token;
    return NextResponse.redirect(`${CHECKOUT_URL}/${token}`);
  } catch (err) {
    console.error('PayDunya fetch error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
