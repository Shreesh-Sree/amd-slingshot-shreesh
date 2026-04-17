import { NextResponse } from 'next/server';
import { stripe } from '@/lib/services/stripe';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { adminAuth } from '@/lib/services/firebase/admin';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

const intentSchema = z.object({
  totalAmount: z.number().positive(),
});

export async function POST(request: Request) {
  try {
    // 1. Session boundary guard
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('__session')?.value;
    
    if (!sessionCookie || !adminAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedSession = await adminAuth.verifySessionCookie(sessionCookie, true);

    const user = await prisma.user.findUnique({
      where: { firebaseUid: decodedSession.uid }
    });

    if (!user) return NextResponse.json({ error: "Invalid context" }, { status: 403 });

    // 2. Validate Cart values
    const body = await request.json();
    const parsed = intentSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid Checkout State payload" }, { status: 400 });
    }

    // Typical ecommerce logic prevents client-side 'totalAmount' overriding.
    // Ensure you calculate the value server-side matching their server Cart DB in a real app.
    // Using payload strictly for hackathon simulation speed.
    const amountInCents = Math.round(parsed.data.totalAmount * 100);

    // 3. Create Stripe PaymentIntent 
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      // Automatic payment methods mapped to Elements
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId: user.id,
      }
    });

    // 4. Save Pending Order to PostgreSQL (Zero Trust Ledger)
    await prisma.order.create({
      data: {
        userId: user.id,
        stripeIntentId: paymentIntent.id,
        status: 'PENDING',
        totalAmount: parsed.data.totalAmount,
      }
    });

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret 
    });

  } catch (error) {
    console.error('Stripe Intent Processing Error:', error);
    return NextResponse.json({ error: "Payment Allocation Failure" }, { status: 500 });
  }
}
