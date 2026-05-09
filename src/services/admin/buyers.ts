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

const MOCK_BUYERS: AdminBuyerRecord[] = [
  {
    id: "BUY-1001",
    name: "Sarah M.",
    email: "sarah.m@example.com",
    phone: "+260971445566",
    location: "Kabulonga, Lusaka",
    status: "active",
    riskLevel: "low",
    joinedAt: "2025-12-12T08:00:00Z",
    orderSummary: { totalOrders: 18, totalSpend: 84500, lastOrderAt: "2026-05-02T11:30:00Z" },
    disputeSummary: { open: 0, resolved: 1, refundRate: 2.4 },
    riskSignals: [],
    timeline: [
      { id: "BTL-1", label: "Account created", timestamp: "2025-12-12T08:00:00Z", note: "Verified phone and email." },
      { id: "BTL-2", label: "High-value order", timestamp: "2026-05-02T11:30:00Z", note: "Order ORD-9921 placed successfully." },
    ],
    internalNotes: ["Strong purchase history with low refund activity."],
  },
  {
    id: "BUY-1002",
    name: "James Banda",
    email: "james.banda@example.com",
    phone: "+260977333222",
    location: "Cairo Road, Lusaka",
    status: "under_review",
    riskLevel: "high",
    joinedAt: "2026-01-21T09:00:00Z",
    orderSummary: { totalOrders: 9, totalSpend: 18200, lastOrderAt: "2026-05-01T14:00:00Z" },
    disputeSummary: { open: 1, resolved: 3, refundRate: 18.6 },
    riskSignals: [
      { id: "RISK-1", label: "Repeated delivery disputes", severity: "high" },
      { id: "RISK-2", label: "Refund rate above threshold", severity: "medium" },
    ],
    timeline: [
      { id: "BTL-3", label: "Dispute opened", timestamp: "2026-05-01T15:00:00Z", note: "Claims item never arrived for ORD-9920." },
      { id: "BTL-4", label: "Risk review started", timestamp: "2026-05-02T08:30:00Z", note: "Ops flagged buyer for manual review." },
    ],
    internalNotes: ["Do not auto-refund without dispute review."],
  },
  {
    id: "BUY-1003",
    name: "Grace K.",
    email: "grace.k@example.com",
    phone: "+260966222111",
    location: "Ndola",
    status: "active",
    riskLevel: "medium",
    joinedAt: "2025-10-03T13:45:00Z",
    orderSummary: { totalOrders: 31, totalSpend: 121000, lastOrderAt: "2026-04-27T10:10:00Z" },
    disputeSummary: { open: 0, resolved: 2, refundRate: 4.8 },
    riskSignals: [{ id: "RISK-3", label: "Two returns in 30 days", severity: "medium" }],
    timeline: [
      { id: "BTL-5", label: "Order delivered", timestamp: "2026-04-27T10:10:00Z", note: "ORD-9919 completed via pickup." },
    ],
    internalNotes: ["Frequent buyer. Watch recent return trend but no action needed."],
  },
];

export const adminBuyersApi = {
  async fetchBuyers(): Promise<AdminBuyerRecord[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_BUYERS]), 500));
  },
  async updateBuyerStatus(buyerId: string, status: BuyerStatus, note: string): Promise<void> {
    void buyerId;
    void status;
    void note;
    return new Promise((resolve) => setTimeout(resolve, 400));
  },
  async addBuyerNote(buyerId: string, note: string): Promise<void> {
    void buyerId;
    void note;
    return new Promise((resolve) => setTimeout(resolve, 300));
  },
};
