"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/components/providers/AuthProvider';
import Link from 'next/link';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[var(--background)] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-strong p-10 md:p-16 rounded-[4rem] relative overflow-hidden"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] -mr-32 -mt-32" />

          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[var(--border)] group hover:border-[var(--cta)] transition-colors shadow-2xl">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'Profile'} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[var(--border)] flex items-center justify-center text-4xl font-black">
                  {user.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            
            <div className="text-center md:text-left">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[var(--cta)] mb-2">Zero Trust Identity</p>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                {user.displayName || 'Nexus Operator'}
              </h1>
              <p className="text-[var(--secondary)] font-medium">Verified ID: <span className="font-mono text-xs opacity-60">{user.uid}</span></p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 relative z-10">
            <div className="p-8 rounded-3xl bg-[var(--border)]/50 border border-[var(--border)]">
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--muted)] mb-4">Security Status</h3>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-sm font-bold">Active Session Encrypted</p>
              </div>
            </div>
            <div className="p-8 rounded-3xl bg-[var(--border)]/50 border border-[var(--border)]">
              <h3 className="text-sm font-black uppercase tracking-widest text-[var(--muted)] mb-4">Auth Provider</h3>
              <p className="text-sm font-bold flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google Identity Verified
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4 relative z-10">
            <Link href="/shop/discover" className="btn-cta !px-8">
              Return to Hardware Requisition
            </Link>
            <button className="px-8 py-4 rounded-2xl font-bold border border-[var(--border)] hover:bg-[var(--border)] transition-colors text-sm">
              View Audit Logs
            </button>
          </div>
        </motion.div>
        
        <p className="mt-10 text-center text-[10px] font-black uppercase tracking-[0.4em] text-[var(--muted)]">
          Nexus Corp Identity Gateway v4.6-LTC
        </p>
      </div>
    </main>
  );
}
