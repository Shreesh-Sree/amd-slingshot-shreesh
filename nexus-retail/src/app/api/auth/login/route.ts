import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/services/firebase/admin';
import { UserRepository } from '@/lib/repositories/UserRepository';
import { cookies } from 'next/headers';
import { z } from 'zod';

const loginSchema = z.object({
  idToken: z.string().min(10, "Invalid token format"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid Payload" }, { status: 400 });
    }

    if (!adminAuth) {
      return NextResponse.json({ error: "Server Auth Configuration Error" }, { status: 500 });
    }

    const { idToken } = parsed.data;

    // Verify token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    // Sync the Firebase Identity to our Zero Trust PostgreSQL layer
    if (!decodedToken.email) {
      return NextResponse.json({ error: "Email is required for identity mapping" }, { status: 400 });
    }
    
    const userRoleMapping = await UserRepository.syncIdentity(
      decodedToken.uid,
      decodedToken.email,
      decodedToken.name || undefined
    );

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set('__session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });

    return NextResponse.json({ 
      success: true, 
      role: userRoleMapping.role // Return RBAC role for client-side navigation optimization
    });

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
