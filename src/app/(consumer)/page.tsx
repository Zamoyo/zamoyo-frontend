"use client";

import * as React from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { 
  Smartphone, Laptop, Shirt, ShoppingBasket, 
  Tv, HeartPulse, Dumbbell, Sofa 
} from "lucide-react";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FlashSales } from "@/components/home/FlashSales";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { TrustBanner } from "@/components/home/TrustBanner";

// --- MOCK DATA ---
const CATEGORIES = [
  { name: "Phones", icon: Smartphone, color: "bg-blue-500/10 text-blue-600" },
  { name: "Computing", icon: Laptop, color: "bg-zinc-500/10 text-zinc-600" },
  { name: "Fashion", icon: Shirt, color: "bg-pink-500/10 text-pink-600" },
  { name: "Supermarket", icon: ShoppingBasket, color: "bg-[#009E49]/10 text-[#009E49]" },
  { name: "Appliances", icon: Tv, color: "bg-purple-500/10 text-purple-600" },
  { name: "Health", icon: HeartPulse, color: "bg-red-500/10 text-red-600" },
  { name: "Sports", icon: Dumbbell, color: "bg-[#FF6B00]/10 text-[#FF6B00]" },
  { name: "Home", icon: Sofa, color: "bg-amber-500/10 text-amber-600" },
];

const CAROUSEL_BANNERS = [
  {
    title: "Grand Opening Sale",
    subtitle: "Welcome to Zamoyo. Shop across all categories with massive discounts.",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=2070&q=80",
    cta: "Start Shopping",
    color: "from-[#009E49]/95 via-[#009E49]/70 to-transparent",
    badge: "Welcome"
  },
  {
    title: "Black Friday Deals",
    subtitle: "The biggest tech and electronics price drops of the entire year.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=2070&q=80",
    cta: "Shop Electronics",
    color: "from-zinc-950/95 via-zinc-900/80 to-transparent",
    badge: "Featured"
  },
  {
    title: "Up to 50% Off",
    subtitle: "Refresh your wardrobe with half-price deals on top global brands.",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2070&q=80",
    cta: "Shop Fashion",
    color: "from-[#FF6B00]/95 via-[#FF6B00]/70 to-transparent",
    badge: "Promo"
  }
];

export default function HomePage() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false }) // Forces it to never stop
  );

  return (
    <main className="min-h-screen bg-[#f4fbf6]">
      
      {/* --- HERO SECTION --- */}
      <section className="container mx-auto max-w-7xl px-4 md:px-6 pt-4 md:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* Main Carousel */}
          <div className="lg:col-span-3">
            <Carousel 
              options={{ loop: true }}
              plugins={[plugin.current, Fade()]}
              className="w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-lg border border-zinc-200/50"
            >
              <CarouselContent>
                {CAROUSEL_BANNERS.map((banner, index) => (
                  <CarouselItem key={index}>
                    {/* Tailwind v4 native aspect-21/9 */}
                    <div className="relative aspect-video md:aspect-21/9 w-full flex items-center">
                      <div 
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${banner.image}')` }}
                      ></div>
                      {/* Tailwind v4 linear-to-r */}
                      <div className={`absolute inset-0 bg-linear-to-r ${banner.color}`}></div>
                      
                      {/* Independent Badge pinned to absolute top-left */}
                      <div className="absolute top-2 left-3 md:top-6 md:left-8 z-20">
                        <Badge className="bg-white/20 text-white backdrop-blur-md border-white/20 px-3 py-1 shadow-sm font-bold tracking-wide">
                          {banner.badge}
                        </Badge>
                      </div>
                      
                      {/* Banner Content */}
                      <div className="relative z-10 px-6 md:px-12 max-w-xl space-y-1 md:space-y-4 mt-6 md:mt-0">
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-white leading-tight drop-shadow-md">
                          {banner.title}
                        </h2>
                        <p className="text-sm md:text-lg text-white/90 font-medium max-w-md drop-shadow-sm">
                          {banner.subtitle}
                        </p>
                        <Button className="mt-4 bg-white text-zinc-900 hover:bg-zinc-100 font-bold px-8 h-12 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.15)] transition-transform hover:scale-105">
                          {banner.cta}
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex left-4 bg-white/20 hover:bg-white/40 text-white border-white/40 backdrop-blur-md" />
              <CarouselNext className="hidden md:flex right-4 bg-white/20 hover:bg-white/40 text-white border-white/40 backdrop-blur-md" />
            </Carousel>
          </div>

          {/* Static Side Banners */}
          <div className="hidden lg:flex flex-col gap-6 h-full">
            {/* Free Delivery Banner - Swapped to a package delivery worker */}
            <div className="flex-1 relative rounded-3xl overflow-hidden shadow-lg border border-zinc-200/50 group cursor-pointer">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
              {/* Tailwind v4 linear-to-t */}
              <div className="absolute inset-0 bg-linear-to-t from-[#FF6B00]/95 via-[#FF6B00]/40 to-transparent"></div>
              <div className="absolute top-4 left-4 z-20">
                <Badge className="bg-white/20 text-white backdrop-blur-md border-white/20 px-2 py-0.5 text-[10px] shadow-sm font-bold">
                  Promo
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 p-6 z-10">
                <h3 className="text-xl font-black text-white leading-tight">Free Delivery</h3>
                <p className="text-xs text-white/90 font-medium mt-1">On your first order in Lusaka.</p>
              </div>
            </div>

            {/* Audio Fest Banner - Swapped to premium dark headphones */}
            <div className="flex-1 relative rounded-3xl overflow-hidden shadow-lg border border-zinc-200/50 group cursor-pointer">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110"></div>
              {/* Tailwind v4 linear-to-t */}
              <div className="absolute inset-0 bg-linear-to-t from-[#009E49]/95 via-[#009E49]/40 to-transparent"></div>
              <div className="absolute top-4 left-4 z-20">
                <Badge className="bg-white/20 text-white backdrop-blur-md border-white/20 px-2 py-0.5 text-[10px] shadow-sm font-bold">
                  Sale
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 p-6 z-10">
                <h3 className="text-xl font-black text-white leading-tight">Audio Fest</h3>
                <p className="text-xs text-white/90 font-medium mt-1">Headphones up to 20% off.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- VISUAL CATEGORIES ROW --- */}
      <section className="container mx-auto max-w-7xl px-4 md:px-6 pt-6">
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <h3 className="text-lg md:text-xl font-bold text-zinc-900 tracking-tight">Shop by Category</h3>
          <Link href="/categories" className="text-sm font-bold text-[#FF6B00] hover:underline">
            View All
          </Link>
        </div>
        
        <div className="flex overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 gap-4 md:gap-6 hide-scrollbar">
          {CATEGORIES.map((category, index) => (
            <Link key={index} href={`/category/${category.name.toLowerCase()}`} className="flex flex-col items-center gap-3 min-w-20 md:min-w-25 group">
              <div className={`h-16 w-16 md:h-20 md:w-20 rounded-2xl flex items-center justify-center ${category.color} border border-zinc-200/50 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:shadow-md`}>
                <category.icon className="h-7 w-7 md:h-8 md:w-8" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-zinc-700 text-center group-hover:text-[#009E49] transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* --- FLASH SALES MODULE --- */}
      <FlashSales />

      {/* --- TRENDING PRODUCTS MODULE --- */}
      <TrendingProducts />

      {/* --- TRUST & SECURITY BANNER --- */}
      <TrustBanner />

    </main>
  );
}