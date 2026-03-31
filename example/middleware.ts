import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Redirect /old-path to /redirect-target
  if (request.nextUrl.pathname === '/old-path') {
    return NextResponse.redirect(new URL('/redirect-target', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/old-path'],
};
