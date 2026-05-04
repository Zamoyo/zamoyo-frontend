import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Only protect /admin routes
  if (path.startsWith('/admin')) {
    const isLoginPage = path === '/admin/login';
    // Look for our secure mock token
    const token = request.cookies.get('zamoyo_admin_session')?.value;

    // No token? Kick them to login.
    if (!token && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // Have a token but trying to view login? Push to dashboard.
    if (token && isLoginPage) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

// Run proxy only on admin routes
export const config = {
  matcher: ['/admin/:path*'],
};