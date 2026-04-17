"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  geminiAltText: string;
  qty: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  total: number;
  count: number;
  isOpen: boolean;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextType>({
  items: [],
  addItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  total: 0,
  count: 0,
  isOpen: false,
  toggleCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from storage
  useEffect(() => {
    const saved = localStorage.getItem("nexus_cart");
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Cart hydration failed");
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to storage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("nexus_cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addItem = useCallback((item: Omit<CartItem, "qty">) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
    setIsOpen(true); // Auto-open cart on add
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);
  const toggleCart = useCallback(() => setIsOpen((p) => !p), []);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, count, isOpen, toggleCart }}>
      {children}

      {/* ─── SLIDE-OVER CART DRAWER ─── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleCart}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[var(--surface)] border-l border-[var(--border)] shadow-2xl flex flex-col"
              role="dialog"
              aria-label="Shopping cart"
            >
              <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <h2 className="font-[var(--font-heading)] text-xl font-bold">Your Cart ({count})</h2>
                <button onClick={toggleCart} className="p-2 rounded-xl hover:bg-[var(--border)] transition-colors focus-ring cursor-pointer" aria-label="Close cart">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 && (
                  <p className="text-center text-[var(--muted)] py-12">Your cart is empty.</p>
                )}
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 rounded-2xl glass">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={item.imageUrl} alt={item.geminiAltText} className="w-20 h-20 rounded-xl object-cover" loading="lazy" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.title}</p>
                      <p className="text-sm text-[var(--muted)]">Qty: {item.qty}</p>
                      <p className="font-bold text-[var(--cta)] mt-1">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="self-start p-1.5 rounded-lg hover:bg-[var(--danger)]/10 text-[var(--danger)] transition-colors cursor-pointer focus-ring" aria-label={`Remove ${item.title} from cart`}>
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.166m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" /></svg>
                    </button>
                  </div>
                ))}
              </div>

              {items.length > 0 && (
                <div className="p-6 border-t border-[var(--border)] space-y-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-[var(--cta)]">${total.toFixed(2)}</span>
                  </div>
                  <Link href="/shop/checkout" onClick={toggleCart} className="btn-cta block text-center w-full rounded-2xl">
                    Proceed to Checkout
                  </Link>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
