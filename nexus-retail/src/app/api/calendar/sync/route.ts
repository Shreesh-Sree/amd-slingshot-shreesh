import { NextResponse } from 'next/server';
import { GeminiService } from '@/lib/services/gemini';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { adminAuth } from '@/lib/services/firebase/admin';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

const syncSchema = z.object({
  summary: z.string().min(1),
  description: z.string().optional().default(""),
  endDate: z.string().datetime(), // Requires ISO 8601
});

export async function POST(request: Request) {
  try {
    // Zero Trust validation: Authenticate Edge Boundary Session
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;
    
    if (!sessionCookie || !adminAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedSession = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Find internal user maps
    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedSession.uid }
    });

    if (!user) {
      return NextResponse.json({ error: "User mapping not found" }, { status: 403 });
    }

    // Parse untrusted calendar payload
    const body = await request.json();
    const parsed = syncSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid Calendar Payload", details: parsed.error.issues }, { status: 400 });
    }

    const { summary, description, endDate } = parsed.data;

    // STEP 1: Transient Abstraction via Gemini
    // Raw parsing piped directly to memory. Do NOT save 'summary' or 'description' to DB.
    const semanticTags = await GeminiService.extractSemanticIntent(summary, description);

    // STEP 2: Store purely semantic tags to PostgreSQL & drop the original payload
    const expiresAt = new Date(endDate);
    // Add logic to extend or clip TTL based on retail viability logic
    expiresAt.setDate(expiresAt.getDate() + 1);

    const insertedTag = await prisma.userEventTag.create({
      data: {
        userId: user.id,
        intent: semanticTags.intent,
        environment: semanticTags.environment,
        duration: semanticTags.duration,
        expiresAt,
      }
    });

    // STEP 3: The recommendation queue / intelligent caching triggers here
    // e.g. mapping products relevant to `intent` -> `EventRecommendation`

    return NextResponse.json({ 
      success: true, 
      message: "Calendar synced securely. PII successfully dropped.",
      tagId: insertedTag.id 
    });

  } catch (error) {
    console.error('Calendar Sync Error:', error);
    return NextResponse.json({ error: "Sync Processing Failure" }, { status: 500 });
  }
}
