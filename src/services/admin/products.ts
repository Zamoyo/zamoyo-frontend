export type AdminProductStatus = "active" | "pending_review" | "delisted";

export interface AdminProductRecord {
  id: string;
  name: string;
  sellerStore: string;
  price: number;
  stock: number;
  status: AdminProductStatus;
  flags: number;
}

const MOCK_PRODUCTS: AdminProductRecord[] = [
  { id: "PRD-001", name: "iPhone 15 Pro Max", sellerStore: "Zamoyo Official", price: 28500, stock: 14, status: "active", flags: 0 },
  { id: "PRD-002", name: "Generic AirPods (Counterfeit Risk)", sellerStore: "Generic Gadgets", price: 450, stock: 100, status: "pending_review", flags: 2 },
  { id: "PRD-003", name: "JBL Flip 6", sellerStore: "Lusaka Electronics", price: 2100, stock: 5, status: "active", flags: 0 },
];

export const adminProductsApi = {
  async fetchProducts(): Promise<AdminProductRecord[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_PRODUCTS]), 600));
  },
  async delistProduct(productId: string): Promise<void> {
    void productId;
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
  async approveProduct(productId: string): Promise<void> {
    void productId;
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
};