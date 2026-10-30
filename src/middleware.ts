import { NextResponse, type NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || process.env.ADMIN_SECRET || 'mintesnot-secret-super-secure-key-2026-production'
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get('admin_session')?.value;
    let isValid = false;

    if (sessionCookie) {
      try {
        await jwtVerify(sessionCookie, SECRET_KEY);
        isValid = true;
      } catch {
        isValid = false;
      }
    }

    // If on login page and already logged in, redirect to /admin
    if (pathname === '/admin/login') {
      if (isValid) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // If on protected admin route and not logged in, redirect to /admin/login
    if (!isValid) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
