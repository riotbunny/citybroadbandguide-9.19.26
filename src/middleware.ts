import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Admin Authentication Protection
  if (pathname.startsWith('/admin')) {
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. Zero-Click Edge Geo-Routing (For Production Homepage)
  if (pathname === '/') {
    // These headers are injected automatically by hosting platforms like Vercel or Cloudflare
    // based on the incoming user's IP address.
    const city = request.headers.get('x-vercel-ip-city');
    const state = request.headers.get('x-vercel-ip-country-region'); // e.g., 'TX'
    
    const userAgent = request.headers.get('user-agent') || '';
    
    // CRITICAL SEO PROTECTION: Never auto-redirect Googlebot or other web crawlers.
    // If you redirect bots, Google will only index the city its server is located in (usually California)
    // and will refuse to crawl your actual homepage.
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent);

    // If we are on a live server, successfully grabbed their city/state, and it is a human:
    if (city && state && !isBot) {
      const citySlug = decodeURIComponent(city).toLowerCase().replace(/\s+/g, '-');
      const stateSlug = state.toLowerCase();
      
      // IP targeting reliably gives City/State (but rarely gives exact Zip codes).
      // Therefore, the smartest automated redirect is to drop them onto the City Directory page!
      // 
      // ACTION REQUIRED: Uncomment the line below when deploying to production to activate zero-click routing:
      return NextResponse.redirect(new URL(`/internet/${stateSlug}/${citySlug}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/admin/:path*'],
}