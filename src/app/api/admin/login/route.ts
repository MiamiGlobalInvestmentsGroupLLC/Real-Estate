import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken } from '@/lib/adminAuth';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  const expectedEmail = (process.env.ADMIN_EMAIL ?? '').trim();
  const expectedPassword = (process.env.ADMIN_PASSWORD ?? '').trim();

  if (!expectedEmail || !expectedPassword) {
    return NextResponse.json({ error: 'Admin not configured' }, { status: 500 });
  }

  const emailMatch = email.trim() === expectedEmail;
  const passwordMatch = password === expectedPassword;

  if (!emailMatch || !passwordMatch) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const token = createAdminToken();
  const response = NextResponse.json({ ok: true });
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60,
    path: '/',
  });
  return response;
}
