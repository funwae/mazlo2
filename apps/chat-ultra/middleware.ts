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

  // Protected routes that require authentication
  const protectedRoutes = ['/rooms', '/settings', '/memories', '/global'];
  const isProtectedRoute = protectedRoutes.some(route => url.pathname.startsWith(route));

  // Public routes that don't need middleware auth check
  const publicRoutes = ['/chatultra', '/login', '/privacy', '/terms', '/password-check'];
  const isPublicRoute = publicRoutes.some(route => url.pathname.startsWith(route));

  // Skip Supabase auth check for public routes to avoid errors
  if (isPublicRoute) {
    return res;
  }

  // Only create Supabase client if we need to check auth
  if (isProtectedRoute) {
    try {
      const supabase = createMiddlewareClient({ req, res });
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // Redirect to login if not authenticated
      if (!session) {
        return NextResponse.redirect(new URL('/login', req.url));
      }
    } catch (error) {
      // If Supabase client creation fails, allow through (will fail at route level if needed)
      console.error('Middleware Supabase error:', error);
    }
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

