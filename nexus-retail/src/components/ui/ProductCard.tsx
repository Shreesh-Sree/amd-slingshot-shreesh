"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useCart } from '@/components/providers/CartProvider';

export interface ProductData {
  id: string;
  title: string;
  description: string;
  price: number;
  geminiAltText: string; 
  imageUrl: string;
  isLocalFirst?: boolean;
}

export default function ProductCard({ product }: { product: ProductData }) {
  const { addItem, toggleCart } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      geminiAltText: product.geminiAltText,
    });
    // Optional: Open cart drawer or show success state
  };

  return (
    <motion.article 
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative flex flex-col bg-white/70 dark:bg-slate-900/60 backdrop-blur-md rounded-3xl overflow-hidden border border-slate-200/50 dark:border-slate-800/80 shadow-lg hover:shadow-2xl transition-all duration-300"
      tabIndex={0}
      aria-labelledby={`product-title-${product.id}`}
      aria-describedby={`product-desc-${product.id}`}
    >
      <div className="relative h-64 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.geminiAltText}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        
        {product.isLocalFirst && (
          <div className="absolute top-4 left-4 bg-green-500/90 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm backdrop-blur-sm" role="status">
            🌱 Local First
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h2 id={`product-title-${product.id}`} className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
            {product.title}
          </h2>
          <span className="text-lg font-extrabold text-[var(--cta)]">
            ${product.price.toFixed(2)}
          </span>
        </div>
        
        <p id={`product-desc-${product.id}`} className="text-xs text-slate-600 dark:text-slate-400 mb-6 flex-grow line-clamp-2">
          {product.description}
        </p>

        <button 
          onClick={handleAddToCart}
          className="btn-cta w-full text-sm !py-3 !rounded-2xl"
          aria-label={`Add ${product.title} to requisition`}
        >
          Add to Requisition
        </button>
      </div>
    </motion.article>
  );
}
