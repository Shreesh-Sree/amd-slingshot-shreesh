"use client";

import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';

export default function CheckoutForm({ amount }: { amount: number }) {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return; 
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/shop/checkout/success`,
      },
    });

    if (error) {
      setErrorMessage(error.message as string);
    } 

    setIsProcessing(false);
  };

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <PaymentElement className="mb-8" />
      </motion.div>

      {errorMessage && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold mb-6" 
          role="alert"
        >
          {errorMessage}
        </motion.div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="btn-cta w-full text-lg !py-5 flex items-center justify-center gap-3"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Validating Vault...
          </>
        ) : (
          `Authorize $${amount.toFixed(2)}`
        )}
      </button>
      
      <div className="mt-8 flex items-center justify-center gap-2">
        <svg className="w-3 h-3 text-[var(--muted)]" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
        </svg>
        <p className="text-[10px] uppercase font-black tracking-widest text-[var(--muted)]">
          PCI-DSS Compliant Secure Entry
        </p>
      </div>
    </form>
  );
}
