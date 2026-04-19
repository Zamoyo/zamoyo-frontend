"use client";

import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// ============================================================================
// 1. DATA CONTRACTS
// ============================================================================
type TrendingBadge = "Hot" | "New" | "Trending" | "Best Seller" | "Top Rated" | null;

type TrendingProduct = {
  id: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  reviewCount: number;
  badge: TrendingBadge;
};

// ============================================================================
// 2. MOCK API SERVICE
// ============================================================================
function useTrendingData() {
  const products: TrendingProduct[] = [
    {
      id: "macbook-air-m2-space-gray", slug: "macbook-air-m2-space-gray", categoryId: "computing", categoryName: "Computing",
      name: "MacBook Air M2 - Space Gray", image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80",
      price: 26500, rating: 4.9, reviewCount: 342, badge: "Hot",
    },
    {
      id: "classic-leather-crossbody-bag", slug: "classic-leather-crossbody-bag", categoryId: "fashion", categoryName: "Fashion",
      name: "Classic Leather Crossbody Bag", image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
      price: 850, rating: 4.7, reviewCount: 128, badge: null,
    },
    {
      id: "nespresso-vertuo-coffee-machine", slug: "nespresso-vertuo-coffee-machine", categoryId: "appliances", categoryName: "Appliances",
      name: "Nespresso Vertuo Coffee Machine", image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&w=800&q=80",
      price: 4200, rating: 4.8, reviewCount: 85, badge: "New",
    },
    {
      id: "samsung-galaxy-s24-ultra", slug: "samsung-galaxy-s24-ultra", categoryId: "phones-and-tablets", categoryName: "Phones",
      name: "Samsung Galaxy S24 Ultra", image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=800&q=80",
      price: 29000, rating: 5, reviewCount: 412, badge: "Hot",
    },
    {
      id: "premium-yoga-mat", slug: "premium-yoga-mat", categoryId: "sports-and-outdoors", categoryName: "Sports",
      name: "Premium Yoga Mat", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=800&q=80",
      price: 450, rating: 4.6, reviewCount: 95, badge: null,
    },
    {
      id: "dyson-supersonic-hair-dryer", slug: "dyson-supersonic-hair-dryer", categoryId: "health-and-beauty", categoryName: "Health",
      name: "Dyson Supersonic Hair Dryer", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&w=800&q=80",
      price: 9500, rating: 4.9, reviewCount: 215, badge: "Trending",
    },
    {
      id: "organic-arabica-coffee-beans", slug: "organic-arabica-coffee-beans", categoryId: "supermarket", categoryName: "Supermarket",
      name: "Organic Arabica Coffee Beans", image: "https://images.unsplash.com/photo-1559525839-b184a4d698c7?auto=format&fit=crop&w=800&q=80",
      price: 320, rating: 4.8, reviewCount: 512, badge: "Best Seller",
    },
    {
      id: "minimalist-chronograph-watch", slug: "minimalist-chronograph-watch", categoryId: "fashion", categoryName: "Fashion",
      name: "Minimalist Chronograph Watch", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      price: 1200, rating: 4.7, reviewCount: 176, badge: null,
    },
    {
      id: "sony-playstation-5-console", slug: "sony-playstation-5-console", categoryId: "electronics", categoryName: "Electronics",
      name: "Sony PlayStation 5 Console", image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
      price: 12500, rating: 4.9, reviewCount: 843, badge: "Hot",
    },
    {
      id: "nike-air-max-270-sneakers", slug: "nike-air-max-270-sneakers", categoryId: "fashion", categoryName: "Fashion",
      name: "Nike Air Max 270 Sneakers", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      price: 2800, rating: 4.8, reviewCount: 320, badge: null,
    },
    {
      id: "waterpik-aquarius-flosser", slug: "waterpik-aquarius-flosser", categoryId: "health-and-beauty", categoryName: "Health",
      name: "Waterpik Aquarius Flosser", image: "https://images.unsplash.com/photo-1559523182-a284c3fb7cff?auto=format&fit=crop&w=800&q=80",
      price: 1800, rating: 4.8, reviewCount: 215, badge: null,
    },
    {
      id: "logitech-mx-master-3s", slug: "logitech-mx-master-3s-mouse", categoryId: "computing", categoryName: "Computing",
      name: "Logitech MX Master 3S Mouse", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80",
      price: 2200, rating: 4.9, reviewCount: 843, badge: "Top Rated",
    },
  ];

  return { products };
}

