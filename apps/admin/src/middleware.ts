import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

type CookieToSet = { name: string; value: string; options: CookieOptions };

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // If env vars are not configured (e.g. preview deployment without secrets),
  // pass through — the page itself will redirect to /login if unauthenticated.
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cs: CookieToSet[]) =>
          cs.forEach(({ name, value, options }) => response.cookies.set(name, value, options)),
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const role = user?.app_metadata?.role;

    const isProtected = !request.nextUrl.pathname.startsWith('/login');
    if (isProtected && (!user || role !== 'super_admin')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  } catch {
    // Edge runtime error — fail open so the page can handle auth itself
    return response;
  }

  return response;
}

export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico|login).*)'] };
