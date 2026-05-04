export type SellerVerificationStatus = "pending" | "approved" | "rejected" | "incomplete";
export type SellerOperationalStatus = "active" | "suspended" | "vacation";

export interface AdminSellerRecord {
  id: string;
  storeName: string;
  ownerName: string;
  email: string;
  phone: string;
  verificationStatus: SellerVerificationStatus;
  status: SellerOperationalStatus;
  commissionRate: number;
  lifetimeGmv: number;
  joinedAt: string;
  riskFlags: number;
}

// --- MOCK API DATA & ENGINE ---
const MOCK_SELLERS: AdminSellerRecord[] = [
  { id: "SEL-001", storeName: "Zamoyo Official", ownerName: "Danny Diara", email: "danny@zamoyo.com", phone: "+260971111111", verificationStatus: "approved", status: "active", commissionRate: 3.0, lifetimeGmv: 450000, joinedAt: "2025-12-01T10:00:00Z", riskFlags: 0 },
  { id: "SEL-002", storeName: "Lusaka Electronics", ownerName: "Chanda M.", email: "chanda@lusakaelec.com", phone: "+260972222222", verificationStatus: "pending", status: "suspended", commissionRate: 5.0, lifetimeGmv: 0, joinedAt: "2026-04-28T14:30:00Z", riskFlags: 1 },
  { id: "SEL-003", storeName: "Sneaker Hub ZM", ownerName: "Emmanuel B.", email: "emmanuel@sneakerhub.zm", phone: "+260973333333", verificationStatus: "approved", status: "active", commissionRate: 5.0, lifetimeGmv: 12500, joinedAt: "2026-02-15T09:15:00Z", riskFlags: 0 },
  { id: "SEL-004", storeName: "Generic Gadgets", ownerName: "John D.", email: "john@generic.com", phone: "+260974444444", verificationStatus: "rejected", status: "suspended", commissionRate: 5.0, lifetimeGmv: 0, joinedAt: "2026-04-10T11:00:00Z", riskFlags: 3 },
];

export const adminSellersApi = {
  async fetchSellers(): Promise<AdminSellerRecord[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_SELLERS]), 800);
    });
  },
  async approveVerification(sellerId: string): Promise<void> {
    void sellerId; // Mock usage
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
  async suspendSeller(sellerId: string, reason: string): Promise<void> {
    void sellerId; void reason;
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
  async reactivateSeller(sellerId: string): Promise<void> {
    void sellerId;
    return new Promise((resolve) => setTimeout(resolve, 500));
  }
};