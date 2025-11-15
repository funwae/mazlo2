import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const url = req.nextUrl;
  
  // Password protection (if SITE_PASSWORD is set)
  // Skip for static assets, API routes, and password check page
  if (
    !url.pathname.startsWith('/_next') &&
    !url.pathname.startsWith('/api') &&
    !url.pathname.startsWith('/manifest') &&
    !url.pathname.startsWith('/favicon') &&
    url.pathname !== '/password-check'
  ) {
    const sitePassword = process.env.SITE_PASSWORD;
    if (sitePassword && process.env.NODE_ENV === 'production') {
      const passwordCookie = req.cookies.get('site_password');
      
      // If password cookie doesn't match, redirect to password check
      if (!passwordCookie || passwordCookie.value !== sitePassword) {
        return NextResponse.redirect(new URL('/password-check', req.url));
      }
    }
  }
  
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protect app routes
  if (req.nextUrl.pathname.startsWith('/app') && !session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect authenticated users away from auth pages
  if (req.nextUrl.pathname.startsWith('/login') && session) {
    return NextResponse.redirect(new URL('/app', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

