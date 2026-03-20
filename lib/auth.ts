import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'secret';

function getSecretKey(secret: string) {
  return new TextEncoder().encode(secret);
}

export async function signAccessToken(userId: string) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(getSecretKey(ACCESS_TOKEN_SECRET));
}

export async function signRefreshToken(userId: string) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecretKey(REFRESH_TOKEN_SECRET));
}

export async function verifyToken(token: string, isRefresh = false) {
  try {
    const secret = isRefresh ? REFRESH_TOKEN_SECRET : ACCESS_TOKEN_SECRET;
    const { payload } = await jwtVerify(token, getSecretKey(secret));
    return payload as { userId: string };
  } catch (error) {
    return null;
  }
}

export async function setRefreshTokenCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('refreshToken', token, {
    httpOnly: true,
    secure: process.env.SECURE_COOKIES === 'true',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
  });
}

export async function getRefreshTokenCookie() {
  const cookieStore = await cookies();
  return cookieStore.get('refreshToken')?.value;
}

export async function clearRefreshTokenCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('refreshToken');
}
