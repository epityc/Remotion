import { NextResponse } from 'next/server';

// Placeholder: in production, query your DB for the user's credits
// based on the session cookie / JWT.
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId') || 'anonymous';

  // Replace with real DB lookup
  const mockCredits = {
    userId,
    plan: 'free',
    credits: 50,
    creditsUsed: 0,
    creditsTotal: 50,
    resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  return NextResponse.json(mockCredits);
}
