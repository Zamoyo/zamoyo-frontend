"use client";

import * as React from "react";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import {
  Smartphone, Laptop, Shirt, ShoppingBasket, Tv, HeartPulse, Dumbbell, Sofa,
} from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// Assuming these exist in your project
import { FlashSales } from "@/components/home/FlashSales";
import { TrendingProducts } from "@/components/home/TrendingProducts";
import { TrustBanner } from "@/components/home/TrustBanner";

// ============================================================================
// 1. DATA CONTRACTS (Show this to your Backend Dev)
// ============================================================================
type HomeCategory = {
  id: string;
  name: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  children?: Array<{ id: string; name: string; slug: string; }>;
};

type HeroBanner = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  overlayClass: string;
  badge: string;
};

// ============================================================================
// 2. MOCK API SERVICE
// When the real API is ready, replace this function with an actual fetch request.
// ============================================================================
function useHomeData() {
  // In the future, this will be: const { data, isLoading } = useQuery(...)
  return {
    categories: [
      {
        id: "cat_1", name: "Phones", slug: "phones-and-tablets", icon: Smartphone, color: "bg-blue-500/10 text-blue-600",
        children: [{ id: "sub_1", name: "Smartphones", slug: "smartphones" }, { id: "sub_2", name: "Tablets", slug: "tablets" }],
      },
      {
        id: "cat_2", name: "Computing", slug: "computing", icon: Laptop, color: "bg-zinc-500/10 text-zinc-600",
        children: [{ id: "sub_3", name: "Laptops", slug: "laptops" }, { id: "sub_4", name: "Desktops", slug: "desktops" }],
      },
      {
        id: "cat_3", name: "Fashion", slug: "fashion", icon: Shirt, color: "bg-pink-500/10 text-pink-600",
        children: [{ id: "sub_5", name: "Men's Fashion", slug: "mens-fashion" }, { id: "sub_6", name: "Women's Fashion", slug: "womens-fashion" }],
      },
      {
        id: "cat_4", name: "Supermarket", slug: "supermarket", icon: ShoppingBasket, color: "bg-[#009E49]/10 text-[#009E49]",
        children: [{ id: "sub_7", name: "Beverages", slug: "beverages" }, { id: "sub_8", name: "Staples", slug: "staples" }],
      },
      { id: "cat_5", name: "Appliances", slug: "appliances", icon: Tv, color: "bg-purple-500/10 text-purple-600" },
      { id: "cat_6", name: "Health", slug: "health-and-beauty", icon: HeartPulse, color: "bg-red-500/10 text-red-600" },
      { id: "cat_7", name: "Sports", slug: "sports-and-outdoors", icon: Dumbbell, color: "bg-[#FF6B00]/10 text-[#FF6B00]" },
      { id: "cat_8", name: "Home", slug: "home-and-living", icon: Sofa, color: "bg-amber-500/10 text-amber-600" },
    ] as HomeCategory[],
    
    heroBanners: [
      {
        id: "banner_1", title: "Grand Opening Sale", subtitle: "Welcome to Zamoyo. Shop across all categories with massive discounts.",
        image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&w=2070&q=80",
        ctaLabel: "Start Shopping", ctaHref: "/categories", overlayClass: "from-[#009E49]/95 via-[#009E49]/70 to-transparent", badge: "Welcome",
      },
      {
        id: "banner_2", title: "Black Friday Deals", subtitle: "The biggest tech and electronics price drops of the entire year.",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=2070&q=80",
        ctaLabel: "Shop Electronics", ctaHref: "/category/electronics", overlayClass: "from-zinc-950/95 via-zinc-900/80 to-transparent", badge: "Featured",
      },
      {
        id: "banner_3", title: "Up to 50% Off", subtitle: "Refresh your wardrobe with half-price deals on top global brands.",
        image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?auto=format&fit=crop&w=2070&q=80",
        ctaLabel: "Shop Fashion", ctaHref: "/category/fashion", overlayClass: "from-[#FF6B00]/95 via-[#FF6B00]/70 to-transparent", badge: "Promo",
      },
    ] as HeroBanner[],
  };
}

