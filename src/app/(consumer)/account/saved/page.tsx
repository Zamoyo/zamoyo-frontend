"use client";

import * as React from "react";
import Link from "next/link";
import { Heart, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/productCard";
import { useWishlist } from "@/hooks/use-wishlist";

export default function SavedItemsPage() {
  const { items } = useWishlist();
  const [search, setSearch] = React.useState("");

  const filteredItems = React.useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;

    return items.filter((product) => {
      const title = (product.title ?? product.name ?? "").toLowerCase();
      const badge = (product.badge ?? "").toLowerCase();
      return title.includes(query) || badge.includes(query);
    });
  }, [items, search]);

  const hasItems = items.length > 0;
  const hasFilteredItems = filteredItems.length > 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-zinc-900 md:text-3xl">
            Saved Items
          </h1>
          <p className="mt-1 text-sm font-medium text-zinc-500">
            Items you&apos;ve favorited to buy later.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your wishlist..."
            className="h-11 rounded-xl border-zinc-200/60 bg-white pl-9 shadow-sm focus-visible:ring-[#009E49]"
          />
        </div>
      </div>

      {!hasItems ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200/60 bg-white p-12 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-400">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">Your wishlist is empty</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Start saving items you like by clicking the heart icon.
          </p>
          <Link href="/" className="mt-6">
            <Button className="bg-[#009E49] text-white hover:bg-[#00853d]">
              Browse Products
            </Button>
          </Link>
        </div>
      ) : !hasFilteredItems ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-200/60 bg-white p-12 text-center shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
            <Search className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">No saved items found</h3>
          <p className="mt-1 text-sm text-zinc-500">
            Nothing in your wishlist matches &quot;{search}&quot;.
          </p>
          <Button variant="outline" onClick={() => setSearch("")} className="mt-6">
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-3 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:gap-4">
          {filteredItems.map((product) => (
            <ProductCard key={`${product.id}-${product.slug}`} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}