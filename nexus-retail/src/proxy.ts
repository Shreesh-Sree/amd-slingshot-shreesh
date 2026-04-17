import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Only instantiate Redis if the API keys are present (prevent build/dev crashes if not setup yet)
const redis = process.env.UPSTASH_REDIS_REST_URL 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    })
  : null;

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = redis ? new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
}) : null;

// In-memory fallback if Redis is missing (useful for Hackathon fast-path)
const memoryCache = new Map<string, { count: number, resetAt: number }>();

function fallbackRateLimit(ip: string): boolean {
  const now = Date.now();
  const userData = memoryCache.get(ip);
  if (!userData || now > userData.resetAt) {
    memoryCache.set(ip, { count: 1, resetAt: now + 10000 }); // 10 seconds
    return true;
  }
  if (userData.count >= 10) {
    return false; // Rate limited
  }
  userData.count += 1;
  return true;
}

export default async function proxy(request: NextRequest) {
  const ip = request.ip ?? '127.0.0.1';
  
  // 1. Aggressive Rate Limiting against DDoS/Brute Force
  // Protect API routes fundamentally
  if (request.nextUrl.pathname.startsWith('/api')) {
    if (ratelimit) {
      const { success } = await ratelimit.limit(ip);
      if (!success) {
        return new NextResponse('Rate Limit Exceeded', { status: 429 });
      }
    } else {
      const success = fallbackRateLimit(ip);
      if (!success) {
        return new NextResponse('Rate Limit Exceeded', { status: 429 });
      }
    }
  }

  // 2. CSRF Protection for mutating API boundaries
  // Ensure the origin header matches the host for state-mutating requests
  if (request.method !== 'GET' && request.method !== 'OPTIONS') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');
    // Ensure origin matches our domain pattern (basic CSRF protection)
    if (origin && host) {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        return new NextResponse('CSRF Token Mismatch - Zero Trust Enforced', { status: 403 });
      }
    }
  }

  // 3. Next.js Route Protection (Session enforcement)
  const sessionCookie = request.cookies.get('__session');
  
  // Protect specific checkout/shop components requiring auth
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/shop/checkout') || 
                           request.nextUrl.pathname.startsWith('/profile');
                           
  if (isProtectedRoute && !sessionCookie) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
