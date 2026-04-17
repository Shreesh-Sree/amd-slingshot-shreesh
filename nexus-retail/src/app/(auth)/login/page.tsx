"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { loginWithGoogle, user } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
      router.push("/shop/discover");
    } catch (error) {
      console.error("Login Error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (user) {
    router.push("/shop/discover");
    return null;
  }

  return (
    <main className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-6 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg glass-strong p-10 md:p-14 rounded-[3rem] shadow-2xl text-center"
        role="region"
        aria-labelledby="login-heading"
      >
        <div className="mb-12">
          <motion.div 
            initial={{ y: -10 }}
            animate={{ y: 0 }}
            className="inline-block p-4 rounded-3xl bg-[var(--border)] mb-8"
          >
            <svg className="w-10 h-10 text-[var(--cta)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
          </motion.div>
          <h1 id="login-heading" className="text-4xl font-black tracking-tight mb-4">
            Secured Login<span className="text-[var(--cta)]">.</span>
          </h1>
          <p className="text-[var(--secondary)] font-medium max-w-xs mx-auto">
            Authorized access only. Verified Zero-Trust identity protocol required.
          </p>
        </div>

        <button
          onClick={handleLogin}
          disabled={isLoggingIn}
          aria-busy={isLoggingIn}
          className="btn-cta w-full flex items-center justify-center gap-4 text-lg !py-5"
        >
          {isLoggingIn ? (
            <span className="flex items-center gap-3">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Verifying...
            </span>
          ) : (
            <>
              <svg className="w-6 h-6" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" opacity="0.8"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="currentColor" opacity="0.6"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" opacity="0.7"/>
              </svg>
              Verify with Google
            </>
          )}
        </button>

        <p className="mt-12 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--muted)]">
          System ID: AMD-SLING-GATEWAY
        </p>
      </motion.div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-[var(--muted)] text-[10px] font-bold tracking-widest uppercase text-center w-full">
        Nexus Retail Identity Module v4.6
      </div>
    </main>
  );
}
