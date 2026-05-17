"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Zap } from "lucide-react";
import { ProductCard } from "@/components/productCard";
import type { Product } from "@/types/product";

type TimeLeft = {
  hours: number;
  minutes: number;
  seconds: number;
};

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

export function FlashSales({ products }: { products: Product[] }) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(getInitialTimeLeft());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft((prev) => tickCountdown(prev));
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const dealCount = useMemo(() => products.length, [products.length]);

  return (
    <section className="container mx-auto max-w-7xl px-4 pt-6 md:px-6">
      <div className="mb-3 flex flex-col justify-between gap-4 md:mb-4 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <h3 className="flex items-center gap-2 text-xl font-black tracking-tight text-zinc-900 md:text-2xl">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FF6B00] text-sm text-white md:h-8 md:w-8 md:text-base">
              <Zap className="h-4 w-4 fill-current md:h-5 md:w-5" />
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
        {products.map((product) => (
          <div key={product.id} className="min-w-40 snap-start md:min-w-50">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
