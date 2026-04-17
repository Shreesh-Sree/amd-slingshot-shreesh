"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/AuthProvider";
import { useCart } from "@/components/providers/CartProvider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { motion } from "framer-motion";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count, toggleCart } = useCart();
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-4 left-4 right-4 z-30 glass-strong rounded-2xl"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1.5 focus-ring rounded-lg cursor-pointer">
          <span className="text-lg font-extrabold tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Nexus<span className="text-[var(--cta)]">Retail</span>
          </span>
        </Link>

        {/* Center nav links */}
        <div className="hidden md:flex items-center gap-1">
          <Link href="/shop/discover" className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-[var(--border)] transition-colors cursor-pointer focus-ring">
            Discover
          </Link>
          {user && (
            <>
              <Link href="/shop/checkout" className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-[var(--border)] transition-colors cursor-pointer focus-ring">
                Checkout
              </Link>
              <Link href="/shop/profile" className="px-4 py-2 text-sm font-medium rounded-xl hover:bg-[var(--border)] transition-colors cursor-pointer focus-ring">
                Profile
              </Link>
            </>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl hover:bg-[var(--border)] transition-colors cursor-pointer focus-ring"
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? (
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" /></svg>
            ) : (
              <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" /></svg>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={toggleCart}
            className="relative p-2.5 rounded-xl hover:bg-[var(--border)] transition-colors cursor-pointer focus-ring"
            aria-label={`Shopping cart with ${count} items`}
          >
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
            {count > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[var(--cta)] text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {count}
              </motion.span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <button
              onClick={logout}
              className="ml-1 px-4 py-2 text-sm font-semibold rounded-xl bg-[var(--border)] hover:bg-[var(--muted)]/20 transition-colors cursor-pointer focus-ring"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="ml-1 btn-cta text-sm !py-2 !px-5 !rounded-xl"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
