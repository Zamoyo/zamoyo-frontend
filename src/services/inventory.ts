import type { Product } from "@/types/product";
import { fetchSellerCatalogProducts } from "@/services/seller-catalog";

export interface Category {
  id: string;
  name: string;
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  stock: number;
}

export interface InventoryProduct
  extends Omit<
    Product,
    "id" | "title" | "name" | "categoryName" | "subcategoryName" | "image"
  > {
  id: string;
  name: string;
  image: string | null;
  category: Category;
  sku: string;
  stock: number;
  threshold: number;
  lastUpdated: string;
  hasVariants: boolean;
  variants: ProductVariant[];
}

export type RawInventoryData = {
  id?: string | number;
  slug?: string;
  name?: string;
  image?: string | null;
  price?: string | number;
  oldPrice?: string | number | null;
  originalPrice?: string | number | null;
  discount?: string | number | null;
  badge?: string | null;
  rating?: string | number;
  reviews?: string | number;
  category?: { id?: string; name?: string } | string;
  categoryId?: string;
  categoryName?: string;
  sku?: string;
  stock?: string | number;
  threshold?: string | number;
  lastUpdated?: string;
  hasVariants?: boolean;
  variants?: Array<{
    id?: string | number;
    name?: string;
    sku?: string;
    stock?: string | number;
  }>;
};

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toSafeString(value: unknown, fallback = ""): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCategory(raw: RawInventoryData): Category {
  if (typeof raw.category === "object" && raw.category !== null) {
    return {
      id: toSafeString(raw.category.id, "unknown"),
      name: toSafeString(raw.category.name, "Uncategorized"),
    };
  }

  if (typeof raw.category === "string") {
    return {
      id: toSafeString(raw.categoryId, slugify(raw.category) || "unknown"),
      name: raw.category,
    };
  }

  if (raw.categoryName) {
    return {
      id: toSafeString(raw.categoryId, slugify(raw.categoryName) || "unknown"),
      name: raw.categoryName,
    };
  }

  return {
    id: toSafeString(raw.categoryId, "unknown"),
    name: "Uncategorized",
  };
}

function normalizeVariants(raw: RawInventoryData): ProductVariant[] {
  if (!Array.isArray(raw.variants)) return [];

  return raw.variants.map((variant, index) => ({
    id: String(variant.id ?? `${raw.id ?? "product"}-variant-${index + 1}`),
    name: toSafeString(variant.name, `Variant ${index + 1}`),
    sku: toSafeString(variant.sku, ""),
    stock: Math.max(0, toNumber(variant.stock, 0)),
  }));
}

export function normalizeInventoryProduct(raw: RawInventoryData): InventoryProduct {
  const category = normalizeCategory(raw);
  const name = toSafeString(raw.name, "Unknown Product");
  const id = String(raw.id ?? "");
  const variants = normalizeVariants(raw);
  const stock = Math.max(0, toNumber(raw.stock, 0));

  return {
    id,
    slug: toSafeString(raw.slug, slugify(name || id || "product")),
    name,
    image: raw.image ?? null,
    price: Math.max(0, toNumber(raw.price, 0)),
    oldPrice:
      raw.oldPrice === null || raw.oldPrice === undefined
        ? null
        : Math.max(0, toNumber(raw.oldPrice, 0)),
    originalPrice:
      raw.originalPrice === null || raw.originalPrice === undefined
        ? null
        : Math.max(0, toNumber(raw.originalPrice, 0)),
    discount:
      raw.discount === null || raw.discount === undefined
        ? null
        : Math.max(0, toNumber(raw.discount, 0)),
    badge: raw.badge ?? null,
    rating: Math.max(0, toNumber(raw.rating, 0)),
    reviews: Math.max(0, toNumber(raw.reviews, 0)),
    category,
    sku: toSafeString(raw.sku, `SKU-${id || "UNKNOWN"}`),
    stock,
    threshold: Math.max(0, toNumber(raw.threshold, 5)),
    lastUpdated: toSafeString(raw.lastUpdated, new Date().toISOString()),
    hasVariants: Boolean(raw.hasVariants || variants.length > 0),
    variants,
  };
}

