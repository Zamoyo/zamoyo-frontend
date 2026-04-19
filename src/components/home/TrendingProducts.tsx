"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/productCard";
import type { Product } from "@/types/product";
export function TrendingProducts({ products }: { products: Product[] }) {
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
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
