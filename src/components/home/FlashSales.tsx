"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, ShoppingCart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type FlashSaleProduct = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  image: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  discountPercent: number;
};

type TimeLeft = {
  hours: number;
  minutes: number;
  seconds: number;
};

const FLASH_PRODUCTS: FlashSaleProduct[] = [
  {
    id: "iphone-15-pro-max-256",
    slug: "apple-iphone-15-pro-max-256gb",
    name: "Apple iPhone 15 Pro Max - 256GB",
    categoryId: "phones-and-tablets",
    image:
      "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
    price: 24500,
    originalPrice: 28000,
    rating: 4.9,
    reviewCount: 124,
    discountPercent: 12,
  },
  {
    id: "sony-wh1000xm5",
    slug: "sony-wh-1000xm5-wireless-headphones",
    name: "Sony WH-1000XM5 Wireless Headphones",
    categoryId: "electronics",
    image:
      "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80",
    price: 6800,
    originalPrice: 8500,
    rating: 4.8,
    reviewCount: 89,
    discountPercent: 20,
  },
  {
    id: "samsung-55-4k-tv",
    slug: "samsung-55-smart-4k-uhd-tv",
    name: 'Samsung 55" Smart 4K UHD TV',
    categoryId: "electronics",
    image:
      "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=800&q=80",
    price: 11200,
    originalPrice: 14000,
    rating: 4.7,
    reviewCount: 56,
    discountPercent: 20,
  },
  {
    id: "nike-air-force-1",
    slug: "nike-air-force-1-07",
    name: "Nike Air Force 1 '07",
    categoryId: "fashion",
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80",
    price: 2100,
    originalPrice: 3000,
    rating: 4.9,
    reviewCount: 210,
    discountPercent: 30,
  },
  {
    id: "dell-xps-13",
    slug: "dell-xps-13-laptop-16gb-ram",
    name: "Dell XPS 13 Laptop - 16GB RAM",
    categoryId: "computing",
    image:
      "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80",
    price: 22000,
    originalPrice: 26000,
    rating: 4.6,
    reviewCount: 42,
    discountPercent: 15,
  },
  {
    id: "playstation-5-console",
    slug: "playstation-5-console",
    name: "PlayStation 5 Console",
    categoryId: "electronics",
    image:
      "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
    price: 12500,
    originalPrice: 14000,
    rating: 4.9,
    reviewCount: 312,
    discountPercent: 10,
  },
];

function formatCurrency(value: number) {
  return `K${value.toLocaleString()}`;
}

function getInitialTimeLeft(): TimeLeft {
  return { hours: 12, minutes: 45, seconds: 30 };
}

function tickCountdown(prev: TimeLeft): TimeLeft {
  if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) return prev;
  if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
  if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
  if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
  return prev;
}

function FlashCountdown({ timeLeft }: { timeLeft: TimeLeft }) {
  const parts = [
    String(timeLeft.hours).padStart(2, "0"),
    String(timeLeft.minutes).padStart(2, "0"),
    String(timeLeft.seconds).padStart(2, "0"),
  ];

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold md:text-sm">
      <Clock className="h-3.5 w-3.5 text-zinc-400 md:h-4 md:w-4" />
      <span className="hidden text-zinc-500 sm:inline">Ends in:</span>
      <div className="flex items-center gap-1">
        {parts.map((part, index) => (
          <div key={index} className="flex items-center gap-1">
            <span className="rounded-md bg-red-500 px-1.5 py-0.5 text-white shadow-sm md:px-2">
              {part}
            </span>
            {index < parts.length - 1 ? <span className="text-red-500">:</span> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function FlashSaleCard({ product }: { product: FlashSaleProduct }) {
  const productHref = `/product/${product.slug}`;

  return (
    <div className="group relative flex min-w-40 snap-start flex-col overflow-hidden rounded-2xl border border-zinc-200/60 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)] md:min-w-50">
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-50 p-3">
        <Badge className="absolute left-2 top-2 z-10 border-none bg-red-500 px-1.5 py-0 text-[10px] font-bold text-white shadow-sm">
          -{product.discountPercent}%
        </Badge>

        <Link href={productHref} className="absolute inset-3 block">
          <div
            className="h-full w-full bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
            style={{ backgroundImage: `url('${product.image}')` }}
          />
        </Link>

        <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            size="sm"
            className="h-8 rounded-lg bg-[#009E49] px-4 text-xs font-bold text-white shadow-lg transition-all duration-300 group-hover:translate-y-0 hover:bg-[#00853d]"
          >
            <ShoppingCart className="mr-1.5 h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3">
        <Link
          href={productHref}
          className="line-clamp-2 text-xs font-bold leading-snug text-zinc-800 transition-colors hover:text-[#009E49] md:text-sm"
        >
          {product.name}
        </Link>

        <div className="mt-1.5 flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-bold text-zinc-700 md:text-xs">{product.rating}</span>
          <span className="text-[9px] font-medium text-zinc-400 md:text-[10px]">
            ({product.reviewCount})
          </span>
        </div>

        <div className="mt-auto flex items-end gap-1.5 pt-2">
          <span className="text-sm font-black tracking-tight text-zinc-900 md:text-base">
            {formatCurrency(product.price)}
          </span>
          <span className="mb-0.5 text-[10px] font-semibold text-zinc-400 line-through md:text-xs">
            {formatCurrency(product.originalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function FlashSales() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getInitialTimeLeft());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => tickCountdown(prev));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const dealCount = useMemo(() => FLASH_PRODUCTS.length, []);

  return (
    <section className="container mx-auto max-w-7xl px-4 pt-6 md:px-6">
      <div className="mb-3 flex flex-col justify-between gap-4 md:mb-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <h3 className="flex items-center gap-2 text-xl font-black tracking-tight text-zinc-900 md:text-2xl">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF6B00] text-sm text-white md:h-8 md:w-8 md:text-base">
              ⚡
            </span>
            Flash Sales
          </h3>

          <FlashCountdown timeLeft={timeLeft} />
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <span className="rounded-lg bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-500">
            {dealCount} deals live
          </span>

          <Link
            href="/flash-sales"
            className="group flex items-center text-sm font-bold text-[#009E49] hover:underline"
          >
            See all deals
            <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="hide-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-6 md:mx-0 md:px-0 md:gap-4">
        {FLASH_PRODUCTS.map((product) => (
          <FlashSaleCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}