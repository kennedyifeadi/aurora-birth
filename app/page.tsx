import { redirect } from 'next/navigation';
import { getRefreshTokenCookie } from '../lib/auth';

export default async function Home() {
  const token = await getRefreshTokenCookie();

  if (token) {
    redirect('/dashboard');
  } else {
    redirect('/auth/login');
  }

  return null;
}
