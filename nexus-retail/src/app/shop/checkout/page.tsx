"use client";

import React, { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from '@/components/ui/CheckoutForm';
import DummyCheckoutForm from '@/components/ui/DummyCheckoutForm';
import { useAuth } from '@/components/providers/AuthProvider';
import { useCart } from '@/components/providers/CartProvider';
import { motion } from 'framer-motion';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_fallback");

export default function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isError, setIsError] = useState(false);
  const { user } = useAuth();
  const { items, total } = useCart();

  useEffect(() => {
    if (total <= 0) return;

    // Timeout to offer Demo Mode if backend is slow/missing
    const demoTimeout = setTimeout(() => {
      if (!clientSecret) setIsError(true);
    }, 5000);

    fetch('/api/checkout/intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ totalAmount: total }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("API Failure");
        return res.json();
      })
      .then((data) => {
        setClientSecret(data.clientSecret);
        clearTimeout(demoTimeout);
      })
      .catch((err) => {
        console.warn("Stripe initialization failed, switching to fallback capability.");
        setIsError(true);
        clearTimeout(demoTimeout);
      });
      
    return () => clearTimeout(demoTimeout);
  }, [total, clientSecret]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-3xl font-black mb-4">Your Requisition is Empty</h2>
        <p className="text-[var(--secondary)] mb-8">You haven't added any gear to your context-aware cart yet.</p>
        <a href="/shop/discover" className="btn-cta !px-10">Return to Store</a>
      </div>
    );
  }

  if (!clientSecret && !isDemoMode) {
    if (isError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="glass-strong p-12 rounded-[3rem] max-w-md">
            <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black mb-4">Secured Enclave Verification</h2>
            <p className="text-sm text-[var(--secondary)] mb-8">Manual entry required for this requisition. Proceed with Demo Authorization?</p>
            <button onClick={() => setIsDemoMode(true)} className="btn-cta w-full">Enable Demo Enrollment</button>
          </div>
        </div>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[var(--border)] border-t-[var(--cta)] rounded-full animate-spin" />
          <p className="text-[10px] font-black tracking-widest uppercase text-[var(--muted)]">Securing Enclave...</p>
        </div>
      </div>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'night' as const,
      variables: {
        colorPrimary: '#FFD700',
        colorBackground: '#0F172A',
        colorText: '#ffffff',
        borderRadius: '16px',
      },
    },
  };

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Order Summary */}
          <section className="order-2 lg:order-1">
            <h1 className="text-4xl font-black tracking-tight mb-8">Complete Requisition<span className="text-[var(--cta)]">.</span></h1>
            
            <div className="glass-strong p-8 rounded-[2.5rem] mb-8">
              <h2 className="text-xs font-black tracking-[0.3em] uppercase text-[var(--muted)] mb-6">Inventory Items</h2>
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-4">
                    <img src={item.imageUrl} alt={item.geminiAltText} className="w-16 h-16 rounded-xl object-cover" />
                    <div className="flex-grow">
                      <h3 className="font-bold text-sm">{item.title}</h3>
                      <p className="text-[10px] text-[var(--muted)]">QTY: {item.quantity}</p>
                    </div>
                    <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-[var(--border)]">
                <div className="flex justify-between items-center text-xl font-black">
                  <span>Total Capital Allocation</span>
                  <span className="text-[var(--cta)]">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-4">
              <svg className="w-6 h-6 text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
              <div>
                <h4 className="font-bold text-sm text-blue-300">Local First Sourcing Validated</h4>
                <p className="text-xs text-blue-200/60 mt-1">Shipping carbon offset: 92%. Items allocated from participating mountain retailers within 5 mi.</p>
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section className="order-1 lg:order-2 sticky top-32">
            <div className="glass-strong p-8 md:p-12 rounded-[2.5rem] border-2 border-[var(--cta)]/20 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xs font-black tracking-[0.3em] uppercase text-[var(--muted)]">Secured Terminal</h2>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[8px] font-bold text-green-500 uppercase">Encrypted</span>
                </div>
              </div>
              
              {isDemoMode ? (
                <DummyCheckoutForm amount={total} />
              ) : (
                <Elements stripe={stripePromise} options={options}>
                  <CheckoutForm amount={total} />
                </Elements>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
