import { NextResponse } from 'next/server';
import { stripe } from '@/lib/services/stripe';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature') as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (!webhookSecret) throw new Error('Webhook secret missing');
    // Verifies the event truly came from Stripe (Zero Trust Webhook)
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      
      // Update Database Ledger: PENDING -> PAID
      await prisma.order.update({
        where: { stripeIntentId: paymentIntent.id },
        data: { status: 'PAID' }
      });
      
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      break;
    
    case 'payment_intent.payment_failed':
      const failedIntent = event.data.object;
      await prisma.order.update({
        where: { stripeIntentId: failedIntent.id },
        data: { status: 'FAILED' }
      });
      break;
      
    // ... handle other event types
    default:
      console.log(`Unhandled Stripe event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}
