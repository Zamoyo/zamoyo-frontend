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

export const adminSellersApi = {
  async fetchSellers(): Promise<AdminSellerRecord[]> {
    return [];
  },
  async approveVerification(sellerId: string): Promise<void> {
    void sellerId;
  },
  async suspendSeller(sellerId: string, reason: string): Promise<void> {
    void sellerId; void reason;
  },
  async reactivateSeller(sellerId: string): Promise<void> {
    void sellerId;
  }
};
