import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip maintenance check for admin routes, API routes, and maintenance page itself
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/maintenance') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  try {
    // Check maintenance mode from settings API
    const settingsUrl = new URL('/api/settings', request.url);
    const settingsResponse = await fetch(settingsUrl.toString());
    
    if (settingsResponse.ok) {
      const data = await settingsResponse.json();
      
      // If maintenance mode is enabled, redirect to maintenance page
      if (data.settings?.maintenanceMode) {
        const maintenanceUrl = new URL('/maintenance', request.url);
        return NextResponse.redirect(maintenanceUrl);
      }
    }
  } catch (error) {
    console.error('Middleware error checking maintenance mode:', error);
    // If there's an error checking maintenance mode, allow the request to continue
  }

  return NextResponse.next();
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