const RAW_MOCK_DATA: RawInventoryData[] = [
  {
    id: "ZM-P-101",
    slug: "macbook-air-m2-256gb-midnight",
    sku: "MAC-AIR-M2-MID",
    name: "MacBook Air M2 - 256GB Midnight",
    category: { id: "cat-1", name: "Electronics" },
    price: 18500,
    stock: 12,
    threshold: 5,
    lastUpdated: "2026-04-18T10:00:00Z",
    hasVariants: false,
    variants: [],
    rating: 4.9,
    reviews: 128,
    badge: "Hot",
  },
  {
    id: "ZM-P-102",
    slug: "samsung-45w-fast-charger-type-c",
    sku: "SAM-45W-CHG",
    name: "Samsung 45W Fast Charger Type-C",
    category: { id: "cat-1", name: "Electronics" },
    price: 450,
    stock: 0,
    threshold: 10,
    lastUpdated: "2026-04-18T09:30:00Z",
    hasVariants: false,
    variants: [],
    rating: 4.6,
    reviews: 84,
    badge: null,
  },
  {
    id: "ZM-P-106",
    slug: "nike-air-max-270-black",
    sku: "NKE-AM270-BLK",
    name: "Nike Air Max 270",
    category: { id: "cat-2", name: "Fashion" },
    price: 1850,
    stock: 3,
    threshold: 6,
    lastUpdated: "2026-04-14T08:45:00Z",
    hasVariants: true,
    variants: [{ id: "v1", name: "Black - 42", sku: "NKE-AM270-BLK-42", stock: 3 }],
    rating: 4.8,
    reviews: 215,
    badge: null,
  },
  {
    id: "ZM-P-104",
    slug: "jbl-flip-6-portable-speaker",
    sku: "JBL-FLIP-6",
    name: "JBL Flip 6 Portable Speaker",
    category: { id: "cat-1", name: "Electronics" },
    price: 2100,
    stock: 45,
    threshold: 5,
    lastUpdated: "2026-04-15T11:10:00Z",
    hasVariants: false,
    variants: [],
    rating: 4.7,
    reviews: 96,
    badge: "Trending",
  },
];

const MOCK_NETWORK_DELAY_MS = 500;

export const inventoryApi = {
  async fetchAll(): Promise<InventoryProduct[]> {
    const sellerProducts = await fetchSellerCatalogProducts();
    const source =
      sellerProducts.length > 0
        ? sellerProducts.map<RawInventoryData>((product) => ({
            id: product.id,
            slug: product.slug,
            sku: product.sku,
            name: product.title,
            category: { id: product.categorySlug, name: product.categoryName },
            image: product.images.find((image) => image.isPrimary)?.url ?? product.images[0]?.url ?? null,
            price: product.salePrice ?? product.price,
            originalPrice: product.salePrice ? product.price : null,
            stock: product.stock,
            threshold: product.lowStockThreshold,
            lastUpdated: product.updatedAt,
            hasVariants: product.variants.length > 1,
            variants: product.variants.map((variant) => ({
              id: variant.id,
              name: `${variant.label}: ${variant.value}`,
              sku: variant.sku,
              stock: variant.stock,
            })),
            rating: 4.7,
            reviews: 42,
            badge: product.status === "pending_review" ? "Pending Review" : null,
          }))
        : RAW_MOCK_DATA;

    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve(source.map(normalizeInventoryProduct));
      }, MOCK_NETWORK_DELAY_MS);
    });
  },

  async updateStock(id: string, newStock: number): Promise<{ id: string; stock: number }> {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve({ id, stock: Math.max(0, newStock) });
      }, MOCK_NETWORK_DELAY_MS);
    });
  },

  async bulkUpdateStock(
    ids: string[],
    newStock: number,
  ): Promise<{ ids: string[]; stock: number }> {
    return new Promise((resolve) => {
      window.setTimeout(() => {
        resolve({ ids, stock: Math.max(0, newStock) });
      }, MOCK_NETWORK_DELAY_MS + 200);
    });
  },
};