// ============================================================================
// 3. UI COMPONENTS
// ============================================================================
function formatCurrency(value: number) {
  return `K${value.toLocaleString()}`;
}

function BadgeTone({ badge }: { badge: Exclude<TrendingBadge, null> }) {
  const badgeClassMap: Record<Exclude<TrendingBadge, null>, string> = {
    Hot: "bg-zinc-900 text-white",
    New: "bg-blue-600 text-white",
    Trending: "bg-[#009E49] text-white",
    "Best Seller": "bg-[#FF6B00] text-white",
    "Top Rated": "bg-purple-600 text-white",
  };

  return (
    <Badge className={`absolute left-2 top-2 z-10 border-none px-1.5 py-0 text-[9px] font-bold shadow-sm md:text-[10px] ${badgeClassMap[badge]}`}>
      {badge}
    </Badge>
  );
}

function TrendingProductCard({ product }: { product: TrendingProduct }) {
  const productHref = `/product/${product.slug}`;
  const categoryHref = `/category/${product.categoryId}`;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)]">
      <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden bg-zinc-50 p-2 md:aspect-5/4">
        {product.badge ? <BadgeTone badge={product.badge} /> : null}

        <button className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border border-zinc-200 bg-white/80 text-zinc-500 shadow-sm backdrop-blur-md transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-500 md:h-7 md:w-7">
          <Heart className="h-3 w-3 md:h-3.5 md:w-3.5" />
        </button>

        <Link href={productHref} className="absolute inset-3 block">
          <div
            className="h-full w-full bg-contain bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105 mix-blend-multiply"
            style={{ backgroundImage: `url('${product.image}')` }}
          />
        </Link>
      </div>

      <div className="flex flex-1 flex-col bg-white p-2.5 md:p-3">
        <Link href={categoryHref} className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-[#009E49] hover:underline md:text-[10px]">
          {product.categoryName}
        </Link>

        <Link href={productHref} className="mb-1 line-clamp-2 text-[11px] font-bold leading-tight text-zinc-800 transition-colors hover:text-[#009E49] md:text-sm">
          {product.name}
        </Link>

        <div className="mb-1.5 flex items-center gap-1 md:mb-2">
          <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400 md:h-3 md:w-3" />
          <span className="text-[10px] font-bold text-zinc-700 md:text-xs">{product.rating}</span>
          <span className="text-[9px] font-medium text-zinc-400 md:text-[10px]">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm font-black tracking-tight text-zinc-900 md:text-base">
            {formatCurrency(product.price)}
          </span>

          <Button size="icon" className="h-6 w-6 rounded-full bg-zinc-100 text-zinc-900 shadow-sm transition-colors hover:bg-[#009E49] hover:text-white md:h-8 md:w-8">
            <ShoppingBag className="h-3 w-3 md:h-3.5 md:w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 4. MAIN EXPORT
// ============================================================================
export function TrendingProducts() {
  const { products } = useTrendingData();

  return (
    <section className="container mx-auto max-w-7xl px-4 pt-6 md:px-6 md:pt-8">
      <div className="mb-4 flex flex-col justify-between gap-4 md:mb-5 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-black tracking-tight text-zinc-900 md:text-2xl">
            Trending Near You
          </h3>
          <Badge className="hidden border-none bg-zinc-100 text-zinc-600 transition-colors hover:bg-zinc-200 md:flex">
            Lusaka Region
          </Badge>
        </div>

        <Link href="/trending" className="group flex items-center text-sm font-bold text-[#FF6B00] hover:underline">
          View all trending
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:gap-4">
        {products.map((product) => (
          <TrendingProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}