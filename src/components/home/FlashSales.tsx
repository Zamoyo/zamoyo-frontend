"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Star, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- MOCK DATA ---
const FLASH_PRODUCTS = [
  {
    id: 1,
    name: "Apple iPhone 15 Pro Max - 256GB",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    price: 24500,
    originalPrice: 28000,
    rating: 4.9,
    reviews: 124,
    discount: 12,
  },
  {
    id: 2,
    name: "Sony WH-1000XM5 Wireless Headphones",
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
    price: 6800,
    originalPrice: 8500,
    rating: 4.8,
    reviews: 89,
    discount: 20,
  },
  {
    id: 3,
    name: "Samsung 55\" Smart 4K UHD TV",
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
    price: 11200,
    originalPrice: 14000,
    rating: 4.7,
    reviews: 56,
    discount: 20,
  },
  {
    id: 4,
    name: "Nike Air Force 1 '07",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    price: 2100,
    originalPrice: 3000,
    rating: 4.9,
    reviews: 210,
    discount: 30,
  },
  {
    id: 5,
    name: "Dell XPS 13 Laptop - 16GB RAM",
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
    price: 22000,
    originalPrice: 26000,
    rating: 4.6,
    reviews: 42,
    discount: 15,
  },
  {
    id: 6,
    name: "PlayStation 5 Console",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
    price: 12500,
    originalPrice: 14000,
    rating: 4.9,
    reviews: 312,
    discount: 10,
  }
];

export function FlashSales() {
  // Simple countdown logic for the UI
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-6 pt-6">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3 md:mb-4">
        <div className="flex items-center gap-4">
          <h3 className="text-xl md:text-2xl font-black text-zinc-900 tracking-tight flex items-center gap-2">
            <span className="flex h-7 w-7 md:h-8 md:w-8 items-center justify-center rounded-lg bg-[#FF6B00] text-white text-sm md:text-base">
              ⚡
            </span>
            Flash Sales
          </h3>
          
          {/* Countdown Timer */}
          <div className="flex items-center gap-1.5 text-xs md:text-sm font-bold">
            <Clock className="h-3.5 w-3.5 md:h-4 md:w-4 text-zinc-400" />
            <span className="text-zinc-500 hidden sm:inline">Ends in:</span>
            <div className="flex items-center gap-1">
              <span className="bg-red-500 text-white px-1.5 md:px-2 py-0.5 rounded-md shadow-sm">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-red-500">:</span>
              <span className="bg-red-500 text-white px-1.5 md:px-2 py-0.5 rounded-md shadow-sm">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-red-500">:</span>
              <span className="bg-red-500 text-white px-1.5 md:px-2 py-0.5 rounded-md shadow-sm">{String(timeLeft.seconds).padStart(2, '0')}</span>
            </div>
          </div>
        </div>

        <Link href="/flash-sales" className="hidden md:flex items-center text-sm font-bold text-[#009E49] hover:underline group">
          See all deals <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Products Horizontal Scroll - Tightened Gap */}
      <div className="flex overflow-x-auto pb-6 -mx-4 px-4 md:mx-0 md:px-0 gap-3 md:gap-4 hide-scrollbar snap-x snap-mandatory">
        {FLASH_PRODUCTS.map((product) => (
          /* COMPACT SIZING: min-w-[160px] mobile, min-w-[200px] desktop */
          <div key={product.id} className="min-w-40 md:min-w-50 snap-start group relative bg-white rounded-2xl border border-zinc-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col">
            
            {/* Image Container - Tighter Padding */}
            <div className="relative aspect-square w-full bg-zinc-50 p-3 overflow-hidden">
              <Badge className="absolute top-2 left-2 z-10 bg-red-500 text-white border-none shadow-sm font-bold text-[10px] px-1.5 py-0">
                -{product.discount}%
              </Badge>
              <div 
                className="absolute inset-3 bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-110 mix-blend-multiply"
                style={{ backgroundImage: `url('${product.image}')` }}
              ></div>
              
              {/* Quick Add Overlay - Smaller Button */}
              <div className="absolute inset-0 bg-black/5 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button size="sm" className="bg-[#009E49] hover:bg-[#00853d] text-white shadow-lg rounded-lg font-bold px-4 h-8 text-xs translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <ShoppingCart className="mr-1.5 h-3.5 w-3.5" /> Add
                </Button>
              </div>
            </div>

            {/* Content Container - Tighter Text & Padding */}
            <div className="p-3 flex flex-col flex-1">
              <Link href={`/product/${product.id}`} className="text-xs md:text-sm font-bold text-zinc-800 line-clamp-2 hover:text-[#009E49] transition-colors leading-snug">
                {product.name}
              </Link>
              
              <div className="flex items-center gap-1 mt-1.5">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span className="text-[11px] md:text-xs font-bold text-zinc-700">{product.rating}</span>
                <span className="text-[9px] md:text-[10px] text-zinc-400 font-medium">({product.reviews})</span>
              </div>

              <div className="mt-auto pt-2 flex items-end gap-1.5">
                <span className="text-sm md:text-base font-black text-zinc-900 tracking-tight">K{product.price.toLocaleString()}</span>
                <span className="text-[10px] md:text-xs font-semibold text-zinc-400 line-through mb-0.5">K{product.originalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}