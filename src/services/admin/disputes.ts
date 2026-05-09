export type DisputeSeverity = "low" | "medium" | "high" | "critical";
export type DisputeStatus = "open" | "waiting_evidence" | "in_review" | "escalated" | "resolved_buyer" | "resolved_seller";
export type DisputeCategory = "delivery" | "payment" | "refund" | "product_quality";

export interface DisputeEvidence {
  buyer: string[];
  seller: string[];
}

export interface LinkedDisputeOrder {
  id: string;
  total: number;
  status: string;
  paymentProvider: string;
  shippingMethod: string;
}

export interface DisputeResolutionEvent {
  id: string;
  actor: string;
  action: string;
  timestamp: string;
  note: string;
}

export interface AdminDisputeRecord {
  id: string;
  title: string;
  category: DisputeCategory;
  severity: DisputeSeverity;
  status: DisputeStatus;
  buyerName: string;
  sellerName: string;
  assignedTo: string;
  openedAt: string;
  dueAt: string;
  claimAmount: number;
  linkedOrder: LinkedDisputeOrder;
  evidence: DisputeEvidence;
  internalNotes: string[];
  resolutionHistory: DisputeResolutionEvent[];
}

const MOCK_DISPUTES: AdminDisputeRecord[] = [
  {
    id: "DSP-4101",
    title: "Buyer reports delivery never arrived",
    category: "delivery",
    severity: "high",
    status: "open",
    buyerName: "James Banda",
    sellerName: "CopperCraft Lusaka",
    assignedTo: "Ops queue",
    openedAt: "2026-05-06T08:15:00Z",
    dueAt: "2026-05-10T08:15:00Z",
    claimAmount: 1850,
    linkedOrder: {
      id: "ORD-9920",
      total: 1850,
      status: "in_transit",
      paymentProvider: "MTN MoMo",
      shippingMethod: "Lusaka courier",
    },
    evidence: {
      buyer: ["Delivery confirmation not received", "Chat screenshot with courier"],
      seller: ["Packed item photo", "Courier pickup manifest"],
    },
    internalNotes: ["Courier confirmation missing. Do not release funds until pickup route is verified."],
    resolutionHistory: [
      { id: "DRH-1", actor: "System", action: "Dispute opened", timestamp: "2026-05-06T08:15:00Z", note: "Buyer selected delivery issue." },
    ],
  },
  {
    id: "DSP-4102",
    title: "Refund requested after damaged product delivery",
    category: "refund",
    severity: "medium",
    status: "in_review",
    buyerName: "Grace K.",
    sellerName: "Ndola Home Goods",
    assignedTo: "Martha Z.",
    openedAt: "2026-05-04T12:10:00Z",
    dueAt: "2026-05-09T12:10:00Z",
    claimAmount: 640,
    linkedOrder: {
      id: "ORD-9919",
      total: 640,
      status: "delivered",
      paymentProvider: "Airtel Money",
      shippingMethod: "Pickup station",
    },
    evidence: {
      buyer: ["Photo of damaged item", "Unboxing photo"],
      seller: ["Pre-dispatch condition photo"],
    },
    internalNotes: ["Likely partial refund if seller cannot provide packaging proof."],
    resolutionHistory: [
      { id: "DRH-2", actor: "Martha Z.", action: "Evidence reviewed", timestamp: "2026-05-05T09:00:00Z", note: "Requested clearer buyer photos." },
    ],
  },
  {
    id: "DSP-4103",
    title: "Seller disputes payment hold after cancellation",
    category: "payment",
    severity: "critical",
    status: "escalated",
    buyerName: "Sarah M.",
    sellerName: "TechLane Zambia",
    assignedTo: "Finance escalation",
    openedAt: "2026-05-03T15:40:00Z",
    dueAt: "2026-05-08T15:40:00Z",
    claimAmount: 12400,
    linkedOrder: {
      id: "ORD-9917",
      total: 12400,
      status: "cancelled",
      paymentProvider: "Card processor",
      shippingMethod: "Seller delivery",
    },
    evidence: {
      buyer: ["Cancellation confirmation"],
      seller: ["Stock reservation proof", "Delivery attempt log"],
    },
    internalNotes: ["Finance must verify processor settlement before any manual release."],
    resolutionHistory: [
      { id: "DRH-3", actor: "Ops Manager", action: "Escalated", timestamp: "2026-05-04T11:25:00Z", note: "Payment state requires finance review." },
    ],
  },
];

export const adminDisputesApi = {
  async fetchDisputes(): Promise<AdminDisputeRecord[]> {
    return new Promise((resolve) => setTimeout(() => resolve([...MOCK_DISPUTES]), 450));
  },
  async assignDispute(disputeId: string, assignee: string): Promise<void> {
    void disputeId;
    void assignee;
    return new Promise((resolve) => setTimeout(resolve, 300));
  },
  async updateDisputeStatus(disputeId: string, status: DisputeStatus, note: string): Promise<void> {
    void disputeId;
    void status;
    void note;
    return new Promise((resolve) => setTimeout(resolve, 360));
  },
  async addDisputeNote(disputeId: string, note: string): Promise<void> {
    void disputeId;
    void note;
    return new Promise((resolve) => setTimeout(resolve, 260));
  },
};
