import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  // Protect /dashboard routes
  if (pathname.startsWith('/dashboard') || pathname === '/book') {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Decode JWT payload (no verification — trust backend for actual auth)
    try {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      const role: string = payload.role;

      if (pathname.startsWith('/dashboard/barber') && role !== 'BARBER') {
        return NextResponse.redirect(new URL('/dashboard/customer', request.url));
      }
      if (pathname.startsWith('/dashboard/customer') && role !== 'CUSTOMER') {
        return NextResponse.redirect(new URL('/dashboard/barber', request.url));
      }
    } catch {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Redirect logged-in users away from auth pages
  if ((pathname === '/login' || pathname === '/register') && token) {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString()
      );
      const role: string = payload.role;
      const dest = role === 'BARBER' ? '/dashboard/barber' : '/dashboard/customer';
      return NextResponse.redirect(new URL(dest, request.url));
    } catch {}
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/book', '/login', '/register'],
};
