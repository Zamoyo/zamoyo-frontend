import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

// Upgraded interface to accept data from both Homepage and Category pages without crashing
export interface Product {
  id: number | string;
  title?: string;
  name?: string;
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

export function ProductCard({ product }: { product: Product }) {
  // Normalize the data so it always finds a name and old price regardless of where it's used
  const displayTitle = product.title || product.name || "Product Name";
  const displayOldPrice = product.oldPrice || product.originalPrice;
  const displayBadge = product.badge || (product.isNew ? "NEW" : null);

  return (
    // iOS Liquid Glass Wrapper (Your original design)
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white/60 backdrop-blur-md border border-white/60 shadow-sm hover:shadow-md hover:bg-white/80 transition-all supports-backdrop-filter:bg-white/50">
      
      {/* Image Container */}
      <div className="relative aspect-square w-full bg-white/40 flex items-center justify-center mix-blend-multiply overflow-hidden">
        
        {/* THE FIX: Render the URL as a background image instead of text */}
        <div 
          className="absolute inset-2 bg-contain bg-center bg-no-repeat transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${product.image}')` }}
        ></div>
        
        {/* Top Left Badge */}
        {displayBadge && (
          <div className="absolute left-2 top-2 z-10 rounded-md bg-[#FF6B00] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm ring-1 ring-white/20">
            {displayBadge}
          </div>
        )}
        
        {/* Top Right Heart */}
        <button className="absolute right-2 top-2 z-10 rounded-full bg-white/60 p-1.5 text-zinc-500 backdrop-blur-md transition-colors hover:text-red-500 hover:bg-white shadow-sm">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Content Container */}
      <div className="flex flex-1 flex-col p-3">
        
        {/* Tightly packed details container */}
        <div className="flex flex-col gap-1">
          {/* Title */}
          <h3 className="line-clamp-2 text-sm font-medium text-zinc-900 leading-snug">
            {displayTitle}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-[#FF6B00] text-[#FF6B00]" />
            <span className="text-xs font-medium text-zinc-700">{product.rating}</span>
            <span className="text-[10px] text-zinc-500">({product.reviews})</span>
          </div>

          {/* Pricing Area */}
          <div className="flex flex-col pt-0.5">
            <div className="text-lg font-bold text-[#009E49] leading-none">
              K{product.price.toLocaleString()}
            </div>
            
            {/* Discount Logic */}
            <div className="flex items-center gap-2 h-4 mt-1">
              {displayOldPrice && (
                <span className="text-[11px] text-zinc-400 line-through">
                  K{displayOldPrice.toLocaleString()}
                </span>
              )}
              {product.discount && (
                <span className="rounded bg-red-100/80 px-1 py-0.5 text-[10px] font-bold text-red-600">
                  -{product.discount}%
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Add to Cart Button (Your original design) */}
        <Button className="mt-auto w-full rounded-xl bg-zinc-900/95 text-xs font-semibold hover:bg-zinc-800 text-white h-9 shadow-sm backdrop-blur-sm transition-all active:scale-95">
          Add to Cart
        </Button>
      </div>
    </div>
  );
}