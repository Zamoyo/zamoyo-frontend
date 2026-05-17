export type BuyerStatus = "active" | "under_review" | "banned";
export type BuyerRiskLevel = "low" | "medium" | "high";

export interface BuyerHistorySummary {
  totalOrders: number;
  totalSpend: number;
  lastOrderAt: string;
}

export interface BuyerDisputeSummary {
  open: number;
  resolved: number;
  refundRate: number;
}

export interface BuyerRiskSignal {
  id: string;
  label: string;
  severity: BuyerRiskLevel;
}

export interface BuyerTimelineEvent {
  id: string;
  label: string;
  timestamp: string;
  note: string;
}

export interface AdminBuyerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: BuyerStatus;
  riskLevel: BuyerRiskLevel;
  joinedAt: string;
  orderSummary: BuyerHistorySummary;
  disputeSummary: BuyerDisputeSummary;
  riskSignals: BuyerRiskSignal[];
  timeline: BuyerTimelineEvent[];
  internalNotes: string[];
}

export const adminBuyersApi = {
  async fetchBuyers(): Promise<AdminBuyerRecord[]> {
    return [];
  },
  async updateBuyerStatus(buyerId: string, status: BuyerStatus, note: string): Promise<void> {
    void buyerId;
    void status;
    void note;
  },
  async addBuyerNote(buyerId: string, note: string): Promise<void> {
    void buyerId;
    void note;
  },
};
