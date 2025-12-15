// app/auth/callback/route.ts (This must be a Route Handler)
import { createServerClient } from '@supabase/ssr' // New Import
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

// This function handles the final OAuth exchange
export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    // FIX: Use the new createServerClient utility
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get: (name: string) => cookies().get(name)?.value,
          set: (name: string, value: string, options: any) => cookies().set(name, value, options),
          remove: (name: string) => cookies().set(name, '', { maxAge: 0 }),
        },
      }
    );
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
  }

  // Redirect user back to the application's home page
  return NextResponse.redirect(requestUrl.origin)
}