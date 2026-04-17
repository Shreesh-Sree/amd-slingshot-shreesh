"use client";

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useCart } from '@/components/providers/CartProvider';

export default function SuccessPage() {
  const { clearCart } = useCart();

  useEffect(() => {
    // Clear the cart on successful completion
    clearCart();
  }, [clearCart]);

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      {/* Background celebration glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-500/10 blur-[180px] rounded-full animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 glass-strong p-12 md:p-20 rounded-[4rem] max-w-2xl shadow-2xl border-2 border-emerald-500/20"
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative w-24 h-24 mx-auto mb-10"
        >
          <div className="absolute inset-0 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center border border-emerald-500/30 z-10">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </div>
          {/* Subtle accent image */}
          <div className="absolute -inset-4 opacity-40 blur-sm z-0">
             <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=200&q=80" className="w-full h-full object-cover rounded-full" alt="" />
          </div>
        </motion.div>

        <h1 className="text-5xl font-black tracking-tight mb-6">Requisition Authorized.</h1>
        <p className="text-xl text-[var(--secondary)] font-medium mb-12">
          Your gear is being staged at local mountain hubs. You've successfully eliminated 
          approximately <span className="text-emerald-400 font-bold">4.2kg of CO2</span> by choosing 
          Nexus Local-First sourcing.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-12">
          <div className="p-4 rounded-3xl bg-[var(--border)]">
            <p className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">Status</p>
            <p className="text-xs font-black">Authorized</p>
          </div>
          <div className="p-4 rounded-3xl bg-[var(--border)]">
            <p className="text-[8px] font-black uppercase tracking-widest text-[var(--muted)] mb-1">Method</p>
            <p className="text-xs font-black">Zero-Trust Vault</p>
          </div>
        </div>

        <Link
          href="/shop/discover"
          className="btn-cta w-full text-lg !py-5 inline-block"
        >
          Return to Intelligence Hub
        </Link>

        <p className="mt-10 text-[10px] font-black uppercase tracking-[0.4em] text-[var(--muted)]">
          REQUISITION ID: NX-{Math.random().toString(36).substring(7).toUpperCase()}
        </p>
      </motion.div>

      <div className="mt-12 text-[var(--muted)] text-[10px] font-bold tracking-widest uppercase">
        Nexus Retail Sustainability Ledger Updated
      </div>
    </main>
  );
}
