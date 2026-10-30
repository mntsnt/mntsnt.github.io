import { NextResponse } from 'next/server';
import {
  checkRateLimit,
  validateCredentials,
  createSessionToken,
  setAdminSessionCookie,
  resetRateLimit,
} from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const body = await request.json();
    const { email, password } = body;

    // Check brute-force rate limit (5 attempts per 15 min)
    const allowed = checkRateLimit(ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please wait 15 minutes before trying again.' },
        { status: 429 }
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const isValid = validateCredentials(email, password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Success: reset rate limit and issue JWT cookie
    resetRateLimit(ip);
    const token = await createSessionToken(email);
    await setAdminSessionCookie(token);

    return NextResponse.json({
      success: true,
      message: 'Logged in successfully',
      user: { email, role: 'admin' },
    });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Authentication failed.' },
      { status: 500 }
    );
  }
}
