import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.ADMIN_SECRET || 'mintesnot-secret-super-secure-key-2026-production'
);

const SESSION_COOKIE_NAME = 'admin_session';

// In-memory rate limiting map: ip -> { count, expiresAt }
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>();

export function checkRateLimit(identifier: string, limit = 5, windowMs = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(identifier, { count: 1, expiresAt: now + windowMs });
    return true; // allowed
  }

  if (entry.count >= limit) {
    return false; // blocked
  }

  entry.count += 1;
  return true; // allowed
}

export function resetRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}

export async function createSessionToken(email: string): Promise<string> {
  const token = await new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET_KEY);

  return token;
}

export async function verifySessionToken(token: string): Promise<{ email: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return {
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<{ email: string; role: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return null;

  return verifySessionToken(sessionCookie.value);
}

export async function setAdminSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function validateCredentials(email: string, pass: string): boolean {
  const configuredEmail = (process.env.ADMIN_EMAIL || 'mintesnoh@gmail.com').toLowerCase().trim();
  const configuredPass = process.env.ADMIN_PASSWORD || 'mintesnot2026!';

  if (email.toLowerCase().trim() === configuredEmail && pass === configuredPass) {
    return true;
  }
  return false;
}
