import { NextResponse } from 'next/server';

const PAYDUNYA_MASTER_KEY = process.env.PAYDUNYA_MASTER_KEY;
const PAYDUNYA_PRIVATE_KEY = process.env.PAYDUNYA_PRIVATE_KEY;
const PAYDUNYA_TOKEN = process.env.PAYDUNYA_TOKEN;
const PAYDUNYA_MODE = process.env.PAYDUNYA_MODE || 'test';

const BASE_URL = PAYDUNYA_MODE === 'live'
  ? 'https://app.paydunya.com/api/v1'
  : 'https://app.paydunya.com/sandbox-api/v1';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8001';

export async function POST(request) {
  try {
    const body = await request.json();
    const { data } = body;

    if (!data?.invoice?.token) {
      return NextResponse.json({ error: 'Missing invoice token' }, { status: 400 });
    }

    // Verify payment with PayDunya
    const verifyRes = await fetch(`${BASE_URL}/checkout-invoice/confirm/${data.invoice.token}`, {
      headers: {
        'PAYDUNYA-MASTER-KEY': PAYDUNYA_MASTER_KEY,
        'PAYDUNYA-PRIVATE-KEY': PAYDUNYA_PRIVATE_KEY,
        'PAYDUNYA-TOKEN': PAYDUNYA_TOKEN,
      },
    });

    const invoice = await verifyRes.json();

    if (invoice.status !== 'completed') {
      return NextResponse.json({ received: true, status: invoice.status });
    }

    const { user_id, type, key, credits } = invoice.custom_data || {};

    if (!user_id) {
      return NextResponse.json({ error: 'Missing user_id in custom_data' }, { status: 400 });
    }

    // Credit the user in our backend
    const topupParams = new URLSearchParams({ user_id });
    if (type === 'plan') topupParams.set('plan', key);
    if (type === 'pack') topupParams.set('pack', `${key}_pack`);

    await fetch(`${BACKEND_URL}/api/credits/topup?${topupParams.toString()}`, {
      method: 'POST',
    });

    return NextResponse.json({ received: true, credited: credits });
  } catch (err) {
    console.error('PayDunya callback error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
