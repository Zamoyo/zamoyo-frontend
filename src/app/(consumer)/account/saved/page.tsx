"use client";

import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ProductCard, type Product } from "@/components/productCard";

// --- MOCK DATA ---
const SAVED_ITEMS: Product[] = [
  { id: 2, title: "Apple Magic Mouse - Black Multi-Touch", price: 1800, oldPrice: 2200, discount: 18, badge: "Popular", rating: 4.6, reviews: 45, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80" },
  { id: 4, title: "Laptop Sleeve 13-inch - Waterproof", price: 250, oldPrice: 350, discount: 28, badge: "New", rating: 4.3, reviews: 24, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80" },
  { id: 104, title: "MacBook Air M2 Screen Protector", price: 350, oldPrice: 500, discount: 30, badge: "Sale", rating: 4.5, reviews: 67, image: "https://images.unsplash.com/photo-1531297172867-4d4ce2e226d9?auto=format&fit=crop&w=800&q=80" }
];

export default function SavedItemsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">Saved Items</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1">Items you&apos;ve favorited to buy later.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Search your wishlist..." 
            className="pl-9 h-11 bg-white border-zinc-200/60 rounded-xl focus-visible:ring-[#009E49] shadow-sm"
          />
        </div>
      </div>

      {/* Product Grid */}
      {SAVED_ITEMS.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-zinc-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.04)] flex flex-col items-center justify-center">
          <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-400">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">Your wishlist is empty</h3>
          <p className="text-sm text-zinc-500 mt-1">Start saving items you like by clicking the heart icon.</p>
          <Link href="/" className="mt-6 text-sm font-bold text-[#009E49] hover:underline">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {SAVED_ITEMS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}