// ============================================================================
// 3. MAIN PAGE RENDER
// ============================================================================
export default function HomePage() {
  const { categories, heroBanners } = useHomeData();
  
  // FIX: Stabilized the Autoplay ref so it doesn't jitter on re-renders
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  return (
    <main className="min-h-screen bg-[#f4fbf6]">
      
      {/* HERO SECTION */}
      <section className="container mx-auto max-w-7xl px-4 pt-4 md:px-6 md:pt-6">
        <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-4">
          
          <div className="lg:col-span-3">
            <Carousel
              options={{ loop: true }}
              plugins={[autoplayPlugin.current, Fade()]}
              className="w-full overflow-hidden rounded-2xl border border-zinc-200/50 shadow-lg md:rounded-3xl"
            >
              <CarouselContent>
                {heroBanners.map((banner) => (
                  <CarouselItem key={banner.id}>
                    <div className="relative flex aspect-video w-full items-center md:aspect-21/9">
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('${banner.image}')` }}
                      />
                      <div className={`absolute inset-0 bg-linear-to-r ${banner.overlayClass}`} />

                      <div className="absolute left-3 top-2 z-20 md:left-8 md:top-6">
                        <Badge className="border-white/20 bg-white/20 px-3 py-1 font-bold tracking-wide text-white shadow-sm backdrop-blur-md">
                          {banner.badge}
                        </Badge>
                      </div>

                      <div className="relative z-10 mt-6 max-w-xl space-y-2 px-6 md:mt-0 md:space-y-4 md:px-12">
                        <h2 className="text-3xl font-black leading-tight tracking-tighter text-white drop-shadow-md md:text-5xl">
                          {banner.title}
                        </h2>
                        <p className="max-w-md text-sm font-medium text-white/90 drop-shadow-sm md:text-lg">
                          {banner.subtitle}
                        </p>
                        {/* FIX: Corrected the Link wrapping so the CTA is clickable and routes safely */}
                        <div className="pt-2">
                          <Link href={banner.ctaHref}>
                            <Button className="h-12 rounded-xl bg-white px-8 font-bold text-zinc-900 shadow-[0_10px_25px_rgba(0,0,0,0.15)] transition-transform hover:scale-[1.02] hover:bg-zinc-100">
                              {banner.ctaLabel}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious className="left-4 hidden border-white/40 bg-white/20 text-white backdrop-blur-md hover:bg-white/40 md:flex" />
              <CarouselNext className="right-4 hidden border-white/40 bg-white/20 text-white backdrop-blur-md hover:bg-white/40 md:flex" />
            </Carousel>
          </div>

          {/* SIDE PROMOS */}
          <div className="hidden h-full flex-col gap-6 lg:flex">
            <Link
              href="/deals"
              className="group relative flex-1 cursor-pointer overflow-hidden rounded-3xl border border-zinc-200/50 shadow-lg"
            >
              {/* FIX: Reduced motion duration for a tighter, premium feel */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-linear-to-t from-[#FF6B00]/95 via-[#FF6B00]/40 to-transparent" />
              <div className="absolute left-4 top-4 z-20">
                <Badge className="border-white/20 bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
                  Promo
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 z-10 p-6">
                <h3 className="text-xl font-black leading-tight text-white">Free Delivery</h3>
                <p className="mt-1 text-xs font-medium text-white/90">
                  On your first order in Lusaka.
                </p>
              </div>
            </Link>

            <Link
              href="/category/electronics"
              className="group relative flex-1 cursor-pointer overflow-hidden rounded-3xl border border-zinc-200/50 shadow-lg"
            >
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80')] bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-linear-to-t from-[#009E49]/95 via-[#009E49]/40 to-transparent" />
              <div className="absolute left-4 top-4 z-20">
                <Badge className="border-white/20 bg-white/20 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm backdrop-blur-md">
                  Sale
                </Badge>
              </div>
              <div className="absolute bottom-0 left-0 z-10 p-6">
                <h3 className="text-xl font-black leading-tight text-white">Audio Fest</h3>
                <p className="mt-1 text-xs font-medium text-white/90">
                  Headphones up to 20% off.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="container mx-auto max-w-7xl px-4 pt-8 md:px-6">
        <div className="mb-4 flex items-center justify-between md:mb-5">
          <h3 className="text-lg font-bold tracking-tight text-zinc-900 md:text-xl">
            Shop by Category
          </h3>
          <Link href="/categories" className="text-sm font-bold text-[#FF6B00] hover:underline">
            View All
          </Link>
        </div>

        {/* FIX: Perfected scroll snapping for mobile users */}
        <div className="hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:px-0 md:gap-6">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`} // FIX: Unifying category routes to use the slug
                className="group flex min-w-20 snap-start flex-col items-center gap-3 md:min-w-24"
              >
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl border border-zinc-200/50 shadow-sm transition-transform duration-300 group-hover:scale-[1.03] group-hover:shadow-md md:h-20 md:w-20 ${category.color}`}
                >
                  <Icon className="h-7 w-7 md:h-8 md:w-8" />
                </div>
                <span className="text-center text-xs font-semibold text-zinc-700 transition-colors group-hover:text-[#009E49] md:text-sm">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <FlashSales />
      <TrendingProducts />
      <TrustBanner />
    </main>
  );
}