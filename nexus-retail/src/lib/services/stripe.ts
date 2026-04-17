import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is missing. Add it to .env for real integration.');
}

// Ensure the real Stripe SDK is utilized in strict test-mode integration
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_fallback', {
  apiVersion: '2025-02-24.acacia', // Best practice: Pin to specific recent Stripe API version
  typescript: true,
  appInfo: {
    name: 'NexusRetail Contextual Commerce',
    version: '0.1.0',
  },
});
