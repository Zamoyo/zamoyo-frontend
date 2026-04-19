"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useWishlist } from "@/hooks/use-wishlist";

export interface Product {
  id: number | string;
  slug: string;
  title?: string;
  name?: string;
  categoryName?: string;
  subcategoryName?: string;
  price: number;
  oldPrice?: number | null;
  originalPrice?: number | null;
  discount?: number | null;
  badge?: string | null;
  isNew?: boolean;
  rating: number;
  reviews: number;
  image: string;
}

function formatCurrency(value: number) {
  return `K${value.toLocaleString()}`;
}

function getBadgeColor(text: string) {
  const lower = text.toLowerCase();
  if (lower === "trending") return "bg-[#009E49] text-white";
  if (lower === "best seller") return "bg-[#FF6B00] text-white";
  if (lower === "hot") return "bg-zinc-900 text-white";
  return "bg-zinc-900 text-white";
}

export function ProductCard({ product }: { product: Product }) {
  const displayTitle = product.title ?? product.name ?? "Product Name";
  const displayCategory = product.subcategoryName ?? product.categoryName;
  const displayOldPrice = product.oldPrice ?? product.originalPrice ?? null;
  const displayBadge = product.badge ?? (product.isNew ? "New" : null);
  const productHref = `/product/${product.slug}`;

  const { toggleItem, hasItem, hasHydrated } = useWishlist();

  const isSaved = hasHydrated ? hasItem(product.id) : false;
  const heartAriaLabel = hasHydrated && isSaved ? "Remove from wishlist" : "Add to wishlist";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[20px] bg-white shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      <div className="p-2 pb-0">
        <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-2xl bg-zinc-50 md:aspect-5/4">
          {displayBadge ? (
            <Badge className={`absolute left-2 top-2 z-10 border-none px-2.5 py-0.5 text-[10px] font-bold shadow-sm ${getBadgeColor(displayBadge)}`}>
              {displayBadge}
            </Badge>
          ) : null}

          <button
            type="button"
            onClick={() => toggleItem(product)}
            className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-400 shadow-sm transition-colors hover:border-red-200 hover:text-red-500"
            aria-label={heartAriaLabel}
          >
            <Heart className={`h-3.5 w-3.5 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
          </button>

          <Link href={productHref} className="absolute inset-2 block">
            <div
              className="h-full w-full bg-contain bg-center bg-no-repeat mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url('${product.image}')` }}
            />
          </Link>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4 pt-3">
        {displayCategory ? (
          <span className="mb-1 text-[9px] font-bold uppercase tracking-wider text-[#009E49] md:text-[10px]">
            {displayCategory}
          </span>
        ) : null}

        <Link
          href={productHref}
          className="line-clamp-2 min-h-9.5 text-xs font-bold leading-tight text-zinc-900 transition-colors hover:text-[#009E49] md:text-[13px]"
        >
          {displayTitle}
        </Link>

        <div className="mb-3 mt-1.5 flex items-center gap-1">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-[11px] font-bold text-zinc-900 md:text-xs">{product.rating}</span>
          <span className="text-[10px] font-medium text-zinc-400">({product.reviews})</span>
        </div>

        <div className="mt-auto flex items-end justify-between pt-1">
          <div className="flex flex-col">
            <span className="text-lg font-black tracking-tight text-zinc-900 md:text-xl">
              {formatCurrency(product.price)}
            </span>
            {displayOldPrice ? (
              <span className="text-[10px] font-bold text-zinc-400 line-through">
                {formatCurrency(displayOldPrice)}
              </span>
            ) : null}
          </div>

          <Link
            href={productHref}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 text-zinc-900 transition-colors hover:bg-[#009E49] hover:text-white md:h-9 md:w-9"
          >
            <ShoppingBag className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}