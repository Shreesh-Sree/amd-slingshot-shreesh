"use client";

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard, { ProductData } from '@/components/ui/ProductCard';
import { GeoService } from '@/lib/services/geo';

type ContextType = 'MOUNTAIN' | 'BEACH' | 'URBAN';

export default function DiscoverPage() {
  const [products, setProducts] = useState<ProductData[]>([]);
  const [loading, setLoading] = useState(true);
  const [context, setContext] = useState<ContextType>('MOUNTAIN');

  useEffect(() => {
    // Simulate Gemini Intelligence analyzing the context
    setLoading(true);
    
    const timer = setTimeout(() => {
      const userLocation = { lat: 37.7749, lng: -122.4194 }; // SF

      const inventory: Record<ContextType, any[]> = {
        MOUNTAIN: [
          {
            id: "m-1",
            title: "Alpha SV Alpine Shell",
            description: "Severe weather protection for high-altitude endurance.",
            price: 899.00,
            geminiAltText: "A rugged orange winter shell with reinforced zippers and storm hood.",
            imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80",
            storeLocation: { lat: 37.7800, lng: -122.4200 }
          },
          {
            id: "m-2",
            title: "Prizm Snow Goggles",
            description: "High-contrast optics for whiteout conditions.",
            price: 210.00,
            geminiAltText: "Sleek frameless goggles with an iridescent lens reflecting alpine peaks.",
            imageUrl: "https://images.unsplash.com/photo-1555462551-fca7d5c9d64f?auto=format&fit=crop&w=800&q=80",
            storeLocation: { lat: 37.6000, lng: -122.3000 }
          },
          {
            id: "m-3",
            title: "Titan GORE-TEX Mitts",
            description: "Deep winter insulation with smartphone-compatible liners.",
            price: 95.00,
            geminiAltText: "Heavy-duty black snow mittens with a waterproof GORE-TEX texture.",
            imageUrl: "https://images.unsplash.com/photo-1520116468816-95b69f847357?auto=format&fit=crop&w=800&q=80",
            storeLocation: { lat: 37.7749, lng: -122.4194 }
          },
          {
            id: "m-4",
            title: "Carbon Expedition Poles",
            description: "Ultralight carbon shafts with rapid deployment locks.",
            price: 165.00,
            geminiAltText: "Pair of matte black trekking poles with ergonomic cork handles.",
            imageUrl: "https://images.unsplash.com/photo-1565992441121-4367c2967103?auto=format&fit=crop&w=800&q=80",
            storeLocation: { lat: 37.7900, lng: -122.4000 }
          }
        ],
        BEACH: [
          {
            id: "b-1",
            title: "Polarized Destin Shades",
            description: "Marine-grade polarization for intense coastal glare.",
            price: 185.00,
            geminiAltText: "Classic tortoise-shell sunglasses with deep blue polarized lenses.",
            imageUrl: "https://images.unsplash.com/photo-1511499767350-a1590fdb7301?auto=format&fit=crop&w=800&q=80",
            storeLocation: { lat: 37.7700, lng: -122.4500 }
          },
          {
            id: "b-2",
            title: "Flow State Longboard",
            description: "Handcrafted bamboo deck for smooth coastal carving.",
            price: 240.00,
            geminiAltText: "A minimal bamboo surfboard with a single black fin and gloss coating.",
            imageUrl: "https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?auto=format&fit=crop&w=800&q=80",
            storeLocation: { lat: 37.7400, lng: -122.4800 }
          },
          {
            id: "b-3",
            title: "Stormproof Gear Tote",
            description: "Welded seam construction for 100% dry storage.",
            price: 110.00,
            geminiAltText: "A roll-top waterproof backpack in matte mustard yellow.",
            imageUrl: "https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=800&q=80",
            storeLocation: { lat: 37.7749, lng: -122.4194 }
          },
          {
            id: "b-4",
            title: "Eco-Tech Boardshorts",
            description: "Recycled ocean plastic weave with 4-way mechanical stretch.",
            price: 78.00,
            geminiAltText: "Navy blue swim shorts with a subtle topographic design pattern.",
            imageUrl: "https://images.unsplash.com/photo-1526315535315-99881775266b?auto=format&fit=crop&w=800&q=80",
            storeLocation: { lat: 37.7800, lng: -122.4400 }
          }
        ],
        URBAN: [
          {
            id: "u-1",
            title: "Tech-Knit Commuter Blazer",
            description: "Water-repellent formal wear with integrated modular storage.",
            price: 450.00,
            geminiAltText: "A charcoal gray tailored tech blazer with hidden aesthetic zippers.",
            imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
            storeLocation: { lat: 37.7749, lng: -122.4194 }
          },
          {
            id: "u-2",
            title: "Acoustic Silence Pods",
            description: "Adaptive noise cancellation for metropolitan transit.",
            price: 299.00,
            geminiAltText: "Matte black over-ear headphones with premium leather cushioning.",
            imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
            storeLocation: { lat: 37.7850, lng: -122.4100 }
          },
          {
            id: "u-3",
            title: "Modular Grid Backpack",
            description: "Expandable 20L to 30L chassis with anti-theft magnetic locks.",
            price: 220.00,
            geminiAltText: "A futuristic black backpack with MOLLE webbing and sleek hardware.",
            imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
            storeLocation: { lat: 37.7700, lng: -122.4300 }
          },
          {
            id: "u-4",
            title: "Vapor-Mist Flask",
            description: "Vacuum insulated titanium with built-in filtration.",
            price: 85.00,
            geminiAltText: "A titanium water bottle with a unique iridescent metallic finish.",
            imageUrl: "https://images.unsplash.com/photo-1523362628242-f9c3f4ceba21?auto=format&fit=crop&w=800&q=80",
            storeLocation: { lat: 37.7900, lng: -122.4200 }
          }
        ]
      };

      const processed = inventory[context].map(prod => ({
        ...prod,
        isLocalFirst: GeoService.isWithinSustainableRadius(userLocation, prod.storeLocation, 5.0)
      }));

      setProducts(processed);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [context]);

  return (
    <main className="min-h-screen bg-[var(--background)] p-6 pt-32 pb-24">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] font-black tracking-[0.4em] uppercase text-[var(--cta)] mb-4"
            >
              Gemini Intelligence Hub
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-black tracking-tight"
            >
              {context === 'MOUNTAIN' && "Your Alpine Requisition."}
              {context === 'BEACH' && "Coastal Optimized Gear."}
              {context === 'URBAN' && "Metropolitan Performance."}
            </motion.h1>
            <p className="mt-4 text-[var(--secondary)] font-medium">
              Intelligence successfully parsed your upcoming events. Sourcing local inventory 
              within <span className="text-[var(--foreground)] font-bold">5.0 miles</span> to eliminate 
              shipping emissions.
            </p>
          </div>

          <div className="flex bg-[var(--border)] p-1.5 rounded-2xl gap-1">
            {(['MOUNTAIN', 'BEACH', 'URBAN'] as ContextType[]).map((c) => (
              <button
                key={c}
                onClick={() => setContext(c)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all focus-ring ${
                  context === c 
                  ? "bg-[var(--surface)] text-[var(--cta)] shadow-sm" 
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="wait">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={`skel-${i}`} className="h-[420px] rounded-[2.5rem] skeleton" />
              ))
            ) : (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
