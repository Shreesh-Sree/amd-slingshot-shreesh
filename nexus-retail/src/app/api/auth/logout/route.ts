import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const cookieStore = await cookies();
  
  // Clear the secure zero-trust session cookie
  cookieStore.set('__session', '', {
    maxAge: -1,
    httpOnly: true, // Remains httpOnly to prevent script hijack
    path: '/',
    secure: process.env.NODE_ENV === 'production',
  });

  return NextResponse.json({ success: true, message: "Logged out successfully" });
}
