"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function DummyCheckoutForm({ amount }: { amount: number }) {
  const router = useRouter();
  const [formData, setFormData] = useState({ card: '', expiry: '', cvc: '', zip: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.card.length < 16) {
      setError("Please enter a valid 16-digit card number.");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    // Simulate payment processing flow
    setTimeout(() => {
      setIsProcessing(false);
      router.push('/shop/checkout/success');
    }, 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <label className="block text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2">Card Number</label>
          <input
            type="text"
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            value={formData.card}
            onChange={(e) => setFormData({ ...formData, card: e.target.value })}
            className="w-full bg-transparent border-none text-white placeholder-slate-600 focus:ring-0 text-sm font-mono"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <label className="block text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2">Expiry</label>
            <input
              type="text"
              placeholder="MM / YY"
              maxLength={7}
              value={formData.expiry}
              onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
              className="w-full bg-transparent border-none text-white placeholder-slate-600 focus:ring-0 text-sm font-mono"
              required
            />
          </div>
          <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <label className="block text-[8px] font-black uppercase tracking-widest text-slate-500 mb-2">CVC / ZIP</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="CVC"
                maxLength={3}
                value={formData.cvc}
                onChange={(e) => setFormData({ ...formData, cvc: e.target.value })}
                className="w-16 bg-transparent border-none text-white placeholder-slate-600 focus:ring-0 text-sm font-mono"
                required
              />
              <input
                type="text"
                placeholder="ZIP"
                maxLength={5}
                value={formData.zip}
                onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                className="w-full bg-transparent border-none text-white placeholder-slate-600 focus:ring-0 text-sm font-mono"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold"
        >
          {error}
        </motion.div>
      )}

      <button
        type="submit"
        disabled={isProcessing}
        className="btn-cta w-full text-lg !py-5 flex items-center justify-center gap-3"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing Enclave...
          </>
        ) : (
          `Demo Authorization: $${amount.toFixed(2)}`
        )}
      </button>

      <div className="flex items-center justify-center gap-2 py-2">
        <svg className="w-3 h-3 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L1 21h22L12 2zm0 3.45l8.2 14.15H3.8L12 5.45zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z" />
        </svg>
        <p className="text-[8px] uppercase font-black tracking-widest text-amber-500/80">
          Demo Mode Active • Internal Simulation Only
        </p>
      </div>
    </form>
  );
}
