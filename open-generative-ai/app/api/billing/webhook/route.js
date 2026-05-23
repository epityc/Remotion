import { NextResponse } from 'next/server';

const PAYDUNYA_BASE = process.env.PAYDUNYA_MODE === 'test'
  ? 'https://app.paydunya.com/sandbox-api/v1'
  : 'https://app.paydunya.com/api/v1';

function pdHeaders() {
  return {
    'PAYDUNYA-MASTER-KEY': process.env.PAYDUNYA_MASTER_KEY,
    'PAYDUNYA-PRIVATE-KEY': process.env.PAYDUNYA_PRIVATE_KEY,
    'PAYDUNYA-TOKEN': process.env.PAYDUNYA_TOKEN,
  };
}

async function confirmPayment(token) {
  const res = await fetch(`${PAYDUNYA_BASE}/checkout-invoice/confirm/${token}`, {
    headers: pdHeaders(),
  });
  return res.json();
}

async function creditUser(userId, credits, plan) {
  // Call the internal credits API to add credits to the user
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  await fetch(`${baseUrl}/api/credits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-internal-secret': process.env.INTERNAL_SECRET || 'kalivid-internal' },
    body: JSON.stringify({ userId, credits, plan }),
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!data?.token) {
      return NextResponse.json({ error: 'Token manquant' }, { status: 400 });
    }

    const confirmation = await confirmPayment(data.token);

    if (confirmation.status !== 'completed') {
      return NextResponse.json({ received: true, status: confirmation.status });
    }

    const customData = confirmation.custom_data || {};
    const { type, plan, pack, credits, user_id } = customData;

    if (type === 'pack' && credits && user_id) {
      await creditUser(user_id, Number(credits), null);
    } else if (type === 'subscription' && plan && user_id) {
      const planCredits = { pro: 1000, enterprise: 5000 }[plan] || 0;
      await creditUser(user_id, planCredits, plan);
    }

    return NextResponse.json({ received: true, status: 'credited' });
  } catch (err) {
    console.error('Webhook error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
