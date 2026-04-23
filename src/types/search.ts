import type { Product } from "@/types/product";

export interface SearchCategoryResult {
  id: string;
  title: string;
  description?: string;
  href: string;
  parentName?: string;
  type: "category" | "subcategory";
}

export interface SearchResults {
  products: Product[];
  categories: SearchCategoryResult[];
  totalCount: number;
}

export interface SearchIndex {
  products: Product[];
  categories: SearchCategoryResult[];
}
