"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/use-wishlist";
import type { Product } from "@/types/product";

type WishlistButtonProps = {
  product: Product;
  className?: string;
  iconClassName?: string;
};

export function WishlistButton({
  product,
  className,
  iconClassName,
}: WishlistButtonProps) {
  const { toggleItem, hasItem, hasHydrated } = useWishlist();

  const isSaved = hasHydrated ? hasItem(product.id) : false;
  const heartAriaLabel = hasHydrated && isSaved ? "Remove from wishlist" : "Add to wishlist";

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggleItem(product);
      }}
      className={cn(className)}
      aria-label={heartAriaLabel}
    >
      <Heart
        className={cn(
          iconClassName,
          isSaved ? "fill-red-500 text-red-500" : "",
        )}
      />
    </button>
  );
}
