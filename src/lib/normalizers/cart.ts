import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import { getProductTitle } from "@/lib/normalizers/product";

export function toCartItem(
  product: Product,
  options?: { quantity?: number; variant?: string | null },
): CartItem {
  return {
    id: product.id,
    slug: product.slug,
    name: getProductTitle(product),
    price: product.price,
    image: product.image,
    quantity: Math.max(1, options?.quantity ?? 1),
    variant: options?.variant ?? null,
  };
}
