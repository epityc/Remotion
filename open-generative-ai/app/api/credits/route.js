import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8001';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'anonymous';

  try {
    const res = await fetch(`${BACKEND_URL}/api/credits?user_id=${encodeURIComponent(userId)}`);
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: 'Backend unavailable', detail: err.message }, { status: 503 });
  }
}

export async function POST(request) {
  // Called by PayDunya callback after successful payment (internal use)
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const plan = searchParams.get('plan');
  const pack = searchParams.get('pack');

  if (!userId) return NextResponse.json({ error: 'userId requis' }, { status: 400 });

  const params = new URLSearchParams({ user_id: userId });
  if (plan) params.set('plan', plan);
  if (pack) params.set('pack', pack);

  try {
    const res = await fetch(`${BACKEND_URL}/api/credits/topup?${params.toString()}`, {
      method: 'POST',
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: 'Backend unavailable', detail: err.message }, { status: 503 });
  }
}

export async function PATCH(request) {
  // Deduct credits for a generation
  const { userId, amount = 1 } = await request.json();
  if (!userId) return NextResponse.json({ error: 'userId requis' }, { status: 400 });

  try {
    const res = await fetch(
      `${BACKEND_URL}/api/credits/deduct?user_id=${encodeURIComponent(userId)}&amount=${amount}`,
      { method: 'POST' }
    );
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    return NextResponse.json({ error: 'Backend unavailable', detail: err.message }, { status: 503 });
  }
}
