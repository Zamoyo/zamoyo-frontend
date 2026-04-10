"use client";

import Link from "next/link";
import { Star, Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- MOCK DATA (12 items for dense grid fill) ---
const TRENDING_PRODUCTS = [
  {
    id: 101,
    category: "Computing",
    name: "MacBook Air M2 - Space Gray",
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
    price: 26500,
    rating: 4.9,
    reviews: 342,
    badge: "Hot",
  },
  {
    id: 102,
    category: "Fashion",
    name: "Classic Leather Crossbody Bag",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    price: 850,
    rating: 4.7,
    reviews: 128,
    badge: null,
  },
  {
    id: 103,
    category: "Appliances",
    name: "Nespresso Vertuo Coffee Machine",
    image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
    price: 4200,
    rating: 4.8,
    reviews: 85,
    badge: "New",
  },
  {
    id: 104,
    category: "Phones",
    name: "Samsung Galaxy S24 Ultra",
    image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
    price: 29000,
    rating: 5.0,
    reviews: 412,
    badge: "Hot",
  },
  {
    id: 105,
    category: "Sports",
    name: "Premium Yoga Mat",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80",
    price: 450,
    rating: 4.6,
    reviews: 95,
    badge: null,
  },
  {
    id: 106,
    category: "Health",
    name: "Dyson Supersonic Hair Dryer",
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80",
    price: 9500,
    rating: 4.9,
    reviews: 215,
    badge: "Trending",
  },
  {
    id: 107,
    category: "Supermarket",
    name: "Organic Arabica Coffee Beans",
    image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80",
    price: 320,
    rating: 4.8,
    reviews: 512,
    badge: "Best Seller",
  },
  {
    id: 108,
    category: "Fashion",
    name: "Minimalist Chronograph Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    price: 1200,
    rating: 4.7,
    reviews: 176,
    badge: null,
  },
  {
    id: 109,
    category: "Electronics",
    name: "Sony PlayStation 5 Console",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
    price: 12500,
    rating: 4.9,
    reviews: 843,
    badge: "Hot",
  },
  {
    id: 110,
    category: "Fashion",
    name: "Nike Air Max 270 Sneakers",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    price: 2800,
    rating: 4.8,
    reviews: 320,
    badge: null,
  },
  {
    id: 111,
    category: "Health",
    name: "Waterpik Aquarius Flosser",
    image: "https://images.unsplash.com/photo-1559523182-a284c3fb7cff?auto=format&fit=crop&w=800&q=80",
    price: 1800,
    rating: 4.8,
    reviews: 215,
    badge: null,
  },
  {
    id: 112,
    category: "Computing",
    name: "Logitech MX Master 3S Mouse",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
    price: 2200,
    rating: 4.9,
    reviews: 843,
    badge: "Top Rated",
  }
];

export function TrendingProducts() {
  return (
    <section className="container mx-auto max-w-7xl px-4 md:px-6 pt-6 md:pt-8">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 md:mb-5">
        <div className="flex items-center gap-3">
          <h3 className="text-xl md:text-2xl font-black text-zinc-900 tracking-tight">
            Trending Near You
          </h3>
          <Badge className="hidden md:flex bg-zinc-100 text-zinc-600 border-none hover:bg-zinc-200 transition-colors">
            Lusaka Region
          </Badge>
        </div>

        <Link href="/trending" className="flex items-center text-sm font-bold text-[#FF6B00] hover:underline group">
          View all trending <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Grid wrapper remains exactly the same */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 md:gap-4">
        {TRENDING_PRODUCTS.map((product) => (
          <div key={product.id} className="group relative bg-white rounded-2xl border border-zinc-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col">
            
            {/* THE FIX: Changed from aspect-square to aspect-[4/3] mobile and aspect-[5/4] desktop to chop vertical height */}
            <div className="relative aspect-4/3 md:aspect-5/4 w-full bg-zinc-50 p-2 overflow-hidden flex items-center justify-center">
              
              {/* Badge */}
              {product.badge && (
                <Badge className="absolute top-2 left-2 z-10 bg-zinc-900 text-white border-none shadow-sm font-bold text-[9px] md:text-[10px] px-1.5 py-0">
                  {product.badge}
                </Badge>
              )}

              {/* Heart Button */}
              <button className="absolute top-2 right-2 z-10 h-6 w-6 md:h-7 md:w-7 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md border border-zinc-200 text-zinc-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors shadow-sm">
                <Heart className="h-3 w-3 md:h-3.5 md:w-3.5" />
              </button>

              <div 
                className="absolute inset-3 bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110 mix-blend-multiply"
                style={{ backgroundImage: `url('${product.image}')` }}
              ></div>
            </div>

            {/* Content Container - Tightened padding (p-2.5) and squashed bottom margins */}
            <div className="p-2.5 md:p-3 flex flex-col flex-1 bg-white">
              <span className="text-[9px] md:text-[10px] font-bold text-[#009E49] uppercase tracking-wider mb-0.5">
                {product.category}
              </span>
              
              <Link href={`/product/${product.id}`} className="text-[11px] md:text-sm font-bold text-zinc-800 line-clamp-2 hover:text-[#009E49] transition-colors leading-tight mb-1">
                {product.name}
              </Link>
              
              <div className="flex items-center gap-1 mb-1.5 md:mb-2">
                <Star className="h-2.5 w-2.5 md:h-3 md:w-3 fill-amber-400 text-amber-400" />
                <span className="text-[10px] md:text-xs font-bold text-zinc-700">{product.rating}</span>
                <span className="text-[9px] md:text-[10px] text-zinc-400 font-medium">({product.reviews})</span>
              </div>

              {/* Bottom Row */}
              <div className="mt-auto flex items-center justify-between">
                <span className="text-sm md:text-base font-black text-zinc-900 tracking-tight">
                  K{product.price.toLocaleString()}
                </span>
                <Button size="icon" className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-zinc-100 hover:bg-[#009E49] text-zinc-900 hover:text-white transition-colors shadow-sm">
                  <ShoppingBag className="h-3 w-3 md:h-3.5 md:w-3.5" />
                </Button>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </section>
  );
}