import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { GeminiService } from '@/lib/services/gemini';
import { z } from 'zod';
import { adminAuth } from '@/lib/services/firebase/admin';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

const createProductSchema = z.object({
  title: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  inventory: z.number().int().nonnegative(),
  imageUrl: z.string().url(),
});

export async function POST(request: Request) {
  try {
    // 1. Zero Trust Role Enforcement (Vendor only)
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;
    
    if (!sessionCookie || !adminAuth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decodedSession = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    const user = await prisma.user.findUnique({ where: { firebaseUid: decodedSession.uid } });
    if (!user || user.role !== 'VENDOR') {
      return NextResponse.json({ error: "Insufficient Zero Trust Clearance - Vendor Only" }, { status: 403 });
    }

    // 2. Validate payload
    const body = await request.json();
    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: "Invalid Product Matrix" }, { status: 400 });

    const { title, description, price, inventory, imageUrl } = parsed.data;

    // 3. Static Alt-Text Generation (Intelligent Caching mechanism) 
    // Triggers Background processing logic
    const generatedAltText = await GeminiService.generateProductAltText(imageUrl, title);

    // 4. Save to Persistent Store ensuring Zero Trust defaults
    const product = await prisma.product.create({
      data: {
        title,
        description,
        price,
        inventory,
        imageUrl,
        geminiAltText: generatedAltText, // Static cache is stored permanently
      }
    });

    return NextResponse.json({ success: true, product });

  } catch (error) {
    console.error('Product Generation Error:', error);
    return NextResponse.json({ error: "Product Ingestion Failure" }, { status: 500 });
  }
}
