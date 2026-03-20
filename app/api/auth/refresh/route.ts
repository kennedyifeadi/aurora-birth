import { NextResponse } from 'next/server';
import { verifyToken, signAccessToken, getRefreshTokenCookie } from '@/lib/auth';

export async function POST() {
  try {
    const refreshToken = await getRefreshTokenCookie();

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    const payload = await verifyToken(refreshToken, true);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }

    const accessToken = await signAccessToken(payload.userId);

    return NextResponse.json({ accessToken });
  } catch (error: any) {
    console.error('Refresh Token Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
