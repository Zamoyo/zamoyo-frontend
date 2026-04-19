import type { Product } from "@/types/product";

export interface CategoryChild {
  id: string;
  name: string;
  slug: string;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconKey:
    | "smartphone"
    | "laptop"
    | "shirt"
    | "shopping-basket"
    | "tv"
    | "heart-pulse"
    | "dumbbell"
    | "sofa";
  colorClass: string;
  children: CategoryChild[];
}

export interface CategoryHeroMeta {
  title: string;
  description: string;
  subcategories: CategoryChild[];
}

export interface CategoryPageData {
  slug: string;
  meta: CategoryHeroMeta;
  products: Product[];
}

export type CategorySortOption =
  | "recommended"
  | "price-low"
  | "price-high"
  | "top-rated";

export type CategoryFilterOption =
  | "all"
  | "under-500"
  | "500-2000"
  | "over-2000"
  | "4-stars";
